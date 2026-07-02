/**
 * Eixo horizontal SISTEMA: agrega diagnósticos de TODOS os modelos por sistema
 * mecânico. Classificação automática por palavra-chave do defeito/slug (evita
 * tocar nos 59+ artigos). Gera /sistema/[slug].
 */
export interface SistemaFaq { pergunta: string; resposta: string }

export interface Sistema {
  slug: string;
  nome: string;
  titulo: string;
  seoTitle?: string;
  resumo: string;
  faq?: SistemaFaq[];
  match: RegExp; // casa contra `${defeito} ${slug}` em minúsculas
}

export const SISTEMAS: Sistema[] = [
  {
    slug: 'bateria-e-recarga-ev', nome: 'Bateria e recarga (elétricos)',
    titulo: 'Problemas de bateria, autonomia e recarga em carros elétricos e híbridos',
    seoTitle: 'Bateria e recarga de elétricos: problemas',
    resumo: 'Em veículos elétricos e híbridos plug-in, a bateria de tração e o sistema de recarga concentram as dúvidas e os defeitos mais relatados pelos donos. A autonomia real é sempre menor que a de catálogo: os ciclos de homologação medem condições que não existem no trânsito brasileiro, e calor intenso, ar-condicionado e velocidade de rodovia reduzem o alcance de forma perceptível. A recarga depende de três elos: o carregador de bordo do veículo, o cabo ou wallbox e a rede elétrica da instalação. Carregamento em corrente alternada mais lento que o esperado costuma vir de limite do carregador de bordo ou de configuração de corrente na wallbox, não da bateria. Já a bateria de 12 volts, presente também nos elétricos, continua sendo a causa mais comum de falha geral: quando descarrega, o carro não liga nem destrava funções, mesmo com a bateria de tração cheia. Modos de proteção que limitam potência indicam anomalia térmica ou de célula e pedem leitura de códigos na assistência.',
    faq: [
      { pergunta: "Por que a autonomia real é menor que a anunciada?", resposta: "Os números de catálogo vêm de ciclos de homologação (CLTC, WLTP, PBEV) medidos em condições controladas. No uso brasileiro, com ar-condicionado, calor e velocidade de rodovia, a referência prática fica entre 70% e 85% do valor anunciado, dependendo do ciclo usado pelo fabricante." },
      { pergunta: "Carregar todo dia até 100% faz mal à bateria?", resposta: "Para baterias LFP, os próprios fabricantes recomendam carga completa periódica para calibrar o indicador. Para químicas NMC, manter o uso diário entre 20% e 80% reduz o estresse das células e preserva a vida útil. Consulte a recomendação específica do manual do seu modelo." },
      { pergunta: "O carro elétrico não liga: bateria de tração ou de 12V?", resposta: "Na grande maioria dos casos é a bateria de 12 volts, que alimenta a eletrônica de bordo e as travas. Se o painel não acende ou o carro não destrava, teste ou troque a 12V antes de suspeitar da bateria de tração, que raramente é a causa." },
    ],
    match: /autonomia|recarga|carregamento|carregador|wallbox|modo tartaruga|modo-tartaruga|kwh|célula|bateria de tração/i,
  },
  {
    slug: 'motor-e-lubrificacao', nome: 'Motor e lubrificação',
    titulo: 'Problemas de motor e óleo nos carros populares: causas e custos',
    seoTitle: 'Motor e óleo: causas e custos',
    resumo: 'O motor é o coração do veículo e depende de lubrificação contínua para funcionar sem desgaste prematuro. A correia dentada ou a corrente de distribuição sincroniza o movimento das válvulas com os pistões e, quando se rompe ou perde tensão, pode destruir o motor em frações de segundo. O consumo excessivo de óleo é frequente em motores turboalimentados modernos e em unidades com alta quilometragem, geralmente associado a retentores desgastados, anéis de pistão fatigados ou junta do cabeçote comprometida. A bomba de óleo, ao falhar, interrompe a circulação do lubrificante e provoca desgaste acelerado em todas as partes móveis. Motores de pequena cilindrada com turbo, como os 1.0 e 1.3 presentes em modelos populares de diversas marcas, estão entre os mais suscetíveis. O motorista pode notar luz de pressão de óleo acesa no painel, fumaça azulada pelo escapamento, ruídos metálicos durante a aceleração ou queda perceptível de potência. Qualquer um desses sintomas exige avaliação imediata em oficina especializada para evitar danos irreversíveis ao conjunto motor.',
    faq: [
      { pergunta: "Quanto tempo devo esperar para trocar o óleo depois de comprar um carro usado?", resposta: "Troque imediatamente se não houver registro da última troca. Óleo de procedência desconhecida é um risco, independente da aparência. Analise a cor na vareta: marrom escuro ou preto indica degradação avançada." },
      { pergunta: "A luz de pressão de óleo piscou e apagou. Devo me preocupar?", resposta: "Sim. Mesmo piscadas breves indicam queda momentânea de pressão no circuito de lubrificação. Verifique o nível imediatamente. Se estiver correto e a luz retornar, pode ser a bomba de óleo ou o sensor com defeito — ambos exigem diagnóstico urgente." },
      { pergunta: "Qual a diferença entre correia dentada e corrente de distribuição?", resposta: "A correia é de borracha reforçada e tem intervalo de troca obrigatório (geralmente 60 mil km). A corrente é metálica e, em princípio, dura a vida do motor — mas exige óleo de qualidade para não esticar. Ambas sincronizam o eixo de manivelas com o comando de válvulas." },
    ],
    match: /correia|corrente de comando|tucho|bomba de óleo|bomba-de-oleo|vazamento.*óleo|vazamento-oleo|consumo de óleo|consumo-de-oleo|junta|retentor|virabrequim|respiro/i,
  },
  {
    slug: 'cambio-e-transmissao', nome: 'Câmbio e transmissão',
    titulo: 'Problemas de câmbio nos carros populares: CVT, automático e automatizado',
    seoTitle: 'Câmbio CVT e automático: defeitos',
    resumo: 'A caixa de câmbio é responsável por transmitir a força do motor às rodas de forma eficiente. Transmissões automatizadas como o CVT (variação contínua), o Dualogic da Fiat, o PowerShift da Ford e o GSR de outras marcas ganharam popularidade por reduzir o consumo de combustível, mas apresentam histórico de falhas mais frequentes do que câmbios manuais convencionais. O fluido de transmissão tem papel crítico: quando degradado ou em nível incorreto, provoca superaquecimento interno e desgaste progressivo das peças. O trocador de calor do fluido, quando entupido, acelera esse processo. Veículos compactos com câmbio automatizado de dupla embreagem seca são especialmente vulneráveis em uso urbano intenso com arranques frequentes. O motorista percebe solavancos na troca de marcha, demora para engatar, engasgos na aceleração, ruído de atrito ou a transmissão entrando em modo de proteção. A troca periódica do fluido é manutenção obrigatória. Sintomas persistentes indicam revisão urgente para evitar a substituição completa da unidade.',
    faq: [
      { pergunta: "O que é o fluido de transmissão e por que ele precisa ser trocado?", resposta: "É o lubrificante específico do câmbio que refrigera as peças internas e protege as embreagens. Ele se degrada com o calor e o atrito ao longo do tempo. Câmbios automáticos convencionais pedem troca a cada 40 mil km; os CVTs e de dupla embreagem a cada 30-40 mil km, dependendo do fabricante." },
      { pergunta: "Solavanco na troca de marcha é sempre sinal de câmbio com defeito?", resposta: "Não necessariamente. O primeiro passo é verificar o nível e a qualidade do fluido. Em câmbios CVT e automatizados, fluido baixo ou degradado é a causa mais comum de solavancos. Caso o problema persista após a troca do fluido, aí sim é necessário diagnóstico eletrônico com scanner." },
      { pergunta: "Vale a pena fazer revisão preventiva do câmbio automático?", resposta: "Sempre. Uma troca de fluido custa entre R$ 300 e R$ 800, enquanto a reconstrução de uma caixa automática pode passar de R$ 8.000. Manutenção preventiva dentro do intervalo é a melhor proteção contra falhas prematuras, especialmente em câmbios CVT e de dupla embreagem seca." },
    ],
    match: /câmbio|cambio|cvt|dualogic|gsr|aisin|aq250|powershift|embreagem|trocador de calor|trocador-de-calor|marcha|transmiss|diferencial|4x4|transferência|transferencia|tração|tracao/i,
  },
  {
    slug: 'suspensao', nome: 'Suspensão',
    titulo: 'Problemas de suspensão nos carros populares: barulhos e desgaste',
    seoTitle: 'Suspensão: barulhos e desgaste',
    resumo: 'O sistema de suspensão conecta a carroceria às rodas e garante estabilidade, conforto e segurança em curvas e frenagens. É composto por amortecedores, molas, bieletas, bandejas e buchas de borracha que absorvem os impactos do pavimento. As buchas se deterioram com o tempo e a exposição ao calor, perdendo elasticidade e gerando folgas mecânicas. As bieletas estabilizadoras são peças de desgaste frequente, especialmente em vias urbanas com muitos buracos. Os amortecedores, quando vencidos, reduzem o controle do veículo e aumentam a distância de frenagem. Modelos de suspensão dianteira do tipo McPherson, amplamente usados em carros populares de diversas marcas, têm custo acessível de manutenção, mas exigem atenção periódica. O motorista identifica problemas pela presença de barulhos como estalos e batidas ao passar em lombadas ou curvas, pelo volante oscilando, pelo desgaste irregular dos pneus ou pela sensação de que o carro não segura a linha. A revisão deve ocorrer ao surgir esses sinais ou a cada 40.000 a 60.000 km.',
    faq: [
      { pergunta: "Como saber se os amortecedores precisam ser trocados?", resposta: "Faça o teste do balanço: empurre cada canto do carro para baixo e solte. Se o veículo balançar mais de uma vez antes de estabilizar, os amortecedores estão vencidos. Outros sinais são tendência a cabeçar em frenagens bruscas e oscilação exagerada em lombadas." },
      { pergunta: "Estalo ao virar o volante em baixa velocidade indica qual problema?", resposta: "Na maioria das vezes indica bucha de bandeja desgastada ou bieleta estabilizadora com folga. São peças de custo acessível e o reparo em tempo previne danos nos próprios rolamentos de roda e na caixa de direção, que são muito mais caros." },
      { pergunta: "Com que frequência devo revisar a parte dianteira do carro?", resposta: "A cada 20 mil km vale a pena inspecionar visualmente buchas e bieletas. A troca efetiva costuma ocorrer entre 60 mil e 100 mil km dependendo do uso e do tipo de pavimento. Em veículos usados em estradas de terra ou vias muito esburacadas, antecipe a inspeção." },
    ],
    match: /suspens|amortecedor|bieleta|bucha|coxim|batente/i,
  },
  {
    slug: 'freios', nome: 'Freios',
    titulo: 'Problemas de freio nos carros populares: ruído, pedal e segurança',
    seoTitle: 'Freios: ruído, pedal e segurança',
    resumo: 'O sistema de freios é o principal mecanismo de segurança ativa do veículo. Pastilhas e discos trabalham juntos para converter energia cinética em calor; quando desgastados, a eficiência de frenagem cai drasticamente. O sistema ABS previne o travamento das rodas em frenagens bruscas, auxiliando a manter o controle direcional em situações de emergência. O servofreio amplifica a força aplicada no pedal e, quando apresenta defeito, exige esforço muito maior do condutor para frear. Alguns modelos receberam campanhas de recall relacionadas a defeitos no sistema de freio, o que reforça a importância de verificar pendências via Denatran ou no site da montadora. Veículos com alto uso em rodovias tendem a desgastar discos mais rapidamente pela frenagem a alta velocidade. O motorista percebe vibrações no pedal, ruído de rangido ou chiado, pedal mole com curso excessivo e aumento da distância de parada. Qualquer alteração no comportamento do freio deve ser investigada imediatamente, pois representa risco direto à segurança de todos.',
    faq: [
      { pergunta: "Com que frequência devo trocar as pastilhas de freio?", resposta: "O intervalo típico para uso urbano é entre 20 mil e 40 mil km para pastilhas dianteiras e 40 mil a 70 mil km para as traseiras. Mas o principal indicador é a espessura residual: quando atingir 3 mm, programe a troca. Nunca aguarde ouvir o chiado metálico contínuo — nesse ponto os discos já estão sendo danificados." },
      { pergunta: "Vibração no pedal durante a frenagem é grave?", resposta: "Indica disco empenado ou com variação de espessura. O empenamento ocorre por choque térmico, comum quando o veículo freia bruscamente em alta velocidade com discos quentes e depois para em poça de água. Em casos iniciais o disco pode ser retificado; casos mais avançados exigem substituição." },
      { pergunta: "O que provoca pedal de freio mole ou esponjoso?", resposta: "A presença de ar no circuito hidráulico é a causa mais comum. Ar entra por vazamento ou quando o fluido absorveu água ao longo do tempo (o fluido higroscópico deve ser trocado a cada 2 anos ou 40 mil km). Verifique o nível no reservatório e, se baixo, inspecione possíveis vazamentos no sistema." },
    ],
    match: /freio|pastilha|disco|servofreio|abs|pedal/i,
  },
  {
    slug: 'direcao', nome: 'Direção',
    titulo: 'Problemas de direção nos carros populares: volante duro e folga',
    seoTitle: 'Direção: volante duro e folga',
    resumo: 'O sistema de direção transmite os comandos do volante às rodas dianteiras e determina a precisão e o esforço de condução. A direção elétrica, presente na maioria dos veículos modernos, usa um motor elétrico assistido por sensores para calcular o auxílio necessário conforme a velocidade. Quando a unidade de controle falha ou os sensores se deterioram, o volante pode endurecer subitamente, principalmente em baixas velocidades ou logo após a partida a frio. A coluna de direção pode desenvolver folgas mecânicas com o tempo, transmitindo imprecisão na resposta ao volante. Ruídos como estalos ao girar o volante indicam juntas homocinéticas desgastadas ou terminais de direção com folga excessiva. Modelos com alto volume de produção submetidos a condições severas de uso são os mais afetados. O motorista nota esforço exagerado para girar o volante, vibração transmitida às mãos, barulhos em manobras lentas ou resposta imprecisa em curvas. Buscar uma oficina ao primeiro sinal evita perda de controle em situações de emergência.',
    faq: [
      { pergunta: "O volante endurece ao ligar o carro a frio e depois normaliza. É grave?", resposta: "É um comportamento relatado em modelos com módulo EPS (elétrico) que entra em modo de proteção durante o aquecimento. Se normaliza após 1-2 minutos, pode ser só o sistema calibrando. Se o endurecimento for brusco e persistir, há risco real de perda de controle e merece diagnóstico imediato." },
      { pergunta: "Estalo ao virar o volante até o batente indica qual defeito?", resposta: "Normalmente indica junta homocinética externa desgastada. É uma junta que transmite força das rodas em ângulo durante as curvas. O conserto custa entre R$ 400 e R$ 900 e deve ser feito logo, pois uma homocinética quebrada deixa o carro imobilizado e pode danificar a caixa de câmbio." },
      { pergunta: "Quanto tempo dura o sistema de direção elétrica?", resposta: "Em condições normais, o motor e o módulo EPS duram a vida útil do veículo. O que falha com mais frequência é o sensor de ângulo do volante e o torque sensor, que podem apresentar leituras erradas com o tempo. A vida útil é fortemente dependente da qualidade das estradas e do uso diário." },
    ],
    match: /direção|direcao|coluna de direção|coluna-de-direcao|stabilitrak|volante/i,
  },
  {
    slug: 'eletrica-e-eletronica', nome: 'Elétrica e eletrônica',
    titulo: 'Problemas elétricos e eletrônicos nos carros populares',
    seoTitle: 'Elétrica e eletrônica: defeitos',
    resumo: 'O sistema elétrico e eletrônico é o sistema nervoso do veículo moderno, integrando motor de partida, alternador, bateria, central de injeção, sensores, bobinas de ignição e velas. Velas de ignição desgastadas causam falhas de combustão e aumento no consumo de combustível. As bobinas, quando defeituosas, provocam misfire (falha de cilindro), que o motorista sente como marcha lenta instável e engasgos na aceleração. O sistema de injeção eletrônica depende de sensores como o MAP, TPS, sonda lambda e sensor de posição de comando para calcular a mistura ar-combustível ideal. A luz EPC acende quando o sistema de gerenciamento eletrônico detecta uma falha crítica. O sistema Start-Stop, presente em veículos mais novos, submete a bateria e o motor de partida a ciclos intensos, exigindo componentes de maior durabilidade. O motorista percebe a luz de check engine no painel, perda de potência, oscilação de rotação em marcha lenta ou dificuldade de partida. A leitura dos códigos de falha com scanner eletrônico é sempre o primeiro passo para o diagnóstico correto.',
    faq: [
      { pergunta: "De quanto em quanto tempo devo trocar as velas de ignição?", resposta: "Velas de platina ou irídio duram em média 40 mil a 60 mil km. Velas de cobre simples têm vida de 20 mil a 30 mil km. Não ultrapassar esses intervalos evita misfire (falha de combustão), que pode danificar o catalisador e elevar o consumo de combustível em até 15%." },
      { pergunta: "O que significa a luz de injeção acender e piscar durante a aceleração?", resposta: "Indica falha detectada pelo sistema de gerenciamento do motor (ECU). Luz fixa geralmente é uma falha menos grave; luz piscando sinaliza misfire ativo que pode estar danificando o catalisador. Em ambos os casos, use um scanner OBD2 para ler o código de falha antes de qualquer intervenção." },
      { pergunta: "A bateria do carro pode afetar o funcionamento eletrônico?", resposta: "Sim. Tensão instável na bateria causa leituras errôneas nos sensores e pode gerar falhas esporádicas em módulos de injeção, ABS e câmbio. Em veículos modernos com muitos sistemas conectados ao barramento CAN, uma bateria envelhecida é fonte de erros difíceis de rastrear." },
    ],
    match: /bobina|vela|injeção|injecao|epc|luz-injecao|luz de injeção|sensor|módulo|modulo|bateria|start-stop|partida|alta pressão|alta-pressao|corpo de borboleta|marcha lenta|multimídia|multimidia|carplay|android|connect|dilink|alternador|painel|ventilador/i,
  },
  {
    slug: 'arrefecimento', nome: 'Arrefecimento',
    titulo: 'Problemas de arrefecimento nos carros populares: superaquecimento',
    seoTitle: 'Arrefecimento: superaquecimento',
    resumo: 'O sistema de arrefecimento regula a temperatura do motor, evitando que o calor gerado pela combustão danifique os componentes internos. É composto por radiador, bomba de água, válvula termostática, mangueiras e fluido de arrefecimento com aditivo anticorrosivo. A válvula termostática controla quando o líquido começa a circular pelo radiador; quando trava na posição fechada, o motor superaquece rapidamente. A bomba de água impulsiona o fluido por todo o circuito e, ao falhar, interrompe a circulação causando superaquecimento imediato. Motores 1.0 aspirados com alta quilometragem e motores turbinados em uso intenso são os mais vulneráveis a falhas nesse sistema. O motorista percebe o ponteiro de temperatura subindo além do normal, vapor saindo do compartimento do motor, luz de temperatura acesa no painel ou queda abrupta de potência. Conduzir com o motor superaquecido por mais de poucos minutos pode fundir a junta do cabeçote ou danificar o bloco definitivamente. Ao notar qualquer sinal de temperatura elevada, o correto é estacionar, desligar o motor e acionar socorro especializado sem demora.',
    faq: [
      { pergunta: "Com que frequência devo trocar o líquido de arrefecimento?", resposta: "O intervalo padrão é entre 40 mil e 60 mil km ou a cada 2 anos, o que ocorrer primeiro. O fluido perde capacidade anticorrosiva com o tempo e os subprodutos ácidos atacam internamente as mangueiras, a bomba e o radiador. Verifique a cor: fluido marrom ou com partículas indica troca imediata." },
      { pergunta: "Posso usar água pura em vez de fluido de arrefecimento em emergência?", resposta: "Em emergência, sim. Mas a água pura não tem anticorrosivo e acelera a deterioração do circuito interno, além de ferver a temperatura mais baixa. Assim que possível, drene e adicione o fluido correto na proporção indicada pelo fabricante (geralmente 50% água desmineralizada e 50% aditivo)." },
      { pergunta: "O motor aqueceu, apaguei e deixei esfriar. Posso continuar viagem?", resposta: "Depende. Se aqueceu por pouco tempo e não houve vapor visível, é possível continuar após resfriamento completo. Se houve vapor intenso, o motor ferveu e pode ter comprometido a junta do cabeçote. Nesse caso, não arrisque: chame guincho. Continuar a viagem pode transformar um reparo de R$ 2.000 em troca de motor." },
    ],
    match: /superaquecimento|arrefecimento|bomba.*água|bomba-de-agua|radiador|termostát|fervendo|ferve/i,
  },
  {
    slug: 'ar-condicionado', nome: 'Ar-condicionado',
    titulo: 'Problemas de ar-condicionado nos carros populares: não gela',
    seoTitle: 'Ar-condicionado: por que não gela',
    resumo: 'O sistema de ar-condicionado veicular resfria e desumidifica o ar interior, sendo essencial para conforto e visibilidade em dias úmidos. É composto pelo compressor, condensador, evaporador, válvula de expansão e gás refrigerante (geralmente R134a ou R1234yf nos modelos mais recentes). O compressor pressuriza o gás e é o componente mais sujeito a falhas mecânicas, especialmente em veículos que nunca realizaram manutenção preventiva do sistema. O evaporador, localizado dentro do painel, acumula sujidade ao longo do tempo e pode desenvolver microfissuras por corrosão, causando mau cheiro e perda de eficiência de resfriamento. O condensador, posicionado à frente do radiador, é vulnerável a entupimentos por insetos e detritos da estrada. A falta de gás refrigerante por vazamentos é a causa mais comum de ar-condicionado que não gela. Veículos com alta quilometragem ou que operam em climas muito quentes demandam manutenção mais frequente. O motorista percebe ar morno mesmo no máximo do controle, cheiro de mofo, ruído no compressor ou variações bruscas de temperatura. A revisão anual do sistema previne falhas de maior complexidade.',
    faq: [
      { pergunta: "Por que o ar do carro cheira a mofo logo que é ligado?", resposta: "O evaporador acumula umidade e fungos quando o sistema é desligado com o ventilador ainda no modo de resfriamento, sem tempo para secar. Para eliminar o cheiro, ligue só o ventilador (sem refrigeração) nos últimos 5 minutos de uso. Uma higienização com spray antifúngico no duto de entrada de ar resolve casos mais graves." },
      { pergunta: "Com que frequência devo revisar o sistema de climatização?", resposta: "Uma revisão anual é o ideal: verificação da carga de gás, inspeção das mangueiras de alta e baixa pressão e limpeza dos filtros internos. Em climas mais quentes, com uso intenso, considere revisar a cada 8 meses. Gás refrigerante que some rápido indica vazamento — não é consumo normal." },
      { pergunta: "Por que o ar gela bem em baixa velocidade mas piora na aceleração?", resposta: "Pode ser a polia eletromagnética do compressor com deslizamento intermitente, ou pressão insuficiente de gás que faz o compressor ciclar (ligar e desligar). Outro motivo comum é o condensador parcialmente entupido, que não disipa calor adequadamente em regime de alta carga do motor." },
    ],
    match: /ar-condicionado|ar condicionado|nao-gela|não gela|climatiz|evaporador|condensador|compressor/i,
  },
];

export const getSistema = (slug: string) => SISTEMAS.find((s) => s.slug === slug);

/** Classifica um defeito num sistema (o primeiro que casar). */
export function sistemaDoDefeito(defeito: string, slug: string): Sistema | undefined {
  const txt = `${defeito} ${slug}`.toLowerCase();
  return SISTEMAS.find((s) => s.match.test(txt));
}
