# Camadas de página — Hachiroku

> Arquitetura de templates do hachiroku.com.br, levantada do código em **2026-10-03**.
> Serve de contrato para a repaginada visual: **a estrutura fica fixa e só a pele muda.**

**Mapa visual navegável:** rode `npm run dev` e abra **`/dev/camadas/`** (ex.: `http://localhost:4386/dev/camadas/`).
A rota só existe no `astro dev` (integração `hachiroku:dev-camadas` em `astro.config.mjs`); não vai para o build,
para o sitemap nem para a Vercel. Ela mostra cada template com a contagem real de páginas, um exemplo clicável,
uma prévia em iframe e a lista completa de URLs.

**Fonte da verdade:** `src/dev/camadas.ts`. Ao criar, remover ou mudar a anatomia de um template, atualize esse
arquivo e este documento.

---

## Regra de classificação

A camada é definida pela **função da página**, não pela profundidade da URL.

| Camada | Função | Pergunta que a página responde |
|---|---|---|
| **0 · Casca** | Envolve todas as páginas | — (cabeçalho, nav, rodapé, cookies) |
| **1 · Raiz** | Porta de entrada | "O que é este site e por onde eu começo?" |
| **2 · Institucional e hubs** | Identidade + agregação | "Quem escreve?" / "O que existe sobre X?" |
| **3 · Conteúdo (folhas)** | Resposta | "Qual é o defeito, como faço, vale a pena?" |
| **4 · Legal e utilitárias** | Obrigação e serviço | "Quais são as regras?" / "Não achei" |

Exemplo do porquê: `/problemas/chevrolet/onix/` está no 3º nível de URL, mas só agrega diagnósticos, então é
**hub (camada 2)**. `/problemas/chevrolet/onix/barulho-suspensao-dianteira/` é a resposta, então é **folha (camada 3)**.

---

## Visão geral

**15 templates · 764 páginas HTML** (sem contar os 53 HTML de redirect; total conferido contra o `dist/` do build
de 2026-10-03: 817 HTML − 53 redirects = 764).

| Camada | Templates | Páginas |
|---|---|---|
| 1 · Raiz | 1 | 1 |
| 2 · Institucional e hubs | 3 | 140 |
| 3 · Conteúdo (folhas) | 8 | 619 |
| 4 · Legal e utilitárias | 3 | 4 |

```
Casca (BaseLayout) ─────────────────────────────────────────────────────────────
│
├─ 1  Home  /
│
├─ 2  Institucional ── /sobre/  /equipe/ (autor coletivo de todas as folhas)
│     Hub de silo ──── /problemas/ ─────────┐   /manutencao/  /guia-de-compra/
│                      /ficha-tecnica/  /eletricos/  /tecnico/  /revisao/  /preparacao/
│                      /marca/  /motor/  /tecnologia/  /sistema/
│     Hub de entidade ─ /problemas/{marca}/{modelo}/ ◄┘   /marca/{slug}/
│                       /motor/{slug}/  /tecnologia/{slug}/  /sistema/{slug}/
│
├─ 3  Folhas ───────── /problemas/{marca}/{modelo}/{defeito}/   /manutencao/{slug}/
│                      /guia-de-compra/{slug}/   /ficha-tecnica/{marca}/{versao}/
│                      /eletricos/{slug}/   /tecnico/{slug}/   /revisao/{slug}/   /preparacao/{slug}/
│
└─ 4  Legal/utilitárias ─ /politicas/ (#privacidade #cookies #termos #afiliados #isencao)
                          /creditos/   /busca/ (noindex)   404
```

---

## Camada 0 — Casca global

Um único layout para o site inteiro: `src/layouts/BaseLayout.astro`. **Mudar aqui muda 100% das páginas.**

| Bloco | Classe / componente |
|---|---|
| Faixa utilitária ("Independente · sem verba de montadora") | `.utility-bar` |
| Cabeçalho: logo claro/escuro, menu hambúrguer, nav de 6 itens, busca, alternador de tema | `.header-main`, `.site-nav`, `.header-search`, `.theme-toggle` |
| Área do template | `<main id="conteudo">` |
| Rodapé escuro, 4 colunas + linha legal com âncoras | `.site-footer`, `.footer-cols`, `.footer-copy` |
| Banner de cookies (GA4 só carrega após aceite) | `Cookies.astro` |

**Onde o visual mora (a "pele"):**

| Arquivo | Conteúdo |
|---|---|
| `src/styles/tokens/fonts.css` | Saira (display), IBM Plex Sans (texto), IBM Plex Mono (dados) |
| `src/styles/tokens/colors.css` | Escalas asphalt / redline / amber / green / beam e tokens semânticos, claro e escuro |
| `src/styles/tokens/typography.css`, `spacing.css` | Escala tipográfica, espaçamento, raio, sombra, containers |
| `src/styles/tokens/base.css` | Reset leve |
| `src/styles/site.css` (977 linhas) | Todas as classes de template |

---

## Camada 1 — Raiz

| ID | Template | Rota | Arquivo | Páginas | Schema |
|---|---|---|---|---|---|
| T1.1 | Home | `/` | `src/pages/index.astro` | 1 | WebSite + Organization + SiteNavigationElement (global) |

**Anatomia da home:** hero escuro `.hero-home` (eyebrow, H1 com `.redline`, busca, 4 `StatBlock`) → seção 01
"Por onde começar" (5 `.silo-card`) → seção 02 "Defeitos crônicos por modelo" (11 `.chronic-card` com foto e
badge) → teaser EV `.ev-teaser` escuro.

---

## Camada 2 — Institucional e hubs

| ID | Template | Rotas | Páginas | Schema |
|---|---|---|---|---|
| T2.1 | Institucional | `/sobre/`, `/equipe/` | 2 | Só o grafo global |
| T2.2 | Hub de silo (índice) | `/problemas/` `/manutencao/` `/guia-de-compra/` `/ficha-tecnica/` `/eletricos/` `/tecnico/` `/revisao/` `/preparacao/` `/marca/` `/motor/` `/tecnologia/` `/sistema/` | 12 | BreadcrumbList + CollectionPage (+ ItemList nos índices de entidade e em preparação) |
| T2.3 | Hub de entidade | `/problemas/{marca}/{modelo}/` (78) · `/marca/{slug}/` (18) · `/motor/{slug}/` (13) · `/tecnologia/{slug}/` (8) · `/sistema/{slug}/` (9) | 126 | BreadcrumbList + CollectionPage + ItemList (+ Brand e FAQPage na marca, + FAQPage no sistema) |

**Página de autor:** não existe autor individual. A assinatura é coletiva ("Equipe Técnica Hachiroku") e toda folha
linka o nome do autor para `/equipe/`. Num redesign, `/equipe/` é a página de autor.

**Anatomias:**

- **T2.1 Institucional** — `article.prose`: kicker → `h1.article-title` → `p.lead` → seções em H2 → `p.disclaimer` (só /sobre/).
- **T2.2 Hub de silo** — `section.hero` (kicker, H1, tagline) → `section.page-intro` (só /problemas/, /revisao/,
  /tecnico/, /marca/) → `section.silos` com N `.silo-card` → `SiloCta` (faixa escura com busca; ausente em /motor/,
  /tecnologia/, /sistema/, /preparacao/).
  Variantes: `/marca/` tem filtro de texto e logos (`.marca-grid`, `<style>` local); `/preparacao/` agrupa cards por
  tipo; `/motor/`, `/tecnologia/` e `/sistema/` trazem breadcrumb abaixo do hero e um bloco `.prose` explicativo.
- **T2.3 Hub de entidade** — `article.prose`: breadcrumb → kicker → H1 → lead → contexto opcional → capa (só modelo) →
  `.defeito-grid` com `.defeito-card` → `nav.modelo-xlinks` → `dl.faq` (marca e sistema).
  Arquivos: `problemas/[marca]/[modelo]/index.astro`, `marca/[slug].astro`, `components/EntidadeHub.astro`
  (motor e tecnologia), `sistema/[slug].astro`.

---

## Camada 3 — Conteúdo (folhas)

Os banners de afiliado no meio do corpo saíram em 05/10/2026 (eram AstroAI S8 no 2º H2 e kit Vonixx no 4º H2).
No lugar entra o banner de cotação de seguro auto (`rehypeBannerMeio`, família `seguro`, em `astro.config.mjs`):
antes do 1º e do 3º H2 e no fim do corpo, abrindo o pop-up `CotacaoSeguro.astro`. Ele só vai ao build de produção
quando `corretora` estiver definida em `src/config/cotacao-seguro.ts`; até lá aparece só no `astro dev`.

| ID | Template | Rota | Arquivo | Páginas | Schema |
|---|---|---|---|---|---|
| T3.1 | Diagnóstico de defeito | `/problemas/{marca}/{modelo}/{defeito}/` | `problemas/[...slug].astro` | 344 | TechArticle + HowTo + FAQPage + BreadcrumbList |
| T3.2 | Manutenção (how-to) | `/manutencao/{slug}/` | `manutencao/[...slug].astro` | 65 | Article + HowTo + FAQPage + BreadcrumbList |
| T3.3 | Guia de compra | `/guia-de-compra/{slug}/` | `guia-de-compra/[...slug].astro` | 84 | Article + ItemList + FAQPage + BreadcrumbList |
| T3.4 | Ficha técnica | `/ficha-tecnica/{marca}/{versao}/` | `ficha-tecnica/[...slug].astro` | 88 | TechArticle + FAQPage + BreadcrumbList |
| T3.5 | Elétricos | `/eletricos/{slug}/` | `eletricos/[...slug].astro` | 17 | TechArticle + FAQPage + BreadcrumbList |
| T3.6 | Técnico | `/tecnico/{slug}/` | `tecnico/[slug].astro` | 12 | TechArticle + FAQPage + BreadcrumbList |
| T3.7 | Revisão | `/revisao/{slug}/` | `revisao/[slug].astro` | 5 | HowTo + FAQPage + BreadcrumbList |
| T3.8 | Preparação | `/preparacao/{slug}/` | `preparacao/[...slug].astro` | 4 | Article + FAQPage + BreadcrumbList |

**Anatomia comparada** (✔ = o bloco existe no template):

| Bloco | T3.1 Diag. | T3.2 Manut. | T3.3 Guia | T3.4 Ficha | T3.5 EV | T3.6 Técn. | T3.7 Rev. | T3.8 Prep. |
|---|---|---|---|---|---|---|---|---|
| Breadcrumb | ✔ | ✔ | ✔ | ✔ (escuro) | ✔ | ✔ | ✔ | ✔ |
| Autor + data visíveis | ✔ | ✔ | ✔ | ✔ | ✔ | — | — | ✔ |
| Lead | ✔ | ✔ | ✔ (veredito) | — | ✔ | ✔ (negrito) | ✔ (negrito) | ✔ |
| "Em resumo" | ✔ | — | — | — | — | — | — | ✔ |
| Capa | Photo | Photo fixa | Photo | Photo | Photo | — | — | Figura c/ crédito |
| Sumário (Toc) | ✔ | — | ✔ | — | ✔ | — | — | — |
| Bloco estruturado próprio | sidebar mini-ficha | tempo/dificuldade, ferramentas, passos | checklist | hero escuro, KPIs, tabelas | — | — | tabela por km | ficha de qualificação |
| Afiliados (caixa "Peça recomendada", removida em 05/10/2026) | — | — | — | — | — | — | — | — |
| FAQ | `dl.faq` | `dl.faq` | `dl.faq` | `dl.faq` | `dl.faq` | `div.faq-item` | `div.faq-item` | `dl.faq` |
| Referências | ✔ | — | — | fonte dos dados | — | — | — | ✔ |
| Relacionados | 3 navs | `nav.relacionados` | `nav.relacionados` | `nav.relacionados` | `nav.relacionados` | "Leia também" (H2) | "Leia também" (H2) | `nav.relacionados` |
| Barra lateral | ✔ | — | — | — | — | — | — | — |

---

## Camada 4 — Legal e utilitárias

| ID | Template | Rota | Arquivo | Páginas | Observação |
|---|---|---|---|---|---|
| T4.1 | Legal / transparência | `/politicas/`, `/creditos/` | `politicas/index.astro`, `creditos/index.astro` | 2 | Políticas numa página só, com âncoras `#privacidade #cookies #termos #afiliados #isencao` que o rodapé linka |
| T4.2 | Busca | `/busca/` | `busca/index.astro` + `lib/busca-lexico.ts` | 1 | `noindex`, fora do sitemap. O índice do Pagefind só existe após `npm run build`: no `astro dev` a busca não devolve resultado |
| T4.3 | Erro 404 | `/404.html` | `404.astro` | 1 | Seção escura com `<style>` local |

---

## Avaliação para a repaginada visual

### O que favorece um redesign "só de pele"

1. **Uma casca só.** Todo o site passa por `BaseLayout.astro`: cabeçalho, nav e rodapé novos chegam às 764 páginas
   com uma edição.
2. **Tokens já separados.** Cor, tipo e espaçamento vivem em `src/styles/tokens/`, com tema claro e escuro.
   Trocar a paleta e as fontes é editar tokens, não caçar valores.
3. **Poucos templates para muitas páginas.** 8 templates de folha cobrem 619 páginas; o T3.1 sozinho cobre 344.
   Redesenhar o T3.1 resolve 45% do site.

### O que escapa de um redesign feito só em tokens + `site.css`

| # | Achado | Evidência | Impacto no redesign |
|---|---|---|---|
| 1 | 37 linhas com `style=""` inline em 17 arquivos de template (padding do hero dos hubs, metadados da ficha, preparação) | ex.: `src/pages/preparacao/index.astro` (5), `src/pages/motor/index.astro` (3), `src/pages/ficha-tecnica/[...slug].astro` (1) | Não obedecem a `site.css`. Precisam virar classe antes ou durante o redesign |
| 2 | `<style>` local em 4 páginas | `404.astro`, `busca/index.astro`, `creditos/index.astro`, `marca/index.astro` | Cada uma precisa de revisão manual |
| 3 | Duas marcações de FAQ na mesma camada | `dl.faq` em 6 folhas; `div.faq-item` (H3 + p) em `tecnico/[slug].astro:72` e `revisao/[slug].astro:102` | O mesmo componente visual tem que ser desenhado duas vezes, ou a marcação unificada |
| 4 | Duas marcações de "relacionados" | `nav.relacionados` com kicker vs. "Leia também" com H2 em técnico e revisão | Idem |
| 5 | Técnico e revisão sem autor/data visíveis, sem capa e sem Toc | `tecnico/[slug].astro`, `revisao/[slug].astro` (nenhum `.article-meta`) | Visualmente parecem de outro site. Decidir antes do redesign se ganham esses blocos (isso é mudança de estrutura) |
| 6 | Breadcrumb visível começa em "Início" em técnico, revisão e nos hubs de marca, motor, tecnologia e sistema; começa no silo em diagnóstico, manutenção, guia, elétricos, ficha, preparação e no hub de modelo | `tecnico/[slug].astro`, `revisao/[slug].astro`, `EntidadeHub.astro` vs. `problemas/[marca]/[modelo]/index.astro:95`, `preparacao/[...slug].astro:93` | Inconsistência visível; padronizar é decisão de estrutura |
| 7 | Microdata de autor diverge: `Organization` no diagnóstico, `Person` em manutenção, guia, elétricos e preparação, para o mesmo autor coletivo | `problemas/[...slug].astro:120` vs. `manutencao/[...slug].astro:32`, `guia-de-compra/[...slug].astro:39`, `eletricos/[...slug].astro:32`, `preparacao/[...slug].astro:100` | Não é visual, mas aparece ao mexer no `.article-meta`. Não copiar o `Person` para os templates novos |
| 8 | Hubs `/tecnico/` e `/revisao/` sem link na nav, no rodapé, na home ou no corpo dos artigos; só o breadcrumb das próprias folhas aponta para eles | `BaseLayout.astro:39-46` (nav) e coluna "Conteúdo" do rodapé (`:167-173`) | Se o redesign mexer na navegação, é a hora de decidir se esses dois silos entram no menu |

### Contrato do redesign

**Pode mudar:** tokens, `site.css`, marcação de apresentação dentro de cada template (wrappers, classes, ícones),
componentes de UI (`src/components/ui/`), a casca visual.

**Não pode mudar sem decisão explícita:** rotas e slugs, `getStaticPaths`, ordem e presença dos blocos de conteúdo
listados acima, JSON-LD (`src/components/schema/` e os `@graph` inline), `rehypeBannerMeio`, canonical, metas,
breadcrumbs (o texto e o destino), `data-pagefind-*`, o fluxo de consentimento do `Cookies.astro`.

Os itens 5, 6 e 8 da avaliação são mudanças de **estrutura**. Se forem feitos, entram numa rodada separada, antes da
repaginada, para que o redesign parta de templates já consistentes.
