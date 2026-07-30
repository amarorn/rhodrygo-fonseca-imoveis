/**
 * Sincroniza imóveis do Instagram → src/data/properties.json
 *
 * Pré-requisitos:
 *   npm install -g apify-cli
 *   apify login --token SEU_TOKEN
 *
 * Uso:
 *   node scripts/sync-instagram-properties.mjs
 */

import { execSync } from "node:child_process";
import { writeFileSync, mkdirSync, createWriteStream } from "node:fs";
import { dirname, join, extname } from "node:path";
import { fileURLToPath } from "node:url";
import https from "node:https";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const PROFILE = "https://www.instagram.com/rhodrygofonseca/";
const OUTPUT_JSON = join(ROOT, "src/data/properties.json");
const IMAGES_DIR = join(ROOT, "public/properties");

const input = JSON.stringify({
  directUrls: [PROFILE],
  resultsType: "posts",
  resultsLimit: 50,
});

function slugify(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);
}

function extractPrice(text) {
  const m = text.match(/R\$\s*([\d.]+(?:,\d{2})?)/i);
  if (!m) return undefined;
  return Number(m[1].replace(/\./g, "").replace(",", "."));
}

function extractArea(text) {
  const m = text.match(/(\d+)\s*m²/i);
  return m ? Number(m[1]) : undefined;
}

function extractBedrooms(text) {
  const m = text.match(/(\d+)\s*(?:quartos?|dorm)/i);
  return m ? Number(m[1]) : undefined;
}

function extractLocation(text) {
  const patterns = [
    /(?:em|–|-)\s*([A-Za-zÀ-ú\s]+(?:RN|PE|\/RN|\/PE))/i,
    /(Ponta Negra|São Miguel do Gostoso|Pipa|Macaíba|Natal|Tirol)[^,\n]*/i,
  ];
  for (const p of patterns) {
    const m = text.match(p);
    if (m) return m[1].trim().replace(/\s+/g, " ");
  }
  return "Natal, RN";
}

function guessCategory(text) {
  if (/lote|terreno/i.test(text)) return "terrenos";
  if (/apart|cobertura/i.test(text)) return "apartamentos";
  if (/comercial|sala/i.test(text)) return "comercial";
  return "casas";
}

function isListing(caption) {
  return /vend|imóvel|apart|casa|lote|terreno|duplex|triplex|condomínio|m²/i.test(caption);
}

function isExcluded(caption) {
  return /vendido|consórcio|crédito imobiliário|porto seguro|simulação/i.test(caption);
}

function downloadImage(url, dest) {
  return new Promise((resolve, reject) => {
    const file = createWriteStream(dest);
    https
      .get(url, { headers: { "User-Agent": "Mozilla/5.0", Referer: "https://www.instagram.com/" } }, (res) => {
        if (res.statusCode !== 200) {
          reject(new Error(`HTTP ${res.statusCode} for ${dest}`));
          return;
        }
        res.pipe(file);
        file.on("finish", () => file.close(() => resolve(dest)));
      })
      .on("error", reject);
  });
}

console.log("Buscando posts do Instagram via Apify...");

async function main() {
  let posts;
  try {
    const raw = execSync(`apify actors call apify/instagram-scraper --input '${input.replace(/'/g, "'\\''")}'`, {
      encoding: "utf8",
      stdio: ["pipe", "pipe", "inherit"],
      maxBuffer: 20 * 1024 * 1024,
    });
    posts = JSON.parse(raw);
  } catch {
    console.error("\nErro: configure o Apify CLI primeiro.");
    console.error("  npm install -g apify-cli");
    console.error("  apify login --token SEU_TOKEN  # https://console.apify.com/settings/integrations");
    process.exit(1);
  }

  mkdirSync(IMAGES_DIR, { recursive: true });

  const listings = [];
  for (const post of posts) {
    const caption = post.caption || "";
    if (!isListing(caption) || isExcluded(caption)) continue;

    const title = caption.split("\n")[0].replace(/[#@]/g, "").trim().slice(0, 80) || "Imóvel";
    const slug = slugify(title) || slugify(post.shortCode || post.id);
    const ext = extname(new URL(post.displayUrl).pathname) || ".jpg";
    const filename = `${slug}${ext}`;
    const imagePath = `/properties/${filename}`;

    try {
      await downloadImage(post.displayUrl, join(IMAGES_DIR, filename));
    } catch {
      console.warn(`Aviso: não baixou imagem de ${slug}, usando URL remota`);
    }

    listings.push({
      id: post.id || `ig-${slug}`,
      slug,
      title,
      location: extractLocation(caption),
      price: extractPrice(caption),
      category: guessCategory(caption),
      badge: /vendido/i.test(caption) ? "Vendido" : "Instagram",
      image: imagePath,
      bedrooms: extractBedrooms(caption),
      area: extractArea(caption) ?? 0,
      features: [],
      instagramUrl: post.url,
      description: caption.slice(0, 280).trim(),
    });
  }

  writeFileSync(OUTPUT_JSON, JSON.stringify(listings, null, 2) + "\n");
  console.log(`\n✓ ${listings.length} imóveis salvos em src/data/properties.json`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
