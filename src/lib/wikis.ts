/**
 * sameAs Wikipedia PT por modelo — usado nos schemas de ficha e problema
 * para ligar os modelos ao Knowledge Graph.
 */
export const MODELO_SAME_AS: Record<string, string> = {
  'chevrolet/onix': 'https://pt.wikipedia.org/wiki/Chevrolet_Onix',
  'chevrolet/tracker': 'https://pt.wikipedia.org/wiki/Chevrolet_Tracker',
  'volkswagen/gol': 'https://pt.wikipedia.org/wiki/Volkswagen_Gol',
  'volkswagen/polo-tsi': 'https://pt.wikipedia.org/wiki/Volkswagen_Polo',
  'volkswagen/t-cross': 'https://pt.wikipedia.org/wiki/Volkswagen_T-Cross',
  'volkswagen/nivus': 'https://pt.wikipedia.org/wiki/Volkswagen_Nivus',
  'hyundai/hb20': 'https://pt.wikipedia.org/wiki/Hyundai_HB20',
  'hyundai/creta': 'https://pt.wikipedia.org/wiki/Hyundai_Creta',
  'fiat/argo': 'https://pt.wikipedia.org/wiki/Fiat_Argo',
  'fiat/palio': 'https://pt.wikipedia.org/wiki/Fiat_Palio',
  'fiat/mobi': 'https://pt.wikipedia.org/wiki/Fiat_Mobi',
  'fiat/strada': 'https://pt.wikipedia.org/wiki/Fiat_Strada',
  'fiat/toro': 'https://pt.wikipedia.org/wiki/Fiat_Toro',
  'fiat/cronos': 'https://pt.wikipedia.org/wiki/Fiat_Cronos',
  'fiat/fastback': 'https://pt.wikipedia.org/wiki/Fiat_Fastback',
  'fiat/pulse': 'https://pt.wikipedia.org/wiki/Fiat_Pulse',
  'ford/ka': 'https://pt.wikipedia.org/wiki/Ford_Ka',
  'jeep/renegade': 'https://pt.wikipedia.org/wiki/Jeep_Renegade',
  'jeep/compass': 'https://pt.wikipedia.org/wiki/Jeep_Compass',
  'renault/kwid': 'https://pt.wikipedia.org/wiki/Renault_Kwid',
  'renault/sandero': 'https://pt.wikipedia.org/wiki/Renault_Sandero',
  'renault/duster': 'https://pt.wikipedia.org/wiki/Renault_Duster',
  'toyota/corolla': 'https://pt.wikipedia.org/wiki/Toyota_Corolla',
  'nissan/kicks': 'https://pt.wikipedia.org/wiki/Nissan_Kicks',
  'honda/hr-v': 'https://pt.wikipedia.org/wiki/Honda_HR-V',
  'honda/city': 'https://pt.wikipedia.org/wiki/Honda_City',
  'byd/dolphin-mini': 'https://pt.wikipedia.org/wiki/BYD_Dolphin',
  // Onda 2
  'volkswagen/virtus': 'https://pt.wikipedia.org/wiki/Volkswagen_Virtus',
  'volkswagen/taos': 'https://pt.wikipedia.org/wiki/Volkswagen_Taos',
  'honda/civic': 'https://pt.wikipedia.org/wiki/Honda_Civic',
  'renault/captur': 'https://pt.wikipedia.org/wiki/Renault_Captur',
  'ford/ecosport': 'https://pt.wikipedia.org/wiki/Ford_EcoSport',
  'toyota/yaris': 'https://pt.wikipedia.org/wiki/Toyota_Yaris',
  'hyundai/ix35': 'https://pt.wikipedia.org/wiki/Hyundai_ix35',
  'honda/fit': 'https://pt.wikipedia.org/wiki/Honda_Fit',
  // Onda 3
  'toyota/corolla-cross': 'https://pt.wikipedia.org/wiki/Toyota_Corolla_Cross',
  'hyundai/tucson': 'https://pt.wikipedia.org/wiki/Hyundai_Tucson',
  'volkswagen/tiguan': 'https://pt.wikipedia.org/wiki/Volkswagen_Tiguan',
  'renault/oroch': 'https://pt.wikipedia.org/wiki/Renault_Duster_Oroch',
  'peugeot/208': 'https://pt.wikipedia.org/wiki/Peugeot_208',
  'peugeot/2008': 'https://pt.wikipedia.org/wiki/Peugeot_2008',
  'citroen/c3': 'https://pt.wikipedia.org/wiki/Citroën_C3',
  'ford/ranger': 'https://pt.wikipedia.org/wiki/Ford_Ranger',
  // Onda 4
  'chevrolet/montana': 'https://pt.wikipedia.org/wiki/Chevrolet_Montana',
  'chevrolet/s10': 'https://pt.wikipedia.org/wiki/Chevrolet_S10',
  'toyota/hilux': 'https://pt.wikipedia.org/wiki/Toyota_Hilux',
  'nissan/versa': 'https://pt.wikipedia.org/wiki/Nissan_Versa',
  'honda/wr-v': 'https://pt.wikipedia.org/wiki/Honda_WR-V',
  'jeep/commander': 'https://pt.wikipedia.org/wiki/Jeep_Commander',
  'byd/yuan-plus': 'https://pt.wikipedia.org/wiki/BYD_Yuan',
  'volkswagen/amarok': 'https://pt.wikipedia.org/wiki/Volkswagen_Amarok',
  // Onda 5
  'chevrolet/spin': 'https://pt.wikipedia.org/wiki/Chevrolet_Spin',
  'fiat/fiorino': 'https://pt.wikipedia.org/wiki/Fiat_Fiorino',
  'volkswagen/jetta': 'https://pt.wikipedia.org/wiki/Volkswagen_Jetta',
  'renault/logan': 'https://pt.wikipedia.org/wiki/Renault_Logan',
  'nissan/frontier': 'https://pt.wikipedia.org/wiki/Nissan_Frontier',
  'toyota/sw4': 'https://pt.wikipedia.org/wiki/Toyota_SW4',
  // Onda 6
  'fiat/uno': 'https://pt.wikipedia.org/wiki/Fiat_Uno',
  'volkswagen/saveiro': 'https://pt.wikipedia.org/wiki/Volkswagen_Saveiro',
  'hyundai/hb20s': 'https://pt.wikipedia.org/wiki/Hyundai_HB20',
  'chevrolet/cruze': 'https://pt.wikipedia.org/wiki/Chevrolet_Cruze',
  'ford/territory': 'https://pt.wikipedia.org/wiki/Ford_Territory',
  'byd/song-plus': 'https://pt.wikipedia.org/wiki/BYD_Song',
  'jeep/wrangler': 'https://pt.wikipedia.org/wiki/Jeep_Wrangler',
};

export function modeloSameAs(marcaModelo: string): string | undefined {
  return MODELO_SAME_AS[marcaModelo.toLowerCase()];
}
