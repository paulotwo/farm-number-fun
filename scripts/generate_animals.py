"""
Gerador de imagens de animais com fundo transparente usando Nano Banana (Gemini).
Estratégia: gerar com fundo chromakey verde (#00FF00), depois remover via HSV.

Uso:
    GOOGLE_API_KEY=sua_chave python scripts/generate_animals.py

Requisitos:
    pip install google-genai pillow scipy numpy
"""

import io
import os
import sys
import time

import numpy as np
from PIL import Image
from google import genai

# ---------------------------------------------------------------------------
# Configuração
# ---------------------------------------------------------------------------

API_KEY = os.environ.get("GOOGLE_API_KEY")
if not API_KEY:
    print("Erro: defina a variável de ambiente GOOGLE_API_KEY")
    sys.exit(1)

client = genai.Client(api_key=API_KEY)
MODEL = "gemini-3.1-flash-image-preview"

OUTPUT_BASE = os.path.join(os.path.dirname(__file__), "..", "public", "animals")

# ---------------------------------------------------------------------------
# Animais por tema  (key → nome em inglês para o prompt)
# ---------------------------------------------------------------------------

ANIMALS = {
    "domestic": {
        "galinha":    "a cute farm chicken hen",
        "vaca":       "a cute dairy cow",
        "porco":      "a cute pink pig",
        "ovelha":     "a cute fluffy white sheep",
        "cavalo":     "a cute brown horse",
        "pato":       "a cute yellow duck",
        "coelho":     "a cute white rabbit",
        "gato":       "a cute orange tabby cat",
    },
    "wild": {
        "leao":       "a cute lion with a fluffy mane",
        "elefante":   "a cute gray elephant",
        "girafa":     "a cute giraffe with spots",
        "macaco":     "a cute brown monkey",
        "zebra":      "a cute zebra with black and white stripes",
        "urso":       "a cute brown bear",
        "tigre":      "a cute orange tiger with black stripes",
        "cobra":      "a cute colorful snake, red and yellow colors, NOT green",
    },
    "aquatic": {
        "peixe":      "a cute tropical fish with bright orange and white stripes",
        "golfinho":   "a cute blue dolphin",
        "polvo":      "a cute purple octopus",
        "caranguejo": "a cute red crab",
        "tartaruga":  "a cute sea turtle, blue shell with yellow markings",
        "baleia":     "a cute blue whale",
        "tubarao":    "a cute gray shark",
        "lula":       "a cute pink squid",
    },
    "easter": {
        "ovo":        "a cute decorated Easter egg with colorful patterns, pink and yellow",
        "coelhinho":  "a cute Easter bunny with a bow tie",
        "pintinho":   "a cute yellow baby chick hatching from an egg",
        "cesta":      "a cute Easter basket with colorful eggs, wicker basket",
        "flor":       "a cute pink tulip flower",
        "borboleta":  "a cute butterfly with purple and pink wings",
        "cenoura":    "a cute orange carrot with bright orange color",
        "chocolate":  "a cute chocolate Easter egg with colorful wrapping, red and gold foil",
    },
}

# ---------------------------------------------------------------------------
# Processamento de imagem: remover fundo verde via HSV
# ---------------------------------------------------------------------------

def rgb_to_hsv_array(rgb_array: np.ndarray) -> np.ndarray:
    rgb = rgb_array.astype(np.float32) / 255.0
    r, g, b = rgb[:, :, 0], rgb[:, :, 1], rgb[:, :, 2]

    max_c = np.maximum(np.maximum(r, g), b)
    min_c = np.minimum(np.minimum(r, g), b)
    delta = max_c - min_c

    h = np.zeros_like(max_c)
    mask_r = (max_c == r) & (delta != 0)
    h[mask_r] = (60 * ((g[mask_r] - b[mask_r]) / delta[mask_r]) + 360) % 360
    mask_g = (max_c == g) & (delta != 0)
    h[mask_g] = 60 * ((b[mask_g] - r[mask_g]) / delta[mask_g]) + 120
    mask_b = (max_c == b) & (delta != 0)
    h[mask_b] = 60 * ((r[mask_b] - g[mask_b]) / delta[mask_b]) + 240

    s = np.zeros_like(max_c)
    s[max_c != 0] = delta[max_c != 0] / max_c[max_c != 0]

    return np.stack([h, s * 100, max_c * 100], axis=-1)


def remove_green_screen(image: Image.Image) -> Image.Image:
    if image.mode != "RGBA":
        image = image.convert("RGBA")

    data = np.array(image)
    hsv = rgb_to_hsv_array(data[:, :, :3])
    h, s, v = hsv[:, :, 0], hsv[:, :, 1], hsv[:, :, 2]

    hue_diff = np.minimum(np.abs(h - 120), 360 - np.abs(h - 120))
    mask = (hue_diff < 30) & (s > 60) & (v > 60)

    try:
        from scipy import ndimage
        mask = ndimage.binary_dilation(mask, iterations=2)
    except ImportError:
        pass

    alpha = data[:, :, 3].copy()
    alpha[mask] = 0
    data[:, :, 3] = alpha
    return Image.fromarray(data)


def cleanup_edges(image: Image.Image, threshold: int = 64) -> Image.Image:
    if image.mode != "RGBA":
        return image
    data = np.array(image)
    alpha = data[:, :, 3]
    alpha[alpha < threshold] = 0
    alpha[alpha >= threshold] = 255
    data[:, :, 3] = alpha
    return Image.fromarray(data)

# ---------------------------------------------------------------------------
# Geração via Nano Banana (Gemini)
# ---------------------------------------------------------------------------

PROMPT_TEMPLATE = """\
Create a sticker illustration of: {description}

REQUIREMENTS FOR CHROMAKEY EXTRACTION:
1. BACKGROUND: Solid flat chromakey green, EXACTLY hex #00FF00 (RGB 0,255,0). No gradients, no shadows on background.
2. WHITE OUTLINE: The subject must have a clean 2-3 pixel white border separating it from the green background.
3. NO GREEN on the subject itself — avoid any green colors on the character/object.
4. SHARP EDGES: Crisp, well-defined edges for clean extraction.
5. CENTERED: Subject centered with padding around all sides.
6. STYLE: Cute cartoon sticker style, bold outlines, vibrant colors, friendly and adorable, suitable for children aged 4 years old.
7. The image should look like a fun children's book illustration sticker."""


def generate_animal_image(description: str) -> Image.Image:
    prompt = PROMPT_TEMPLATE.format(description=description)

    response = client.models.generate_content(
        model=MODEL,
        contents=prompt,
    )

    for part in response.candidates[0].content.parts:
        if hasattr(part, "inline_data") and part.inline_data:
            # inline_data.data já é bytes (não precisa de base64 decode)
            return Image.open(io.BytesIO(part.inline_data.data))

    raise ValueError("Nenhuma imagem foi retornada pela API")


def create_transparent_animal(description: str, output_path: str) -> bool:
    try:
        print(f"  Gerando: {description[:60]}...")
        raw = generate_animal_image(description)

        print(f"  Removendo fundo verde...")
        transparent = remove_green_screen(raw)
        transparent = cleanup_edges(transparent)

        transparent.save(output_path, "PNG")
        print(f"  Salvo: {output_path}")
        return True

    except Exception as e:
        print(f"  ERRO: {e}")
        return False

# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main():
    total = sum(len(v) for v in ANIMALS.values())
    done = 0
    errors = []

    for theme, animals in ANIMALS.items():
        theme_dir = os.path.join(OUTPUT_BASE, theme)
        os.makedirs(theme_dir, exist_ok=True)

        print(f"\n{'='*50}")
        print(f"Tema: {theme.upper()}")
        print(f"{'='*50}")

        for key, description in animals.items():
            output_path = os.path.join(theme_dir, f"{key}.png")

            if os.path.exists(output_path):
                print(f"  Pulando (já existe): {key}.png")
                done += 1
                continue

            print(f"\n[{done+1}/{total}] {key}")
            success = create_transparent_animal(description, output_path)

            if success:
                done += 1
            else:
                errors.append(f"{theme}/{key}")

            # Respeitar rate limits da API
            time.sleep(2)

    print(f"\n{'='*50}")
    print(f"Concluído: {done}/{total} imagens geradas")
    if errors:
        print(f"Erros ({len(errors)}): {', '.join(errors)}")
    print(f"Imagens salvas em: public/animals/")

if __name__ == "__main__":
    main()
