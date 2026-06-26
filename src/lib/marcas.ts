/**
 * Eixo MARCA: cada marca vira entidade de 1ª classe com casa canônica
 * (/marca/[slug]) e sameAs ao Knowledge Graph (Wikipedia PT). Slug = 1º
 * segmento do id da collection (ex: "chevrolet/onix" → "chevrolet").
 */
export interface Marca {
  slug: string;
  nome: string;
  resumo: string;
  sameAs: string[];
}

export const MARCAS: Marca[] = [
  {
    slug: 'chevrolet',
    nome: 'Chevrolet',
    resumo: 'A Chevrolet está presente em praticamente todo estacionamento brasileiro, e os motivos ficam claros olhando para o portfólio. O Onix hatch e o Onix Plus sedã dominaram o segmento de entrada por anos, enquanto o Tracker turbinado conquistou o mercado de SUVs compactos. A S10 figura entre as picapes mais procuradas para uso misto, e a Spin segue como referência em monovolumes de sete lugares. Motoricamente, a linha atual aposta no 1.0 turbo Flex de três cilindros, um motor ágil que exige troca de óleo rigorosa porque o turbo opera em rotações altas mesmo em uso urbano. O câmbio automático de seis marchas do Tracker convive bem com o dia a dia, porém o CVT da geração anterior do Onix Plus merece inspeção preventiva do fluido a cada 40 mil km. O mecânico deve ficar de olho no nível de refrigerante, pois o motor 1.0 turbo aquece mais rápido em trânsito lento, e na corrente de distribuição nos exemplares mais antigos do 1.4 EcoTec, que apresentou desgaste prematuro quando o óleo esteve fora do prazo de troca.',
    sameAs: ['https://pt.wikipedia.org/wiki/Chevrolet', 'https://www.wikidata.org/entity/Q484938'],
  },
  {
    slug: 'volkswagen',
    nome: 'Volkswagen',
    resumo: 'A Volkswagen consolidou seu espaço no Brasil tanto no segmento popular quanto no premium. O Polo e o Virtus sedã brigam ponto a ponto com concorrentes diretos, enquanto o T-Cross e o Nivus fazem sucesso crescente nos SUVs compactos. O Gol segue rodando em milhares de frotas mesmo após o encerramento da produção, e o robusto Amarok continua sendo referência entre picapes de uso intenso. O motor TSI, presente na maioria dos modelos recentes, entrega boa eficiência, mas acumula depósito de carbono nas válvulas de admissão com mais facilidade do que motores de injeção indireta: uma limpeza a cada 40-60 mil km é recomendada. O câmbio de dupla embreagem DSG, disponível em seis ou sete marchas, é suave em uso normal, mas pode apresentar solavanco em tráfego congestionado se o óleo da caixa não for trocado no prazo. O mecânico deve prestar atenção nos rolamentos de roda do T-Cross nas primeiras gerações e verificar se o software da centralinha de injeção está atualizado, pois muitos solavancos e falhas de partida no motor TSI têm solução via update da própria fabricante.',
    sameAs: ['https://pt.wikipedia.org/wiki/Volkswagen', 'https://www.wikidata.org/entity/Q246'],
  },
  {
    slug: 'fiat',
    nome: 'Fiat',
    resumo: 'A Fiat é a fabricante com maior presença nas estradas brasileiras, e os números comprovam essa liderança. A Strada domina o segmento de picapes compactas com folga, o Argo dividiu o mercado de hatches populares com o Mobi de entrada, e o Toro consolidou a marca no segmento de picapes médias. O Pulse SUV e o Cronos sedã completam o portfólio atual, ambos com o motor Firefly 1.3 turbo como topo de gama a combustão. O Firefly em versão aspirada é simples e econômico, mas exige atenção ao ajuste de válvulas a cada 30 mil km, um intervalo mais curto do que o habitual para a categoria. O motor E.torQ 1.8, ainda presente em versões mais antigas do Argo e da Toro, tem boa durabilidade, porém apresentou problemas com velas de ignição se não forem trocadas na manutenção prevista. O câmbio CVT do Pulse foi alvo de recall em alguns lotes, e o mecânico deve conferir o histórico do veículo antes de qualquer revisão. Para as picapes, inspecionar o diferencial traseiro da Toro 4x4 a cada revisão é prática que evita reparos de alto custo no futuro.',
    sameAs: ['https://pt.wikipedia.org/wiki/Fiat', 'https://www.wikidata.org/entity/Q27597'],
  },
  {
    slug: 'hyundai',
    nome: 'Hyundai',
    resumo: 'A Hyundai chegou ao Brasil com o HB20 e rapidamente emplacou o modelo como favorito no segmento de entrada. Hoje, o HB20 hatch e o HB20S sedã mantêm boa demanda, mas é o Creta que sustenta os números maiores de emplacamento, especialmente nas versões Limited com motor 2.0 aspirado e câmbio automático de seis marchas. O Tucson e o Santa Fe atendem o público que busca mais espaço e acabamento premium. Tecnicamente, o motor 1.0 turbo do HB20 é compacto e eficiente, porém demanda troca de óleo a cada 10 mil km no máximo por conta do turbo de geometria fixa. O câmbio CVT com correia metálica da geração anterior do HB20 merece atenção: se o fluido não foi trocado dentro do prazo, há risco de deslizamento e perda de eficiência. O mecânico deve verificar o estado do filtro de ar e do sensor de fluxo de massa nos motores 1.6 aspirado, pois esse sensor, quando sujo, gera falhas de mistura que imitam problema no catalisador. A vida útil das pastilhas de freio dianteiras no Creta 2.0 costuma ser mais curta do que o previsto por proprietários que fazem trajetos com muitas descidas ou frenagens frequentes.',
    sameAs: ['https://pt.wikipedia.org/wiki/Hyundai', 'https://www.wikidata.org/entity/Q36032'],
  },
  {
    slug: 'ford',
    nome: 'Ford',
    resumo: 'A Ford encerrou a produção no Brasil em 2021, mas Ka, EcoSport, Fusion e Ranger ainda circulam em grande número pelo país. O Ka foi fenômeno de vendas com motor Dragon 1.5 e 1.0 EcoBoost, enquanto o EcoSport, pioneiro do segmento SUV compacto nacional, ainda mantém valores razoáveis de revenda. A Ranger segue sendo oferecida no Brasil como produto importado e continua entre as picapes mais admiradas do segmento. O motor EcoBoost 1.0 do Ka tem fama de consumo eficiente, mas exige atenção ao sistema de arrefecimento: a sonda lambda e o sensor de temperatura tendem a acusar falha quando o líquido de arrefecimento está abaixo do nível. O câmbio PowerShift de dupla embreagem seca, presente nos Ka e Focus de período mais antigo, foi o ponto mais crítico da linha: ruídos ao engatar primeira marcha e solavancos em fila são sintomas que exigem atualização de software ou substituição do kit de embreagem. O mecânico que receber um Ford desse período deve verificar o histórico de recalls antes de qualquer diagnóstico, pois a montadora emitiu vários boletins de serviço e as peças ainda têm disponibilidade razoável nas redes autorizadas mesmo após a saída do mercado.',
    sameAs: ['https://pt.wikipedia.org/wiki/Ford_Motor_Company', 'https://www.wikidata.org/entity/Q44294'],
  },
  {
    slug: 'jeep',
    nome: 'Jeep',
    resumo: 'A Jeep reinventou o gosto brasileiro por SUVs quando lançou o Renegade em 2015, e desde então não saiu do radar dos consumidores. O Compass tomou conta do segmento intermediário com acabamento premium, e o Commander chegou para atender famílias que precisam de sete lugares com tração. Todos os modelos mais recentes são movidos pelo motor 1.3 turbo T270 ou T4, desenvolvido em parceria com a Stellantis, com potência entre 150 e 185 cv dependendo da versão. O ponto de atenção mais citado em oficinas é o sistema de arrefecimento: o T270 opera próximo da temperatura máxima em uso urbano intenso, e qualquer vazamento por mangueiras ou tampa do radiador pode levar ao superaquecimento rapidamente. O câmbio automático de nove marchas do Compass T4 é suave, mas deve ter o fluido trocado a cada 60 mil km, pois muitos proprietários ignoram esse item e enfrentam solavancos precoces. No Commander, o mecânico deve inspecionar as buchas do braço de controle dianteiro nas revisões, pois a suspensão multilink sofre mais com a carga de sete ocupantes em ruas esburacadas. Peças originais têm boa distribuição no Brasil por meio da rede Stellantis.',
    sameAs: ['https://pt.wikipedia.org/wiki/Jeep', 'https://www.wikidata.org/entity/Q26866'],
  },
  {
    slug: 'renault',
    nome: 'Renault',
    resumo: 'A Renault é uma das marcas que melhor soube adaptar seus modelos ao gosto e ao bolso brasileiro. O Kwid abriu o segmento de SUV de entrada com preço de popular, o Sandero mantém fidelidade entre quem prefere câmbio manual, e o Duster ainda é referência em custo-benefício nos SUVs compactos. O Captur e o Oroch, derivado do Duster com caçamba, completam o portfólio atual. O motor 1.6 aspirado SCe presente em várias versões é simples, robusto e de manutenção barata, o que explica o alto índice de satisfação em pesquisas de custo operacional. O câmbio CVT X-Tronic do Captur e do Duster 2.0 tem desempenho adequado para o uso urbano, mas o fluido deve ser trocado a cada 40 mil km: sem essa troca, o sistema de correia interna desgasta antes do esperado. O mecânico deve observar o estado dos coxins do motor no Duster 2.0, que vibra mais em marcha lenta quando os suportes estão desgastados, e verificar o sensor de posição do acelerador no Kwid, cujo pedal eletrônico é mais sensível à sujeira do que nos concorrentes japoneses. A rede de peças da Renault no Brasil é abrangente e com preços competitivos.',
    sameAs: ['https://pt.wikipedia.org/wiki/Renault', 'https://www.wikidata.org/entity/Q286'],
  },
  {
    slug: 'toyota',
    nome: 'Toyota',
    resumo: 'A Toyota construiu no Brasil uma reputação de durabilidade que poucos fabricantes conseguem igualar. O Corolla sedã permanece como referência de confiabilidade entre sedãs médios, e o Corolla Cross trouxe o visual de SUV sem abrir mão da mecânica híbrida disponível na versão topo. A Hilux é a picape mais valorizada na revenda e a mais escolhida por quem trabalha em zonas rurais. O Yaris hatch e sedã atendem o público que quer um Toyota de entrada sem abrir mão da extensa rede autorizada. Os motores 2.0 flex Dynamic Force e o sistema híbrido 1.8 do Corolla Cross são de alta durabilidade, mas o mecânico deve checar o estado dos injetores nos motores de injeção direta a cada 60 mil km para evitar acúmulo de carbono nas válvulas. Na Hilux, o ponto mais sensível é a bomba de combustível do diesel 2.8 Turbo, com relatos de entupimento em postos com combustível de baixa qualidade. O câmbio automático de seis marchas presente nos modelos flex é bastante robusto, mas o fluido ATF deve ser trocado a cada 80 mil km para preservar a suavidade das trocas. A rede de peças da Toyota é das mais organizadas e ágeis do Brasil.',
    sameAs: ['https://pt.wikipedia.org/wiki/Toyota', 'https://www.wikidata.org/entity/Q53268'],
  },
  {
    slug: 'nissan',
    nome: 'Nissan',
    resumo: 'A Nissan se firmou no Brasil principalmente por dois modelos de volume: o Kicks SUV compacto e o Versa sedã. O Kicks conquistou o mercado com design arrojado e câmbio CVT Xtronic bem calibrado, enquanto o Versa se manteve como opção econômica e espaçosa para quem não abre mão de um porta-malas generoso. A Frontier diesel continua sendo a picape de trabalho pesado preferida por fazendeiros e construtores que não querem pagar o preço premium de uma Hilux. O câmbio CVT Xtronic usa uma polia de variação contínua que depende de fluido limpo para funcionar bem: a Nissan recomenda troca a cada 30 mil km, mas boa parte dos proprietários ultrapassa esse intervalo. O mecânico deve testar o comportamento do câmbio em frenagem suave, pois qualquer solavanquinho ou demora para retomar a tração indica desgaste inicial da correia interna. Na Frontier 2.3 biturbo, a corrente de distribuição pode apresentar ruído ao arrancar a frio se o óleo estiver degradado, e usar viscosidade 5W-30 sintético é a recomendação mais segura para preservar a cadeia. O estoque de peças da Nissan no Brasil é razoável, com prazos de entrega um pouco maiores do que os das marcas japonesas com produção local.',
    sameAs: ['https://pt.wikipedia.org/wiki/Nissan', 'https://www.wikidata.org/entity/Q20165'],
  },
  {
    slug: 'honda',
    nome: 'Honda',
    resumo: 'A Honda tem no Brasil um portfólio enxuto e bem focado: City sedã e hatch, HR-V SUV compacto, WR-V e o Civic nas versões 1.5 turbo. O City é, possivelmente, o sedã mais recomendado por mecânicos independentes no segmento compacto, com motor 1.5 Flex aspirado simples, durável e peças de preço acessível. O HR-V 1.5 turbo da segunda geração subiu de patamar em refinamento, mas trouxe a complexidade de um motor turbo de três cilindros que exige mais atenção nas revisões. O câmbio CVT presente em toda a linha atual é suave e bem calibrado, porém o fluido precisa ser trocado antes dos 40 mil km para evitar solavancos à baixa velocidade. O ponto mais crítico na atual geração do HR-V é o sensor de velocidade de roda traseira, que pode gerar falsa ativação do controle de estabilidade em pavimento irregular, problema com solução via atualização de software na rede autorizada. No City 1.5 flex, o mecânico deve verificar o estado das buchas do braço de controle traseiro após 60 mil km: peças originais têm preço acessível e a substituição preventiva evita que o pneu traseiro desgaste irregularmente antes do prazo. A rede Honda tem cobertura abrangente nas capitais e no interior.',
    sameAs: ['https://pt.wikipedia.org/wiki/Honda', 'https://www.wikidata.org/entity/Q9584'],
  },
  {
    slug: 'byd',
    nome: 'BYD',
    resumo: 'A BYD chegou ao Brasil como a montadora elétrica que levou o segmento a sério, e os emplacamentos confirmaram que o mercado respondeu. O Dolphin compacto tornou o elétrico acessível para o público urbano, enquanto o Song Plus híbrido plug-in (PHEV) abriu o segmento para quem ainda hesita com a autonomia elétrica pura. O Seal sedã e o Atto 3 SUV completam a gama, com o Tan e o King atendendo o topo da linha. A tecnologia Blade Battery, com células LFP integradas ao assoalho, é o principal diferencial técnico: maior resistência a impactos e menor risco de ignição em acidentes comparado às baterias NMC convencionais. O mecânico independente que quiser atender esses modelos precisa de equipamento de isolamento de alta tensão (mínimo 1000 V) e certificação específica, pois sistemas de 400 V exigem precauções bem além do treinamento convencional. O ponto prático mais importante na revisão é o gerenciamento térmico da bateria: verificar o fluido refrigerante do circuito elétrico, separado do circuito do motor, dentro do nível e no prazo é tão crítico quanto checar o fluido de freio. A rede autorizada BYD cresceu rápido no Brasil, com cobertura boa nas capitais e expansão contínua para o interior.',
    sameAs: ['https://pt.wikipedia.org/wiki/BYD', 'https://www.wikidata.org/entity/Q248654'],
  },
  {
    slug: 'peugeot',
    nome: 'Peugeot',
    resumo: 'A Peugeot voltou a aparecer com frequência nas pesquisas de consumidores brasileiros após o lançamento do 208 hatch e do 2008 SUV, ambos com design europeu moderno e bom nível de acabamento. O 3008 e o 408 completam a gama para quem busca mais espaço ou um perfil de crossover alongado. Os motores da família PureTech, especialmente o 1.2 turbo de três cilindros que substituiu o 1.6 THP, têm eficiência energética excelente. O 1.6 THP ainda presente em alguns seminovos é conhecido pelo acúmulo de carbono nas válvulas de admissão: uma limpeza por injeção a cada 30-40 mil km prolonga muito a vida útil sem custos altos. O câmbio automático EAT8 de oito marchas é refinado e rápido nas trocas, porém exige troca de fluido a cada 60 mil km, pois deixar passar esse prazo é a principal causa de solavancos notados em baixa velocidade. O mecânico deve prestar atenção no sensor de pressão de óleo do motor PureTech 1.2, que tem relatos de falha prematura acendendo o alarme de óleo sem queda real de pressão: o diagnóstico correto por leitor OBD evita reparos desnecessários e economiza o bolso do proprietário.',
    sameAs: ['https://pt.wikipedia.org/wiki/Peugeot', 'https://www.wikidata.org/entity/Q6779'],
  },
  {
    slug: 'citroen',
    nome: 'Citroën',
    resumo: 'A Citroën conquistou um nicho fiel no Brasil apostando em conforto de suspensão e design diferenciado. O C3 popular virou um best-seller inesperado ao oferecer câmbio automatizado (AMT), ar-condicionado e direção elétrica a um preço competitivo. O C4 Cactus e o C5 Aircross atendem quem quer mais refinamento, com suspensão de amortecedores hidráulicos progressivos no C5 para melhorar o conforto em estradas ruins. Os motores usados são o 1.0 e 1.2 turbo PureTech compartilhados com a Peugeot, além do 1.6 THP em versões mais antigas. O câmbio automatizado de dois pedais do C3 de entrada funciona bem em uso tranquilo, mas os solavancos em tráfego congestionado são inerentes ao sistema AMT e o mecânico não deve confundir esse comportamento normal com defeito mecânico. No C5 Aircross, a suspensão progressive hydraulic cushions tem durabilidade alta, porém quando as hastes do amortecedor apresentam corrosão o custo de substituição é elevado. O filtro de ar e o filtro de combustível do 1.2 turbo devem ser trocados rigorosamente no prazo, pois o turbo de pequeno volume é sensível a variações na qualidade do ar e do combustível, cuidado básico que evita gastos maiores na bomba de combustível e no próprio turbo.',
    sameAs: ['https://pt.wikipedia.org/wiki/Citro%C3%ABn', 'https://www.wikidata.org/entity/Q6742'],
  },
  {
    slug: 'mitsubishi',
    nome: 'Mitsubishi',
    resumo: 'A Mitsubishi ocupa no Brasil um espaço particular: não compete no volume dos populares, mas construiu uma base leal de clientes que valoriza robustez e tração 4x4. O L200 Triton Sport é a picape de trabalho preferida por fazendeiros e aventureiros que precisam de carga pesada e terreno difícil. O Eclipse Cross e o Outlander atendem o público de SUVs médios, enquanto o ASX tem presença mais tímida no mercado nacional. O motor 2.4 MIVEC flex aspirado tem reputação de durabilidade, mas o ajuste de folga de válvulas deve ser verificado após o primeiro aquecimento em motores que ficaram parados por longo período. No L200 Triton, o motor 2.4 turbo diesel di-D tem injetores sensíveis à qualidade do combustível: usar diesel de posto confiável e trocar o filtro dentro do prazo reduz o risco de entupimento da bomba injetora, reparo que pode custar caro. O câmbio CVT do Eclipse Cross exige troca de fluido a cada 40 mil km, intervalo que muitos proprietários ignoram por não haver sinalização no painel. O diferencial traseiro da Triton 4x4 deve ser inspecionado a cada 40 mil km ou após uso intenso em lama, com troca de óleo para evitar desgaste precoce das engrenagens.',
    sameAs: ['https://pt.wikipedia.org/wiki/Mitsubishi_Motors', 'https://www.wikidata.org/entity/Q36033'],
  },
  {
    slug: 'gwm',
    nome: 'GWM',
    resumo: 'A GWM (Great Wall Motors) representa a nova onda de montadoras chinesas que chegaram ao Brasil com produtos de alto nível de especificação a preços competitivos. O Haval H6 SUV médio foi o carro de estreia e ainda é o modelo mais vendido da marca no país, com motor 1.5 turbo e câmbio de dupla embreagem (DCT) de sete marchas. O Tank 300 abriu o nicho de SUVs off-road premium, e o Ora 03 elétrico entrou no segmento de EVs compactos. O câmbio DCT dos modelos Haval passa por um período de adaptação nos primeiros 5 mil km, e solavancos leves ao arrancar são normais nessa fase: se persistirem além desse período, o mecânico deve verificar se há atualização de software disponível para o módulo de controle da transmissão. O motor 1.5 turbo é econômico e responsivo, porém demanda óleo sintético 5W-40 ou 5W-30: usar lubrificante mineral ou semissintético acelera o desgaste do turbo. A rede de concessionários GWM cresceu rapidamente no Brasil, mas para cidades do interior a disponibilidade de peças de funilaria e vidros especiais merece verificação antes de fechar o negócio, pois os prazos de importação podem ser longos.',
    sameAs: ['https://pt.wikipedia.org/wiki/Great_Wall_Motors', 'https://www.wikidata.org/entity/Q1142699'],
  },
  {
    slug: 'ram',
    nome: 'RAM',
    resumo: 'A RAM é a marca de picapes da Stellantis com dois posicionamentos bem distintos no Brasil. O Rampage chegou como picape média acessível com motor 2.0 turbo diesel de 170 cv e câmbio automático de nove marchas, combinação que entrega torque abundante para carga e reboque sem consumo excessivo. Já a RAM 1500 V8 Hemi é a picape de luxo sem disfarce, com 5.7 litros, 395 cv e transmissão ZF de oito marchas para quem quer conforto de sedã com a capacidade de carga de uma fazenda. O ponto mais crítico no Rampage diesel é a válvula EGR (recirculação de gases de escapamento): entupimento é queixa frequente em veículos urbanos que fazem trajetos curtos sem aquecimento completo do motor. Uma limpeza preventiva do EGR a cada 40-50 mil km evita queda de potência e eventual falha no teste de emissões. Na RAM 1500, o fluido 5W-20 Mopar deve ser o especificado para o V8: substitutos de baixa qualidade podem gerar alerta de pressão de óleo no painel e acelerar o desgaste das bronzinas. A rede de garantia da RAM no Brasil cobre bem as capitais e tem expandido para as principais cidades do interior.',
    sameAs: ['https://pt.wikipedia.org/wiki/Ram_Trucks', 'https://www.wikidata.org/entity/Q3960236'],
  },
  {
    slug: 'suzuki',
    nome: 'Suzuki',
    resumo: 'A Suzuki ocupa um nicho muito específico no mercado brasileiro, e o Jimny é o coração desse nicho. O pequeno off-road com chassi de escada separado, caixa de redução e diferencial traseiro bloqueável é único entre os lançamentos da última década, e chegou ao mercado esgotando estoques com meses de antecedência em cada lote disponível. O Grand Vitara retornou ao portfólio para quem quer mais espaço sem abrir mão do 4x4 integral, e o Swift hatch entrou discretamente no segmento urbano. O motor 1.5 K15B do Jimny tem consumo modesto para um off-road, mas o mecânico deve verificar o nível de óleo a cada 5 mil km, pois o propulsor consome uma pequena quantidade de lubrificante em uso fora de estrada intenso. A caixa de transferência AllGrip Pro merece inspeção do óleo a cada 40 mil km ou após uso pesado em lama. Os freios do Jimny, dimensionados para o peso original do veículo, desgastam as pastilhas com mais rapidez em uso urbano frequente com carga e passageiros. Peças originais Suzuki têm disponibilidade razoável nas capitais, mas no interior o prazo de entrega pode ser longo, o que exige planejamento na manutenção preventiva.',
    sameAs: ['https://pt.wikipedia.org/wiki/Suzuki', 'https://www.wikidata.org/entity/Q25915'],
  },
  {
    slug: 'caoa-chery',
    nome: 'CAOA Chery',
    resumo: 'A CAOA Chery reposicionou as marcas chinesas no Brasil ao entregar SUVs com acabamento competitivo e preço abaixo dos equivalentes europeus. O Tiggo 5X foi o modelo de estreia do novo posicionamento, seguido pelo Tiggo 7 Pro e o Tiggo 8 Pro, este último com motor 2.0 turbo de 197 cv e câmbio DCT de sete marchas. O Tiggo 5X usa o propulsor 1.5 turbo associado ao câmbio CVT ou DCT conforme a versão, sendo o mais indicado para uso urbano por conta do consumo mais contido. O câmbio DCT dos modelos mais potentes exige um período de adaptação nos primeiros quilômetros, e solavancos ao sair do semáforo são normais nessa fase inicial. O mecânico deve acompanhar o calendário de troca do fluido do DCT com atenção: o intervalo recomendado é de 40 mil km, menor do que proprietários acostumados a marcas japonesas costumam esperar. A correia dentada do motor 1.5 turbo tem intervalo de substituição mais curto do que o habitual em outros fabricantes, e ignorar essa troca pode resultar em falha catastrófica com encontro entre válvulas e pistões. A rede CAOA Chery tem boa cobertura nas capitais e está expandindo para cidades médias do interior.',
    sameAs: ['https://pt.wikipedia.org/wiki/Chery', 'https://www.wikidata.org/entity/Q574262'],
  },
];

export const getMarca = (slug: string) => MARCAS.find((m) => m.slug === slug);
