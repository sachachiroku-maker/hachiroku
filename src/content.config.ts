import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * Hachiroku — Content Collections (Astro 5 Content Layer API).
 * Cada modelo de carro vira entradas tipadas; o frontmatter alimenta
 * tanto o E.E.A.T.S. (entidade nomeada, entity set) quanto o Schema.org
 * (Article + HowTo + FAQPage), gerado por componentes a partir destes campos.
 */

// Sub-schemas reutilizáveis
const faqItem = z.object({
  pergunta: z.string(),
  resposta: z.string(),
});

const howtoStep = z.object({
  nome: z.string(),
  texto: z.string(),
});

const afiliado = z.object({
  produto: z.string(),
  nota: z.string().optional(),                                  // por que recomendamos (contexto)
  busca: z.string().optional(),                                 // termo de busca afiliada (fallback)
  url: z.string().url().optional(),                             // link direto de afiliado (preferir sempre)
  preco: z.string().optional(),                                 // preço observado + data da coleta
  programa: z.enum(['amazon', 'mercadoLivre', 'pneuStore']).default('amazon'),
  cta: z.string().default('Ver peça recomendada'),
}).refine((a) => Boolean(a.url || a.busca), {
  message: 'Bloco de afiliado precisa de `url` (link direto, preferido) ou `busca` (fallback).',
});

const link = z.object({
  titulo: z.string(),
  url: z.string(),
});

/**
 * Banner de produto injetado no meio do corpo do artigo, antes do N-ésimo
 * heading de um nível (ver src/lib/rehype-banner-meio.mjs). `produto` é a
 * chave em src/config/banners.ts — trocar o produto exibido é editar o
 * registro lá, nunca hardcode aqui. `indice` é 1-based ("2" = antes do
 * segundo H2 do corpo).
 */
const bannerMeio = z.object({
  produto: z.string(),
  nivel: z.enum(['h2', 'h3', 'h4']).default('h2'),
  indice: z.number().int().min(1).default(1),
});

/**
 * Referência do bloco "Referências" (fim do artigo).
 * `url` é OPCIONAL de propósito: nem toda fonte precisa receber link.
 * Citar canal, fórum ou levantamento próprio pelo nome já estabelece procedência
 * e relação de entidade, que é o que motor de busca e motor generativo leem.
 * O link é sinal de confiança, não requisito de atribuição.
 */
const referencia = z.object({
  titulo: z.string(),
  url: z.string().url().optional(),
  autor: z.string().optional(),     // canal, fórum, veículo
  data: z.string().optional(),      // ex: "mar/2026"
});

/**
 * Imagem com crédito obrigatório.
 * O site não publica foto sem procedência: `credito` é exigido pelo schema, e
 * `licenca` + `fonteUrl` fecham a atribuição de material sob Creative Commons.
 * Sem isso, a foto é passivo jurídico e ruído de E-E-A-T ao mesmo tempo.
 */
const imagemCreditada = z.object({
  src: z.string(),                  // caminho local (ex: /img/preparacao/x.webp)
  alt: z.string(),                  // texto alternativo descritivo
  largura: z.number().int().positive(),
  altura: z.number().int().positive(),
  legenda: z.string().optional(),   // o que a foto mostra, na voz do artigo
  credito: z.string(),              // autor da foto
  fonteUrl: z.string().url().optional(),   // página do arquivo na origem
  licenca: z.string().optional(),          // ex: "CC BY-SA 4.0"
  licencaUrl: z.string().url().optional(),
});

/**
 * Assinatura editorial. `nome` é `z.enum` de propósito, e não `z.string()`.
 *
 * O corpus chegou a ter quatro grafias em circulação (547 "Redação Hachiroku",
 * 69 sem acento, 8 "Equipe Técnica Hachiroku" e 1 com mojibake servido ao vivo),
 * o que produzia quatro autores distintos no JSON-LD de 624 páginas. Atribuição
 * dividida fecha o portão 4 da citação: a máquina não sabe quem afirma.
 *
 * Travar aqui torna a divergência impossível de voltar por descuido: grafia fora
 * da lista não compila. Autor nomeado no futuro entra somando à lista, numa
 * decisão explícita, nunca por digitação em frontmatter.
 */
const AUTORES = ['Redação Hachiroku'] as const;

const autorEditorial = z.object({
  nome: z.enum(AUTORES),
  credencial: z.string().optional(),      // ex: "Engenheiro mecânico"
  sameAs: z.string().url().optional(),    // perfil próprio, quando existir
});

// SILO 1 — /problemas/{marca}/{modelo}/{defeito}/
const problemas = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/problemas' }),
  schema: () =>
    z.object({
      // --- Entity Lock-in (camada 1) ---
      title: z.string(),                       // H1
      seoTitle: z.string().optional(),
      h1: z.string().optional(),               // override do H1 se diferir do title
      description: z.string(),                  // meta description + resumo citável
      entidade: z.object({                     // entidade principal nomeada
        marca: z.string(),
        modelo: z.string(),
        motor: z.string().optional(),
        geracao: z.string().optional(),
      }),
      defeito: z.string(),                      // entidade do defeito (ex: "correia dentada")

      // --- editorial / motorsport casing ---
      kicker: z.string().default('DEFEITO CRÔNICO · ALTA INTENÇÃO'),
      intencao: z.string().optional(),          // intenção dominante

      // --- Essential Entity Set (camada 2) ---
      entidadesEssenciais: z.array(z.string()).default([]),

      // --- GEO/AEO: resposta rápida citável + fontes verificáveis ---
      pontosChave: z.array(z.string()).default([]),   // → bloco "Em resumo" (TL;DR)
      fontes: z.array(link).default([]),              // → bloco "Referências" (E-E-A-T)

      // --- E-E-A-T (YMYL) ---
      autor: autorEditorial,
      pubDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      disclaimer: z.string().optional(),        // YMYL — tutoriais críticos

      // --- mídia (foto original + legenda semântica) ---
      imagem: z.string().optional(),
      imagemAlt: z.string().optional(),

      // --- blocos estruturados que viram Schema ---
      faq: z.array(faqItem).default([]),        // → FAQPage
      passos: z.array(howtoStep).default([]),   // → HowTo
      afiliados: z.array(afiliado).default([]), // → <aside> contextual
      relacionados: z.array(link).default([]),  // links internos (cross-silo)

      // --- controle ---
      draft: z.boolean().default(false),
    }),
});

// SILO 4 — /ficha-tecnica/{marca}/{modelo}/{ano}/{versao}/  (entity page: Product + Vehicle)
const fichas = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/fichas' }),
  schema: () =>
    z.object({
      title: z.string(),
      seoTitle: z.string().optional(),
      description: z.string(),
      marca: z.string(),
      modelo: z.string(),
      versao: z.string(),
      ano: z.number(),
      geracao: z.string().optional(),
      carroceria: z.string().optional(),        // hatch, sedã
      kicker: z.string().default('FICHA TÉCNICA · DADOS REAIS'),

      // grupos de specs (cada item: rótulo + valor + nota opcional)
      motor: z.array(z.object({ k: z.string(), v: z.string() })).default([]),
      transmissao: z.array(z.object({ k: z.string(), v: z.string() })).default([]),
      desempenho: z.array(z.object({ k: z.string(), v: z.string() })).default([]),
      consumo: z.array(z.object({ k: z.string(), v: z.string() })).default([]),
      dimensoes: z.array(z.object({ k: z.string(), v: z.string() })).default([]),
      chassi: z.array(z.object({ k: z.string(), v: z.string() })).default([]),

      // valores soltos p/ Schema Product/Vehicle
      potenciaCv: z.string().optional(),
      cilindrada: z.string().optional(),
      combustivel: z.string().default('Flex (etanol/gasolina)'),

      fonteDados: z.string(),                    // citação da fonte dos números
      autor: autorEditorial.optional(),
      pubDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      faq: z.array(faqItem).default([]),
      relacionados: z.array(link).default([]),
      problemaHref: z.string().optional(),
      draft: z.boolean().default(false),
    }),
});

// SILO 3 — /guia-de-compra/...  (Article + ItemList checklist + FAQPage)
const guias = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/guias' }),
  schema: () =>
    z.object({
      title: z.string(),
      seoTitle: z.string().optional(),
      h1: z.string().optional(),
      description: z.string(),
      marca: z.string().optional(),
      modelo: z.string().optional(),
      kicker: z.string().default('GUIA DE COMPRA · DECISÃO'),
      veredito: z.string(),                                  // resposta direta "vale a pena?"
      checklist: z.array(z.object({
        item: z.string(),
        detalhe: z.string(),
        critico: z.boolean().default(false),
      })).default([]),                                       // → ItemList
      autor: autorEditorial,
      pubDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      disclaimer: z.string().optional(),
      faq: z.array(faqItem).default([]),
      afiliados: z.array(afiliado).default([]),
      relacionados: z.array(link).default([]),
      draft: z.boolean().default(false),
    }),
});

// SILO 2 — /manutencao/...  (HowTo + Article + FAQPage)
const manutencao = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/manutencao' }),
  schema: () =>
    z.object({
      title: z.string(),
      seoTitle: z.string().optional(),
      h1: z.string().optional(),
      description: z.string(),
      kicker: z.string().default('HOW-TO · MÃO NA MASSA'),
      veiculo: z.string().optional(),
      tempo: z.string().optional(),
      dificuldade: z.string().optional(),
      custoEstimado: z.string().optional(),
      ferramentas: z.array(z.string()).default([]),
      materiais: z.array(z.string()).default([]),
      passos: z.array(howtoStep).default([]),
      autor: autorEditorial,
      pubDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      disclaimer: z.string().optional(),
      faq: z.array(faqItem).default([]),
      afiliados: z.array(afiliado).default([]),
      relacionados: z.array(link).default([]),
      bannerMeio: bannerMeio.optional(),
      draft: z.boolean().default(false),
    }),
});

// SILO 5 — /eletricos/...  (Article + Vehicle EV + FAQPage)
const eletricos = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/eletricos' }),
  schema: () =>
    z.object({
      title: z.string(),
      seoTitle: z.string().optional(),
      h1: z.string().optional(),
      description: z.string(),
      entidade: z.object({ marca: z.string(), modelo: z.string(), tipo: z.string().default('Elétrico') }),
      kicker: z.string().default('VERTICAL EV · ALTA DEMANDA'),
      intencao: z.string().optional(),
      entidadesEssenciais: z.array(z.string()).default([]),
      autor: autorEditorial,
      pubDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      disclaimer: z.string().optional(),
      imagem: z.string().optional(),
      imagemAlt: z.string().optional(),
      faq: z.array(faqItem).default([]),
      passos: z.array(howtoStep).default([]),
      afiliados: z.array(afiliado).default([]),
      relacionados: z.array(link).default([]),
      draft: z.boolean().default(false),
    }),
});

// SILO 6 — /tecnico/[slug]/ (TechArticle — motor, bomba, sistemas aprofundados)
const tecnico = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/tecnico' }),
  schema: () =>
    z.object({
      title: z.string(),
      seoTitle: z.string().optional(),
      h1: z.string().optional(),
      description: z.string(),
      kicker: z.string().default('TÉCNICO · APROFUNDADO'),
      categoria: z.enum(['motor', 'transmissao', 'eletrica', 'combustivel', 'suspensao', 'outro']).default('motor'),
      entidadesEssenciais: z.array(z.string()).default([]),
      autor: autorEditorial,
      pubDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      faq: z.array(faqItem).default([]),
      relacionados: z.array(link).default([]),
      draft: z.boolean().default(false),
    }),
});

// SILO 7 — /revisao/[slug]/ (HowTo — revisão programada por modelo)
const revisao = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/revisao' }),
  schema: () =>
    z.object({
      title: z.string(),
      seoTitle: z.string().optional(),
      h1: z.string().optional(),
      description: z.string(),
      kicker: z.string().default('REVISÃO · TABELA KM'),
      marca: z.string(),
      modelo: z.string(),
      motor: z.string().optional(),
      tabelaRevisao: z.array(z.object({
        km: z.string(),
        itens: z.array(z.string()),
      })).default([]),
      custoEstimado: z.string().optional(),
      autor: autorEditorial,
      pubDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      faq: z.array(faqItem).default([]),
      relacionados: z.array(link).default([]),
      draft: z.boolean().default(false),
    }),
});

// SILO 8 — /preparacao/ (performance: listas por meta de potência, receitas e peças)
//
// Regra de integridade do silo: "turbina para 300cv" NÃO é especificação.
// Potência é função de deslocamento, combustível, pressão e internos. Páginas do
// tipo `lista` e `receita` exigem essa qualificação, validada em tempo de build
// pelo superRefine abaixo. Publicar meta de potência sem qualificar quebra o build
// de propósito: é o erro que destrói a credibilidade do silo na primeira leitura.
const preparacao = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/preparacao' }),
  schema: () =>
    z.object({
      // --- Entity Lock-in ---
      title: z.string(),
      seoTitle: z.string().optional(),
      h1: z.string().optional(),
      description: z.string(),
      kicker: z.string().default('PREPARAÇÃO · ALTA PERFORMANCE'),

      // Tipo de página do silo:
      //  lista   = "Turbinas para 300cv em AP 2.0 álcool"  (eixo A, fundo de funil)
      //  receita = "Receita: Gol AP 2.0 turbo para 300cv"  (eixo B, projeto completo)
      //  peca    = "Coletor de escape para AP: como escolher"
      //  projeto = ficha de projeto real catalogado (banco de projetos)
      tipo: z.enum(['lista', 'receita', 'peca', 'projeto']),

      // --- Qualificação técnica (o que separa este silo de conteúdo genérico) ---
      motor: z.string().optional(),                 // ex: "AP 2.0 8v"
      plataforma: z.string().optional(),            // ex: "volkswagen/gol"
      combustivel: z.enum(['gasolina', 'alcool', 'flex', 'e85', 'diesel']).optional(),
      metaPotencia: z.number().int().positive().optional(),   // cv
      pressaoMax: z.string().optional(),            // ex: "1,0 kg"
      internos: z.enum(['original', 'forjado', 'misto']).optional(),

      // --- Produtos (usa o sub-schema afiliado já existente) ---
      // Silo editorial: /preparacao/ não monetiza por afiliado. O array existe
      // para compatibilidade de tipo com os outros silos e fica vazio aqui.
      afiliados: z.array(afiliado).default([]),
      custoEstimado: z.string().optional(),         // ex: "R$ 38.400"

      // --- Mídia creditada ---
      capa: imagemCreditada.optional(),             // abre o artigo (LCP)
      imagens: z.array(imagemCreditada).default([]),// apoio, no fim do corpo

      // --- GEO / E-E-A-T ---
      entidadesEssenciais: z.array(z.string()).default([]),
      pontosChave: z.array(z.string()).default([]),
      // Bloco "Referências" no fim do artigo. URL é opcional (ver `referencia`).
      fontes: z.array(referencia).default([]),

      autor: autorEditorial,
      pubDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      faq: z.array(faqItem).default([]),
      relacionados: z.array(link).default([]),
      draft: z.boolean().default(false),
    })
    .superRefine((d, ctx) => {
      if (d.tipo !== 'lista' && d.tipo !== 'receita') return;
      const exigidos: Array<[keyof typeof d, string]> = [
        ['motor', 'motor (ex: "AP 2.0 8v")'],
        ['combustivel', 'combustivel'],
        ['metaPotencia', 'metaPotencia (cv)'],
        ['internos', 'internos (original | forjado | misto)'],
      ];
      for (const [campo, descricao] of exigidos) {
        if (d[campo] === undefined || d[campo] === null || d[campo] === '') {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: [campo as string],
            message:
              `Página tipo "${d.tipo}" exige ${descricao}. ` +
              'Meta de potência sem qualificar motor, combustível e internos não é especificação, é chute.',
          });
        }
      }
    }),
});

export const collections = { problemas, fichas, guias, manutencao, eletricos, tecnico, revisao, preparacao };
