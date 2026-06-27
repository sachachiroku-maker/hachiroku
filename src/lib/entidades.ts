/**
 * Entidades transversais (motores e tecnologias) que conectam os modelos.
 * Geram os hubs semânticos /motor/[slug] e /tecnologia/[slug], a camada
 * horizontal que dá autoridade temática ao portal.
 * `modelos` = ids "marca/modelo" que têm pilar de problemas.
 */
export interface Entidade {
  slug: string;
  tipo: 'motor' | 'tecnologia';
  nome: string;        // nome curto exibido
  titulo: string;      // <h1> / <title>
  seoTitle?: string;   // <title> tag curto (≤48 chars)
  resumo: string;      // 1-2 frases factuais (voz mecânico digital)
  modelos: string[];   // "marca/modelo"
  sameAs?: string;     // liga a entidade ao Knowledge Graph
}

export const ENTIDADES: Entidade[] = [
  // ---------- MOTORES ----------
  {
    slug: 'ea211-tsi', tipo: 'motor', nome: 'Motor TSI (EA211)',
    titulo: 'Motor 1.0 e 1.4 TSI (EA211): carros, defeitos e manutenção',
    seoTitle: 'Motor EA211 TSI: defeitos e cuidados',
    resumo: 'O motor 1.0 TSI da família EA211 utiliza injeção direta de combustível, o que elimina o efeito limpante da gasolina nas válvulas de admissão. Com o tempo, forma-se depósito de carbono nessas válvulas, causando falhas de ignição, perda de potência e consumo elevado. Presente no Polo, Virtus, T-Cross, Nivus e Saveiro MY21+, esse propulsor trabalha em parceria com o câmbio automático AQ250 ou o DSG de dupla embreagem. O ponto de atenção principal é a limpeza de válvulas por jateamento de nozes a cada 60.000 km a 80.000 km. A troca de óleo 5W-30 VW 504.00 deve ocorrer a cada 10.000 km ou 12 meses. Filtro de ar e velas de iridium completam o ciclo preventivo que mantém o motor dentro da especificação de fábrica.',
    modelos: ['volkswagen/polo-tsi', 'volkswagen/t-cross', 'volkswagen/nivus', 'volkswagen/virtus', 'volkswagen/taos'],
    sameAs: 'https://en.wikipedia.org/wiki/Volkswagen_EA211_engine',
  },
  {
    slug: 't270', tipo: 'motor', nome: 'Motor 1.3 Turbo (GSE T270)',
    titulo: 'Motor 1.3 turbo flex T270 (GSE): carros, defeitos e cuidados',
    seoTitle: 'Motor T270 turbo: defeitos e cuidados',
    resumo: 'O motor T270, também chamado T4, é um 1.3 turbo de quatro cilindros desenvolvido pela Stellantis para o mercado sul-americano. Equipado com corrente de distribuição em vez de correia, ele dispensa troca periódica desse componente desde que o óleo seja renovado em dia. Presente no Fiat Argo, Cronos, Pulse e nos Jeep Renegade e Compass de versões de entrada, o T270 opera com sobrealimentação a baixas rotações, aumentando o estresse térmico. O sistema de arrefecimento merece atenção especial: a troca do líquido refrigerante deve ocorrer a cada 40.000 km ou dois anos, usando fluido OAT rosa especificado pela fábrica. A troca de óleo 5W-30 ACEA C3 a cada 10.000 km é crítica para preservar os anéis e a corrente de distribuição dentro dos parâmetros de vida útil projetados.',
    modelos: ['jeep/renegade', 'jeep/compass', 'fiat/toro', 'fiat/fastback'],
    sameAs: 'https://en.wikipedia.org/wiki/Stellantis_Global_Small_Engine',
  },
  {
    slug: 'etorq', tipo: 'motor', nome: 'Motor E.torQ',
    titulo: 'Motor E.torQ (1.6 e 1.8): carros, defeitos e manutenção',
    seoTitle: 'Motor E.torQ: defeitos e manutenção',
    resumo: 'O motor E.torQ é uma família de propulsores de quatro cilindros desenvolvida pela parceria Fiat e Tritec no Brasil, disponível nas versões 1.6 e 1.8 com injeção indireta. Reconhecido pela robustez mecânica, equipa o Fiat Linea, Bravo, Grand Siena e versões mais antigas do Doblo e Palio. O principal ponto de atenção é o consumo de óleo, que pode se tornar excessivo após 80.000 km quando velas, vedações de hastes e retentores não são substituídos conforme o planejamento preventivo. Juntas do cabeçote e retentores do virabrequim também devem ser inspecionados nesse marco. A troca de óleo mineral ou semissintético 10W-40 deve ocorrer a cada 7.500 km a 10.000 km. A correia dentada de distribuição exige substituição a cada 60.000 km, obrigatoriamente com troca simultânea da bomba d\'água e da polia tensionadora.',
    modelos: ['fiat/palio', 'fiat/argo', 'jeep/renegade', 'fiat/cronos', 'fiat/toro'],
    sameAs: 'https://en.wikipedia.org/wiki/Fiat_E.torQ_engine',
  },
  {
    slug: 'firefly', tipo: 'motor', nome: 'Motor Firefly',
    titulo: 'Motor Firefly (1.0 e 1.3): carros, defeitos e manutenção',
    seoTitle: 'Motor Firefly: defeitos e manutenção',
    resumo: 'O motor Firefly é um propulsor de três cilindros desenvolvido pela FCA com corrente de distribuição banhada a óleo, eliminando a troca periódica da distribuição convencional. Disponível nas versões 1.0, 1.3 e 1.3 turbo, equipa o Fiat Argo, Cronos, Pulse, Mobi e versões Toro de entrada. A corrente banhada a óleo depende diretamente da qualidade e do nível do lubrificante: o intervalo de troca de óleo 0W-20 ou 5W-30 especificado pela Fiat, a cada 10.000 km ou 12 meses, é crítico para preservar os tensionadores e a corrente. Negligenciar esse intervalo causa estiramento precoce, risco de pular dentes e encontro entre válvulas e pistões. A vibração inerente ao ciclo de três cilindros é gerenciada por contrapeso balanceador no eixo virabrequim, componente que também deve ser inspecionado em motores com mais de 100.000 km.',
    modelos: ['fiat/argo', 'fiat/mobi', 'fiat/strada', 'fiat/pulse', 'fiat/cronos', 'fiat/fastback'],
    sameAs: 'https://pt.wikipedia.org/wiki/Motor_Fiat_Firefly',
  },
  {
    slug: 'css-prime-turbo', tipo: 'motor', nome: 'Motor Turbo CSS Prime',
    titulo: 'Motor 1.0 e 1.2 turbo CSS Prime (GM): carros e defeitos',
    seoTitle: 'Motor CSS Prime Turbo: carros e defeitos',
    resumo: 'O motor 1.0 Turbo da família Gen III, comercialmente chamado de Prime Turbo pela General Motors, utiliza correia dentada de distribuição banhada a óleo. Equipa o Onix Plus, Tracker, Montana e versões do Cruze Sport6. A característica mais crítica é a correia banhada a óleo: diferente das correias secas convencionais, ela não pode ser inspecionada visualmente sem desmontagem específica. A troca deve ocorrer a cada 100.000 km conforme especificação GM, mas qualquer queda de nível de óleo, uso de produto não homologado ou contaminação por agente externo acelera a degradação da correia e dos tensionadores. Fragmentos de correia dentro do motor podem obstruir a bomba de óleo e causar falha catastrófica. O óleo especificado é o 0W-20 GM dexos2, com intervalo de troca a cada 10.000 km, e o monitoramento quinzenal do nível é fundamental.',
    modelos: ['chevrolet/onix', 'chevrolet/tracker'],
  },
  {
    slug: 'puretech-thp', tipo: 'motor', nome: 'Motor PureTech / THP (PSA)',
    titulo: 'Motor 1.2 PureTech e 1.6 THP (Peugeot/Citroën): defeitos e cuidados',
    seoTitle: 'Motor PureTech e THP: defeitos',
    resumo: 'O motor PureTech 1.2 turbo, identificado como THP nos modelos anteriores, é um propulsor de três cilindros do grupo PSA com injeção direta e turbocompressor de geometria fixa. Presente no Peugeot 208, 2008, 3008 e no Citroen C4 Cactus e C5 Aircross, ele apresentou fragilidade nas primeiras gerações: a corrente curta entre os comandos de admissão e escape tende ao estiramento precoce entre 40.000 km e 70.000 km. A PSA atualizou o projeto em 2017, reduzindo a incidência, mas motores fabricados antes dessa data exigem inspeção da corrente nesse intervalo. O óleo 5W-30 PSA B71 2312 deve ser trocado a cada 10.000 km ou 12 meses. Superaquecimento severo pode deformar o cabeçote de alumínio fundido, tornando o monitoramento do sistema de arrefecimento um ponto de atenção paralelo obrigatório.',
    modelos: ['peugeot/208', 'peugeot/2008', 'peugeot/3008', 'citroen/c3', 'citroen/c4'],
    sameAs: 'https://en.wikipedia.org/wiki/PSA_EB_engine',
  },
  // ---------- TECNOLOGIAS ----------
  {
    slug: 'correia-banhada-a-oleo', tipo: 'tecnologia', nome: 'Correia banhada a óleo',
    titulo: 'Correia dentada banhada a óleo: o que é, riscos e quais carros usam',
    seoTitle: 'Correia banhada a óleo: riscos',
    resumo: 'A correia dentada banhada a óleo é uma tecnologia de distribuição que substitui a correia seca convencional por um sistema submerso em óleo lubrificante dentro do bloco do motor. A vantagem é maior vida útil teórica e menor ruído operacional em comparação às correias secas. General Motors e Ford adotaram essa solução em vários motores de baixa cilindrada produzidos no Brasil, como o 1.0 Turbo dos Onix e o EcoBoost 1.5 de versões do Ka e EcoSport. O risco principal é a contaminação: se o nível de óleo cair, se o lubrificante ultrapassar o intervalo de troca ou se for usado produto não homologado, a correia pode ressecar, fragmentar-se e lançar pedaços no interior do motor. Esses fragmentos podem obstruir a bomba de óleo e causar falha catastrófica de lubrificação. O respeito rigoroso ao intervalo de troca de óleo especificado pela fábrica é inegociável.',
    modelos: ['chevrolet/onix', 'chevrolet/tracker', 'ford/ka'],
  },
  {
    slug: 'cambio-aisin-aq250', tipo: 'tecnologia', nome: 'Câmbio automático Aisin (AQ250)',
    titulo: 'Câmbio automático Aisin AQ250: como funciona e os trancos',
    seoTitle: 'Câmbio Aisin AQ250: trancos e manutenção',
    resumo: 'O câmbio automático de seis velocidades AQ250, fabricado pela Aisin e fornecido à Volkswagen, é um torque conversor convencional presente no Polo, Virtus, T-Cross e Nivus com motores 1.0 TSI e 1.4 TSI. Reconhecido pela suavidade em velocidade de cruzeiro, pode apresentar trancos e hesitações em manobras de baixa velocidade, comportamento atribuído à calibração de software do módulo de controle e ao envelhecimento do fluido de transmissão. A troca do fluido ATF Aisin AW-1 é recomendada a cada 40.000 km a 60.000 km, mesmo que a Volkswagen classifique o câmbio como selado para vida útil em condições normais. Em uso urbano intenso o fluido envelhece mais rápido. Atualizações de software via concessionária podem corrigir os trancos pontualmente. Verificar códigos de falha com scanner VW e inspecionar o nível do fluido a cada 30.000 km é a prática preventiva mais eficaz.',
    modelos: ['volkswagen/polo-tsi', 'volkswagen/t-cross', 'volkswagen/nivus', 'volkswagen/virtus', 'volkswagen/taos'],
  },
  {
    slug: 'cambio-automatizado', tipo: 'tecnologia', nome: 'Câmbio automatizado (Dualogic/GSR)',
    titulo: 'Câmbio automatizado Dualogic e GSR: por que dá trancos',
    seoTitle: 'Dualogic e GSR: por que dá trancos',
    resumo: 'O câmbio automatizado, chamado de Dualogic pela Fiat e GSR na versão Jeep, é um câmbio manual de cinco velocidades com atuação eletroeletromagnética e hidráulica: um módulo eletrônico e um atuador substituem o pedal de embreagem e a alavanca de marchas. A embreagem seca presente no sistema gera trancos típicos em trocas de baixa velocidade, comportamento esperado e diferente de câmbios automáticos convencionais. Os principais pontos de atenção são o desgaste da embreagem, que deve ser inspecionada entre 60.000 km e 80.000 km, e o atuador, que pode falhar por vazamento de fluido ou desgaste de vedações internas. A regulagem do ponto de contato da embreagem via scanner específico é manutenção preventiva recomendada a cada 30.000 km. Veículos Fiat Argo, Cronos, Uno e Mobi com esse câmbio se beneficiam da recalibração periódica pelo módulo de transmissão.',
    modelos: ['fiat/palio', 'fiat/argo'],
  },
  {
    slug: 'cambio-cvt', tipo: 'tecnologia', nome: 'Câmbio CVT',
    titulo: 'Câmbio CVT: como funciona, o fluido e os mitos',
    resumo: 'O câmbio CVT utiliza um par de polias de diâmetro variável e uma correia ou corrente metálica para oferecer variação contínua da relação de transmissão, sem marchas fixas. Presente no Toyota Corolla Cross, Yaris, no Fiat Pulse com motor 1.3 turbo e no Nissan Kicks, proporciona aceleração progressiva e rotações baixas em velocidade de cruzeiro. O mito do câmbio CVT selado para vida útil é recorrente: o fluido de transmissão CVTF é específico por fabricante e deve ser trocado a cada 40.000 km a 60.000 km. Usar fluido errado causa deslizamento da correia metálica e desgaste acelerado das polias. Veículos submetidos a reboques frequentes ou arranques agressivos desgastam o conjunto mais rápido. O diagnóstico precoce de deslizamento inclui oscilação de rotação em carga constante e vibração percebida no pedal acelerador durante aceleração progressiva em subidas.',
    modelos: ['toyota/corolla', 'toyota/yaris', 'honda/city', 'honda/hr-v', 'honda/civic', 'honda/fit', 'nissan/kicks', 'renault/duster', 'renault/captur'],
  },
];

export const getEntidade = (slug: string) => ENTIDADES.find((e) => e.slug === slug);
export const motores = () => ENTIDADES.filter((e) => e.tipo === 'motor');
export const tecnologias = () => ENTIDADES.filter((e) => e.tipo === 'tecnologia');

/** Entidades que incluem um dado modelo "marca/modelo" (para interlinking no artigo). */
export function entidadesDoModelo(marcaModelo: string): Entidade[] {
  return ENTIDADES.filter((e) => e.modelos.includes(marcaModelo));
}
