/**
 * Eixo horizontal SISTEMA: agrega diagnósticos de TODOS os modelos por sistema
 * mecânico. Classificação automática por palavra-chave do defeito/slug (evita
 * tocar nos 59+ artigos). Gera /sistema/[slug].
 */
export interface Sistema {
  slug: string;
  nome: string;
  titulo: string;
  resumo: string;
  match: RegExp; // casa contra `${defeito} ${slug}` em minúsculas
}

export const SISTEMAS: Sistema[] = [
  {
    slug: 'motor-e-lubrificacao', nome: 'Motor e lubrificação',
    titulo: 'Problemas de motor e óleo nos carros populares: causas e custos',
    resumo: 'Os defeitos crônicos ligados ao motor e à lubrificação dos carros populares brasileiros: correia e corrente de distribuição, consumo e vazamento de óleo, tuchos, bomba de óleo e junta de cabeçote. Por modelo, com a causa, o custo e a prevenção.',
    match: /correia|corrente de comando|tucho|bomba de óleo|bomba-de-oleo|vazamento.*óleo|vazamento-oleo|consumo de óleo|consumo-de-oleo|junta|retentor|virabrequim|respiro/i,
  },
  {
    slug: 'cambio-e-transmissao', nome: 'Câmbio e transmissão',
    titulo: 'Problemas de câmbio nos carros populares: CVT, automático e automatizado',
    resumo: 'Os defeitos crônicos de transmissão dos carros populares: câmbio CVT, automático Aisin, automatizado Dualogic e GSR, PowerShift, embreagem e o trocador de calor que mistura água no óleo. Por modelo, com sintomas, causa e custo de reparo.',
    match: /câmbio|cambio|cvt|dualogic|gsr|aisin|aq250|powershift|embreagem|trocador de calor|trocador-de-calor|marcha|transmiss/i,
  },
  {
    slug: 'suspensao', nome: 'Suspensão',
    titulo: 'Problemas de suspensão nos carros populares: barulhos e desgaste',
    resumo: 'Os defeitos crônicos de suspensão dos carros populares: barulho na dianteira, bieletas, buchas, coxins e amortecedores que vazam cedo. Por modelo, com o diagnóstico do ruído e o custo do reparo.',
    match: /suspens|amortecedor|bieleta|bucha|coxim|batente/i,
  },
  {
    slug: 'freios', nome: 'Freios',
    titulo: 'Problemas de freio nos carros populares: ruído, pedal e segurança',
    resumo: 'Os defeitos e cuidados de freio dos carros populares: pedal duro, ruído, desgaste de pastilha e disco, ABS e os recalls de servofreio. Por modelo, com o que é seguro e o que exige parar na hora.',
    match: /freio|pastilha|disco|servofreio|abs|pedal/i,
  },
  {
    slug: 'direcao', nome: 'Direção',
    titulo: 'Problemas de direção nos carros populares: volante duro e folga',
    resumo: 'Os defeitos crônicos de direção dos carros populares: direção elétrica que endurece, coluna de direção com folga ou recall, e ruídos ao esterçar. Por modelo, com o diagnóstico e o custo.',
    match: /direção|direcao|coluna de direção|coluna-de-direcao|stabilitrak|volante/i,
  },
  {
    slug: 'eletrica-e-eletronica', nome: 'Elétrica e eletrônica',
    titulo: 'Problemas elétricos e eletrônicos nos carros populares',
    resumo: 'Os defeitos crônicos de elétrica e eletrônica dos carros populares: bobinas, velas, falha de injeção, luz EPC, sensores, módulos, bateria e o sistema Start-Stop. Por modelo, com o diagnóstico por scanner e o custo.',
    match: /bobina|vela|injeção|injecao|epc|luz-injecao|luz de injeção|sensor|módulo|modulo|bateria|start-stop|partida|alta pressão|alta-pressao|corpo de borboleta|marcha lenta/i,
  },
  {
    slug: 'arrefecimento', nome: 'Arrefecimento',
    titulo: 'Problemas de arrefecimento nos carros populares: superaquecimento',
    resumo: 'Os defeitos crônicos do sistema de arrefecimento dos carros populares: superaquecimento, bomba d’água que vaza, válvula termostática e o motor que ferve. Por modelo, com o risco e o reparo.',
    match: /superaquecimento|arrefecimento|bomba.*água|bomba-de-agua|radiador|termostát|fervendo|ferve/i,
  },
  {
    slug: 'ar-condicionado', nome: 'Ar-condicionado',
    titulo: 'Problemas de ar-condicionado nos carros populares: não gela',
    resumo: 'Os defeitos crônicos do ar-condicionado dos carros populares: o ar que para de gelar por vazamento no evaporador, condensador ou compressor. Por modelo, com o diagnóstico e o custo.',
    match: /ar-condicionado|ar condicionado|nao-gela|não gela|climatiz|evaporador|condensador|compressor/i,
  },
];

export const getSistema = (slug: string) => SISTEMAS.find((s) => s.slug === slug);

/** Classifica um defeito num sistema (o primeiro que casar). */
export function sistemaDoDefeito(defeito: string, slug: string): Sistema | undefined {
  const txt = `${defeito} ${slug}`.toLowerCase();
  return SISTEMAS.find((s) => s.match.test(txt));
}
