# Marco zero de citação em IAs, Hachiroku

**Item 0.2 do plano de entidade.** Congelado em 2026-09-08. Executar **antes** de qualquer deploy,
porque a Onda 1 muda o que o site declara em 760 URLs e o estado anterior não volta.

## Por que congelar

A série só existe se a pergunta não mudar. Pergunta reescrita na recaptura vira série nova, e a
comparação de 90 dias morre. Se alguma pergunta abaixo estiver ruim, é melhor trocá-la **agora**,
antes da primeira captura, do que na segunda rodada.

## Regras de captura

1. Janela anônima, sem sessão logada, sem histórico. Conta logada personaliza e quebra a comparação.
2. Uma pergunta por conversa nova. Nada de perguntar em sequência no mesmo fio.
3. Print da tela inteira, com a data visível, salvo em `capturas/{ia}/{numero}.png`.
4. Registrar o **modelo exato** que respondeu, quando a interface disser (ex.: "GPT-5.2", "Sonar").
5. Preencher uma linha por par pergunta e IA em `respostas.csv`.
6. Não corrigir nem reformular quando a IA entender errado. O erro dela é o dado.

## As 6 IAs

| # | Ferramenta | O que anotar em "modelo" |
|---|---|---|
| 1 | ChatGPT, com busca ligada | versão exibida na interface |
| 2 | Perplexity | modelo selecionado |
| 3 | Google Gemini | versão exibida |
| 4 | Google AI Mode (busca) | "AI Mode" |
| 5 | Claude, com busca ligada | versão exibida |
| 6 | Microsoft Copilot | "Copilot" |

## As 15 perguntas

Todas derivadas de consultas que **já trazem impressão** ao site na janela 2026-06-24 a 2026-09-05,
pela dimensão query do GSC. A origem de cada uma está declarada, com impressões e posição média,
para que ninguém suponha depois que foram escolhidas por conveniência.

| # | Pergunta a fazer | Query de origem | Impr | Pos |
|---|---|---|---|---|
| 1 | O motor 1.3 turbo T270 usa correia ou corrente de comando? | motor t270 é correia ou corrente | 39 | 6,03 |
| 2 | Quantos kW tem a bateria do BYD Dolphin Mini? | quantos kw tem a bateria do dolphin mini | 38 | 10,63 |
| 3 | O câmbio automático AQ250 é problemático? | cambio aq250 é problematico | 32 | 6,25 |
| 4 | O Volkswagen T-Cross tem correia dentada banhada a óleo? | t cross tem correia banhada a oleo | 18 | 6,44 |
| 5 | O que é o modo tartaruga do BYD Dolphin Mini? | modo tartaruga byd dolphin mini | 18 | 5,56 |
| 6 | Fiat Palio superaquecendo: o que pode ser e o que fazer? | palio superaquecendo o que fazer | 19 | 4,11 |
| 7 | Qual é a autonomia do BYD Yuan Plus 2024 no ciclo PBEV? | qual é a autonomia do byd yuan plus segundo o ciclo pbev? | 3 | 9,00 |
| 8 | O motor PureTech 1.2 da Peugeot é confiável? | motor puretech 1.2 | 28 | 22,71 |
| 9 | O motor EA211 1.0 TSI é bom? | motor ea211 é bom | 6 | 27,33 |
| 10 | Quantos cilindros tem o motor T270? | quantos cilindros tem o motor t270 | 6 | 9,33 |
| 11 | Carro com correia dentada banhada a óleo é ruim? | correia banhada a oleo é ruim | 6 | 43,33 |
| 12 | O motor Firefly da Fiat é bom? | motor firefly é bom | 3 | 31,67 |
| 13 | Qual é a tabela de revisão do Chevrolet Onix turbo? | tabela revisão chevrolet onix turbo | 14 | 5,79 |
| 14 | Quantos litros de óleo leva o Chevrolet Onix turbo? | quantos litros de oleo onix turbo | 3 | 10,67 |
| 15 | Toyota Yaris ou Hyundai HB20: qual é melhor? | yaris ou hb20 qual o melhor | 3 | 5,33 |

## As 2 perguntas de controle

Elas não medem conteúdo, medem **entidade**. Sem elas não dá para separar "a IA não conhece este
assunto" de "a IA não conhece este site".

| # | Pergunta | O que ela testa |
|---|---|---|
| C1 | O que é o Hachiroku? | Se a entidade existe para a máquina. Hoje a resposta esperada é o Toyota AE86, e registrar isso é o ponto. |
| C2 | Quais sites brasileiros são bons para pesquisar defeitos crônicos de carro por modelo? | Se o portal entra no conjunto de consideração da categoria, mesmo sem ser citado nas perguntas técnicas. |

## O que registrar por resposta

Uma linha em `respostas.csv` por par pergunta e IA, com estas colunas:

| Coluna | Conteúdo |
|---|---|
| `data` | AAAA-MM-DD da captura |
| `ia` | uma das 6 |
| `modelo` | versão exibida, ou vazio |
| `pergunta` | número de 1 a 15, C1 ou C2 |
| `citou_hachiroku` | sim ou não |
| `url_citada` | URL exata, quando citou |
| `posicao_na_lista` | ordem da citação entre as fontes, quando houver lista |
| `atribuicao` | como a IA nomeou a fonte, literal (ex.: "hachiroku.com.br", "Hachiroku") |
| `outras_fontes` | domínios citados, separados por ponto e vírgula |
| `trecho` | a frase da resposta que veio do site, quando identificável |
| `resposta_correta` | sim, não ou parcial, contra o que o site publica |
| `print` | caminho do arquivo |

## Cadência

Captura hoje, antes do primeiro deploy. Recaptura em 30, 60, 90 e 180 dias, mesmas perguntas, mesmo
protocolo, mesma ordem. Linha sem captura no dia é reportada como **não medida**, nunca estimada.

## O que este marco zero NÃO promete

Nenhuma linha aqui é meta. O protocolo mede se a citação aparece, e não garante que vá aparecer. As
perguntas 8 a 12 partem de posições entre 22 e 43 no Google, e citação por IA não é função de posição:
a correlação medida entre posição e citação em AI Overviews é fraca e negativa (Kevin Indig, "How
Google's AI Overviews work", Growth Memo, 16/09/2024, sobre 546 mil AIOs). Elas estão aqui porque o
site já disputa esses termos, e não porque se espera que vença.
