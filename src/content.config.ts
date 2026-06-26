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
  busca: z.string(),                                            // termo de busca afiliada
  programa: z.enum(['amazon', 'mercadoLivre', 'pneuStore']).default('amazon'),
  cta: z.string().default('Ver peça recomendada'),
});

const link = z.object({
  titulo: z.string(),
  url: z.string(),
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
      autor: z.object({
        nome: z.string(),
        credencial: z.string().optional(),      // ex: "Engenheiro mecânico"
        sameAs: z.string().url().optional(),    // LinkedIn
      }),
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
      autor: z.object({
        nome: z.string(),
        credencial: z.string().optional(),
      }).optional(),
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
      autor: z.object({
        nome: z.string(),
        credencial: z.string().optional(),
        sameAs: z.string().url().optional(),
      }),
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
      description: z.string(),
      kicker: z.string().default('HOW-TO · MÃO NA MASSA'),
      veiculo: z.string().optional(),
      tempo: z.string().optional(),
      dificuldade: z.string().optional(),
      custoEstimado: z.string().optional(),
      ferramentas: z.array(z.string()).default([]),
      materiais: z.array(z.string()).default([]),
      passos: z.array(howtoStep).default([]),
      autor: z.object({ nome: z.string(), credencial: z.string().optional(), sameAs: z.string().url().optional() }),
      pubDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      disclaimer: z.string().optional(),
      faq: z.array(faqItem).default([]),
      afiliados: z.array(afiliado).default([]),
      relacionados: z.array(link).default([]),
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
      description: z.string(),
      entidade: z.object({ marca: z.string(), modelo: z.string(), tipo: z.string().default('Elétrico') }),
      kicker: z.string().default('VERTICAL EV · ALTA DEMANDA'),
      intencao: z.string().optional(),
      entidadesEssenciais: z.array(z.string()).default([]),
      autor: z.object({ nome: z.string(), credencial: z.string().optional(), sameAs: z.string().url().optional() }),
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
      description: z.string(),
      kicker: z.string().default('TÉCNICO · APROFUNDADO'),
      categoria: z.enum(['motor', 'transmissao', 'eletrica', 'combustivel', 'suspensao', 'outro']).default('motor'),
      entidadesEssenciais: z.array(z.string()).default([]),
      autor: z.object({ nome: z.string(), credencial: z.string().optional(), sameAs: z.string().url().optional() }),
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
      autor: z.object({ nome: z.string(), credencial: z.string().optional(), sameAs: z.string().url().optional() }),
      pubDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      faq: z.array(faqItem).default([]),
      relacionados: z.array(link).default([]),
      draft: z.boolean().default(false),
    }),
});

export const collections = { problemas, fichas, guias, manutencao, eletricos, tecnico, revisao };
