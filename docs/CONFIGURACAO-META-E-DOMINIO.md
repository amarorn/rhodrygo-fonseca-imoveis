# Configuração: Meta Pixel + Domínio Próprio

## 1. Meta Pixel (Facebook / Instagram Ads)

### Criar o Pixel

1. Acesse [Meta Events Manager](https://business.facebook.com/events_manager)
2. Clique em **Conectar dados** → **Web** → **Meta Pixel**
3. Nome sugerido: `Rhodrygo Fonseca Site`
4. Copie o **ID do Pixel** (número de 15–16 dígitos, ex: `123456789012345`)

### Configurar localmente

Crie `.env.local` na raiz do projeto:

```env
NEXT_PUBLIC_META_PIXEL_ID=SEU_ID_AQUI
NEXT_PUBLIC_SITE_URL=https://rhodrygofonseca.com.br
USE_CUSTOM_DOMAIN=true
```

Reinicie o `npm run dev`.

### Configurar no GitHub (produção)

```bash
gh secret set NEXT_PUBLIC_META_PIXEL_ID --body "SEU_ID_AQUI"
```

O deploy já injeta esse secret no build.

### Eventos rastreados automaticamente

| Evento Meta | Quando dispara |
|-------------|----------------|
| `PageView` | Toda página |
| `ViewContent` | Página de imóvel |
| `Lead` | Clique WhatsApp / envio de formulário |
| `Contact` | Botão flotante WhatsApp |

### Testar o Pixel

1. Instale a extensão [Meta Pixel Helper](https://chrome.google.com/webstore/detail/meta-pixel-helper) no Chrome
2. Abra o site e verifique se o Pixel dispara
3. No Events Manager → **Testar eventos** → digite a URL do site

---

## 2. Domínio rhodrygofonseca.com.br

### GitHub Pages (já configurado no repo)

- Arquivo `public/CNAME` → `rhodrygofonseca.com.br`
- Build usa `USE_CUSTOM_DOMAIN=true` (sem `/rhodrygo-fonseca-imoveis` na URL)

### DNS no registrador do domínio

Configure **um** dos métodos abaixo:

#### Opção A — Domínio raiz (@) + www (recomendado)

| Tipo | Nome | Valor |
|------|------|-------|
| A | @ | 185.199.108.153 |
| A | @ | 185.199.109.153 |
| A | @ | 185.199.110.153 |
| A | @ | 185.199.111.153 |
| CNAME | www | amarorn.github.io |

#### Opção B — Só www

| Tipo | Nome | Valor |
|------|------|-------|
| CNAME | www | amarorn.github.io |

### Ativar no GitHub

1. Repo → **Settings** → **Pages**
2. Em **Custom domain**, digite: `rhodrygofonseca.com.br`
3. Aguarde verificação DNS (até 24h, geralmente minutos)
4. Marque **Enforce HTTPS**

### Link para bio do Instagram

```
https://rhodrygofonseca.com.br/?utm_source=instagram&utm_medium=bio&utm_campaign=rhodrygo
```

---

## 3. Checklist final

- [ ] Pixel criado no Meta Events Manager
- [ ] Secret `NEXT_PUBLIC_META_PIXEL_ID` no GitHub
- [ ] DNS apontando para GitHub Pages
- [ ] Custom domain verificado no GitHub
- [ ] HTTPS ativo
- [ ] Link da bio do Instagram atualizado
- [ ] Teste com Meta Pixel Helper
