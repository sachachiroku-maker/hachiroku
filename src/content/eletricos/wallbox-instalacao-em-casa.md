---
title: "Wallbox em casa: requisitos elétricos, custo e por que ele"
description: "Guia técnico do carregador de parede para carro elétrico: o que é, requisitos elétricos (potência, disjuntor, DR, aterramento), tomada comum vs wallbox, custo aproximado e por que o wallbox desarma o disjuntor. Conteúdo informativo, instalação por eletricista qualificado."
entidade:
  marca: "Geral"
  modelo: "Wallbox residencial"
  tipo: "Infraestrutura EV"
kicker: "CARRO ELÉTRICO · INFRAESTRUTURA"
intencao: "Decisão e instalação"
entidadesEssenciais:
  - "wallbox"
  - "disjuntor"
  - "DR"
  - "aterramento"
  - "potência kW"
  - "recarga AC"
autor:
  nome: "Redação Hachiroku"
pubDate: 2026-06-18
updatedDate: 2026-06-18
disclaimer: "Instalação elétrica de alta corrente exige eletricista qualificado e projeto conforme a norma. Este conteúdo é informativo e não substitui o profissional."
imagem: "/logos/hachiroku-badge-86.png"
imagemAlt: "Wallbox residencial para recarga de carro elétrico"
faq:
  - pergunta: "Qual a diferença entre carregar na tomada comum e no wallbox?"
    resposta: "A tomada residencial comum entrega potência baixa (uma tomada de 220 V costuma ficar por volta de 2,2 kW), o que joga a recarga completa para muitas horas, em alguns casos passando de 24 horas conforme o tamanho da bateria. O wallbox usa um circuito dedicado de alta corrente e potências típicas de 7,4 kW, 11 kW ou 22 kW, reduzindo bastante o tempo. Mais importante: a tomada comum não foi feita para entregar corrente alta por horas seguidas, e improvisar isso cria risco real de superaquecimento."
  - pergunta: "Quais são os requisitos elétricos para instalar um wallbox?"
    resposta: "Em linhas gerais, a instalação pede um circuito exclusivo (sem outras tomadas ou cargas no mesmo ramo), disjuntor dedicado dimensionado para a corrente do carregador, dispositivo DR adequado para detectar fuga de corrente, aterramento funcional e cabos com bitola correta para a corrente e a distância. No Brasil, a referência é a norma ABNT NBR 17019, específica para instalações de recarga de veículos elétricos, que complementa a NBR 5410. Quem define os valores exatos é o eletricista qualificado, com base no seu quadro e na potência do equipamento."
  - pergunta: "Por que o wallbox fica desarmando o disjuntor?"
    resposta: "As causas mais comuns são dimensionamento incorreto (disjuntor ou cabo apertados para a corrente real e contínua do carregador), fuga de corrente detectada pelo DR, ou um circuito que não é exclusivo e soma outras cargas. O ponto crítico é que o wallbox puxa corrente alta por horas seguidas, diferente de um chuveiro que liga por poucos minutos. Um circuito que aguentaria um pico curto pode não aguentar a carga contínua. Desarme recorrente é sinal para chamar o eletricista, não para trocar o disjuntor por um maior."
  - pergunta: "Preciso de eletricista para instalar o wallbox ou dá para fazer sozinho?"
    resposta: "É serviço para eletricista qualificado. A instalação envolve alta corrente, intervenção no quadro de distribuição, dimensionamento de proteção e aterramento conforme norma. Erro aqui não é luz que pisca: é risco de choque, superaquecimento e incêndio, além de anular garantias e seguros. O dono planeja, levanta requisitos e contrata; a execução é do profissional."
  - pergunta: "Quanto custa instalar um wallbox em casa?"
    resposta: "Os valores variam muito por marca, potência, distância do quadro até a vaga e estado da instalação. Levantamentos de mercado de 2025 citam o equipamento entre cerca de R$ 3 mil e R$ 10 mil, e o conjunto (carregador mais serviço) em uma faixa aproximada de R$ 4 mil a R$ 8 mil. Trate isso como ordem de grandeza, não como orçamento: o número real só sai depois da visita técnica."
passos:
  - nome: "Confirme a potência de recarga do seu carro"
    texto: "Veja no manual quanto o carregador de bordo (onboard) do seu EV aceita em corrente alternada (AC). Não adianta instalar um wallbox de 22 kW se o carro só aceita 7 kW: a recarga não fica mais rápida. A potência útil é limitada pelo menor dos dois (carro e wallbox)."
  - nome: "Chame um eletricista qualificado para a visita técnica"
    texto: "O profissional avalia o quadro de distribuição, a entrada de energia (monofásica ou trifásica), a capacidade do disjuntor geral e a distância do quadro até a vaga. É essa avaliação que define se a instalação é simples ou se vai exigir reforço de infraestrutura."
  - nome: "Defina o circuito dedicado e as proteções"
    texto: "Com base na potência escolhida, o eletricista dimensiona o circuito exclusivo, o disjuntor dedicado, o dispositivo DR adequado e o aterramento, seguindo a NBR 17019 e a NBR 5410. Esse é o coração da segurança da instalação."
  - nome: "Verifique a necessidade de ampliação junto à concessionária"
    texto: "Se a casa é monofásica e a recarga pretendida pede mais potência, pode ser necessário solicitar ampliação de carga ou mudança de padrão de entrada à distribuidora. Isso tem prazo e custo próprios e precisa entrar no planejamento antes de comprar o equipamento."
  - nome: "Execute, teste e documente"
    texto: "O eletricista executa a instalação, testa o desarme das proteções, o aterramento e uma recarga real para confirmar que não há desarme nem aquecimento anormal. Guarde a documentação do serviço: ela vale para garantia e para o seguro."
afiliados:
  - produto: "Wallbox / carregador veicular residencial"
    nota: "O equipamento é só metade do projeto: o custo da instalação elétrica (circuito dedicado, proteções, aterramento, mão de obra) entra junto. Compre a potência que o seu carro realmente aceita."
    busca: "wallbox carregador veicular residencial"
    programa: "amazon"
relacionados:
  - titulo: "BYD Dolphin Mini: autonomia real, bateria e garantia"
    url: "/eletricos/byd-dolphin/"
draft: false
---

Você comprou (ou está prestes a comprar) o seu primeiro carro elétrico e descobriu a primeira verdade da vida elétrica: o carro é só metade da conta. A outra metade está na parede da sua garagem.

O wallbox, o carregador de parede, é o que transforma o EV de uma promessa de catálogo em um carro cômodo de usar todo dia. E é também onde mora a maior parte das dores de cabeça de quem improvisa.

Aqui o papo é de mecânico digital: sem marketing de fabricante de carregador, sem promessa de instalação "rápida e fácil". Você vai entender o que o wallbox exige da sua instalação elétrica, por que ele não é um eletrodoméstico que você liga na tomada, por que ele desarma o disjuntor quando mal dimensionado, e quanto isso custa de verdade.

O objetivo é que você chegue na conversa com o eletricista sabendo o que perguntar.

## O que é um wallbox e por que ele existe

Wallbox é o nome popular do carregador de parede para veículo elétrico, um equipamento fixo instalado na garagem ou na vaga e conectado diretamente à rede elétrica da casa. Ele trabalha em corrente alternada (AC) e corresponde ao que se chama de recarga "Nível 2" ou "Modo 3": um ponto de recarga dedicado, com proteção elétrica própria e comunicação com o carro.

A função dele não é só "carregar mais rápido". É carregar de forma segura uma carga que tem um comportamento incomum para uma casa: alta corrente por muitas horas seguidas. Um chuveiro elétrico puxa bastante corrente, mas liga por poucos minutos.

Um carro elétrico plugado pode ficar puxando corrente alta a noite inteira, sem parar. É essa diferença, a de carga contínua, que muda tudo no projeto elétrico e que a maioria das pessoas não percebe à primeira vista.

O wallbox também conversa com o carro: negocia a corrente disponível, monitora a conexão e corta a energia em caso de problema. É um equipamento de segurança, não só uma "tomada turbinada".

## Tomada comum vs wallbox: por que não dá para improvisar

A pergunta que todo mundo faz primeiro: "não dá para carregar na tomada de casa e economizar a instalação?" Dá, mas com ressalvas grandes, e por isso ele existe.

A tomada residencial comum entrega potência baixa. Uma tomada de 220 V costuma ficar em torno de 2,2 kW, o que, dependendo do tamanho da bateria, joga a recarga completa para muitas horas, podendo passar de 24 horas em baterias maiores.

Com um wallbox de 7 kW, esse mesmo trabalho cai para uma faixa de poucas horas (algo em torno de 6 horas em muitos casos), e com 22 kW menos ainda, em carros compatíveis. Os números variam conforme a bateria e o carregador de bordo do veículo, então trate-os como referência, não como promessa.

Mas o problema da tomada comum não é só lentidão. É segurança. A tomada e a fiação residencial padrão não foram projetadas para entregar corrente alta de forma contínua por horas.

Carregar um carro por 12, 15 ou 20 horas seguidas em uma tomada comum cria risco real de superaquecimento, derretimento de cabos e até incêndio, além de desgaste acelerado da própria tomada e desarmes frequentes do disjuntor.

<aside class="telltale danger" role="note"><span aria-hidden="true">⛔</span><p><strong>Cabo portátil de tomada é socorro, não recarga principal.</strong> O cabo que muitos carros trazem para ligar em tomada serve para emergência ou uso raro. Adotar isso como recarga diária, ainda mais em fiação antiga ou com extensão, é onde os relatos de tomada derretida aparecem. Para uso de todo dia, o caminho seguro é o wallbox em circuito dedicado.</p></aside>

Resumindo a comparação honesta: a tomada comum é recurso de emergência; o wallbox é solução de uso diário. Quem roda pouquíssimo pode até sobreviver com a tomada por um tempo, mas quem vai usar o carro de verdade vai precisar do wallbox.

## Os requisitos elétricos que ninguém pode pular

Aqui está o coração técnico do texto. Instalar um wallbox não é fixar uma caixa na parede e puxar um fio. É montar um circuito de alta corrente com proteções específicas.

No Brasil, a referência é a norma ABNT NBR 17019, específica para instalações de recarga de veículos elétricos, que complementa a NBR 5410 (instalações elétricas de baixa tensão). Vamos aos pilares.

### Potência e corrente: o ponto de partida

Tudo começa na potência do carregador, porque é ela que define a corrente e, a partir daí, o disjuntor e os cabos. Os wallbox residenciais costumam vir em potências de 7,4 kW, 11 kW ou 22 kW.

Para ter noção da grandeza: um carregador de 7,4 kW em 220 V puxa por volta de 33,6 A de corrente. Isso é bastante, comparável a um chuveiro potente, com a diferença crucial de que o carro mantém essa corrente por horas.

E aqui entra uma regra fundamental da NBR 17019: o fator de utilização e o fator de simultaneidade do circuito devem ser considerados como 1, ou seja, 100%. O dimensionamento precisa assumir que o carregador vai trabalhar na potência máxima, de forma contínua. Não há "folga estatística" como em outros circuitos da casa.

### Circuito exclusivo: sem dividir com nada

A NBR 17019 exige que o circuito do carregador seja exclusivo, sem derivações nem extensões. Nada de pendurar uma tomada extra, uma luz da garagem ou qualquer outra carga no mesmo ramo.

O wallbox precisa do seu próprio caminho desde o quadro de distribuição, com seu próprio disjuntor e sua própria proteção. Misturar cargas é uma das receitas clássicas para desarme e para risco.

### Disjuntor dedicado e dimensionado com folga

O wallbox precisa de um disjuntor dedicado, dimensionado para a corrente real e contínua do carregador, com margem. A boa prática de dimensionamento trabalha com folga sobre a corrente nominal (uma referência citada por profissionais é em torno de 20% acima da corrente de operação), justamente porque a carga é contínua. Subdimensionar o disjuntor é o erro número um que leva ao desarme recorrente.

### DR: a proteção que precisa ser do tipo certo

Este é o ponto mais técnico e mais ignorado. Todo carregador precisa de proteção por dispositivo DR (dispositivo diferencial residual), que corta a energia ao detectar fuga de corrente, protegendo contra choque.

O detalhe é o tipo de DR. Carregadores de veículos elétricos podem gerar fugas de corrente contínua (DC) que "cegam" os DRs comuns (do tipo AC, mais baratos, usados na maioria das casas), deixando a instalação desprotegida sem ninguém perceber.

Por isso a NBR 17019 trata da proteção contra correntes residuais com componente contínua. Na prática isso aparece de duas formas nas instalações: ou um DR do Tipo B, que tem eletrônica capaz de detectar fugas em frequências complexas e corrente contínua pura, ou um DR Tipo A combinado com proteção específica para a componente contínua, quando o próprio wallbox já embarca parte dessa detecção.

O tipo correto para o seu caso é definição do projetista ou eletricista qualificado, conforme o equipamento e a norma. O que você não pode aceitar é um DR comum de prateleira "porque é mais barato".

<aside class="telltale danger" role="note"><span aria-hidden="true">⛔</span><p><strong>DR comum (Tipo AC) não protege recarga de EV.</strong> A fuga de corrente contínua que um carregador pode gerar passa despercebida por um DR comum. O resultado é uma instalação que parece protegida no papel e não está na prática. Exija que o eletricista especifique o tipo de DR conforme a NBR 17019, e confirme isso por escrito no orçamento.</p></aside>

### Aterramento: a rota de fuga obrigatória

Toda instalação de recarga precisa de aterramento funcional e de proteção. É o caminho por onde uma corrente indesejada escoa em caso de falha, garantindo que as outras proteções atuem e evitando que a carcaça do carregador ou do próprio carro fique energizada.

Em uma falha sem aterramento adequado, encostar no veículo pode virar risco de choque. Aterramento não é detalhe opcional: é item de segurança que o eletricista verifica e, se necessário, executa.

### Monofásico ou trifásico: o que a sua casa tem

A potência que você consegue instalar depende da entrada de energia da casa. Carregadores trifásicos, mais comuns em empresas e condomínios com infraestrutura preparada, exigem entrada trifásica.

Se a residência é monofásica e a recarga pretendida pede mais potência do que a entrada comporta, pode ser necessário solicitar ampliação de carga ou mudança de padrão de entrada junto à concessionária. Isso tem prazo, custo e burocracia próprios, e precisa entrar no planejamento antes da compra do equipamento, não depois.

## Por que precisa de eletricista qualificado (e não é frescura)

Junte os pontos anteriores: alta corrente, carga contínua, intervenção no quadro de distribuição, escolha do tipo de DR, dimensionamento de disjuntor e cabo conforme a distância, aterramento e, às vezes, ampliação de entrada com a concessionária. Nada disso é tarefa de tutorial de internet.

Erro em instalação de wallbox não é uma luz que pisca. É risco de choque, de superaquecimento e de incêndio, exatamente porque a carga fica horas puxando corrente alta.

Some a isso que uma instalação fora de norma pode anular a garantia do carregador, complicar o seguro da casa e, em condomínio, esbarrar em regras e na necessidade de autorização. O papel do dono é planejar e contratar bem. A execução é do profissional qualificado, idealmente seguindo a NBR 17019.

<aside class="telltale info" role="note"><span aria-hidden="true">ℹ️</span><p><strong>O wallbox é parte do projeto de compra do carro, não um acessório depois.</strong> Some o custo da instalação ao preço do EV e peça a visita técnica antes de fechar o carro, principalmente se a sua casa for antiga ou monofásica. Descobrir que precisa de ampliação de entrada depois de comprar o carro é o tipo de surpresa que estraga o orçamento.</p></aside>

## O problema do "wallbox desarmando o disjuntor"

Esse é o sintoma que mais aparece em fórum de dono de elétrico, e merece seção própria porque quase sempre é mal interpretado.

O carro está plugado, carregando, e do nada o disjuntor desarma e a recarga para. De manhã o carro está com menos carga do que deveria. O que está acontecendo?

As causas mais comuns são três, e nenhuma se resolve trocando o disjuntor por um maior na marra:

- **Dimensionamento incorreto.** O disjuntor ou o cabo foram escolhidos apertados para a corrente real do carregador. Lembre da carga contínua: um circuito que aguentaria um pico de poucos minutos pode não aguentar horas de corrente alta sem aquecer e desarmar. É a causa mais frequente e a mais perigosa de "resolver" do jeito errado.
- **Fuga de corrente detectada pelo DR.** Se o DR está atuando, ele pode estar fazendo exatamente o trabalho dele: cortando por detectar uma fuga. Isso pode indicar um problema no carregador, no carro ou na instalação. Desarme do DR não é defeito do DR; é aviso.
- **Circuito não exclusivo.** Se o wallbox divide o ramo com outras cargas (contrariando a norma), a soma das correntes estoura o disjuntor. A solução é o circuito dedicado, não um disjuntor maior.

<aside class="telltale danger" role="note"><span aria-hidden="true">⛔</span><p><strong>Nunca "resolva" desarme trocando o disjuntor por um de corrente maior.</strong> Se o cabo foi dimensionado para uma corrente e você instala um disjuntor que só desarma acima disso, o cabo passa a poder aquecer sem que a proteção atue. Você troca o desarme (que é chato) por risco de incêndio (que é grave). Desarme recorrente é caso de diagnóstico do circuito por eletricista qualificado, não de "destravar" a proteção.</p></aside>

O resumo é direto: na esmagadora maioria dos casos, o wallbox que desarma o disjuntor não é defeito do carregador, e sim sinal de uma instalação subdimensionada ou de uma proteção fazendo o seu papel. A resposta certa é investigar a causa, não silenciar o sintoma.

## Quanto custa: a faixa honesta de 2025

Falar de preço aqui é arriscado, porque varia demais, então vamos com referência e ressalva. Levantamentos de mercado de 2025 citam o equipamento (o wallbox em si) entre cerca de R$ 3 mil e R$ 10 mil, dependendo de marca, potência e recursos como conectividade e app.

Já o conjunto completo, carregador mais serviço de instalação, aparece em uma faixa aproximada de R$ 4 mil a R$ 8 mil em boa parte das estimativas.

Esses números são ordem de grandeza, não orçamento. O custo real depende de fatores que só a visita técnica revela: a distância do quadro de distribuição até a vaga (que define o comprimento e a bitola do cabo, item que pesa no bolso), o estado da sua instalação, se há ou não necessidade de ampliação de entrada junto à concessionária, e a potência escolhida.

Uma casa com quadro folgado e vaga perto do medidor sai muito mais barata que uma casa antiga, monofásica e com a vaga no fundo do terreno.

<aside class="telltale warning" role="note"><span aria-hidden="true">⚠️</span><p><strong>Peça orçamento depois da visita técnica, nunca por telefone.</strong> Qualquer preço fechado sem alguém olhar o seu quadro e medir a distância até a vaga é chute. E desconfie do orçamento "campeão de barato": é nele que costumam cortar o tipo certo de DR, o aterramento e a bitola correta de cabo, justo os itens que separam uma instalação segura de uma armadilha.</p></aside>

## Planejando a sua instalação: o caminho do dono

Para fechar, o passo a passo de planejamento (de planejamento, não de execução leiga, que continua sendo do eletricista). A ordem importa, porque pular etapa é o que gera retrabalho e surpresa de custo.

Primeiro, confirme quanto o seu carro aceita de potência em AC. Não adianta instalar um wallbox de 22 kW se o carregador de bordo do veículo só aceita 7 kW: a recarga não fica mais rápida, e você pagou por capacidade que o carro não usa.

A potência útil é limitada pelo menor dos dois.

Depois, chame um eletricista qualificado para a visita técnica. É ele quem avalia o quadro, a entrada de energia, o disjuntor geral e a distância até a vaga, e quem define se a instalação é simples ou exige reforço.

Com isso em mãos, vem o dimensionamento do circuito exclusivo, do disjuntor, do DR adequado e do aterramento, conforme a NBR 17019 e a NBR 5410.

Se a sua casa for monofásica e a recarga pretendida pedir mais potência, verifique com a concessionária a necessidade de ampliação de carga, com o seu devido prazo.

Por fim, execução, teste e documentação: o profissional confirma o desarme das proteções, o aterramento e uma recarga real sem aquecimento anormal, e você guarda a papelada para garantia e seguro.

Carregador elétrico de carro não é o item para economizar improvisando. É justamente o oposto: é onde uma instalação bem feita, na norma e por gente qualificada, paga a si mesma em segurança e em noites de sono sem o medo de cheiro de fio quente na garagem.

O carro elétrico fica barato e cômodo de usar quando a parede da garagem está certa. Comece por ela.
