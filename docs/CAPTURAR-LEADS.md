# Captura automática de leads

Ao enviar qualquer formulário do site:

1. **Meta Pixel** — evento `Lead` com Advanced Matching (e-mail / telefone) + score
2. **Google Sheets** (opcional) — grava a linha enriquecida via webhook
3. **WhatsApp** — abre conversa com temperatura (quente/morno/frio), urgência e imóvel visto

Newsletter só salva no webhook + Pixel (não abre WhatsApp).

### Dados enviados (enriquecimento)


| Campo                        | Origem                  |
| ---------------------------- | ----------------------- |
| Nome, e-mail, WhatsApp       | Formulário              |
| Tipo, quartos, faixa, região | Hero                    |
| Urgência                     | Hero / Contato          |
| Interesse, mensagem          | Contato                 |
| Score 0–100 + temperatura    | Calculado               |
| Último imóvel + lista vistos | Sessão (`/imoveis/...`) |
| Páginas na sessão            | Sessão                  |
| UTM + geo                    | URL / IP                |
| `fbp` / `fbc` / `fbclid`     | Cookies Meta            |


Score alto quando: urgência imediata, faixa alta, vários imóveis vistos, veio de ads (Instagram/Facebook).

---

## 1. WhatsApp (já funciona sem config)

Os formulários abrem `wa.me` do número em `CONTACT` (`src/lib/constants.ts`) com a mensagem montada (inclui score e imóvel em foco).

Teste local: preencha o form do Hero e confira se o WhatsApp abre com os dados.

---

## 2. Google Sheets (recomendado)

### Criar a planilha

1. Abra [Google Sheets](https://sheets.google.com) → nova planilha
2. Nome sugerido: `Leads Rhodrygo Site`
3. Na primeira linha, cole os cabeçalhos:

Data	Origem	Nome	E-mail	WhatsApp	Tipo	Quartos	Faixa	Região	Urgência	Interesse	Mensagem	Score	Temperatura	Imóvel	UTM	Páginas	Página

### Apps Script

1. Na planilha: **Extensões → Apps Script**
2. Apague o código padrão e cole:

```javascript
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
      ? [data.lastProperty.title, data.lastProperty.location, data.lastProperty.slug]
          .filter(Boolean)
          .join(" · ")
      : "";

    sheet.appendRow([
      data.createdAt || new Date().toISOString(),
      data.source || "",
      data.name || "",
      data.email || "",
      data.whatsapp || data.phone || "",
      data.propertyType || "",
      data.bedrooms || "",
      data.priceRange || "",
      data.region || "",
      data.urgency || "",
      data.interest || "",
      data.message || "",
      data.score ?? "",
      data.temperature || "",
      lastProp,
      utm,
      data.pageViewCount ?? "",
      data.pageUrl || "",
    ]);

    return ContentService.createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(
      JSON.stringify({ ok: false, error: String(err) })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}
```

1. **Salvar** → **Implantar → Gerenciar implantações → Editar (lápis) → Versão: Nova versão → Implantar**

> Se a planilha já existia com poucas colunas, atualize a linha 1 dos cabeçalhos e **publique uma nova versão** do Apps Script.

### Configurar no site

`.env.local`:

```env
NEXT_PUBLIC_LEADS_WEBHOOK_URL=https://script.google.com/macros/s/XXXX/exec
```

Produção (GitHub):

```bash
gh secret set NEXT_PUBLIC_LEADS_WEBHOOK_URL --body "https://script.google.com/macros/s/XXXX/exec"
```

Reinicie o `npm run dev` após alterar o `.env.local`.

---

## 3. Checklist

- [ ] Formulário abre WhatsApp com score / urgência
- [ ] Planilha + Apps Script atualizados (colunas novas)
- [ ] Nova versão da implantação publicada
- [ ] `NEXT_PUBLIC_LEADS_WEBHOOK_URL` no `.env.local`
- [ ] Secret no GitHub para produção
- [ ] Teste: ver um imóvel → enviar form → linha com score e imóvel