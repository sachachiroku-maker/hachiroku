import { COTACAO_SEGURO } from '../config/cotacao-seguro';

/**
 * Markup do banner de cotação de seguro auto (família 'seguro' do
 * rehypeBannerMeio, astro.config.mjs). Diferente das famílias de afiliado,
 * não é link: é um <button> que abre o formulário em pop-up de
 * src/components/ui/CotacaoSeguro.astro (listener delegado em `.js-cotacao`).
 *
 * Duas variantes no mesmo botão, alternadas por CSS no breakpoint do layout
 * de artigo (880px, onde a barra lateral sai):
 * - desktop: a arte do designer inteira (texto embutido no PNG); o nome
 *   acessível vem do `alt`, que repete o texto da arte;
 * - celular e tablet: `.seg-card`, o mesmo visual em HTML (texto real, nítido
 *   e legível em qualquer largura) com a foto recortada da arte; empilha ou
 *   fica lado a lado conforme a largura do próprio card (container query).
 * Cada variante tem um <source> vazio para a faixa em que fica oculta, então
 * cada aparelho baixa uma imagem só.
 *
 * `carro` vem do frontmatter do artigo (entidade.marca/modelo ou
 * marca/modelo) e só pré-preenche o campo do formulário, que segue editável.
 * Classes `.seg-banner*` em src/styles/site.css (globais, mesmo motivo das
 * outras famílias: o HTML entra pelo pipeline de markdown).
 */
function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

export interface BannerSeguroCtx {
  /** Identifica a posição no evento e na planilha: 'h2-1', 'h2-3', 'fim'. */
  slot: string;
  carro?: string;
  /** O primeiro slot cai perto do topo: não espera o scroll para carregar. */
  eager?: boolean;
}

/** GIF 1×1 transparente: o <source> da variante oculta aponta para ele, para o navegador não baixar a imagem que não vai mostrar. */
const VAZIO = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

export function bannerSeguroHtml(ctx: BannerSeguroCtx): string {
  const { banner } = COTACAO_SEGURO;
  const carro = ctx.carro ? ` data-carro="${esc(ctx.carro)}"` : '';
  const loading = ctx.eager ? '' : ' loading="lazy"';
  return `<aside class="seg-banner-wrap" aria-label="Cotação de seguro auto">
  <button type="button" class="seg-banner js-cotacao" data-cotacao-slot="${esc(ctx.slot)}"${carro} aria-haspopup="dialog">
    <picture class="seg-arte">
      <source media="(max-width: 880px)" srcset="${VAZIO}" />
      <img class="seg-banner-img" src="${banner.desktop.src}" srcset="${banner.desktop.src800} 800w, ${banner.desktop.src} 1600w" sizes="800px" alt="${esc(banner.alt)}" width="${banner.desktop.width}" height="${banner.desktop.height}" decoding="async"${loading} />
    </picture>
    <span class="seg-card">
      <span class="seg-card-foto">
        <picture>
          <source media="(min-width: 881px)" srcset="${VAZIO}" />
          <img src="${banner.foto.src}" alt="" width="${banner.foto.width}" height="${banner.foto.height}" decoding="async"${loading} />
        </picture>
      </span>
      <span class="seg-card-copy">
        <span class="seg-card-titulo">Quanto custa proteger seu carro?</span>
        <span class="seg-card-sub">Faça uma cotação de seguro auto para o seu perfil.</span>
        <span class="seg-card-cta">Cotar seguro auto</span>
      </span>
    </span>
  </button>
</aside>`;
}
