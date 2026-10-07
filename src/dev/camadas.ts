/**
 * Registro das camadas de página do Hachiroku.
 *
 * Fonte da verdade da arquitetura de templates: cada rota de src/pages pertence a
 * exatamente um template, e cada template a uma camada. A camada é definida pela
 * FUNÇÃO da página, não pela profundidade da URL: /problemas/chevrolet/onix/ está no
 * 3º nível de URL, mas é hub (agrega diagnósticos), então mora na camada 2.
 *
 * Consumido por src/dev/camadas.astro (mapa visual, só em `astro dev`) e espelhado
 * em docs/CAMADAS-DE-PAGINA.md. Ao criar ou remover uma rota, atualize os dois.
 *
 * `fonte` diz como a página de mapa conta as páginas reais e escolhe um exemplo —
 * a contagem é calculada das content collections e das libs de entidade, nunca
 * digitada aqui.
 */

export type Fonte =
  | { tipo: 'fixas'; urls: string[] }
  | { tipo: 'colecao'; colecao: 'problemas' | 'manutencao' | 'guias' | 'fichas' | 'eletricos' | 'tecnico' | 'revisao' | 'preparacao'; prefixo: string; preferir?: string }
  | { tipo: 'entidades' };

export interface Template {
  id: string;
  nome: string;
  papel: string;
  rota: string;
  arquivos: string[];
  schema: string;
  /** Blocos na ordem em que aparecem na página, com a classe CSS que os estiliza. */
  blocos: string[];
  /** Diferenças de anatomia dentro do mesmo template (variantes por silo). */
  variantes?: string[];
  fonte: Fonte;
}

export interface Camada {
  numero: 0 | 1 | 2 | 3 | 4;
  nome: string;
  resumo: string;
  templates: Template[];
}

export const CAMADAS: Camada[] = [
  {
    numero: 1,
    nome: 'Raiz',
    resumo: 'A home. Única página que fala com todos os públicos e distribui para os silos.',
    templates: [
      {
        id: 'T1.1',
        nome: 'Home',
        papel: 'Porta de entrada: busca de diagnóstico, os 5 silos principais e os defeitos crônicos em destaque.',
        rota: '/',
        arquivos: ['src/pages/index.astro'],
        schema: 'WebSite + Organization + SiteNavigationElement (SchemaSite, via BaseLayout)',
        blocos: [
          'Hero escuro — .hero-home: Eyebrow, h1 .hero-h1 com .redline, .hero-search, .hero-stats (4× StatBlock)',
          'Seção 01 "Por onde começar" — .silo-grid com 5× .silo-card (ícone + título + linha)',
          'Seção 02 "Defeitos crônicos por modelo" — .chronic-grid com 11× .chronic-card (Photo + Badge + h3)',
          'Teaser EV — .ev-teaser escuro (texto + Photo + botão)',
        ],
        fonte: { tipo: 'fixas', urls: ['/'] },
      },
    ],
  },
  {
    numero: 2,
    nome: 'Institucional e hubs',
    resumo: 'Páginas que sustentam a identidade (quem somos, quem escreve) e páginas que seguram e distribuem conteúdo (hubs de silo e hubs de entidade).',
    templates: [
      {
        id: 'T2.1',
        nome: 'Institucional (quem somos / autoria)',
        papel: 'Identidade e E-E-A-T. /equipe/ é a página de autor: toda folha de conteúdo linka o nome do autor para ela.',
        rota: '/sobre/ · /equipe/',
        arquivos: ['src/pages/sobre/index.astro', 'src/pages/equipe/index.astro'],
        schema: 'Só o grafo global (SchemaSite)',
        blocos: [
          'article.prose — p.kicker, h1.article-title, p.lead',
          'Seções em h2 com parágrafos e listas',
          'p.disclaimer (só em /sobre/)',
        ],
        variantes: ['Não existe página de autor individual: a assinatura é coletiva ("Equipe Técnica Hachiroku").'],
        fonte: { tipo: 'fixas', urls: ['/sobre/', '/equipe/'] },
      },
      {
        id: 'T2.2',
        nome: 'Hub de silo (índice)',
        papel: 'Lista toda a coleção de um silo ou de um tipo de entidade em cards. É o nó de agregação de cada seção.',
        rota: '/{silo}/',
        arquivos: [
          'src/pages/problemas/index.astro', 'src/pages/manutencao/index.astro', 'src/pages/guia-de-compra/index.astro',
          'src/pages/ficha-tecnica/index.astro', 'src/pages/eletricos/index.astro', 'src/pages/tecnico/index.astro',
          'src/pages/revisao/index.astro', 'src/pages/preparacao/index.astro', 'src/pages/marca/index.astro',
          'src/pages/motor/index.astro', 'src/pages/tecnologia/index.astro', 'src/pages/sistema/index.astro',
        ],
        schema: 'BreadcrumbList + CollectionPage (+ ItemList em /motor/, /marca/, /tecnologia/, /sistema/, /preparacao/)',
        blocos: [
          'section.hero — p.kicker, h1, p.tagline (padding via style inline)',
          'section.page-intro — parágrafo de contexto (só /problemas/, /revisao/, /tecnico/, /marca/)',
          'section.silos — N× a.silo-card (h2 + linha)',
          'SiloCta — faixa escura de fechamento com busca (não aparece em /motor/, /tecnologia/, /sistema/, /preparacao/)',
        ],
        variantes: [
          '/marca/: filtro de texto + logos das marcas (.marca-grid, .marca-card) e <style> local',
          '/preparacao/: cards agrupados por tipo, com bloco .prose de abertura e de fechamento',
          '/motor/, /tecnologia/, /sistema/: breadcrumb abaixo do hero + bloco .prose explicativo',
        ],
        fonte: { tipo: 'fixas', urls: ['/problemas/', '/manutencao/', '/guia-de-compra/', '/ficha-tecnica/', '/eletricos/', '/tecnico/', '/revisao/', '/preparacao/', '/marca/', '/motor/', '/tecnologia/', '/sistema/'] },
      },
      {
        id: 'T2.3',
        nome: 'Hub de entidade (detalhe)',
        papel: 'Agrega diagnósticos em torno de UMA entidade: um modelo, uma marca, um motor, uma tecnologia ou um sistema mecânico.',
        rota: '/problemas/{marca}/{modelo}/ · /marca/{slug}/ · /motor/{slug}/ · /tecnologia/{slug}/ · /sistema/{slug}/',
        arquivos: [
          'src/pages/problemas/[marca]/[modelo]/index.astro', 'src/pages/marca/[slug].astro',
          'src/components/EntidadeHub.astro (motor + tecnologia)', 'src/pages/sistema/[slug].astro',
        ],
        schema: 'BreadcrumbList + CollectionPage + ItemList (+ Brand em marca, + FAQPage em marca e sistema)',
        blocos: [
          'article.prose — nav.breadcrumb, p.kicker, h1.article-title, p.lead',
          'Contexto opcional (.modelo-contexto no modelo, .lead-rico na marca)',
          'Capa Photo (só hub de modelo)',
          '.defeito-grid — N× .defeito-card (Badge + h2 + lista ou descrição)',
          'nav.modelo-xlinks — ficha técnica / guia / motores relacionados',
          'dl.faq (marca e sistema, quando a lib declara FAQ)',
        ],
        fonte: { tipo: 'entidades' },
      },
    ],
  },
  {
    numero: 3,
    nome: 'Conteúdo (folhas)',
    resumo: 'Os artigos. Onde está o tráfego orgânico e onde entra o banner de cotação de seguro auto (antes do 1º e do 3º H2 e no fim do corpo; no ar só com quem atende definido em src/config/cotacao-seguro.ts).',
    templates: [
      {
        id: 'T3.1',
        nome: 'Diagnóstico de defeito',
        papel: 'O template carro-chefe: um defeito de um modelo, com causa, custo e peça. Único com barra lateral.',
        rota: '/problemas/{marca}/{modelo}/{defeito}/',
        arquivos: ['src/pages/problemas/[...slug].astro', 'src/components/schema/SchemaProblema.astro'],
        schema: 'TechArticle + HowTo + FAQPage + BreadcrumbList',
        blocos: [
          '.article-layout (2 colunas) → article.prose',
          'nav.breadcrumb → header: p.kicker, h1.article-title, .article-meta (autor → /equipe/, data)',
          'p.lead → aside.resumo-rapido ("Em resumo") → Photo .artigo-capa → Toc',
          'Corpo markdown (+ banner de seguro antes do 1º e 3º H2 e no fim)',
          'dl.faq → p.disclaimer → section.referencias',
          '3× nav.relacionados: "Continue o diagnóstico", "Faça a manutenção certa", "Outros problemas do modelo"',
          'aside.article-sidebar: .side-card mini-ficha (.side-spec), .side-entidades, .side-news',
        ],
        fonte: { tipo: 'colecao', colecao: 'problemas', prefixo: '/problemas/', preferir: 'chevrolet/onix/' },
      },
      {
        id: 'T3.2',
        nome: 'Manutenção (how-to)',
        papel: 'Tutorial passo a passo com tempo, dificuldade, ferramentas e materiais.',
        rota: '/manutencao/{slug}/',
        arquivos: ['src/pages/manutencao/[...slug].astro', 'src/components/schema/SchemaHowTo.astro'],
        schema: 'Article + HowTo (HowToStep, HowToTool, HowToSupply) + FAQPage + BreadcrumbList',
        blocos: [
          'article.prose — nav.breadcrumb, header (kicker, h1, .article-meta), p.lead',
          'Photo .artigo-capa (capa fixa /img/capas/manutencao.webp)',
          'dl.howto-meta — tempo / dificuldade / custo',
          'Corpo markdown → section.ferramentas (2 listas) → ol.passos',
          'dl.faq → p.disclaimer → nav.relacionados',
        ],
        fonte: { tipo: 'colecao', colecao: 'manutencao', prefixo: '/manutencao/' },
      },
      {
        id: 'T3.3',
        nome: 'Guia de compra',
        papel: 'Vale a pena comprar? Veredito no lead, checklist de inspeção, comparativos.',
        rota: '/guia-de-compra/{slug}/ (inclui /guia-de-compra/comparativos/{slug}/)',
        arquivos: ['src/pages/guia-de-compra/[...slug].astro', 'src/components/schema/SchemaGuia.astro'],
        schema: 'Article + ItemList + FAQPage + BreadcrumbList',
        blocos: [
          'article.prose — nav.breadcrumb, header (kicker, h1, .article-meta)',
          'p.lead com o veredito → Photo .artigo-capa → Toc',
          'Corpo markdown → ul.checklist (itens críticos em .crit)',
          'dl.faq → p.disclaimer → nav.relacionados',
        ],
        fonte: { tipo: 'colecao', colecao: 'guias', prefixo: '/guia-de-compra/', preferir: 'usado-vale-a-pena' },
      },
      {
        id: 'T3.4',
        nome: 'Ficha técnica',
        papel: 'Dado puro de uma versão/ano: KPIs, tabelas por grupo e botão para os problemas do modelo.',
        rota: '/ficha-tecnica/{marca}/{versao}/',
        arquivos: ['src/pages/ficha-tecnica/[...slug].astro', 'src/components/schema/SchemaFicha.astro'],
        schema: 'TechArticle + FAQPage + BreadcrumbList',
        blocos: [
          'section.ficha-hero escuro — .breadcrumb-dark, Eyebrow, h1.ficha-h1, .ficha-badges, botão "Ver problemas"',
          '.article-meta (autor + data, com style inline) → Photo .ficha-foto',
          'article.ficha-body — .ficha-kpis (4× StatBlock) → .ficha-texto (corpo markdown)',
          '.ficha-specs-grid — até 6× .spec-card com table.spec-table',
          'p.fonte-dados (2×) → dl.faq → nav.relacionados',
        ],
        fonte: { tipo: 'colecao', colecao: 'fichas', prefixo: '/ficha-tecnica/', preferir: 'onix' },
      },
      {
        id: 'T3.5',
        nome: 'Elétricos',
        papel: 'Vertical EV: um modelo elétrico ou um tema transversal (recarga, autonomia, custo).',
        rota: '/eletricos/{slug}/ · /eletricos/{marca}/{modelo}/',
        arquivos: ['src/pages/eletricos/[...slug].astro', 'src/components/schema/SchemaEV.astro'],
        schema: 'TechArticle + FAQPage + BreadcrumbList',
        blocos: [
          'article.prose — nav.breadcrumb, header (kicker, h1, .article-meta), p.lead',
          'Photo .artigo-capa → Toc → corpo markdown',
          'dl.faq → p.disclaimer → nav.relacionados',
        ],
        fonte: { tipo: 'colecao', colecao: 'eletricos', prefixo: '/eletricos/', preferir: 'byd/' },
      },
      {
        id: 'T3.6',
        nome: 'Técnico (como funciona)',
        papel: 'Explicação de um sistema ou componente, sem modelo específico.',
        rota: '/tecnico/{slug}/',
        arquivos: ['src/pages/tecnico/[slug].astro'],
        schema: 'TechArticle + FAQPage + BreadcrumbList (inline na página)',
        blocos: [
          'article.prose — nav.breadcrumb (começa em Início), header: kicker, h1, p.lead em <strong>',
          'Corpo markdown (sem capa, sem Toc, sem autor/data visíveis)',
          'FAQ em div.faq-item (h3 + p) → nav "Leia também" com h2',
        ],
        fonte: { tipo: 'colecao', colecao: 'tecnico', prefixo: '/tecnico/' },
      },
      {
        id: 'T3.7',
        nome: 'Revisão (tabela por km)',
        papel: 'Plano de revisão de um modelo por quilometragem, com custo estimado.',
        rota: '/revisao/{slug}/',
        arquivos: ['src/pages/revisao/[slug].astro'],
        schema: 'HowTo (um HowToStep por faixa de km) + FAQPage + BreadcrumbList (inline)',
        blocos: [
          'article.prose — nav.breadcrumb (começa em Início), header: kicker, h1, p.lead em <strong>',
          'Tabela de revisão: um <details>/<summary> por faixa de km',
          'Corpo markdown → FAQ em div.faq-item → nav "Leia também"',
        ],
        fonte: { tipo: 'colecao', colecao: 'revisao', prefixo: '/revisao/' },
      },
      {
        id: 'T3.8',
        nome: 'Preparação',
        papel: 'Projeto de potência: declara motor, combustível, pressão e internos antes de qualquer número.',
        rota: '/preparacao/{slug}/',
        arquivos: ['src/pages/preparacao/[...slug].astro'],
        schema: 'Article + FAQPage + BreadcrumbList (inline)',
        blocos: [
          'article.prose — nav.breadcrumb (começa no silo), header (kicker, h1, .article-meta), p.lead',
          'Figura com crédito/licença (ou Photo de fallback)',
          'dl.howto-meta como ficha de qualificação → section.resumo ("Em resumo")',
          'Corpo markdown → galeria de Figura → dl.faq → section.referencias → nav.relacionados',
        ],
        fonte: { tipo: 'colecao', colecao: 'preparacao', prefixo: '/preparacao/' },
      },
    ],
  },
  {
    numero: 4,
    nome: 'Legal e utilitárias',
    resumo: 'Páginas obrigatórias ou de serviço: não disputam busca, mas toda página do site aponta para elas pelo rodapé.',
    templates: [
      {
        id: 'T4.1',
        nome: 'Legal / transparência',
        papel: 'Privacidade, cookies, termos, afiliados e isenção numa página só, com âncoras; créditos e licenças de imagem.',
        rota: '/politicas/ (#privacidade #cookies #termos #afiliados #isencao) · /creditos/',
        arquivos: ['src/pages/politicas/index.astro', 'src/pages/creditos/index.astro'],
        schema: 'Só o grafo global (SchemaSite)',
        blocos: [
          'article.prose — (breadcrumb só em /creditos/), p.kicker, h1.article-title, p.lead',
          'Seções h2 com id âncora (o rodapé linka cada âncora)',
          'Tabelas (cookies em /politicas/, .creditos-table em /creditos/)',
        ],
        fonte: { tipo: 'fixas', urls: ['/politicas/', '/creditos/'] },
      },
      {
        id: 'T4.2',
        nome: 'Busca',
        papel: 'Pagefind + correção de intenção (léxico próprio). noindex e fora do sitemap.',
        rota: '/busca/',
        arquivos: ['src/pages/busca/index.astro', 'src/lib/busca-lexico.ts'],
        schema: 'Só o grafo global; meta robots noindex, follow',
        blocos: [
          'section.prose.busca-page — kicker, h1, campo de busca',
          'Pesquisas populares → Explorar por silo',
        ],
        variantes: ['O índice do Pagefind só existe depois de `npm run build`: no `astro dev` a busca não devolve resultado.'],
        fonte: { tipo: 'fixas', urls: ['/busca/'] },
      },
      {
        id: 'T4.3',
        nome: 'Erro 404',
        papel: 'Rota inexistente: volta ao início, à busca ou aos 5 silos.',
        rota: '/404.html',
        arquivos: ['src/pages/404.astro'],
        schema: 'Só o grafo global',
        blocos: ['section.erro-404 escura (<style> local) — código, h1, 2 botões, atalhos dos silos'],
        fonte: { tipo: 'fixas', urls: ['/rota-que-nao-existe/'] },
      },
    ],
  },
];

/** Camada 0: o que envolve TODAS as páginas. Mudar aqui muda o site inteiro. */
export const CASCA = {
  layout: 'src/layouts/BaseLayout.astro',
  blocos: [
    'Faixa utilitária — .utility-bar ("Independente · sem verba de montadora")',
    'Cabeçalho — .header-main: logo claro/escuro, menu hambúrguer (checkbox), nav .site-nav (6 itens), busca .header-search, alternador de tema',
    '<main id="conteudo"> — o slot onde cada template entra',
    'Rodapé escuro — .site-footer: marca + 4 colunas (Conteúdo, Por sistema, Por tema, Hachiroku) + linha legal com âncoras',
    'Banner de cookies — Cookies.astro (o GA4 só carrega depois do aceite)',
  ],
  estilos: [
    'src/styles/tokens/fonts.css — Saira (display), IBM Plex Sans (texto), IBM Plex Mono (dados)',
    'src/styles/tokens/colors.css — escalas asphalt / redline / amber / green / beam + tokens semânticos, claro e escuro',
    'src/styles/tokens/typography.css, spacing.css — escala tipográfica, espaçamento, raio, sombra, containers',
    'src/styles/tokens/base.css — reset leve',
    'src/styles/site.css — todas as classes de template (.hero, .silo-card, .prose, .defeito-card, .ficha-*, .side-card…)',
  ],
};
