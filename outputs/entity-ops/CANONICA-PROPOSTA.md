# Canônica do Hachiroku: proposta para aprovação

**Item 3.1 do plano de entidade, o human gate da Onda 3.** Escrito em 2026-09-08, não publicado.

A Onda 3 inteira está travada nesta página, e a trava é de propósito: publicar antes de fechar a
canônica é o que produziu as sete descrições que hoje circulam. Depois de publicada, a URL e a string
não mudam mais, porque o grafo aprende por repetição e mudar depois custa meses.

Abaixo está a proposta. O que precisa da sua decisão está marcado como **DECISÃO**, e nada vai para o
site antes de você responder.

---

## 1. O problema, medido

Sete descrições distintas em circulação hoje, todas afirmando o que o site é, nenhuma igual à outra:

| # | Onde | Texto |
|---|---|---|
| 1 | `SchemaSite.astro`, nó `Organization` | Portal automotivo editorial-comercial independente: diagnóstico, manutenção, compra racional de usados e projetos. Soluções automotivas de precisão. |
| 2 | `SchemaSite.astro`, nó `WebSite` | Portal automotivo editorial-comercial independente brasileiro sobre diagnóstico, manutenção e compra de carros. |
| 3 | `index.astro`, meta da home | Portal automotivo independente: diagnóstico de defeitos crônicos, manutenção, compra racional de usados e projetos. Soluções automotivas de precisão. |
| 4 | `sobre/index.astro`, meta | Quem é o Hachiroku: um portal automotivo independente, sem verba de montadora. Conheça a metodologia de diagnóstico e o compromisso com a precisão técnica. |
| 5 | `manifest.webmanifest` | Diagnóstico automotivo, manutenção, compra de usados e carros elétricos. Soluções automotivas de precisão. |
| 6 | `rss.xml.js`, canal | Diagnóstico de defeitos crônicos, manutenção, compra de usados e carros elétricos. Soluções automotivas de precisão. |
| 7 | `equipe/index.astro`, meta | Quem produz o conteúdo do Hachiroku: a equipe técnica responsável pelos diagnósticos, a forma como revisamos cada matéria e o compromisso com a precisão. |

Nenhuma delas está errada. O problema é que sete embeddings levemente diferentes não convergem para
uma entidade, e nenhuma delas está ancorada numa página que diga "esta URL é sobre este nó".

---

## 2. Nome oficial

| Campo | Proposta |
|---|---|
| `name` | **Hachiroku** |
| `alternateName` | **hachiroku.com.br** |
| Slogan (fica fora de `alternateName`) | O Seu Mecânico Digital |

Hoje `alternateName` guarda `Hachiroku — O Seu Mecânico Digital`, que é o lockup da marca e uma string
que ninguém digita numa busca. O slogan continua vivo como slogan, no campo `slogan`, onde ele não
compete como nome.

**Não entram como variante, em nenhuma hipótese:** `Hachi-Roku`, `Hachi Roku` e a forma em katakana.
As três são alias registrado do Toyota AE86 no Wikidata (a hifenizada em espanhol, a katakana em
japonês), e declarar qualquer uma delas é pedir para ser fundido com o carro. A forma sólida
`Hachiroku` é a única livre no grafo.

---

## 3. Descrição de duas frases

> **O Hachiroku é um portal automotivo brasileiro que diagnostica defeitos crônicos por modelo e
> explica o que a manutenção de cada carro cobra, para quem já tem o carro e precisa decidir o que
> fazer. Publica sem verba de montadora e organiza o acervo também por motor, tecnologia e sistema,
> porque o mesmo defeito costuma vir do projeto do propulsor e não do nome do modelo.**

O que cada parte faz, e por que ela é verificável:

| Parte | O que sustenta |
|---|---|
| "portal automotivo brasileiro" | tipo e território. 317 dos 330 cliques em 90 dias vêm do Brasil |
| "diagnostica defeitos crônicos por modelo" | 423 URLs em `/problemas/`, que carregam 217 dos 330 cliques |
| "explica o que a manutenção de cada carro cobra" | 66 URLs em `/manutencao/` e 6 em `/revisao/` |
| "para quem já tem o carro" | o público, e é o que separa este site de portal de lançamento |
| "publica sem verba de montadora" | é a posição editorial declarada em `/sobre/`. É afirmação do próprio site, não fato de terceiro, e é assim que ela deve ser lida |
| "organiza também por motor, tecnologia e sistema" | verificável no código: 13 motores, 8 tecnologias e 9 sistemas em `src/lib/`, com hub próprio para cada |
| "o mesmo defeito vem do projeto do propulsor" | é a tese do site, e a razão de a camada de entidade existir |

**O que a descrição deliberadamente não diz:** "referência", "autoridade", "o maior". Enquanto quatro
instrumentos independentes com controle pareado devolverem zero terceiros falando do domínio, essas
palavras são afirmação sobre reputação sem nenhuma fonte, e o gate de rastro as barra.

---

## 4. Desambiguação, em campo próprio

O schema tem uma propriedade para exatamente isto, e ela não polui a descrição:

> `disambiguatingDescription`: **Portal de conteúdo automotivo, sem relação com o Toyota AE86, também
> conhecido como Hachiroku, nem com a marca de vestuário Hachiroku Apparel.**

Isso resolve as duas colisões medidas: o carro (Q1377219 no Wikidata, com alias em seis línguas) e o
homônimo comercial vivo `drivehachiroku.com`, que usa a mesma grafia sólida.

Na prosa de `/sobre/`, uma frase, e só uma, explica a origem do nome. Ali ela funciona como
desambiguação explícita. Espalhada pelo rodapé de 760 páginas, como estava até a Onda 1, ela só
reforçava a associação com o carro.

---

## 5. Atributos verificáveis

Só entra o que já está publicado ou é conferível. Nada aqui é inventado.

| Propriedade | Valor proposto | Fonte |
|---|---|---|
| `url` | https://hachiroku.com.br | — |
| `foundingDate` | **DECISÃO 1** | o schema diz `2026`; o RDAP do registro.br registra o domínio em 2026-04-16; o primeiro dado no Search Console é de 2026-06-24 |
| `email` | **DECISÃO 2** | hoje o único e-mail do site é um gmail, publicado em `/creditos/` no contexto de atribuição de foto |
| `publishingPrinciples` | https://hachiroku.com.br/sobre/#metodologia | a seção existe e descreve o processo |
| `ownershipFundingInfo` | https://hachiroku.com.br/politicas/ | a página existe |
| `areaServed` | Brasil | 96% dos cliques |
| `inLanguage` | **não declarar na Organization** | o vocabulário não admite a propriedade nesse tipo; ela já está correta no nó `WebSite` |
| `correctionsPolicy` | **não declarar** | a seção não existe. Criar a seção é uma opção; declarar sem ela não é |

---

## 6. Relações: o campo que quase todo mundo deixa vazio

É aqui que a canônica do site está mais pobre hoje, e é o que mais pesa para o grafo entender de que
a entidade faz parte.

| Relação | Proposta | Situação |
|---|---|---|
| `subOrganization` | a redação, com `@id` próprio em `/equipe/` | depende da **DECISÃO 3** |
| `founder` | pessoa física nomeada no RDAP do registro.br | **DECISÃO 4**: o dado é público, mas publicar é escolha sua |
| `knowsAbout` | os 13 motores, 8 tecnologias e 9 sistemas que o site já cobre, por nome | verificável em `src/lib/entidades.ts` e `sistemas.ts` |
| `knowsAbout` (marcas) | as 18 marcas de `src/lib/marcas.ts`, por referência ao QID do Wikidata | os QIDs já estão no repositório e hoje são jogados fora |
| `sameAs` | vazio, até existir perfil próprio | a Onda 1 esvaziou porque os dois anteriores eram de terceiros |

A ligação com as 18 marcas via QID é a única ponte para o grafo que o site já tem em mãos e não usa.
Ela não afirma parceria nenhuma: `knowsAbout` diz sobre o que a organização fala, e não com quem ela
tem relação comercial.

---

## 7. As quatro decisões que são suas

**DECISÃO 1 · Data de fundação.** Três datas defensáveis: 2026-04-16 (registro do domínio, verificável
por terceiros no RDAP), 2026-06-18 (primeiro artigo publicado, verificável no git) ou 2026-06-24
(primeira impressão no Google). A do domínio é a única que um terceiro consegue conferir sem acesso ao
repositório, e por isso é a mais forte para corroboração. Recomendo **2026-04-16**.

**DECISÃO 2 · E-mail institucional.** O plano de corroboração depende disto mais do que parece: o
jornalista precisa de alguém para contatar antes de escrever a primeira linha, e hoje o site oferece
um gmail escondido na página de créditos de imagem. Um endereço em domínio próprio, declarado em
`contactPoint`, é o item mais barato do caminho para a primeira fonte T1. Recomendo criar
`redacao@hachiroku.com.br` e declarar. Se preferir manter o gmail, ele precisa ao menos sair de
`/creditos/` para `/sobre/`, com rótulo de contato editorial.

**DECISÃO 3 · Como a redação se chama.** Existe uma contradição publicada: `/equipe/` diz que as
matérias assinam como **Equipe Técnica Hachiroku**, e o corpus assina **Redação Hachiroku** em 624 de
624 arquivos, depois da unificação de hoje. Enquanto isso não for decidido, o nó da redação não pode
ser criado, porque ancorar identidade num lugar onde o texto e o schema discordam é criar a
divergência dentro da própria âncora. Recomendo **Redação Hachiroku**, que é o que o corpus inteiro
já diz, com ajuste de uma frase em `/equipe/`.

**DECISÃO 4 · Fundador nomeado.** O RDAP do registro.br já expõe publicamente a pessoa física
responsável pelo domínio. Declarar `founder` amarra o portal a uma pessoa real e é um dos poucos
atributos de identidade que o site pode oferecer hoje sem depender de terceiros. É também exposição
pessoal. A decisão é sua, e o plano segue sem ela se você disser não.

---

## 8. Onde a string aprovada vai entrar

Os sete lugares da seção 1, com a **mesma string, caractere a caractere**, mais o nó da entity home.
Depois disso, o critério de saída é binário e não depende do Google:

- `curl` em `/sobre/` devolve dois blocos `ld+json`, o segundo com `AboutPage` e `mainEntity` para o
  `@id` da Organization
- `curl` na home devolve `mainEntityOfPage` apontando para `/sobre/`
- exatamente **uma** URL do site emite `mainEntity` para `#organization`
- a mesma descrição aparece nos sete pontos, comparada literalmente

---

## 9. O que esta canônica não promete

Não promete Knowledge Panel, não promete posição e não promete prazo de consolidação no grafo. Os
três a seis meses que o método usa como referência são referência, e não previsão. O que ela entrega é
uma coisa só, e é a que falta: a partir do dia em que for publicada, tudo que o site diz sobre si
mesmo passa a dizer a mesma coisa, no mesmo lugar, com um endereço estável para onde apontar.
