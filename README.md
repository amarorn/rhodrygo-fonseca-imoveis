# Rhodrygo Fonseca Imóveis

Site imobiliário premium de alta conversão para o corretor **Rhodrygo Fonseca**, desenvolvido com Next.js 14+, TypeScript, Tailwind CSS e animações GSAP.

## Stack

- **Framework:** Next.js 16 (App Router)
- **Linguagem:** TypeScript (strict)
- **Estilização:** Tailwind CSS 4
- **Animações:** GSAP + ScrollTrigger + Lenis
- **Formulários:** React Hook Form + Zod
- **Ícones:** Lucide React

## Pré-requisitos

- Node.js 18+
- npm ou yarn

## Instalação

```bash
cd rhodrygo-fonseca-imoveis
npm install
```

## Desenvolvimento

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000).

## Build de Produção

```bash
npm run build
npm start
```

## Deploy no GitHub Pages

O workflow `.github/workflows/deploy-github-pages.yml` publica automaticamente a cada push na branch `main`.

### Configuração no GitHub (uma vez)

1. Vá em **Settings → Pages**
2. Em **Source**, selecione **GitHub Actions**
3. Faça push na branch `main` — o deploy roda automaticamente

**URL do site:** [https://amarorn.github.io/rhodrygo-fonseca-imoveis/](https://amarorn.github.io/rhodrygo-fonseca-imoveis/)

### Build local (mesmo modo do CI)

```bash
npm run build:gh-pages
```

Os arquivos estáticos são gerados na pasta `out/`.

## Imóveis do Instagram

Os imóveis em destaque vêm do perfil [@rhodrygofonseca](https://www.instagram.com/rhodrygofonseca/). Cada um tem página de detalhe em `/imoveis/[slug]`.

### Sincronizar automaticamente

```bash
# Requer Apify CLI autenticado
npm install -g apify-cli
apify login --token SEU_TOKEN
npm run sync:instagram
```

O workflow `.github/workflows/sync-instagram.yml` roda toda segunda-feira (ou manualmente) se você adicionar o secret `APIFY_TOKEN` no GitHub.

### Rastreamento (Meta Pixel + UTM)

1. Copie `.env.example` → `.env.local`
2. Cole o ID do Meta Pixel em `NEXT_PUBLIC_META_PIXEL_ID`
3. Use na bio do Instagram:

```
https://amarorn.github.io/rhodrygo-fonseca-imoveis/?utm_source=instagram&utm_medium=bio&utm_campaign=rhodrygo
```

## Estrutura do Projeto

```
src/
├── app/           # Layout, home, páginas /imoveis/[slug]
├── data/          # properties.json (imóveis sincronizados)
├── sections/      # Seções da home (Hero, Imóveis, FAQ, etc.)
├── components/    # Componentes reutilizáveis
├── hooks/         # Hooks customizados (Lenis, scroll, exit intent)
├── lib/           # Utilitários, analytics, properties
└── types/         # Tipos TypeScript
scripts/
└── sync-instagram-properties.mjs
public/
└── properties/    # Imagens dos imóveis
```

## Seções

1. **Hero** — Split-screen com formulário de captação e animação cinematográfica
2. **Trust Badges** — Barra de credibilidade
3. **Imóveis** — Grid com filtros por categoria
4. **Como Funciona** — 4 passos animados
5. **Sobre** — Apresentação do corretor
6. **Depoimentos** — Cards com glassmorphism
7. **CTA E-book** — Lead magnet
8. **FAQ** — Accordion com navegação por teclado
9. **Contato** — Formulário completo + informações

## Funcionalidades de Conversão

- 5 formulários com validação Zod (Hero, Contato, E-book, Exit Intent, Newsletter)
- Botão flutuante WhatsApp com deep links contextualizados
- Modal de exit intent (mouse leave desktop / timeout 30s mobile)
- Cursor customizado (desktop only)
- Smooth scroll com Lenis
- Filtro de imóveis por categoria
- Páginas de detalhe por imóvel (`/imoveis/[slug]`)
- Imóveis reais do Instagram com sync via Apify
- Meta Pixel e captura de UTM para rastrear leads

## Paleta de Cores

| Token | Hex |
|-------|-----|
| Navy | `#0a1f44` |
| Gold | `#c9a227` |
| Cream | `#faf8f3` |
| WhatsApp | `#25d366` |

## Licença

Projeto privado — Rhodrygo Fonseca Imóveis.
