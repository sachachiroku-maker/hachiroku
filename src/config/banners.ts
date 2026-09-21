/**
 * Registro dos produtos usados no banner do meio de conteúdo (BannerProduto).
 * Uma chave aqui = um produto disponível para qualquer `bannerMeio.produto`
 * no frontmatter. Trocar preço/link/desconto é editar aqui, nunca no
 * componente nem no plugin de injeção.
 *
 * Rotação entre vários produtos na mesma posição ainda não existe — hoje
 * `bannerMeio.produto` aponta pra uma chave fixa. Quando entrar rotação,
 * o consumidor (componente ou plugin) decide qual chave usar; o formato
 * de cada entrada não muda.
 */
export interface BannerProdutoProps {
  headline: string;
  subheadline: string;
  description: string;
  specs: string;
  imageSrc: string;
  imageAlt: string;
  href: string;
  /** 0 oculta o selo de desconto. Usado na variante desktop (paisagem). */
  discount: number;
  /** Selo da variante mobile (vertical). Cai para `discount` se omitido. */
  discountMobile?: number;
  cta: string;
}

export const BANNERS: Record<string, BannerProdutoProps> = {
  'astroai-s8': {
    headline: 'BATERIA ACABOU?',
    subheadline: 'ESTEJA PREPARADO.',
    description: 'Auxiliar de partida portátil AstroAI S8',
    specs: '12 V • 8000 mAh',
    imageSrc: '/img/banners/astroai-s8.webp',
    imageAlt: 'Auxiliar de partida AstroAI S8 preto e laranja com garras de bateria',
    href: 'https://meli.la/2uKxGTP',
    discount: 0,
    discountMobile: 34,
    cta: 'Conferir preço',
  },
};
