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
  resumo: string;      // 1-2 frases factuais (voz mecânico digital)
  modelos: string[];   // "marca/modelo"
  sameAs?: string;     // liga a entidade ao Knowledge Graph
}

export const ENTIDADES: Entidade[] = [
  // ---------- MOTORES ----------
  {
    slug: 'ea211-tsi', tipo: 'motor', nome: 'Motor TSI (EA211)',
    titulo: 'Motor 1.0 e 1.4 TSI (EA211): carros, defeitos e manutenção',
    resumo: 'Família de motores TSI da Volkswagen, com injeção direta e turbo. No Brasil equipa Polo, T-Cross, Nivus e Virtus nas versões 1.0 e 1.4. Como compartilham o mesmo bloco, os pontos de atenção se repetem entre os modelos.',
    modelos: ['volkswagen/polo-tsi', 'volkswagen/t-cross', 'volkswagen/nivus', 'volkswagen/virtus', 'volkswagen/taos'],
    sameAs: 'https://en.wikipedia.org/wiki/Volkswagen_EA211_engine',
  },
  {
    slug: 't270', tipo: 'motor', nome: 'Motor 1.3 Turbo (GSE T270)',
    titulo: 'Motor 1.3 turbo flex T270 (GSE): carros, defeitos e cuidados',
    resumo: 'Motor 1.3 turbo flex do grupo Stellantis, com sistema MultiAir. Equipa Jeep Renegade e Compass, além de Fiat Toro, Pulse e Fastback. Por compartilhar o mesmo conjunto, os modelos herdam os mesmos cuidados, com atenção à corrente de comando.',
    modelos: ['jeep/renegade', 'jeep/compass', 'fiat/toro', 'fiat/fastback'],
    sameAs: 'https://en.wikipedia.org/wiki/Stellantis_Global_Small_Engine',
  },
  {
    slug: 'etorq', tipo: 'motor', nome: 'Motor E.torQ',
    titulo: 'Motor E.torQ (1.6 e 1.8): carros, defeitos e manutenção',
    resumo: 'Motor aspirado de origem Tritec usado pela Fiat nas versões 1.6 e 1.8. Apareceu em Palio, Argo HGT, Renegade e outros. É durável, mas tem manias conhecidas de consumo de óleo e de vedação.',
    modelos: ['fiat/palio', 'fiat/argo', 'jeep/renegade', 'fiat/cronos', 'fiat/toro'],
    sameAs: 'https://en.wikipedia.org/wiki/Fiat_E.torQ_engine',
  },
  {
    slug: 'firefly', tipo: 'motor', nome: 'Motor Firefly',
    titulo: 'Motor Firefly (1.0 e 1.3): carros, defeitos e manutenção',
    resumo: 'Família de motores 3 cilindros da Fiat, aspirados e turbo. Equipa Mobi, Argo, Strada, Pulse e Fastback. Usa corrente de comando banhada a óleo, o que torna a troca do óleo certo no intervalo um ponto crítico.',
    modelos: ['fiat/argo', 'fiat/mobi', 'fiat/strada', 'fiat/pulse', 'fiat/cronos', 'fiat/fastback'],
    sameAs: 'https://pt.wikipedia.org/wiki/Motor_Fiat_Firefly',
  },
  {
    slug: 'css-prime-turbo', tipo: 'motor', nome: 'Motor Turbo CSS Prime',
    titulo: 'Motor 1.0 e 1.2 turbo CSS Prime (GM): carros e defeitos',
    resumo: 'Motor turbo 3 cilindros da GM, da família CSS Prime, nas versões 1.0 e 1.2. Equipa Onix, Onix Plus, Tracker e Montana. Usa correia dentada banhada a óleo, o ponto central da manutenção preventiva.',
    modelos: ['chevrolet/onix', 'chevrolet/tracker'],
  },
  {
    slug: 'puretech-thp', tipo: 'motor', nome: 'Motor PureTech / THP (PSA)',
    titulo: 'Motor 1.2 PureTech e 1.6 THP (Peugeot/Citroën): defeitos e cuidados',
    resumo: 'Família de motores a gasolina do grupo PSA/Stellantis. O 1.2 PureTech 3 cilindros turbo equipa Peugeot 208, 2008 e Citroën C3. O 1.6 THP equipa Peugeot 3008 e Citroën C4. Atenção à corrente de distribuição, que pode estirar antes do intervalo oficial recomendado pela montadora.',
    modelos: ['peugeot/208', 'peugeot/2008', 'peugeot/3008', 'citroen/c3', 'citroen/c4'],
    sameAs: 'https://en.wikipedia.org/wiki/PSA_EB_engine',
  },
  // ---------- TECNOLOGIAS ----------
  {
    slug: 'correia-banhada-a-oleo', tipo: 'tecnologia', nome: 'Correia banhada a óleo',
    titulo: 'Correia dentada banhada a óleo: o que é, riscos e quais carros usam',
    resumo: 'Correia de distribuição que trabalha imersa em óleo, dentro do motor. Promete durar mais e fazer menos barulho, mas se degrada quando o óleo certo não é trocado no intervalo, podendo soltar fragmentos e danificar o motor. Aparece no Onix e Tracker (GM) e no Ka (Ford).',
    modelos: ['chevrolet/onix', 'chevrolet/tracker', 'ford/ka'],
  },
  {
    slug: 'cambio-aisin-aq250', tipo: 'tecnologia', nome: 'Câmbio automático Aisin (AQ250)',
    titulo: 'Câmbio automático Aisin AQ250: como funciona e os trancos',
    resumo: 'Câmbio automático de 6 marchas com conversor de torque, fornecido pela Aisin e usado pela Volkswagen no Polo, Virtus, T-Cross e Nivus. Tem fama de trancos quando o software está desatualizado ou o fluido vence.',
    modelos: ['volkswagen/polo-tsi', 'volkswagen/t-cross', 'volkswagen/nivus', 'volkswagen/virtus', 'volkswagen/taos'],
  },
  {
    slug: 'cambio-automatizado', tipo: 'tecnologia', nome: 'Câmbio automatizado (Dualogic/GSR)',
    titulo: 'Câmbio automatizado Dualogic e GSR: por que dá trancos',
    resumo: 'Câmbio manual com embreagem e trocas comandadas por atuadores, que a Fiat chama de Dualogic e GSR. Dá os trancos típicos do tipo e depende de atuador e embreagem em dia. Equipou Palio, Argo, Idea e outros.',
    modelos: ['fiat/palio', 'fiat/argo'],
  },
  {
    slug: 'cambio-cvt', tipo: 'tecnologia', nome: 'Câmbio CVT',
    titulo: 'Câmbio CVT: como funciona, o fluido e os mitos',
    resumo: 'Transmissão continuamente variável, sem marchas fixas, por polias. Suave no dia a dia, mas exige o fluido específico no intervalo certo. O mito do fluido vitalício é a maior causa de problema. Usada por Corolla, Pulse e muitos outros.',
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
