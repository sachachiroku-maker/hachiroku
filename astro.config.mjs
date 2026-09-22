// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { BANNERS, BANNERS_VONIXX } from './src/config/banners.ts';
import { bannerHtmlResponsive } from './src/lib/banner-html.ts';
import { bannerHtmlVonixx } from './src/lib/banner-vonixx-html.ts';

const SITE = 'https://hachiroku.com.br';

/**
 * Cada família de banner tem seu próprio registro de produtos e gerador de
 * HTML (layouts diferentes — ver src/lib/banner-html.ts e
 * banner-vonixx-html.ts). `familia` num slot escolhe qual das duas usar.
 */
const FAMILIAS_BANNER = {
  padrao: { registro: BANNERS, render: bannerHtmlResponsive },
  vonixx: { registro: BANNERS_VONIXX, render: bannerHtmlVonixx },
};

/**
 * Todo silo leva estes banners por padrão, nas posições abaixo — declarar
 * `bannerMeio` (array) no frontmatter de um artigo sobrescreve a lista
 * inteira só para ele; `bannerMeio: false` desativa todos.
 *
 * kit-vonixx (4º H2) ativado em 2026-09-22 com o link real do anúncio.
 */
const DEFAULT_BANNER_SLOTS = [
  { familia: 'padrao', produto: 'astroai-s8', nivel: 'h2', indice: 2 },
  { familia: 'vonixx', produto: 'kit-vonixx', nivel: 'h2', indice: 4 },
];

/**
 * Injeta um ou mais banners de produto antes do N-ésimo heading de nível
 * `nivel` de cada slot, lidos do frontmatter `bannerMeio` (array) de cada
 * entrada de conteúdo — ou de DEFAULT_BANNER_SLOTS quando o artigo não
 * declara nada. Roda no pipeline de markdown (hast), antes do Astro montar
 * a página — por isso é raw HTML, não um componente Astro.
 *
 * `file.data.astro.frontmatter` aqui é o frontmatter CRU (pré-zod): os
 * defaults do schema (`nivel: 'h2'`, `indice: 1`) são replicados abaixo
 * porque o zod ainda não rodou nesta fase.
 *
 * Todos os slots são localizados no tree ORIGINAL antes de qualquer
 * inserção, depois inseridos em ordem decrescente de índice — inserir indo
 * pra frente deslocaria os índices já calculados dos slots seguintes.
 */
function rehypeBannerMeio() {
  return (tree, file) => {
    const raw = file.data?.astro?.frontmatter?.bannerMeio;
    if (raw === false) return; // opt-out explícito deste artigo
    const slots = raw ?? DEFAULT_BANNER_SLOTS;

    const insercoes = [];
    for (const cfg of slots) {
      const familia = FAMILIAS_BANNER[cfg.familia ?? 'padrao'];
      if (!familia) continue; // família inexistente — não quebra o build, só ignora o slot
      const props = familia.registro[cfg.produto];
      if (!props) continue; // produto inexistente no registro da família — idem
      const nivel = cfg.nivel ?? 'h2';
      const alvo = cfg.indice ?? 1;
      let vistos = 0;
      const idx = tree.children.findIndex((node) => {
        if (node.type === 'element' && node.tagName === nivel) {
          vistos += 1;
          return vistos === alvo;
        }
        return false;
      });
      if (idx === -1) continue; // artigo não tem headings suficientes nesse nível — não injeta
      insercoes.push({ idx, html: familia.render(props, cfg.produto) });
    }

    insercoes.sort((a, b) => b.idx - a.idx);
    for (const { idx, html } of insercoes) {
      tree.children.splice(idx, 0, { type: 'raw', value: html });
    }
  };
}

/** @param {string} dir @param {(file: string) => void} cb */
function walkDir(dir, cb) {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walkDir(full, cb);
    else cb(full);
  }
}

// Lê frontmatter das content collections em build-time para injetar lastmod real no sitemap
function buildLastmodMap() {
  const map = new Map();
  const base = path.resolve('./src/content');
  const cols = [
    { dir: 'problemas',  prefix: '/problemas/' },
    { dir: 'fichas',     prefix: '/ficha-tecnica/' },
    { dir: 'guias',      prefix: '/guia-de-compra/' },
    { dir: 'manutencao', prefix: '/manutencao/' },
    { dir: 'eletricos',  prefix: '/eletricos/' },
    { dir: 'tecnico',    prefix: '/tecnico/' },
    { dir: 'revisao',    prefix: '/revisao/' },
    { dir: 'preparacao', prefix: '/preparacao/' },
  ];
  for (const { dir, prefix } of cols) {
    walkDir(path.join(base, dir), (file) => {
      if (!/\.mdx?$/.test(file)) return;
      const txt = fs.readFileSync(file, 'utf8');
      const d = (txt.match(/^updatedDate:\s*(\d{4}-\d{2}-\d{2})/m)
             ?? txt.match(/^pubDate:\s*(\d{4}-\d{2}-\d{2})/m))?.[1];
      if (!d) return;
      const slug = path.relative(path.join(base, dir), file)
        .replace(/\\/g, '/')
        .replace(/\.mdx?$/, '');
      // Astro minúsculiza o slug (há arquivo consumo-oleo-L15B.md servindo
      // /consumo-oleo-l15b/), então a chave do mapa acompanha.
      map.set(`${SITE}${prefix}${slug}/`.toLowerCase(), d);
    });
  }
  // Hubs de modelo (/problemas/{marca}/{modelo}/) não têm arquivo próprio: a página
  // agrega os diagnósticos daquele carro. A data honesta é a do diagnóstico mais
  // recente que ela lista, e não a do build.
  const porModelo = new Map();
  walkDir(path.join(base, 'problemas'), (file) => {
    if (!/\.mdx?$/.test(file)) return;
    const txt = fs.readFileSync(file, 'utf8');
    const d = (txt.match(/^updatedDate:\s*(\d{4}-\d{2}-\d{2})/m)
           ?? txt.match(/^pubDate:\s*(\d{4}-\d{2}-\d{2})/m))?.[1];
    if (!d) return;
    const partes = path.relative(path.join(base, 'problemas'), file).split(path.sep);

    if (partes.length < 3) return;                 // precisa de marca/modelo/arquivo
    const hub = `${SITE}/problemas/${partes[0]}/${partes[1]}/`;
    const atual = porModelo.get(hub);
    if (!atual || d > atual) porModelo.set(hub, d);
  });
  for (const [hub, d] of porModelo) if (!map.has(hub)) map.set(hub, d);

  return map;
}

const lastmodMap = buildLastmodMap();

/**
 * lastmod das páginas que não vêm de content collection.
 *
 * O fallback anterior era `new Date()`, o que carimbava a data do build em 163 das
 * 760 URLs, incluindo a home, /sobre/, /equipe/ e todos os hubs de entidade. O
 * sitemap afirmava que a página tinha mudado naquele dia sempre que o site subia,
 * enquanto o Google não voltava a /sobre/ desde 2026-08-02. Pedir recrawl com um
 * sinal de frescor que o site vinha emitindo falsamente é o oposto do trabalho de
 * identidade que o resto deste repositório está fazendo.
 *
 * Agora a data vem do git, do arquivo que de fato gera a página. Onde o git não
 * responde (clone raso de CI, por exemplo), a propriedade é OMITIDA: sitemap sem
 * lastmod é honesto, sitemap com data inventada não é.
 */
/**
 * Clone raso não serve para datar arquivo. Com profundidade 1 existe um único
 * commit contendo a árvore inteira, e `git log -1 -- arquivo` devolve a data desse
 * commit para QUALQUER arquivo. Na Vercel, que clona raso, isso carimbaria a data
 * do deploy em todas as páginas de novo, e desta vez com aparência de dado real.
 * Detectado aqui, a origem é declarada inutilizável e o lastmod é omitido.
 */
const gitUtilizavel = (() => {
  try {
    const r = execFileSync('git', ['rev-parse', '--is-shallow-repository'], {
      encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
    if (r === 'true') {
      console.warn('[sitemap] repositório raso: lastmod por git desativado, propriedade omitida');
      return false;
    }
    return true;
  } catch {
    return false;
  }
})();

/** @type {Map<string, string|null>} */
const gitDateCache = new Map();
/** @param {string} file @returns {string|null} */
function gitDate(file) {
  if (!gitUtilizavel) return null;
  if (gitDateCache.has(file)) return gitDateCache.get(file) ?? null;
  let out = null;
  try {
    if (fs.existsSync(file)) {
      const r = execFileSync('git', ['log', '-1', '--format=%cs', '--', file], {
        encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'],
      }).trim();
      if (/^\d{4}-\d{2}-\d{2}$/.test(r)) out = r;
    }
  } catch {
    out = null;   // git indisponível: omite, nunca inventa
  }
  gitDateCache.set(file, out);
  return out;
}

/**
 * Arquivo-fonte de uma URL que não é de content collection. Página estática mora
 * em src/pages/<caminho>/index.astro; hub de entidade é gerado a partir da lib que
 * declara a entidade, então é a lib que datar.
 * @param {string} url @returns {string|null}
 */
function fonteDaUrl(url) {
  const rota = url.replace(SITE, '').replace(/^\/|\/$/g, '');
  if (rota === '') return 'src/pages/index.astro';
  if (/^motor\/.+/.test(rota) || /^tecnologia\/.+/.test(rota)) return 'src/lib/entidades.ts';
  if (/^marca\/.+/.test(rota))   return 'src/lib/marcas.ts';
  if (/^sistema\/.+/.test(rota)) return 'src/lib/sistemas.ts';
  const candidatos = [
    `src/pages/${rota}/index.astro`,
    `src/pages/${rota}.astro`,
  ];
  return candidatos.find((c) => fs.existsSync(c)) ?? null;
}


export default defineConfig({
  site: SITE,
  trailingSlash: 'always',
  // Astro 7 mudou o default p/ 'jsx' (colapsa espaço entre elementos irmãos).
  // Mantém o comportamento v6 — site de conteúdo com muito inline HTML no markdown.
  compressHTML: true,
  markdown: {
    rehypePlugins: [rehypeBannerMeio],
  },
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/busca/'),
      serialize(item) {
        const doFrontmatter = lastmodMap.get(item.url.toLowerCase());
        if (doFrontmatter) {
          item.lastmod = doFrontmatter;
        } else {
          const fonte = fonteDaUrl(item.url);
          const d = fonte ? gitDate(fonte) : null;
          if (d) item.lastmod = d;
          else delete item.lastmod;
        }
        if (item.url.includes('/problemas/')) item.priority = 0.9;
        else if (item.url.includes('/guia-de-compra/')) item.priority = 0.8;
        else if (item.url.includes('/eletricos/')) item.priority = 0.8;
        else if (item.url.includes('/ficha-tecnica/')) item.priority = 0.7;
        else if (item.url.includes('/manutencao/')) item.priority = 0.7;
        return item;
      },
    }),
    // Expõe o índice de sitemap também em /sitemap.xml (URL canônica esperada
    // pelo Search Console e pelo robots.txt). Roda após o @astrojs/sitemap,
    // quando sitemap-index.xml já foi escrito no diretório de saída.
    {
      name: 'hachiroku:sitemap-alias',
      hooks: {
        'astro:build:done': ({ dir, logger }) => {
          const indexFile = new URL('sitemap-index.xml', dir);
          const aliasFile = new URL('sitemap.xml', dir);
          if (fs.existsSync(indexFile)) {
            fs.copyFileSync(indexFile, aliasFile);
            logger.info('sitemap.xml criado (alias de sitemap-index.xml)');
          } else {
            logger.warn('sitemap-index.xml não encontrado — /sitemap.xml não gerado');
          }
        },
      },
    },
  ],
  redirects: {
    // 404s identificadas em auditoria 2026-06-26
    '/problemas/citro%C3%ABn/c3/':             { destination: '/problemas/citroen/c3/',              status: 301 },
    '/problemas/citro%C3%ABn/c4/':             { destination: '/problemas/citroen/c4/',              status: 301 },
    '/problemas/byd/song-plus-ev/':            { destination: '/problemas/byd/song-plus/',           status: 301 },
    '/problemas/mitsubishi/l200-triton-sport/':{ destination: '/problemas/mitsubishi/l200-triton/',  status: 301 },
    '/problemas/volvo/c40-recharge/':          { destination: '/problemas/',                         status: 301 },
    // Consolidação /eletricos flat → marca/modelo (roll-call squads 2026-07-01)
    '/eletricos/byd-dolphin/':                 { destination: '/eletricos/byd/dolphin/',             status: 301 },
    '/eletricos/byd-seal-brasil/':             { destination: '/eletricos/byd/seal/',                status: 301 },
    '/eletricos/hyundai-ioniq-5/':             { destination: '/eletricos/hyundai/ioniq-5/',         status: 301 },
    // Dedup /manutencao (roll-call squads 2026-07-01)
    '/manutencao/como-calibrar-pneus/':                       { destination: '/manutencao/calibragem-de-pneus/', status: 301 },
    '/manutencao/como-calibrar-pneus-correto/':               { destination: '/manutencao/calibragem-de-pneus/', status: 301 },
    '/manutencao/como-trocar-filtro-ar-motor/':               { destination: '/manutencao/como-trocar-filtro-de-ar/', status: 301 },
    '/manutencao/como-trocar-filtro-combustivel/':            { destination: '/manutencao/como-trocar-filtro-de-combustivel/', status: 301 },
    '/manutencao/como-trocar-oleo-motor-carro/':              { destination: '/manutencao/como-trocar-oleo-motor/', status: 301 },
    '/manutencao/como-verificar-bateria-carro/':              { destination: '/manutencao/como-verificar-e-trocar-bateria/', status: 301 },
    '/manutencao/como-verificar-fluido-arrefecimento/':       { destination: '/manutencao/fluido-arrefecimento-como-checar/', status: 301 },
    '/manutencao/como-verificar-nivel-fluido-arrefecimento/': { destination: '/manutencao/fluido-arrefecimento-como-checar/', status: 301 },
    '/manutencao/verificar-nivel-oleo-motor/':                { destination: '/manutencao/como-verificar-nivel-oleo-motor/', status: 301 },
    '/manutencao/como-verificar-oleo-do-motor/':              { destination: '/manutencao/como-verificar-nivel-oleo-motor/', status: 301 },
    '/manutencao/como-substituir-pastilhas-freio/':           { destination: '/manutencao/como-trocar-pastilhas-freio/', status: 301 },
    '/manutencao/quando-trocar-amortecedores/':               { destination: '/manutencao/quando-trocar-amortecedor/', status: 301 },
    '/manutencao/sinais-alternador-com-problema/':            { destination: '/manutencao/alternador-falhando-sinais/', status: 301 },
    '/manutencao/como-higienizar-ar-condicionado/':           { destination: '/manutencao/higienizacao-ar-condicionado-automotivo/', status: 301 },
    '/manutencao/como-limpar-injetores-combustivel/':         { destination: '/manutencao/como-limpar-bicos-injetores/', status: 301 },
    '/manutencao/guia-scanner-obd2-como-usar/':               { destination: '/manutencao/scanner-obd2/', status: 301 },
    '/manutencao/como-trocar-velas-de-ignicao/':              { destination: '/manutencao/troca-de-velas/', status: 301 },
    '/manutencao/como-trocar-correia-dentada/':               { destination: '/manutencao/correia-dentada-quando-trocar/', status: 301 },
    '/manutencao/como-trocar-bobine-ignicao/':                { destination: '/manutencao/como-trocar-bobina-ignicao/', status: 301 },
    '/manutencao/como-desembaclar-vidros/':                   { destination: '/manutencao/como-desembacar-vidros/', status: 301 },
    // Despublicados por QA E.E.A.T.S. (2026-07-01): corpo vazio + defeito CVT inexistente no Onix
    '/problemas/gwm/haval-h6/transmissao-dct-solavanco/': { destination: '/problemas/gwm/haval-h6/cambio-7dct-solavanco/', status: 301 },
    '/problemas/chevrolet/onix/transmissao-cvt-superaquecimento/': { destination: '/problemas/chevrolet/onix/', status: 301 },
    // Batch 25/jun despublicado por QA E.E.A.T.S. (thin content) — 2026-07-01
    '/problemas/chevrolet/onix/consumo-alto-combustivel-automatico/': { destination: '/problemas/chevrolet/onix/', status: 301 },
    '/problemas/chevrolet/tracker/falha-transmissao-cvt/': { destination: '/problemas/chevrolet/tracker/cambio-automatico-trancos/', status: 301 },
    '/problemas/hyundai/hb20/cambio-cvt-falha/': { destination: '/problemas/hyundai/hb20/cambio-automatico-trancos/', status: 301 },
    '/problemas/volkswagen/tiguan-allspace/cambio-dsg7-tranco-solavanco/': { destination: '/problemas/volkswagen/tiguan-allspace/', status: 301 },
    // Dedup intra-pasta câmbio (2026-07-01)
    '/problemas/gwm/haval-h6/cambio-automatico-solavanco/': { destination: '/problemas/gwm/haval-h6/cambio-7dct-solavanco/', status: 301 },
    '/problemas/honda/wr-v/cambio-cvt-patinacao/': { destination: '/problemas/honda/wr-v/cambio-cvt-patinando/', status: 301 },
    '/problemas/honda/wr-v/cambio-cvt-solavanco/': { destination: '/problemas/honda/wr-v/cambio-cvt-patinando/', status: 301 },
    '/ficha-tecnica/mitsubishi/outlander-3-0-v6/': { destination: '/ficha-tecnica/mitsubishi/outlander-v6-3-0/', status: 301 },
    // Despublicados por fact-check (motor alucinado): Logan TCe, Rampage 1.3 — 2026-07-02
    '/problemas/renault/logan/motor-tce-consumo-oleo/': { destination: '/problemas/renault/logan/motor-sce-consumo-oleo/', status: 301 },
    '/problemas/renault/logan/motor-tce-barulho-frio/': { destination: '/problemas/renault/logan/motor-sce-barulho-frio/', status: 301 },
    // Fact-check motores rodada 2 (2026-07-02): corpos sobre motor inexistente + renames Spin
    '/problemas/fiat/strada/motor-etorq-consumo-oleo/': { destination: '/problemas/fiat/strada/motor-firefly-consumo-oleo/', status: 301 },
    '/problemas/chevrolet/spin/motor-etorq-consumo-oleo/': { destination: '/problemas/chevrolet/spin/motor-ecotec-consumo-oleo/', status: 301 },
    '/problemas/chevrolet/spin/superaquecimento-etorq/': { destination: '/problemas/chevrolet/spin/superaquecimento-motor-1-8/', status: 301 },
    '/problemas/hyundai/creta/transmissao-cvt-solavanco/': { destination: '/problemas/hyundai/creta/cambio-7dct-trepidacao/', status: 301 },
    // Paridade com vercel.json (regras que só existiam no edge)
    '/problemas/honda/hrv/':                   { destination: '/problemas/honda/hr-v/',              status: 301 },
    '/problemas/volkswagen/tiguan/':           { destination: '/problemas/volkswagen/tiguan-allspace/', status: 301 },
    '/problemas/volvo/':                       { destination: '/problemas/',                         status: 301 },
    '/problemas/honda/civic/sistema-el%C3%A9trico-falha/': { destination: '/problemas/honda/civic/sistema-eletrico-falha/', status: 301 },
    '/problemas/citroen/c4/cambio-eat8-solavanco/': { destination: '/problemas/citroen/c4/cambio-eat6-solavanco/', status: 301 },
    '/problemas/peugeot/3008/cambio-eat8-solavanco/': { destination: '/problemas/peugeot/3008/cambio-eat6-solavanco/', status: 301 },
    '/ficha-tecnica/ram/rampage-rebel-1-3-t270/': { destination: '/ficha-tecnica/ram/rampage-rebel-2-2-turbodiesel/', status: 301 },
    '/problemas/hyundai/hb20/cambio-cvt-ruido/': { destination: '/problemas/hyundai/hb20/cambio-automatico-trancos/', status: 301 },
    '/problemas/volkswagen/gol/cambio-getrag-085-manutencao/': { destination: '/problemas/volkswagen/gol/cambio-manual-dificil-engatar/', status: 301 },
  },
  build: {
    inlineStylesheets: 'auto',
  },
});
