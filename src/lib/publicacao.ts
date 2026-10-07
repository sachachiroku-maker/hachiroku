/**
 * Publicação agendada (07/10/2026). Uma entrada de coleção vai ao ar quando não é
 * rascunho e a sua `pubDate` já chegou. Assim um lote escrito de uma vez entra no
 * site uma peça por semana: o build de cada segunda (disparado por
 * .github/workflows/publicacao-agendada.yml) passa a incluir a peça cuja data venceu.
 *
 * No `astro dev` tudo aparece, para revisão antes da data.
 * Links do corpo para uma página ainda não publicada são desfeitos no build pelo
 * rehypeLinkAgendado (astro.config.mjs), então nenhuma peça aponta para um 404.
 */
export function publicado(data: { draft?: boolean; pubDate?: Date }, agora: number = Date.now()): boolean {
  if (data.draft) return false;
  if (import.meta.env.DEV) return true;
  return !data.pubDate || data.pubDate.getTime() <= agora;
}
