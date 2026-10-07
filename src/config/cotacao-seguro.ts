/**
 * Banner de cotação de seguro auto (família 'seguro' do rehypeBannerMeio em
 * astro.config.mjs) e o formulário em pop-up que ele abre
 * (src/components/ui/CotacaoSeguro.astro). Os pedidos vão pela função
 * api/cotacao.js para o sistema de atendimento (CRM) da equipe comercial do
 * Hachiroku; se o CRM não confirmar, ficam numa planilha do Google de reserva.
 *
 * QUEM ATENDE: a própria equipe comercial do Hachiroku faz a cotação e fala com
 * a pessoa (decisão de 06/10/2026: não há corretora parceira). É esse
 * destinatário que o aviso de privacidade nomeia (LGPD, art. 9º, V); com ele
 * definido, o banner e o pop-up entram também no build de produção.
 * `atendimento: null` volta a travar a publicação (banner só no `astro dev`).
 */
export const COTACAO_SEGURO = {
  /** Quem recebe os pedidos e faz a cotação. null = pendente (banner fora do ar). */
  atendimento: 'a equipe comercial do Hachiroku' as string | null,
  /** Prazo máximo de guarda dos pedidos (CRM e planilha de reserva), citado no aviso e na política. */
  retencaoMeses: 12,
  /** Versão do texto de ciência gravada junto com cada pedido. Igual a VERSAO_AVISO em api/cotacao.js. */
  versaoAviso: '2026-10-06',
  banner: {
    alt: 'Quanto custa proteger seu carro? Faça uma cotação de seguro auto para o seu perfil. Cotar seguro auto',
    desktop: { src: '/img/banners/seguro-auto-1600.webp', src800: '/img/banners/seguro-auto-800.webp', width: 1600, height: 756 },
    /** Só a foto (sem texto), para o card HTML de celular e tablet. */
    foto: { src: '/img/banners/seguro-auto-foto.webp', width: 720, height: 681 },
  },
};

export const cotacaoNoAr = (): boolean => COTACAO_SEGURO.atendimento !== null;

/** Quem atende, para os textos; no dev, sem atendimento definido, deixa a pendência à vista. */
export const quemAtende = (): string => COTACAO_SEGURO.atendimento ?? '[ATENDIMENTO A DEFINIR]';
