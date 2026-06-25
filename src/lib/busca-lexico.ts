/**
 * Léxico do domínio para correção de busca (typos + abreviações).
 * Montado a partir das entidades reais do site (marcas, modelos, sistemas,
 * motores/tecnologias) + termos automotivos comuns. Serializado para o cliente
 * na página /busca/ e usado para corrigir a intenção antes de consultar o Pagefind.
 *
 * Cresce sozinho: novos modelos/marcas/sistemas entram no léxico no próximo build.
 */
import { MARCAS } from './marcas';
import { SISTEMAS } from './sistemas';
import { ENTIDADES } from './entidades';
import { MODELO_SAME_AS } from './wikis';

// Termos automotivos comuns (defeitos, peças, sintomas) na voz do usuário.
const TERMOS_AUTOMOTIVOS = [
  'barulho', 'ruído', 'estalo', 'trepidação', 'vibração', 'tranco', 'solavanco', 'folga',
  'consumo', 'óleo', 'combustível', 'gasolina', 'etanol', 'diesel', 'flex',
  'câmbio', 'marcha', 'embreagem', 'transmissão', 'automático', 'automatizado', 'manual',
  'correia', 'corrente', 'distribuição', 'comando', 'tucho', 'válvula', 'vela', 'bobina',
  'injeção', 'injetor', 'motor', 'cabeçote', 'junta', 'retentor', 'virabrequim',
  'superaquecimento', 'arrefecimento', 'radiador', 'termostato', 'bomba', 'água', 'fervendo',
  'suspensão', 'amortecedor', 'bieleta', 'bucha', 'coxim', 'mola', 'batente', 'pivô',
  'freio', 'pastilha', 'disco', 'servofreio', 'pedal',
  'direção', 'volante', 'coluna', 'esterçar',
  'ar-condicionado', 'compressor', 'evaporador', 'condensador', 'climatizador',
  'bateria', 'alternador', 'sensor', 'módulo', 'scanner', 'partida', 'arranque',
  'pneu', 'roda', 'rolamento', 'cubo', 'alinhamento', 'balanceamento', 'geometria',
  'recall', 'revisão', 'manutenção', 'garantia', 'quilometragem',
  'autonomia', 'recarga', 'carregamento', 'híbrido', 'elétrico',
  'vazamento', 'fumaça', 'cheiro', 'aquecendo', 'falhando', 'engasgo', 'morrendo',
  'esquentando', 'patinando', 'rangendo', 'assobiando', 'chacoalhando',
  // intenções de compra/conteúdo
  'comparativo', 'vale', 'pena', 'defeito', 'problema', 'sintoma', 'diagnóstico',
  'ficha', 'técnica', 'potência', 'preço', 'usado', 'comprar',
];

// Abreviações e gírias → forma plena. Aplicadas palavra a palavra.
export const ABREVIACOES: Record<string, string> = {
  pq: 'porque', pqe: 'porque', vc: 'você', vcs: 'vocês', tb: 'também', tbm: 'também',
  q: 'que', qto: 'quanto', qdo: 'quando', blz: 'beleza', msm: 'mesmo',
  'ar-cond': 'ar condicionado', arcond: 'ar condicionado', ac: 'ar condicionado',
  susp: 'suspensão', cambio: 'câmbio', oleo: 'óleo', direcao: 'direção',
  injecao: 'injeção', km: 'quilometragem', kms: 'quilometragem', rpm: 'rotação',
  vw: 'volkswagen', gm: 'chevrolet', cv: 'cavalos', man: 'manual', auto: 'automático',
  superaq: 'superaquecimento', amort: 'amortecedor', emb: 'embreagem',
};

/** Constrói o léxico (termos canônicos + abreviações) a partir das entidades reais. */
export function construirLexico(): { termos: string[]; abreviacoes: Record<string, string> } {
  const termos = new Set<string>();
  const add = (s?: string) => {
    if (!s) return;
    for (const w of s.toLowerCase().split(/[\s/_-]+/)) {
      const t = w.trim().replace(/[^a-zà-ú0-9]/gi, '');
      if (t.length >= 3) termos.add(t);
    }
  };
  MARCAS.forEach((m) => { add(m.slug); add(m.nome); });
  Object.keys(MODELO_SAME_AS).forEach(add);        // "chevrolet/onix" → chevrolet, onix
  SISTEMAS.forEach((s) => add(s.nome));
  ENTIDADES.forEach((e) => { add(e.nome); add(e.slug); });
  TERMOS_AUTOMOTIVOS.forEach(add);
  return { termos: [...termos].sort(), abreviacoes: ABREVIACOES };
}
