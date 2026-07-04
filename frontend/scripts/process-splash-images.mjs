import sharp from "sharp";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const brandDir = path.join(__dirname, "../public/brand");

function isLogoBlue(r, g, b) {
  return b > 70 && b >= r * 0.85 && b > g * 0.7;
}

function isChecker(r, g, b) {
  const avg = (r + g + b) / 3;
  return avg > 170 && Math.abs(r - g) < 20 && Math.abs(g - b) < 20;
}

async function extractBlueLogo(inputName, outputName) {
  const input = path.join(brandDir, inputName);
  const output = path.join(brandDir, outputName);
  const { data, info } = await sharp(input).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const pixels = Buffer.from(data);

  for (let i = 0; i < pixels.length; i += 4) {
    const r = pixels[i];
    const g = pixels[i + 1];
    const b = pixels[i + 2];
    if (isLogoBlue(r, g, b)) {
      pixels[i + 3] = 255;
    } else if (isChecker(r, g, b)) {
      pixels[i + 3] = 0;
    } else {
      pixels[i + 3] = 0;
    }
  }

  await sharp(pixels, { raw: { width: info.width, height: info.height, channels: 4 } })
    .png()
    .toFile(output);
  console.log(`✓ ${outputName}`);
}

async function removeBlackBg(inputName, outputName) {
  const input = path.join(brandDir, inputName);
  const output = path.join(brandDir, outputName);
  const { data, info } = await sharp(input).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const pixels = Buffer.from(data);

  for (let i = 0; i < pixels.length; i += 4) {
    const r = pixels[i];
    const g = pixels[i + 1];
    const b = pixels[i + 2];
    const max = Math.max(r, g, b);
    if (max < 48 || isChecker(r, g, b)) {
      pixels[i + 3] = 0;
    } else {
      pixels[i + 3] = 255;
    }
  }

  await sharp(pixels, { raw: { width: info.width, height: info.height, channels: 4 } })
    .png()
    .toFile(output);
  console.log(`✓ ${outputName}`);
}

await extractBlueLogo("splash-mark-ribbon.png", "splash-mark-clean.png");
await removeBlackBg("splash-lotus-logo.png", "splash-lotus-clean.png");
