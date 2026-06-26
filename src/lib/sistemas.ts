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
    resumo: 'O motor é o coração do veículo e depende de lubrificação contínua para funcionar sem desgaste prematuro. A correia dentada ou a corrente de distribuição sincroniza o movimento das válvulas com os pistões e, quando se rompe ou perde tensão, pode destruir o motor em frações de segundo. O consumo excessivo de óleo é frequente em motores turboalimentados modernos e em unidades com alta quilometragem, geralmente associado a retentores desgastados, anéis de pistão fatigados ou junta do cabeçote comprometida. A bomba de óleo, ao falhar, interrompe a circulação do lubrificante e provoca desgaste acelerado em todas as partes móveis. Motores de pequena cilindrada com turbo, como os 1.0 e 1.3 presentes em modelos populares de diversas marcas, estão entre os mais suscetíveis. O motorista pode notar luz de pressão de óleo acesa no painel, fumaça azulada pelo escapamento, ruídos metálicos durante a aceleração ou queda perceptível de potência. Qualquer um desses sintomas exige avaliação imediata em oficina especializada para evitar danos irreversíveis ao conjunto motor.',
    match: /correia|corrente de comando|tucho|bomba de óleo|bomba-de-oleo|vazamento.*óleo|vazamento-oleo|consumo de óleo|consumo-de-oleo|junta|retentor|virabrequim|respiro/i,
  },
  {
    slug: 'cambio-e-transmissao', nome: 'Câmbio e transmissão',
    titulo: 'Problemas de câmbio nos carros populares: CVT, automático e automatizado',
    resumo: 'A caixa de câmbio é responsável por transmitir a força do motor às rodas de forma eficiente. Transmissões automatizadas como o CVT (variação contínua), o Dualogic da Fiat, o PowerShift da Ford e o GSR de outras marcas ganharam popularidade por reduzir o consumo de combustível, mas apresentam histórico de falhas mais frequentes do que câmbios manuais convencionais. O fluido de transmissão tem papel crítico: quando degradado ou em nível incorreto, provoca superaquecimento interno e desgaste progressivo das peças. O trocador de calor do fluido, quando entupido, acelera esse processo. Veículos compactos com câmbio automatizado de dupla embreagem seca são especialmente vulneráveis em uso urbano intenso com arranques frequentes. O motorista percebe solavancos na troca de marcha, demora para engatar, engasgos na aceleração, ruído de atrito ou a transmissão entrando em modo de proteção. A troca periódica do fluido é manutenção obrigatória. Sintomas persistentes indicam revisão urgente para evitar a substituição completa da unidade.',
    match: /câmbio|cambio|cvt|dualogic|gsr|aisin|aq250|powershift|embreagem|trocador de calor|trocador-de-calor|marcha|transmiss/i,
  },
  {
    slug: 'suspensao', nome: 'Suspensão',
    titulo: 'Problemas de suspensão nos carros populares: barulhos e desgaste',
    resumo: 'O sistema de suspensão conecta a carroceria às rodas e garante estabilidade, conforto e segurança em curvas e frenagens. É composto por amortecedores, molas, bieletas, bandejas e buchas de borracha que absorvem os impactos do pavimento. As buchas se deterioram com o tempo e a exposição ao calor, perdendo elasticidade e gerando folgas mecânicas. As bieletas estabilizadoras são peças de desgaste frequente, especialmente em vias urbanas com muitos buracos. Os amortecedores, quando vencidos, reduzem o controle do veículo e aumentam a distância de frenagem. Modelos de suspensão dianteira do tipo McPherson, amplamente usados em carros populares de diversas marcas, têm custo acessível de manutenção, mas exigem atenção periódica. O motorista identifica problemas pela presença de barulhos como estalos e batidas ao passar em lombadas ou curvas, pelo volante oscilando, pelo desgaste irregular dos pneus ou pela sensação de que o carro não segura a linha. A revisão deve ocorrer ao surgir esses sinais ou a cada 40.000 a 60.000 km.',
    match: /suspens|amortecedor|bieleta|bucha|coxim|batente/i,
  },
  {
    slug: 'freios', nome: 'Freios',
    titulo: 'Problemas de freio nos carros populares: ruído, pedal e segurança',
    resumo: 'O sistema de freios é o principal mecanismo de segurança ativa do veículo. Pastilhas e discos trabalham juntos para converter energia cinética em calor; quando desgastados, a eficiência de frenagem cai drasticamente. O sistema ABS previne o travamento das rodas em frenagens bruscas, auxiliando a manter o controle direcional em situações de emergência. O servofreio amplifica a força aplicada no pedal e, quando apresenta defeito, exige esforço muito maior do condutor para frear. Alguns modelos receberam campanhas de recall relacionadas a defeitos no sistema de freio, o que reforça a importância de verificar pendências via Denatran ou no site da montadora. Veículos com alto uso em rodovias tendem a desgastar discos mais rapidamente pela frenagem a alta velocidade. O motorista percebe vibrações no pedal, ruído de rangido ou chiado, pedal mole com curso excessivo e aumento da distância de parada. Qualquer alteração no comportamento do freio deve ser investigada imediatamente, pois representa risco direto à segurança de todos.',
    match: /freio|pastilha|disco|servofreio|abs|pedal/i,
  },
  {
    slug: 'direcao', nome: 'Direção',
    titulo: 'Problemas de direção nos carros populares: volante duro e folga',
    resumo: 'O sistema de direção transmite os comandos do volante às rodas dianteiras e determina a precisão e o esforço de condução. A direção elétrica, presente na maioria dos veículos modernos, usa um motor elétrico assistido por sensores para calcular o auxílio necessário conforme a velocidade. Quando a unidade de controle falha ou os sensores se deterioram, o volante pode endurecer subitamente, principalmente em baixas velocidades ou logo após a partida a frio. A coluna de direção pode desenvolver folgas mecânicas com o tempo, transmitindo imprecisão na resposta ao volante. Ruídos como estalos ao girar o volante indicam juntas homocinéticas desgastadas ou terminais de direção com folga excessiva. Modelos com alto volume de produção submetidos a condições severas de uso são os mais afetados. O motorista nota esforço exagerado para girar o volante, vibração transmitida às mãos, barulhos em manobras lentas ou resposta imprecisa em curvas. Buscar uma oficina ao primeiro sinal evita perda de controle em situações de emergência.',
    match: /direção|direcao|coluna de direção|coluna-de-direcao|stabilitrak|volante/i,
  },
  {
    slug: 'eletrica-e-eletronica', nome: 'Elétrica e eletrônica',
    titulo: 'Problemas elétricos e eletrônicos nos carros populares',
    resumo: 'O sistema elétrico e eletrônico é o sistema nervoso do veículo moderno, integrando motor de partida, alternador, bateria, central de injeção, sensores, bobinas de ignição e velas. Velas de ignição desgastadas causam falhas de combustão e aumento no consumo de combustível. As bobinas, quando defeituosas, provocam misfire (falha de cilindro), que o motorista sente como marcha lenta instável e engasgos na aceleração. O sistema de injeção eletrônica depende de sensores como o MAP, TPS, sonda lambda e sensor de posição de comando para calcular a mistura ar-combustível ideal. A luz EPC acende quando o sistema de gerenciamento eletrônico detecta uma falha crítica. O sistema Start-Stop, presente em veículos mais novos, submete a bateria e o motor de partida a ciclos intensos, exigindo componentes de maior durabilidade. O motorista percebe a luz de check engine no painel, perda de potência, oscilação de rotação em marcha lenta ou dificuldade de partida. A leitura dos códigos de falha com scanner eletrônico é sempre o primeiro passo para o diagnóstico correto.',
    match: /bobina|vela|injeção|injecao|epc|luz-injecao|luz de injeção|sensor|módulo|modulo|bateria|start-stop|partida|alta pressão|alta-pressao|corpo de borboleta|marcha lenta/i,
  },
  {
    slug: 'arrefecimento', nome: 'Arrefecimento',
    titulo: 'Problemas de arrefecimento nos carros populares: superaquecimento',
    resumo: 'O sistema de arrefecimento regula a temperatura do motor, evitando que o calor gerado pela combustão danifique os componentes internos. É composto por radiador, bomba de água, válvula termostática, mangueiras e fluido de arrefecimento com aditivo anticorrosivo. A válvula termostática controla quando o líquido começa a circular pelo radiador; quando trava na posição fechada, o motor superaquece rapidamente. A bomba de água impulsiona o fluido por todo o circuito e, ao falhar, interrompe a circulação causando superaquecimento imediato. Motores 1.0 aspirados com alta quilometragem e motores turbinados em uso intenso são os mais vulneráveis a falhas nesse sistema. O motorista percebe o ponteiro de temperatura subindo além do normal, vapor saindo do compartimento do motor, luz de temperatura acesa no painel ou queda abrupta de potência. Conduzir com o motor superaquecido por mais de poucos minutos pode fundir a junta do cabeçote ou danificar o bloco definitivamente. Ao notar qualquer sinal de temperatura elevada, o correto é estacionar, desligar o motor e acionar socorro especializado sem demora.',
    match: /superaquecimento|arrefecimento|bomba.*água|bomba-de-agua|radiador|termostát|fervendo|ferve/i,
  },
  {
    slug: 'ar-condicionado', nome: 'Ar-condicionado',
    titulo: 'Problemas de ar-condicionado nos carros populares: não gela',
    resumo: 'O sistema de ar-condicionado veicular resfria e desumidifica o ar interior, sendo essencial para conforto e visibilidade em dias úmidos. É composto pelo compressor, condensador, evaporador, válvula de expansão e gás refrigerante (geralmente R134a ou R1234yf nos modelos mais recentes). O compressor pressuriza o gás e é o componente mais sujeito a falhas mecânicas, especialmente em veículos que nunca realizaram manutenção preventiva do sistema. O evaporador, localizado dentro do painel, acumula sujidade ao longo do tempo e pode desenvolver microfissuras por corrosão, causando mau cheiro e perda de eficiência de resfriamento. O condensador, posicionado à frente do radiador, é vulnerável a entupimentos por insetos e detritos da estrada. A falta de gás refrigerante por vazamentos é a causa mais comum de ar-condicionado que não gela. Veículos com alta quilometragem ou que operam em climas muito quentes demandam manutenção mais frequente. O motorista percebe ar morno mesmo no máximo do controle, cheiro de mofo, ruído no compressor ou variações bruscas de temperatura. A revisão anual do sistema previne falhas de maior complexidade.',
    match: /ar-condicionado|ar condicionado|nao-gela|não gela|climatiz|evaporador|condensador|compressor/i,
  },
];

export const getSistema = (slug: string) => SISTEMAS.find((s) => s.slug === slug);

/** Classifica um defeito num sistema (o primeiro que casar). */
export function sistemaDoDefeito(defeito: string, slug: string): Sistema | undefined {
  const txt = `${defeito} ${slug}`.toLowerCase();
  return SISTEMAS.find((s) => s.match.test(txt));
}
