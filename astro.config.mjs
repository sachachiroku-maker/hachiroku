// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import fs from 'node:fs';
import path from 'node:path';

const SITE = 'https://hachiroku.com.br';

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
      map.set(`${SITE}${prefix}${slug}/`, d);
    });
  }
  return map;
}

const lastmodMap = buildLastmodMap();

export default defineConfig({
  site: SITE,
  trailingSlash: 'always',
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/busca/'),
      serialize(item) {
        item.lastmod = lastmodMap.get(item.url) ?? new Date().toISOString().slice(0, 10);
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
  },
  build: {
    inlineStylesheets: 'auto',
  },
});
