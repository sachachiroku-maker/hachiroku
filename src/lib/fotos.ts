/**
 * Mapa de foto real por modelo (Wikimedia Commons, licença CC — ver /creditos/).
 * Indexado por "marca/modelo" (os 2 primeiros segmentos do id da collection).
 */
import fs from 'node:fs';
import path from 'node:path';

const MODELO: Record<string, string> = {
  'chevrolet/onix': 'onix',
  'volkswagen/gol': 'gol',
  'volkswagen/polo-tsi': 'polo-tsi',
  'hyundai/hb20': 'hb20',
  'fiat/argo': 'argo',
  'fiat/palio': 'palio',
  'ford/ka': 'ka',
  'chevrolet/tracker': 'tracker',
  'volkswagen/t-cross': 't-cross',
  'hyundai/creta': 'creta',
  'renault/kwid': 'kwid',
  'jeep/renegade': 'renegade',
  'fiat/mobi': 'mobi',
  'toyota/corolla': 'corolla',
  'jeep/compass': 'compass',
  'fiat/strada': 'strada',
  'volkswagen/nivus': 'nivus',
  'fiat/pulse': 'pulse',
  'fiat/toro': 'toro',
  'fiat/cronos': 'cronos',
  'renault/sandero': 'sandero',
  'honda/hr-v': 'hr-v',
  'byd/dolphin-mini': 'dolphin',
  // Onda 2 — 2026-06-20
  'volkswagen/virtus': 'virtus',
  'volkswagen/taos': 'taos',
  'honda/civic': 'civic',
  'renault/captur': 'captur',
  'ford/ecosport': 'ecosport',
  'toyota/yaris': 'yaris',
  'hyundai/ix35': 'ix35',
  'honda/fit': 'fit',
  // Onda 3 — 2026-06-20
  'toyota/corolla-cross': 'corolla-cross',
  'hyundai/tucson': 'tucson',
  'volkswagen/tiguan': 'tiguan',
  'renault/oroch': 'oroch',
  'peugeot/208': 'peugeot-208',
  'peugeot/2008': 'peugeot-2008',
  'citroen/c3': 'c3',
  'ford/ranger': 'ranger',
  // Onda 4 — 2026-06-20
  'chevrolet/montana': 'montana',
  'chevrolet/s10': 's10',
  'toyota/hilux': 'hilux',
  'nissan/versa': 'versa',
  'honda/wr-v': 'wr-v',
  'jeep/commander': 'commander',
  'byd/yuan-plus': 'yuan-plus',
  'volkswagen/amarok': 'amarok',
  // Onda 5 — 2026-06-20
  'chevrolet/spin': 'spin',
  'fiat/fiorino': 'fiorino',
  'volkswagen/jetta': 'jetta',
  'renault/logan': 'logan',
  'nissan/frontier': 'frontier',
  'toyota/sw4': 'sw4',
  'fiat/fastback': 'fastback',
  'honda/city': 'city',
  // Onda 6 — 2026-06-20
  'fiat/uno': 'uno',
  'volkswagen/saveiro': 'saveiro',
  'renault/duster': 'duster',
  'hyundai/hb20s': 'hb20s',
  'chevrolet/cruze': 'cruze',
  'ford/territory': 'territory',
  'byd/song-plus': 'song-plus',
  'jeep/wrangler': 'wrangler',
  // Onda 7 — 2026-06-20
  'gwm/haval-h6': 'haval-h6',
  'citroen/c4': 'c4',
  'peugeot/3008': '3008',
  'hyundai/santa-fe': 'santa-fe',
  'nissan/kicks': 'kicks',
  // Onda 8 — 2026-06-20
  'mitsubishi/l200-triton': 'l200-triton',
  'mitsubishi/outlander': 'outlander',
  'fiat/doblo': 'doblo',
  'volkswagen/fox': 'fox',
};

const EXT = '.webp';

/**
 * Slugs com arquivo real em /public/img/modelos (lido em build-time).
 * Garante que nunca apontamos para uma imagem inexistente — sem isso, modelos
 * mapeados mas sem foto gerariam 404 (prejudica LCP e schema ImageObject).
 */
const FOTOS_EXISTENTES: Set<string> = (() => {
  try {
    const dir = path.resolve('./public/img/modelos');
    return new Set(
      fs.readdirSync(dir)
        .filter((f) => f.endsWith(EXT))
        .map((f) => f.slice(0, -EXT.length)),
    );
  } catch {
    return new Set<string>();
  }
})();

/** Resolve o caminho da foto a partir do slug, caindo para a capa se não existir. */
function resolverFoto(slug: string | undefined, fallbackCategoria: string): string {
  return slug && FOTOS_EXISTENTES.has(slug)
    ? `/img/modelos/${slug}${EXT}`
    : `/img/capas/${fallbackCategoria}${EXT}`;
}

/** Foto do modelo a partir do id da collection (ex: "chevrolet/onix/correia-dentada"). */
export function fotoPorId(id: string, fallbackCategoria = 'problemas'): string {
  const key = id.split('/').slice(0, 2).join('/');
  return resolverFoto(MODELO[key], fallbackCategoria);
}

/** Foto do modelo a partir de marca + modelo (ex: home, fichas). */
export function fotoPorModelo(marca: string, modelo: string, fallbackCategoria = 'problemas'): string {
  const key = `${marca}/${modelo}`.toLowerCase().replace(/\s+/g, '-');
  const slug = MODELO[key] ?? Object.entries(MODELO).find(([k]) => key.includes(k.split('/')[1]))?.[1];
  return resolverFoto(slug, fallbackCategoria);
}
