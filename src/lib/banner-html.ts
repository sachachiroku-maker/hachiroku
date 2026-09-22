import type { BannerProdutoProps } from '../config/banners';

/**
 * Fonte única do markup do banner de produto. Usada por dois consumidores:
 * - BannerProduto.astro, para uso manual (`<BannerProduto produto="..." />`);
 * - rehype-banner-meio.mjs, que injeta este HTML bruto dentro do corpo
 *   renderizado do markdown (antes do N-ésimo heading).
 * As classes `.bp*`/`.bpm*` vivem em src/styles/site.css (globais) — não em
 * `<style>` escopado do componente — porque o segundo consumidor roda no
 * pipeline de markdown, fora do sistema de estilos do Astro.
 *
 * Duas variantes, uma por breakpoint, alternadas só por CSS (sem JS):
 * `bannerHtml` (paisagem, sem selo) e `bannerHtmlVertical` (empilhado, com
 * selo — layout de src/lib/../../../banner-astroai-mobile.zip). As duas são
 * sempre emitidas juntas por `bannerHtmlResponsive`; `.bp-desktop-only` /
 * `.bp-mobile-only` escondem a que não serve pro viewport atual, então nunca
 * aparecem as duas ao mesmo tempo (ver breakpoint em site.css, 600px).
 *
 * `data-bp-produto`/`data-bp-variante` alimentam o listener global de clique
 * (evento GA4 `banner_produto_click`, ver BaseLayout.astro).
 */
function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

export function bannerHtml(p: BannerProdutoProps, produtoKey: string): string {
  const discountBadge = p.discount > 0
    ? `<span class="bp-discount" aria-label="${p.discount}% de desconto"><strong>${p.discount}%</strong> OFF</span>`
    : '';
  return `<a class="bp-wrap bp-desktop-only js-banner-produto" data-bp-produto="${esc(produtoKey)}" data-bp-variante="desktop" href="${esc(p.href)}" target="_blank" rel="sponsored nofollow noopener" aria-label="${esc(p.description)} — ${esc(p.cta)}">
  <span class="bp">
    <span class="bp-copy">
      ${discountBadge}
      <span class="bp-title"><span>${esc(p.headline)}</span><span>${esc(p.subheadline)}</span></span>
      <span class="bp-desc">${esc(p.description)}</span>
      <span class="bp-spec">${esc(p.specs)}</span>
      <span class="bp-cta">${esc(p.cta)}</span>
    </span>
    <span class="bp-media">
      <img class="bp-image" src="${esc(p.imageSrc)}" alt="${esc(p.imageAlt)}" width="700" height="583" decoding="async" />
    </span>
  </span>
</a>`;
}

export function bannerHtmlVertical(p: BannerProdutoProps, produtoKey: string): string {
  const discount = p.discountMobile ?? p.discount;
  const discountBadge = discount > 0
    ? `<span class="bpm-discount" aria-label="${discount}% de desconto"><strong>${discount}%</strong> OFF</span>`
    : '';
  return `<a class="bpm-wrap bp-mobile-only js-banner-produto" data-bp-produto="${esc(produtoKey)}" data-bp-variante="mobile" href="${esc(p.href)}" target="_blank" rel="sponsored nofollow noopener" aria-label="${esc(p.description)} — ${esc(p.cta)}">
  <span class="bpm">
    <span class="bpm-copy">
      ${discountBadge}
      <span class="bpm-title"><span>${esc(p.headline)}</span><span>${esc(p.subheadline)}</span></span>
      <span class="bpm-desc">${esc(p.description)}</span>
      <span class="bpm-spec">${esc(p.specs)}</span>
    </span>
    <span class="bpm-media">
      <img class="bpm-image" src="${esc(p.imageSrc)}" alt="${esc(p.imageAlt)}" width="700" height="583" decoding="async" />
    </span>
    <span class="bpm-cta">${esc(p.cta)}</span>
  </span>
</a>`;
}

export function bannerHtmlResponsive(p: BannerProdutoProps, produtoKey: string): string {
  return bannerHtml(p, produtoKey) + bannerHtmlVertical(p, produtoKey);
}
