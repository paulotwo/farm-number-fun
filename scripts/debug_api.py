"""Debug: inspecionar resposta da API Gemini para geração de imagem"""
import os, base64, io
from google import genai

API_KEY = os.environ.get("GOOGLE_API_KEY")
client = genai.Client(api_key=API_KEY)

response = client.models.generate_content(
    model="gemini-3.1-flash-image-preview",
    contents="A cute chicken sticker on solid green #00FF00 background",
)

print("=== Candidates ===")
for i, candidate in enumerate(response.candidates):
    print(f"\nCandidate {i}:")
    for j, part in enumerate(candidate.content.parts):
        print(f"  Part {j}:")
        print(f"    type(part): {type(part)}")
        print(f"    dir: {[x for x in dir(part) if not x.startswith('_')]}")
        if hasattr(part, 'text') and part.text:
            print(f"    text: {part.text[:200]}")
        if hasattr(part, 'inline_data') and part.inline_data:
            print(f"    inline_data mime_type: {part.inline_data.mime_type}")
            print(f"    inline_data data (first 100 chars): {str(part.inline_data.data)[:100]}")
            print(f"    type(inline_data.data): {type(part.inline_data.data)}")
        if hasattr(part, 'file_data') and part.file_data:
            print(f"    file_data: {part.file_data}")
