import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

const SITE = 'https://hachiroku.com.br';

export async function GET(context) {
  // Coleta todos os artigos publicáveis das collections de conteúdo
  const colecoes = [
    ['problemas', '/problemas/'],
    ['manutencao', '/manutencao/'],
    ['guias', '/guia-de-compra/'],
    ['eletricos', '/eletricos/'],
  ];

  const itens = [];
  for (const [nome, base] of colecoes) {
    const entries = await getCollection(nome, ({ data }) => !data.draft);
    for (const e of entries) {
      itens.push({
        title: e.data.title,
        description: e.data.description ?? e.data.veredito ?? '',
        link: `${base}${e.id}/`,
        pubDate: e.data.updatedDate ?? e.data.pubDate ?? new Date(2026, 5, 18),
      });
    }
  }

  // Mais recentes primeiro
  itens.sort((a, b) => new Date(b.pubDate).valueOf() - new Date(a.pubDate).valueOf());

  return rss({
    title: 'Hachiroku — O Seu Mecânico Digital',
    description: 'Diagnóstico de defeitos crônicos, manutenção, compra de usados e carros elétricos. Soluções automotivas de precisão.',
    site: context.site ?? SITE,
    items: itens,
    customData: '<language>pt-br</language>',
  });
}
