/**
 * Configuração central de afiliados do Hachiroku.
 * TROQUE AS CREDENCIAIS AQUI, em um único lugar: todos os links do site herdam.
 *
 * Status (2026-06-18): placeholders. Substituir pelos IDs reais quando as contas
 * de afiliado estiverem ativas (ver brief: monetização curto prazo).
 */

export const AFILIADOS = {
  // Amazon Associados (BR) — tag no formato "algo-20"
  amazon: {
    tag: 'hachiroku-20', // TODO: trocar pela tag real
    base: 'https://www.amazon.com.br/s',
  },
  // Mercado Livre — programa de afiliados (matt_tool/word ou link encurtado próprio)
  mercadoLivre: {
    matt: 'HACHIROKU', // TODO: trocar pelo identificador real do programa
    base: 'https://lista.mercadolivre.com.br',
  },
  // PneuStore — parceria direta (ticket alto, ~5%)
  pneuStore: {
    ref: 'hachiroku', // TODO: trocar pelo parâmetro real de parceria
    base: 'https://www.pneustore.com.br/busca',
  },
} as const;

export type Programa = 'amazon' | 'mercadoLivre' | 'pneuStore';

/** Monta o link de busca afiliada para um termo, no programa indicado. */
export function linkAfiliado(termo: string, programa: Programa = 'amazon'): string {
  const q = encodeURIComponent(termo);
  switch (programa) {
    case 'amazon':
      return `${AFILIADOS.amazon.base}?k=${q}&tag=${AFILIADOS.amazon.tag}`;
    case 'mercadoLivre':
      return `${AFILIADOS.mercadoLivre.base}/${q}#matt_word=${AFILIADOS.mercadoLivre.matt}`;
    case 'pneuStore':
      return `${AFILIADOS.pneuStore.base}/${q}?ref=${AFILIADOS.pneuStore.ref}`;
  }
}

/** Rótulo curto do programa, para o selo do bloco. */
export function rotuloPrograma(programa: Programa): string {
  return { amazon: 'Amazon', mercadoLivre: 'Mercado Livre', pneuStore: 'PneuStore' }[programa];
}
