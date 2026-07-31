/**
 * Cole este arquivo inteiro no Apps Script da planilha
 * (Extensões → Apps Script), salve e publique NOVA VERSÃO.
 *
 * Ordem das colunas (linha 1 da planilha):
 * Data | Origem | Nome | E-mail | WhatsApp | Tipo | Quartos | Faixa |
 * Região | Urgência | Interesse | Mensagem | Score | Temperatura |
 * Imóvel | UTM | Páginas | Página
 */

function doGet() {
  return ContentService.createTextOutput(
    JSON.stringify({ ok: true, message: "Webhook de leads ativo. Use POST." })
  ).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    const raw = e.postData && e.postData.contents ? e.postData.contents : "{}";
    const data = JSON.parse(raw);
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];

    const utm = data.utm
      ? [data.utm.source, data.utm.medium, data.utm.campaign, data.utm.content]
          .filter(Boolean)
          .join(" / ")
      : "";

    const lastProp = data.lastProperty
      ? [
          data.lastProperty.title,
          data.lastProperty.location,
          data.lastProperty.slug,
        ]
          .filter(Boolean)
          .join(" · ")
      : "";

    // 18 colunas — mesma ordem dos cabeçalhos
    sheet.appendRow([
      data.createdAt || new Date().toISOString(), // A Data
      data.source || "", // B Origem
      data.name || "", // C Nome
      data.email || "", // D E-mail
      data.whatsapp || data.phone || "", // E WhatsApp
      data.propertyType || "", // F Tipo
      data.bedrooms || "", // G Quartos
      data.priceRange || "", // H Faixa
      data.region || "", // I Região
      data.urgency || "", // J Urgência
      data.interest || "", // K Interesse
      data.message || "", // L Mensagem
      data.score != null ? data.score : "", // M Score
      data.temperature || "", // N Temperatura
      lastProp, // O Imóvel
      utm, // P UTM
      data.pageViewCount != null ? data.pageViewCount : "", // Q Páginas
      data.pageUrl || "", // R Página
    ]);

    return ContentService.createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(
      JSON.stringify({ ok: false, error: String(err) })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}
