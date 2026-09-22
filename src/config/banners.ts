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

/**
 * Segunda família de banner — ver src/lib/banner-vonixx-html.ts. `href`
 * fica vazio de propósito: banner-vonixx-responsivo.zip não trouxe o link
 * do anúncio ("Não foi recebido um link deste kit"), e o gerador de HTML
 * falha o build com erro claro em vez de publicar CTA sem destino.
 * NÃO ATIVO em DEFAULT_BANNER_SLOTS (astro.config.mjs) até o href real
 * entrar aqui.
 */
export const BANNERS_VONIXX: Record<string, import('../lib/banner-vonixx-html').VonixxBannerProps> = {
  'kit-vonixx': {
    href: '', // TODO: colar o link real do anúncio do kit Vonixx
    headline: 'SEU CARRO LIMPO.',
    subheadline: 'O BRILHO QUE DÁ GOSTO.',
    description: 'Da lavagem ao acabamento: cuide da pintura, do interior e dos plásticos com o kit Vonixx.',
    benefits: 'Limpeza · Brilho · Cuidado com os plásticos',
    imageSrc: '/img/banners/kit-vonixx.webp',
    imageAlt: 'Kit Vonixx com Sintra Fast, Tok Final, Restaurax e V-Floc, acompanhado de acessórios',
    discount: 30,
    cta: 'Conferir preço',
  },
};
