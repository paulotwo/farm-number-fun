// Gera o ícone do app (número 3 gigante com a galinha do jogo na frente):
// fontes do Capacitor em assets/ e ícones web em public/.
// Uso, na raiz do projeto:
//   node scripts/gen-app-icons.mjs && bunx capacitor-assets generate --android
import { mkdirSync, writeFileSync } from "node:fs";
import sharp from "sharp";

const ANIMAL = "public/animals/domestic/galinha.webp";
// O "3" da Fredoka 700 em branco sobre transparente (a fonte do jogo).
const NUMBER = "assets/icon-number.png";
const GREEN = "#35B34A";
const YELLOW = "#FFD23F";
const SHADOW = "#17324D";

// Desenho de referência, num quadro de 1024: altura do número, centro dele,
// deslocamento da sombra, caixa em que a galinha cabe e centro dela.
const DESIGN = {
  numberHeight: 640,
  numberAt: [430, 480],
  shadowOffset: 22,
  animalBox: 430,
  animalAt: [640, 680],
};

/** Recorta a imagem na caixa dos pixels visíveis. */
async function trimmed(file) {
  const image = sharp(file).ensureAlpha();
  const { data, info } = await image
    .clone()
    .extractChannel("alpha")
    .raw()
    .toBuffer({ resolveWithObject: true });
  let [x0, y0, x1, y1] = [info.width, info.height, -1, -1];
  for (let y = 0; y < info.height; y++)
    for (let x = 0; x < info.width; x++)
      if (data[y * info.width + x] > 8) {
        if (x < x0) x0 = x;
        if (x > x1) x1 = x;
        if (y < y0) y0 = y;
        if (y > y1) y1 = y;
      }
  return image
    .extract({ left: x0, top: y0, width: x1 - x0 + 1, height: y1 - y0 + 1 })
    .png()
    .toBuffer();
}

/** A mesma silhueta, pintada de uma cor só. */
async function tinted(png, color) {
  const { width, height } = await sharp(png).metadata();
  const alpha = await sharp(png).extractChannel("alpha").toBuffer();
  return sharp({ create: { width, height, channels: 3, background: color } })
    .joinChannel(alpha)
    .png()
    .toBuffer();
}

const numberArt = await trimmed(NUMBER);
const animalArt = await trimmed(ANIMAL);

/**
 * Número (sombra + amarelo) e galinha num quadro transparente de `size` px.
 * `scale` amplia o desenho de referência e `shift` desloca tudo (em px finais).
 */
async function drawing(size, scale, shift = [0, 0]) {
  const number = await sharp(numberArt)
    .resize({ height: Math.round(DESIGN.numberHeight * scale) })
    .png()
    .toBuffer();
  const box = Math.round(DESIGN.animalBox * scale);
  const animal = await sharp(animalArt).resize(box, box, { fit: "inside" }).png().toBuffer();
  const place = async (input, [cx, cy], offset = 0) => {
    const { width, height } = await sharp(input).metadata();
    return {
      input,
      left: Math.round((cx + offset) * scale + shift[0] - width / 2),
      top: Math.round((cy + offset) * scale + shift[1] - height / 2),
    };
  };
  return sharp({
    create: { width: size, height: size, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } },
  })
    .composite([
      await place(await tinted(number, SHADOW), DESIGN.numberAt, DESIGN.shadowOffset),
      await place(await tinted(number, YELLOW), DESIGN.numberAt),
      await place(animal, DESIGN.animalAt),
    ])
    .png()
    .toBuffer();
}

/**
 * Menor círculo que contém todo o desenho de referência (em px do quadro de
 * 1024). O launcher do Android recorta o ícone em círculo, e o conjunto
 * número + galinha não é centrado pela caixa retangular.
 */
async function enclosingCircle() {
  const SAMPLE = 320;
  const { data, info } = await sharp(await drawing(1024, 1))
    .resize(SAMPLE, SAMPLE)
    .extractChannel("alpha")
    .raw()
    .toBuffer({ resolveWithObject: true });
  const points = [];
  for (let y = 0; y < info.height; y++)
    for (let x = 0; x < info.width; x++)
      if (data[y * info.width + x] > 8) points.push([x + 0.5, y + 0.5]);
  const farthest = (cx, cy) => {
    let best = points[0];
    let dist = -1;
    for (const p of points) {
      const d = (p[0] - cx) ** 2 + (p[1] - cy) ** 2;
      if (d > dist) [best, dist] = [p, d];
    }
    return [best, Math.sqrt(dist)];
  };
  // Bădoiu–Clarkson: o centro caminha, em passos cada vez menores, até o ponto mais distante.
  let [cx, cy] = [SAMPLE / 2, SAMPLE / 2];
  for (let i = 1; i <= 3000; i++) {
    const [p] = farthest(cx, cy);
    cx += (p[0] - cx) / (i + 1);
    cy += (p[1] - cy) / (i + 1);
  }
  const [, r] = farthest(cx, cy);
  const k = 1024 / SAMPLE;
  return { cx: cx * k, cy: cy * k, r: (r + 1) * k };
}

const circle = await enclosingCircle();

/** O desenho, o maior possível dentro do círculo de diâmetro `diameter` centrado no quadro. */
function motif(size, diameter) {
  const scale = diameter / (2 * circle.r);
  return drawing(size, scale, [size / 2 - circle.cx * scale, size / 2 - circle.cy * scale]);
}

const background = (size) =>
  sharp({ create: { width: size, height: size, channels: 3, background: GREEN } })
    .png()
    .toBuffer();

/** Ícone completo: fundo verde + desenho. */
async function icon(size, diameter) {
  return sharp(await background(size))
    .composite([{ input: await motif(size, diameter) }])
    .png()
    .toBuffer();
}

/** .ico com um PNG embutido (formato aceito desde o Windows Vista). */
function ico(png, size) {
  const header = Buffer.alloc(22);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(1, 4);
  header.writeUInt8(size, 6);
  header.writeUInt8(size, 7);
  header.writeUInt16LE(1, 10);
  header.writeUInt16LE(32, 12);
  header.writeUInt32LE(png.length, 14);
  header.writeUInt32LE(22, 18);
  return Buffer.concat([header, png]);
}

// Capacitor (@capacitor/assets). O ícone adaptativo gerado por ele encaixa a
// imagem inteira nos 72dp visíveis (inset de 16,7%), então a zona segura de
// 66dp, que nenhum launcher corta, é um círculo de 66/72 do lado da imagem.
const SAFE = Math.floor((1024 * 66) / 72);
// icon-only também vira ícone redondo (Android antigo) e "maskable" no PWA
// (zona segura: círculo de 80%).
const full = await icon(1024, 800);
await sharp(full).toFile("assets/icon-only.png");
await sharp(await background(1024)).toFile("assets/icon-background.png");
await sharp(await motif(1024, SAFE)).toFile("assets/icon-foreground.png");
const splash = await icon(2732, 1100);
await sharp(splash).toFile("assets/splash.png");
await sharp(splash).toFile("assets/splash-dark.png");

// Web / PWA
await sharp(full).resize(512, 512).png().toFile("public/icon-512.png");
await sharp(full).resize(192, 192).png().toFile("public/icon-192.png");
writeFileSync("public/favicon.ico", ico(await sharp(full).resize(48, 48).png().toBuffer(), 48));

// Prévia do ícone adaptativo como o launcher recorta (círculo e quadrado arredondado).
const adaptive = await sharp("assets/icon-background.png")
  .composite([{ input: "assets/icon-foreground.png" }])
  .png()
  .toBuffer()
  .then((layered) => sharp(layered).resize(400, 400).png().toBuffer());
const mask = (rx) =>
  Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400"><rect width="400" height="400" rx="${rx}" fill="#fff"/></svg>`,
  );
const masked = (rx) =>
  sharp(adaptive)
    .composite([{ input: mask(rx), blend: "dest-in" }])
    .png()
    .toBuffer();
mkdirSync("test-results", { recursive: true });
await sharp({ create: { width: 1340, height: 480, channels: 3, background: "#f2f2f2" } })
  .composite([
    { input: await masked(200), left: 40, top: 40 },
    { input: await masked(90), left: 470, top: 40 },
    { input: await sharp(full).resize(400, 400).toBuffer(), left: 900, top: 40 },
  ])
  .png()
  .toFile("test-results/icone-aplicado.png");
console.log("ícones gerados");
