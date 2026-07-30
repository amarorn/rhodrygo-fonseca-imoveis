import type {
  ContactInfo,
  FAQItem,
  Property,
  PropertyCategory,
  Step,
  Testimonial,
  TrustBadge,
} from "@/types";

export const SITE = {
  name: "Rhodrygo Fonseca",
  title: "Corretor de Imóveis",
  creci: "CRECI-PE 00000",
} as const;

export const CONTACT: ContactInfo = {
  whatsapp: "(81) 99999-9999",
  whatsappLink: "https://wa.me/5581999999999",
  email: "contato@rhodrygofonseca.com.br",
  address: "Recife, PE - Boa Viagem",
  schedule: "Seg-Sex 8h-18h, Sáb 9h-13h",
};

export const NAV_LINKS = [
  { label: "Início", href: "#inicio" },
  { label: "Imóveis", href: "#imoveis" },
  { label: "Como Funciona", href: "#como-funciona" },
  { label: "Sobre", href: "#sobre" },
  { label: "Depoimentos", href: "#depoimentos" },
  { label: "Contato", href: "#contato" },
] as const;

export const PROPERTY_CATEGORIES: { value: PropertyCategory; label: string }[] = [
  { value: "todos", label: "Todos" },
  { value: "casas", label: "Casas" },
  { value: "apartamentos", label: "Apartamentos" },
  { value: "terrenos", label: "Terrenos" },
  { value: "comercial", label: "Comercial" },
];

export const PROPERTIES: Property[] = [
  {
    id: "1",
    slug: "apartamento-luxo-boa-viagem",
    title: "Apartamento de Luxo",
    location: "Boa Viagem, Recife - PE",
    price: 450000,
    category: "apartamentos",
    badge: "Destaque",
    image:
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80",
    bedrooms: 3,
    bathrooms: 2,
    area: 85,
    parking: 2,
  },
  {
    id: "2",
    slug: "casa-moderna-casa-forte",
    title: "Casa Moderna",
    location: "Casa Forte, Recife - PE",
    price: 680000,
    category: "casas",
    badge: "Novo",
    image:
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
    bedrooms: 4,
    bathrooms: 3,
    area: 220,
    parking: 3,
  },
  {
    id: "3",
    slug: "apartamento-vista-mar-piedade",
    title: "Apartamento Vista Mar",
    location: "Piedade, Jaboatão - PE",
    price: 320000,
    category: "apartamentos",
    badge: "Vista Mar",
    image:
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80",
    bedrooms: 2,
    bathrooms: 1,
    area: 65,
    parking: 1,
  },
  {
    id: "4",
    slug: "terreno-condominio-parnamirim",
    title: "Terreno Condomínio Fechado",
    location: "Parnamirim, Recife - PE",
    price: 180000,
    category: "terrenos",
    badge: "Oportunidade",
    image:
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80",
    area: 450,
  },
  {
    id: "5",
    slug: "sala-comercial-centro-recife",
    title: "Sala Comercial",
    location: "Centro, Recife - PE",
    price: 250000,
    category: "comercial",
    badge: "Investimento",
    image:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80",
    area: 45,
  },
  {
    id: "6",
    slug: "casa-praia-porto-de-galinhas",
    title: "Casa de Praia",
    location: "Porto de Galinhas, PE",
    price: 890000,
    category: "casas",
    badge: "Exclusivo",
    image:
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80",
    bedrooms: 5,
    bathrooms: 4,
    area: 350,
    features: ["Piscina"],
  },
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "1",
    name: "Mariana Silva",
    role: "Comprou apartamento em Boa Viagem",
    content:
      "O Rhodrygo foi fundamental na compra do meu primeiro apartamento. Atendimento impecável do início ao fim, sempre disponível para tirar dúvidas.",
    rating: 5,
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80",
  },
  {
    id: "2",
    name: "Carlos Mendes",
    role: "Vendeu casa em Casa Forte",
    content:
      "Profissionalismo e dedicação incomparáveis. Vendeu minha casa em tempo recorde e pelo melhor valor do mercado. Recomendo de olhos fechados!",
    rating: 5,
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80",
  },
  {
    id: "3",
    name: "Roberto Almeida",
    role: "Investidor imobiliário",
    content:
      "Visão de negócio impressionante. Rhodrygo me apresentou oportunidades que eu nem imaginava existir. Parceiro de confiança para investimentos.",
    rating: 5,
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80",
  },
];

export const FAQ_ITEMS: FAQItem[] = [
  {
    id: "1",
    question: "Preciso pagar algo para o corretor?",
    answer:
      "Na maioria dos casos, a comissão do corretor é paga pelo vendedor do imóvel. Você, como comprador, não paga nada pelo serviço de intermediação. Transparência total desde o primeiro contato.",
  },
  {
    id: "2",
    question: "Como funciona o financiamento imobiliário?",
    answer:
      "Trabalho com os principais bancos e posso te ajudar a simular condições, analisar sua capacidade de crédito e acompanhar todo o processo de aprovação até a assinatura do contrato.",
  },
  {
    id: "3",
    question: "Quanto tempo leva para comprar um imóvel?",
    answer:
      "O prazo varia conforme o tipo de negociação. À vista pode levar de 30 a 60 dias. Com financiamento, geralmente de 60 a 90 dias. Acompanho cada etapa para agilizar ao máximo.",
  },
  {
    id: "4",
    question: "Você atende em quais cidades?",
    answer:
      "Atendo principalmente Recife e Região Metropolitana, incluindo Jaboatão, Olinda, Paulista e Cabo de Santo Agostinho. Também tenho imóveis no litoral sul, como Porto de Galinhas.",
  },
  {
    id: "5",
    question: "Posso visitar os imóveis antes de decidir?",
    answer:
      "Claro! Agendo visitas presenciais nos horários mais convenientes para você. Também posso enviar vídeos e fotos adicionais antes da visita para otimizar seu tempo.",
  },
  {
    id: "6",
    question: "Você também vende imóveis?",
    answer:
      "Sim! Se você deseja vender seu imóvel, faço uma avaliação gratuita, elaboro estratégia de marketing e conduzo todo o processo de venda com máxima transparência.",
  },
];

export const STEPS: Step[] = [
  {
    id: "1",
    number: "01",
    title: "Contato Inicial",
    description:
      "Entre em contato pelo formulário ou WhatsApp. Entendo suas necessidades e preferências.",
    icon: "MessageCircle",
  },
  {
    id: "2",
    number: "02",
    title: "Seleção Personalizada",
    description:
      "Apresento imóveis selecionados especialmente para você, com todas as informações detalhadas.",
    icon: "Search",
  },
  {
    id: "3",
    number: "03",
    title: "Visitas e Negociação",
    description:
      "Agendo visitas nos melhores horários e conduzo a negociação buscando as melhores condições.",
    icon: "Key",
  },
  {
    id: "4",
    number: "04",
    title: "Fechamento Seguro",
    description:
      "Acompanho toda a documentação e burocracia até a entrega das chaves do seu novo imóvel.",
    icon: "CheckCircle",
  },
];

export const TRUST_BADGES: TrustBadge[] = [
  { id: "1", label: "Negociação Segura", icon: "Shield" },
  { id: "2", label: "Documentação Completa", icon: "FileCheck" },
  { id: "3", label: "Atendimento Personalizado", icon: "HeartHandshake" },
  { id: "4", label: "CRECI Ativo", icon: "BadgeCheck" },
  { id: "5", label: "Resposta Rápida", icon: "Zap" },
];

export const HERO_STATS = [
  { value: 500, suffix: "+", label: "Imóveis" },
  { value: 98, suffix: "%", label: "Satisfeitos" },
  { value: 10, suffix: "+", label: "Anos" },
] as const;

export const PROPERTY_TYPES = [
  "Apartamento",
  "Casa",
  "Terreno",
  "Comercial",
  "Cobertura",
  "Outro",
] as const;

export const PRICE_RANGES = [
  "Até R$ 200.000",
  "R$ 200.000 - R$ 400.000",
  "R$ 400.000 - R$ 600.000",
  "R$ 600.000 - R$ 1.000.000",
  "Acima de R$ 1.000.000",
] as const;

export const INTEREST_OPTIONS = [
  "Comprar imóvel",
  "Vender imóvel",
  "Investimento",
  "Financiamento",
  "Avaliação gratuita",
  "Outro",
] as const;
