/**
 * Segunda família de banner de meio-de-conteúdo — design próprio (kit
 * Vonixx), diferente da família "padrão" (banner-html.ts). Um único
 * markup responsivo via container query (empilha ≤580px de largura do
 * espaço do banner, não do viewport) — ao contrário da família padrão,
 * que usa duas variantes alternadas por media query de viewport.
 *
 * Origem: banner-vonixx-responsivo.zip (BannerVonixx.astro). `href` é
 * obrigatório e sem fallback de propósito — publicar sem o link real do
 * anúncio seria inventar destino, e o build deve falhar alto e visível
 * em vez de publicar um CTA morto.
 */
export interface VonixxBannerProps {
  href: string;
  headline: string;
  subheadline: string;
  description: string;
  benefits: string;
  imageSrc: string;
  imageAlt: string;
  discount: number;
  cta: string;
}

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

export function bannerHtmlVonixx(p: VonixxBannerProps, produtoKey: string): string {
  if (!p.href || !/^https?:\/\//i.test(p.href)) {
    throw new Error(`bannerHtmlVonixx: produto "${produtoKey}" está sem href válido em src/config/banners.ts — não publica CTA sem link real.`);
  }
  const discountBadge = p.discount > 0
    ? `<span class="vx-off" aria-label="${p.discount}% de desconto"><strong>${p.discount}%</strong> OFF</span>`
    : '';
  return `<a class="vx-wrap js-banner-produto" data-bp-produto="${esc(produtoKey)}" data-bp-variante="responsivo" href="${esc(p.href)}" target="_blank" rel="sponsored nofollow noopener" aria-label="${esc(p.description)} — ${esc(p.cta)}">
  <span class="vx-banner">
    <span class="vx-copy">
      <span class="vx-top"><span class="vx-label">KIT VONIXX</span>${discountBadge}</span>
      <span class="vx-title"><span>${esc(p.headline)}</span><span>${esc(p.subheadline)}</span></span>
      <span class="vx-description">${esc(p.description)}</span>
      <span class="vx-benefits">${esc(p.benefits)}</span>
    </span>
    <span class="vx-media">
      <img src="${esc(p.imageSrc)}" alt="${esc(p.imageAlt)}" width="650" height="594" loading="lazy" decoding="async" />
    </span>
    <span class="vx-action"><span class="vx-button">${esc(p.cta)}</span><small>Veja os itens e as condições no anúncio.</small></span>
  </span>
</a>`;
}
