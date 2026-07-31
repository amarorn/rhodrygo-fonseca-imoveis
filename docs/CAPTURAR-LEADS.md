# Captura automática de leads

Ao enviar qualquer formulário do site:

1. **Meta Pixel** — evento `Lead` com Advanced Matching (e-mail / telefone)
2. **Google Sheets** (opcional) — grava a linha via webhook
3. **WhatsApp** — abre conversa com o corretor já com nome, e-mail, telefone e preferências

Newsletter só salva no webhook + Pixel (não abre WhatsApp).

---

## 1. WhatsApp (já funciona sem config)

Os formulários abrem `wa.me` do número em `CONTACT` (`src/lib/constants.ts`) com a mensagem montada.

Teste local: preencha o form do Hero e confira se o WhatsApp abre com os dados.

---

## 2. Google Sheets (recomendado)



### Criar a planilha

1. Abra [Google Sheets](https://sheets.google.com) → nova planilha
2. Nome sugerido: `Leads Rhodrygo Site`
3. Na primeira linha, coloque os cabeçalhos:


| A    | B      | C    | D      | E        | F    | G     | H      | I         | J        | K   | L      |
| ---- | ------ | ---- | ------ | -------- | ---- | ----- | ------ | --------- | -------- | --- | ------ |
| Data | Origem | Nome | E-mail | WhatsApp | Tipo | Faixa | Região | Interesse | Mensagem | UTM | Página |




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

    sheet.appendRow([
      data.createdAt || new Date().toISOString(),
      data.source || "",
      data.name || "",
      data.email || "",
      data.whatsapp || data.phone || "",
      data.propertyType || "",
      data.priceRange || "",
      data.region || "",
      data.interest || "",
      data.message || "",
      utm,
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

> Abrir a URL no navegador usa GET. Se só existir `doPost`, aparece "Script function not found: doGet" — isso é normal. O site envia **POST**.

1. **Implantar → Nova implantação**
2. Tipo: **App da Web**
3. Executar como: **Eu**
4. Quem tem acesso: **Qualquer pessoa**
5. Copie a **URL da implantação** (termina com `/exec`)



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

- [ ] Formulário abre WhatsApp com os dados
- [ ] Planilha + Apps Script implantados
- [ ] `NEXT_PUBLIC_LEADS_WEBHOOK_URL` no `.env.local`
- [ ] Secret no GitHub para produção
- [ ] Teste: enviar form → linha nova na planilha