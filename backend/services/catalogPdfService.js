import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import Product from "../models/Product.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BRAND = "MGRM Medicare";
const SITE = process.env.CLIENT_URL || "https://www.mgrmmedicare.com";

const PUBLIC_CANDIDATES = [
  path.resolve(__dirname, "../../frontend/public"),
  path.resolve(process.cwd(), "../frontend/public"),
  path.resolve(process.cwd(), "frontend/public"),
];

function formatPrice(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return "—";
  return `Rs. ${n.toLocaleString("en-IN")}`;
}

function resolveLocalImagePath(imagePath) {
  if (!imagePath || typeof imagePath !== "string") return null;
  if (imagePath.startsWith("http")) return null;

  const clean = imagePath.replace(/^\//, "");
  for (const root of PUBLIC_CANDIDATES) {
    const full = path.join(root, clean);
    if (fs.existsSync(full)) return full;
  }
  return null;
}

async function loadImageBuffer(imagePath) {
  if (!imagePath) return null;

  if (imagePath.startsWith("http")) {
    try {
      const response = await fetch(imagePath, {
        headers: { "User-Agent": "MGRM-Catalog/1.0" },
      });
      if (!response.ok) return null;
      return Buffer.from(await response.arrayBuffer());
    } catch {
      return null;
    }
  }

  const local = resolveLocalImagePath(imagePath);
  if (!local) return null;

  try {
    return fs.readFileSync(local);
  } catch {
    return null;
  }
}

function groupByCategory(products) {
  const groups = new Map();
  for (const product of products) {
    const key = product.category?.trim() || "General";
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(product);
  }
  return [...groups.entries()].sort(([a], [b]) => a.localeCompare(b));
}

function drawCategoryHeader(doc, category) {
  if (doc.y > 700) doc.addPage();

  doc
    .roundedRect(48, doc.y, 499, 28, 6)
    .fill("#25319a");

  doc
    .fillColor("#ffffff")
    .fontSize(12)
    .text(category, 60, doc.y + 8, { width: 480 });

  doc.y += 38;
}

function drawProductCard(doc, product, imageBuffer, x, y, cardW, cardH) {
  doc.save();
  doc.roundedRect(x, y, cardW, cardH, 8).fill("#f8fafc");
  doc.roundedRect(x, y, cardW, cardH, 8).lineWidth(1).stroke("#e2e8f0");

  const imgPad = 10;
  const imgBox = cardW - imgPad * 2;
  const imgTop = y + imgPad;

  if (imageBuffer) {
    try {
      doc.image(imageBuffer, x + imgPad, imgTop, {
        fit: [imgBox, 88],
        align: "center",
        valign: "center",
      });
    } catch {
      doc
        .roundedRect(x + imgPad, imgTop, imgBox, 88, 4)
        .fill("#e2e8f0");
      doc
        .fillColor("#94a3b8")
        .fontSize(8)
        .text("Image", x + imgPad, imgTop + 38, { width: imgBox, align: "center" });
    }
  } else {
    doc.roundedRect(x + imgPad, imgTop, imgBox, 88, 4).fill("#e2e8f0");
    doc
      .fillColor("#94a3b8")
      .fontSize(8)
      .text("MGRM Medicare", x + imgPad, imgTop + 38, {
        width: imgBox,
        align: "center",
      });
  }

  const textY = imgTop + 96;
  const price = formatPrice(product.discountPrice ?? product.price);
  const mrp =
    product.discountPrice && product.price && product.discountPrice < product.price
      ? `  MRP ${formatPrice(product.price)}`
      : "";

  doc
    .fillColor("#0f172a")
    .fontSize(9.5)
    .text(product.name, x + imgPad, textY, {
      width: cardW - imgPad * 2,
      height: 28,
      ellipsis: true,
    });

  doc
    .fillColor("#25319a")
    .fontSize(9)
    .text(`${price}${mrp}`, x + imgPad, textY + 30, {
      width: cardW - imgPad * 2,
    });

  if (product.sizes?.length) {
    doc
      .fillColor("#64748b")
      .fontSize(7.5)
      .text(`Sizes: ${product.sizes.slice(0, 4).join(", ")}`, x + imgPad, textY + 44, {
        width: cardW - imgPad * 2,
        ellipsis: true,
      });
  }

  doc.restore();
}

export async function generateProductCatalogPdf() {
  const products = await Product.find({})
    .select("name slug category activity price discountPrice description sizes images")
    .sort({ category: 1, name: 1 })
    .lean();

  const imageBuffers = await Promise.all(
    products.map((p) => loadImageBuffer(p.images?.[0]))
  );

  const imageById = new Map(
    products.map((product, index) => [product._id?.toString(), imageBuffers[index]])
  );

  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 48, size: "A4", bufferPages: true });
    const chunks = [];

    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    doc.fillColor("#25319a").fontSize(26).text(BRAND, { align: "center" });
    doc
      .fillColor("#0f172a")
      .fontSize(15)
      .text("Full Product Catalogue", { align: "center" });
    doc
      .moveDown(0.35)
      .fontSize(10)
      .fillColor("#64748b")
      .text(`${products.length} products  •  ${SITE.replace(/^https?:\/\//, "")}`, {
        align: "center",
      });
    doc
      .fontSize(9)
      .text(`Generated ${new Date().toLocaleDateString("en-IN")}`, { align: "center" });

    doc.moveDown(1.1);

    const groups = groupByCategory(products);
    const cardW = 238;
    const cardH = 168;
    const gapX = 14;
    const gapY = 14;
    const cols = 2;
    const marginLeft = 48;

    for (const [category, items] of groups) {
      drawCategoryHeader(doc, category);

      for (let i = 0; i < items.length; i += cols) {
        const rowItems = items.slice(i, i + cols);

        if (doc.y + cardH > 760) {
          doc.addPage();
          doc.y = 48;
        }

        const y = doc.y;

        rowItems.forEach((product, col) => {
          const x = marginLeft + col * (cardW + gapX);
          const imageBuffer = imageById.get(product._id?.toString()) ?? null;
          drawProductCard(doc, product, imageBuffer, x, y, cardW, cardH);
        });

        doc.y = y + cardH + gapY;
      }

      doc.moveDown(0.3);
    }

    const pages = doc.bufferedPageRange();
    for (let i = 0; i < pages.count; i += 1) {
      doc.switchToPage(i);
      doc
        .fontSize(8)
        .fillColor("#94a3b8")
        .text(`${BRAND}  •  ${SITE}  •  Page ${i + 1} of ${pages.count}`, 48, 805, {
          align: "center",
          width: 500,
        });
    }

    doc.end();
  });
}
