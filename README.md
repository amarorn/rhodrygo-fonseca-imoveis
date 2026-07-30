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

## Estrutura do Projeto

```
src/
├── app/           # Layout, página principal, estilos globais
├── sections/      # Seções da home (Hero, Imóveis, FAQ, etc.)
├── components/    # Componentes reutilizáveis
├── hooks/         # Hooks customizados (Lenis, scroll, exit intent)
├── lib/           # Utilitários, animações e dados mock
└── types/         # Tipos TypeScript
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

## Paleta de Cores

| Token | Hex |
|-------|-----|
| Navy | `#0a1f44` |
| Gold | `#c9a227` |
| Cream | `#faf8f3` |
| WhatsApp | `#25d366` |

## Licença

Projeto privado — Rhodrygo Fonseca Imóveis.
