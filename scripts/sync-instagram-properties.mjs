/**
 * Sincroniza imóveis do Instagram → src/data/properties.json
 *
 * Requer APIFY_TOKEN no ambiente (GitHub Secret ou .env.local)
 *
 * Uso:
 *   APIFY_TOKEN=xxx node scripts/sync-instagram-properties.mjs
 */

import { writeFileSync, mkdirSync, createWriteStream } from "node:fs";
import { dirname, join, extname } from "node:path";
import { fileURLToPath } from "node:url";
import https from "node:https";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const PROFILE = "https://www.instagram.com/rhodrygofonseca/";
const OUTPUT_JSON = join(ROOT, "src/data/properties.json");
const IMAGES_DIR = join(ROOT, "public/properties");
const ACTOR_ID = "apify~instagram-scraper";

const APIFY_TOKEN = process.env.APIFY_TOKEN;
if (!APIFY_TOKEN) {
  console.error("Erro: defina APIFY_TOKEN no ambiente.");
  console.error("  GitHub: Settings → Secrets → APIFY_TOKEN");
  console.error("  Local:  APIFY_TOKEN=xxx node scripts/sync-instagram-properties.mjs");
  process.exit(1);
}

const actorInput = {
  directUrls: [PROFILE],
  resultsType: "posts",
  resultsLimit: 50,
};

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
          reject(new Error(`HTTP ${res.statusCode}`));
          return;
        }
        res.pipe(file);
        file.on("finish", () => file.close(() => resolve(dest)));
      })
      .on("error", reject);
  });
}

async function fetchInstagramPosts() {
  const url = `https://api.apify.com/v2/acts/${ACTOR_ID}/run-sync-get-dataset-items?token=${APIFY_TOKEN}&timeout=300`;

  console.log("Executando apify/instagram-scraper via API REST...");

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(actorInput),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Apify API ${response.status}: ${body.slice(0, 500)}`);
  }

  const posts = await response.json();
  if (!Array.isArray(posts)) {
    throw new Error("Resposta inesperada da Apify — esperava array de posts.");
  }

  console.log(`Recebidos ${posts.length} posts do Instagram.`);
  return posts;
}

function getImageUrl(post) {
  return post.displayUrl || post.imageUrl || post.thumbnailUrl || post.images?.[0];
}

async function main() {
  const posts = await fetchInstagramPosts();
  mkdirSync(IMAGES_DIR, { recursive: true });

  const listings = [];
  const usedSlugs = new Set();

  for (const post of posts) {
    const caption = post.caption || "";
    if (!isListing(caption) || isExcluded(caption)) continue;

    const imageUrl = getImageUrl(post);
    if (!imageUrl) {
      console.warn(`Aviso: post ${post.shortCode || post.id} sem imagem, ignorado.`);
      continue;
    }

    const title =
      caption
        .split("\n")[0]
        .replace(/[#@]/g, "")
        .trim()
        .slice(0, 80) || "Imóvel";

    let slug = slugify(title) || slugify(post.shortCode || post.id || "imovel");
    if (usedSlugs.has(slug)) slug = `${slug}-${post.shortCode || post.id}`.slice(0, 60);
    usedSlugs.add(slug);

    const ext = extname(new URL(imageUrl).pathname.split("?")[0]) || ".jpg";
    const filename = `${slug}${ext}`;
    const imagePath = `/properties/${filename}`;

    try {
      await downloadImage(imageUrl, join(IMAGES_DIR, filename));
    } catch (err) {
      console.warn(`Aviso: falha ao baixar imagem de ${slug}: ${err.message}`);
    }

    listings.push({
      id: post.id || `ig-${slug}`,
      slug,
      title,
      location: extractLocation(caption),
      ...(extractPrice(caption) ? { price: extractPrice(caption) } : {}),
      category: guessCategory(caption),
      badge: /vendido/i.test(caption) ? "Vendido" : "À venda",
      image: imagePath,
      ...(extractBedrooms(caption) ? { bedrooms: extractBedrooms(caption) } : {}),
      area: extractArea(caption) ?? 0,
      features: [],
      instagramUrl: post.url || `https://www.instagram.com/p/${post.shortCode}/`,
      description: caption.slice(0, 280).trim(),
    });
  }

  if (listings.length === 0) {
    console.warn("Nenhum imóvel encontrado nos posts — mantendo arquivo anterior.");
    process.exit(0);
  }

  writeFileSync(OUTPUT_JSON, JSON.stringify(listings, null, 2) + "\n");
  console.log(`\n✓ ${listings.length} imóveis salvos em src/data/properties.json`);
}

main().catch((err) => {
  console.error("\nFalha no sync:", err.message || err);
  process.exit(1);
});
