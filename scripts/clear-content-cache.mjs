// Apaga o cache do Content Layer do Astro (node_modules/.astro/data-store.json)
// antes de todo build. Esse cache é chaveado pelo arquivo de conteúdo, não
// pelas dependências transitivas do pipeline de markdown — mudar um rehype
// plugin (ex: rehypeBannerMeio em astro.config.mjs) ou um módulo que ele
// importa (src/config/banners.ts, src/lib/banner-html.ts) NÃO invalida o
// cache, então o build serve HTML antigo em silêncio, sem erro. Reproduzido
// tanto local quanto no build da Vercel (que reaproveita node_modules entre
// deploys) em 2026-09-21/22. `rm -rf` não roda em todo shell do Windows;
// isso é Node puro, funciona em qualquer SO.
import { rmSync } from 'node:fs';

rmSync('node_modules/.astro', { recursive: true, force: true });
