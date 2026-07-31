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
  // Formato "R$ 110.000,00" ou "R$ 720 mil"
  const match = text.match(/R\$\s*([\d.]+(?:,\d{2})?)\s*(mil)?/i);
  if (!match) return undefined;
  let value = Number(match[1].replace(/\./g, "").replace(",", "."));
  if (match[2] && /mil/i.test(match[2])) value *= 1000;
  return value;
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

const LISTING_KEYWORDS = [
  /vende[- ]?se/i,
  /à venda/i,
  /a venda/i,
  /vendo/i,
  /venda r\$/i,
  /aluga[- ]?se/i,
  /oportunidade.*imóvel/i,
  /imóvel.*à venda/i,
  /apartamento.*(?:à )?venda/i,
  /casa.*(?:à )?venda/i,
  /lote.*(?:à )?venda/i,
  /terreno.*(?:à )?venda/i,
  /duplex/i,
  /triplex/i,
  /condomínio.*(?:venda|horizontes|shamballa|maxmil)/i,
  /m².*(?:r\$|venda)/i,
  /r\$.*m²/i,
  /investir.*condomínio/i,
];

function isListing(caption) {
  const t = caption.toLowerCase();
  if (/planejamento inteligente|estratégia.*imóvel|você não precisa de sorte|dica do corretor|bom dia|frase do dia/i.test(t)) {
    return false;
  }
  return LISTING_KEYWORDS.some((re) => re.test(t));
}

function isExcluded(caption) {
  const t = caption.toLowerCase();
  if (/vendido|consórcio|crédito imobiliário|porto seguro|simulação|parceria|divulgação/i.test(t)) {
    return true;
  }
  // Frases de marketing sem imóvel específico
  if (/enquanto você decide|eu busco o melhor imóvel|planejamento inteligente|estrategia/i.test(t) && !/vende|à venda|vendo|r\$/i.test(t)) {
    return true;
  }
  return false;
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

/** Todas as URLs de imagem do post (carrossel / sidecar / single). */
function getImageUrls(post) {
  const urls = [];

  if (Array.isArray(post.carouselImages)) {
    for (const u of post.carouselImages) {
      if (typeof u === "string" && u) urls.push(u);
    }
  }

  if (Array.isArray(post.childPosts)) {
    for (const child of post.childPosts) {
      const u =
        child?.displayUrl ||
        child?.imageUrl ||
        child?.thumbnailUrl ||
        (Array.isArray(child?.images) ? child.images[0] : undefined);
      if (typeof u === "string" && u) urls.push(u);
    }
  }

  if (Array.isArray(post.images)) {
    for (const u of post.images) {
      if (typeof u === "string" && u) urls.push(u);
    }
  }

  const primary =
    post.displayUrl || post.imageUrl || post.thumbnailUrl || undefined;
  if (typeof primary === "string" && primary) urls.unshift(primary);

  return [...new Set(urls)];
}

function imageExtension(url) {
  try {
    return extname(new URL(url).pathname.split("?")[0]) || ".jpg";
  } catch {
    return ".jpg";
  }
}

async function main() {
  const posts = await fetchInstagramPosts();
  mkdirSync(IMAGES_DIR, { recursive: true });

  const listings = [];
  const usedSlugs = new Set();

  for (const post of posts) {
    const caption = post.caption || "";
    if (!isListing(caption) || isExcluded(caption)) continue;

    const imageUrls = getImageUrls(post);
    if (imageUrls.length === 0) {
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

    const localImages = [];
    for (let i = 0; i < imageUrls.length; i++) {
      const url = imageUrls[i];
      const ext = imageExtension(url);
      const filename = i === 0 ? `${slug}${ext}` : `${slug}-${i + 1}${ext}`;
      const imagePath = `/properties/${filename}`;
      try {
        await downloadImage(url, join(IMAGES_DIR, filename));
        localImages.push(imagePath);
      } catch (err) {
        console.warn(
          `Aviso: falha ao baixar foto ${i + 1}/${imageUrls.length} de ${slug}: ${err.message}`
        );
      }
    }

    if (localImages.length === 0) {
      console.warn(`Aviso: nenhuma foto salva para ${slug}, ignorado.`);
      continue;
    }

    console.log(`  ${slug}: ${localImages.length} foto(s)`);

    listings.push({
      id: post.id || `ig-${slug}`,
      slug,
      title,
      location: extractLocation(caption),
      ...(extractPrice(caption) ? { price: extractPrice(caption) } : {}),
      category: guessCategory(caption),
      badge: /vendido/i.test(caption) ? "Vendido" : "À venda",
      image: localImages[0],
      images: localImages,
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
