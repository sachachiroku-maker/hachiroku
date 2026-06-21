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
  { slug: 'chevrolet', nome: 'Chevrolet', resumo: 'A Chevrolet (GM) é uma das marcas mais vendidas do Brasil, com Onix e Tracker na liderança. Veja os defeitos crônicos, fichas e guias dos modelos Chevrolet.', sameAs: ['https://pt.wikipedia.org/wiki/Chevrolet', 'https://www.wikidata.org/entity/Q484938'] },
  { slug: 'volkswagen', nome: 'Volkswagen', resumo: 'A Volkswagen domina o segmento com Polo, T-Cross, Nivus e o eterno Gol. Veja os defeitos crônicos, fichas e guias dos modelos VW e seus motores TSI.', sameAs: ['https://pt.wikipedia.org/wiki/Volkswagen', 'https://www.wikidata.org/entity/Q246'] },
  { slug: 'fiat', nome: 'Fiat', resumo: 'A Fiat lidera vendas no Brasil com Strada, Argo, Mobi e Toro. Veja os defeitos crônicos, fichas e guias dos modelos Fiat e dos motores Firefly e E.torQ.', sameAs: ['https://pt.wikipedia.org/wiki/Fiat', 'https://www.wikidata.org/entity/Q27597'] },
  { slug: 'hyundai', nome: 'Hyundai', resumo: 'A Hyundai tem no HB20 e no Creta dois campeões de venda. Veja os defeitos crônicos, fichas e guias dos modelos Hyundai.', sameAs: ['https://pt.wikipedia.org/wiki/Hyundai', 'https://www.wikidata.org/entity/Q36032'] },
  { slug: 'ford', nome: 'Ford', resumo: 'A Ford deixou de fabricar no Brasil, mas Ka, EcoSport e Ranger seguem nas ruas. Veja os defeitos crônicos e fichas dos modelos Ford.', sameAs: ['https://pt.wikipedia.org/wiki/Ford_Motor_Company', 'https://www.wikidata.org/entity/Q44294'] },
  { slug: 'jeep', nome: 'Jeep', resumo: 'A Jeep popularizou o SUV no Brasil com Renegade e Compass, ambos do motor 1.3 turbo T270. Veja os defeitos crônicos, fichas e guias dos modelos Jeep.', sameAs: ['https://pt.wikipedia.org/wiki/Jeep', 'https://www.wikidata.org/entity/Q26866'] },
  { slug: 'renault', nome: 'Renault', resumo: 'A Renault aposta em Kwid, Sandero e Duster como carros de custo acessível. Veja os defeitos crônicos, fichas e guias dos modelos Renault.', sameAs: ['https://pt.wikipedia.org/wiki/Renault', 'https://www.wikidata.org/entity/Q286'] },
  { slug: 'toyota', nome: 'Toyota', resumo: 'A Toyota é referência de confiabilidade no Brasil com Corolla e Corolla Cross. Veja os pontos de atenção, fichas e guias dos modelos Toyota.', sameAs: ['https://pt.wikipedia.org/wiki/Toyota', 'https://www.wikidata.org/entity/Q53268'] },
  { slug: 'nissan', nome: 'Nissan', resumo: 'A Nissan tem no Kicks e no Versa seus modelos de volume no Brasil. Veja os defeitos crônicos, fichas e guias dos modelos Nissan.', sameAs: ['https://pt.wikipedia.org/wiki/Nissan', 'https://www.wikidata.org/entity/Q20165'] },
  { slug: 'honda', nome: 'Honda', resumo: 'A Honda tem City e HR-V como carros de volume, com fama de motor durável. Veja os defeitos crônicos, fichas e guias dos modelos Honda.', sameAs: ['https://pt.wikipedia.org/wiki/Honda', 'https://www.wikidata.org/entity/Q9584'] },
  { slug: 'byd', nome: 'BYD', resumo: 'A BYD lidera a invasão chinesa de elétricos e híbridos no Brasil com Dolphin e Song Plus. Veja a cobertura técnica dos modelos BYD.', sameAs: ['https://pt.wikipedia.org/wiki/BYD', 'https://www.wikidata.org/entity/Q248654'] },
  { slug: 'peugeot', nome: 'Peugeot', resumo: 'A Peugeot voltou ao foco no Brasil com 208 e 2008, movidos pelo motor 1.6 THP e câmbio automático EAT8. Veja os defeitos crônicos, fichas e guias dos modelos Peugeot.', sameAs: ['https://pt.wikipedia.org/wiki/Peugeot', 'https://www.wikidata.org/entity/Q6779'] },
  { slug: 'citroen', nome: 'Citroën', resumo: 'A Citroën aposta no C3 como carro popular com câmbio automatizado e estilo europeu. Veja os defeitos crônicos, fichas e guias dos modelos Citroën.', sameAs: ['https://pt.wikipedia.org/wiki/Citro%C3%ABn', 'https://www.wikidata.org/entity/Q6742'] },
  { slug: 'mitsubishi', nome: 'Mitsubishi', resumo: 'A Mitsubishi tem no L200 Triton, Outlander e Eclipse Cross seus principais modelos no Brasil. Veja os defeitos crônicos, fichas e guias dos modelos Mitsubishi.', sameAs: ['https://pt.wikipedia.org/wiki/Mitsubishi_Motors', 'https://www.wikidata.org/entity/Q36033'] },
  { slug: 'gwm', nome: 'GWM', resumo: 'A GWM (Great Wall Motors) lidera a expansão das marcas chinesas no Brasil com Haval H6 e outros SUVs. Veja os pontos de atenção e cobertura técnica dos modelos GWM.', sameAs: ['https://pt.wikipedia.org/wiki/Great_Wall_Motors', 'https://www.wikidata.org/entity/Q1142699'] },
  { slug: 'ram', nome: 'RAM', resumo: 'A RAM traz picapes robustas ao Brasil com o Rampage e a clássica RAM 1500. Veja os defeitos crônicos e fichas dos modelos RAM.', sameAs: ['https://pt.wikipedia.org/wiki/Ram_Trucks', 'https://www.wikidata.org/entity/Q3960236'] },
  { slug: 'suzuki', nome: 'Suzuki', resumo: 'A Suzuki tem no Jimny o ícone do off-road compacto no Brasil. Veja os pontos de atenção e fichas dos modelos Suzuki.', sameAs: ['https://pt.wikipedia.org/wiki/Suzuki', 'https://www.wikidata.org/entity/Q25915'] },
  { slug: 'caoa-chery', nome: 'CAOA Chery', resumo: 'A CAOA Chery aposta no Tiggo 5X e Tiggo 8 Pro no segmento de SUVs compactos no Brasil. Veja os pontos de atenção e cobertura técnica dos modelos CAOA Chery.', sameAs: ['https://pt.wikipedia.org/wiki/Chery', 'https://www.wikidata.org/entity/Q574262'] },
];

export const getMarca = (slug: string) => MARCAS.find((m) => m.slug === slug);
