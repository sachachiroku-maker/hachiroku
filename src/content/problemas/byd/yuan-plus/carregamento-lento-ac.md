---
title: "Carregamento AC lento do BYD Yuan Plus"
description: "O carregamento AC do BYD Yuan Plus é limitado a 7,2 kW, o que significa 8 horas para uma carga completa com wallbox. Entenda como funciona o carregador interno, a diferença entre tomada doméstica, wallbox e DC rápido, e como planejar a recarga no Brasil."
entidade:
  marca: "BYD"
  modelo: "Yuan Plus"
  motor: "Motor elétrico 204 cv"
  geracao: "1ª geração no Brasil (2023 em diante)"
defeito: "carregamento AC limitado a 7,2 kW versus expectativa dos usuários"
kicker: "DEFEITO CRÔNICO"
intencao: "Diagnóstico"
entidadesEssenciais:
  - "carregamento AC"
  - "wallbox"
  - "7,2 kW"
  - "carregador onboard"
  - "Type 2"
  - "tomada doméstica"
  - "recarga DC"
  - "80 kW DC"
  - "tempo de recarga"
  - "BYD Link"
  - "rede de recarga"
autor:
  nome: "Redação Hachiroku"
pubDate: 2026-06-20
updatedDate: 2026-06-20
disclaimer: "Tempos de recarga são estimativas baseadas em especificações técnicas; a recarga real varia com o estado da bateria, a temperatura e a infraestrutura elétrica disponível. Consulte um eletricista habilitado antes de instalar wallbox residencial."
imagem: "/logos/hachiroku-badge-86.png"
imagemAlt: "BYD Yuan Plus conectado a wallbox de recarga AC com indicador de tempo de carregamento"
faq:
  - pergunta: "Quanto tempo demora para carregar o BYD Yuan Plus?"
    resposta: "Com wallbox AC de 7,2 kW (o máximo que o Yuan Plus aceita em corrente alternada), a carga completa do zero leva aproximadamente 8 horas. Com tomada doméstica convencional de 220V (2,3 kW), a carga completa pode levar mais de 24 horas. Com carregador DC de 80 kW, a carga de 30% a 80% leva cerca de 30 minutos."
  - pergunta: "O BYD Yuan Plus aceita carregamento AC de 11 kW ou 22 kW?"
    resposta: "Não. O carregador onboard do Yuan Plus é limitado a 7,2 kW em corrente alternada. Mesmo conectado a um wallbox de 11 kW ou 22 kW, o carro vai carregar na sua velocidade máxima de 7,2 kW. A limitação está no carregador interno do veículo, não no wallbox. Um wallbox de 7 kW é suficiente para o Yuan Plus."
  - pergunta: "Posso carregar o Yuan Plus na tomada doméstica convencional?"
    resposta: "Sim, mas a velocidade é muito baixa. Em tomada 220V com 10 amperes (2,2 kW), a recarga de uma bateria do zero levaria mais de 27 horas. Em tomada 220V com 20 amperes (4,4 kW), a recarga leva cerca de 14 horas. A tomada doméstica é adequada para recargas parciais de emergência; para uso diário, o wallbox é necessário."
  - pergunta: "O BYD Yuan Plus aceita carregamento DC rápido?"
    resposta: "Sim. O Yuan Plus aceita recarga em corrente contínua (DC) de até 80 kW com conector CHAdeMO ou CCS2 dependendo da versão. Com um carregador DC de 80 kW, a bateria vai de 30% a 80% em aproximadamente 30 minutos. A velocidade de carregamento DC diminui acima de 80% de carga como proteção da bateria."
  - pergunta: "Vale a pena instalar wallbox para o BYD Yuan Plus?"
    resposta: "Sim, para quem usa o Yuan Plus como carro principal. Um wallbox de 7 kW garante que a bateria esteja completa todas as manhãs com 8 horas de carregamento noturno. O custo de instalação de um wallbox residencial no Brasil varia de R$ 3.000 a R$ 5.000 incluindo o equipamento e a mão de obra elétrica. O investimento se paga em praticidade e previsibilidade de carga."
passos:
  - nome: "Entenda o que limita a velocidade de carregamento AC"
    texto: "A velocidade de carregamento AC do Yuan Plus é limitada pelo carregador onboard (OBC, On-Board Charger) instalado no próprio veículo. O OBC converte a corrente alternada da rede elétrica para corrente contínua que alimenta a bateria. O OBC do Yuan Plus tem potência máxima de 7,2 kW. Isso significa que, independentemente de o wallbox ter 11 kW ou 22 kW, o carro vai carregar em no máximo 7,2 kW."
  - nome: "Calcule o tempo de carga para sua situação específica"
    texto: "A bateria do Yuan Plus tem 60,5 kWh de capacidade. Com um wallbox de 7,2 kW: 60,5 ÷ 7,2 = 8,4 horas para carga completa do zero. Na prática, com as perdas de conversão do OBC (eficiência de cerca de 90%), o tempo real é um pouco maior. Para recargas parciais (de 20% para 80%, por exemplo), o tempo proporcional cai para aproximadamente 4 a 5 horas."
  - nome: "Avalie a instalação elétrica antes do wallbox"
    texto: "Um wallbox de 7 kW exige circuito elétrico dedicado de 220V com disjuntor de 32 amperes ou 40 amperes. Antes de comprar o wallbox, peça um laudo elétrico do seu estacionamento ou garagem. Instalações mais antigas podem precisar de adequação antes de suportar a carga do wallbox. Um eletricista habilitado (com registro no CREA ou CFT) deve executar a instalação."
  - nome: "Configure o agendamento de recarga no app BYD Link"
    texto: "O app BYD Link permite agendar o início da recarga para horários de tarifa mais baixa (como a madrugada, em tarifas com bandeiras horárias). Configure o início da recarga para a hora de início da tarifa reduzida e o alvo de carga para 80% ou 90% (BYD recomenda não carregar para 100% regularmente para preservar a longevidade da bateria Blade LFP)."
  - nome: "Use os carregadores DC públicos para recargas de emergência e viagens"
    texto: "Para viagens longas ou quando não é possível fazer a recarga noturna completa, localize carregadores DC de pelo menos 50 kW nas plataformas ABETTERrouteplanner, PlugShare ou no app BYD. Com 80 kW DC, 30 minutos de carga adicionam aproximadamente 200 km de autonomia PBEV ao Yuan Plus. Identifique o conector disponível nos postos (CCS2 ou CHAdeMO) antes de chegar."
pontosChave:
  - "O carregamento AC máximo do BYD Yuan Plus é de 7,2 kW, limitado pelo carregador onboard interno; um wallbox de 7 kW é suficiente e mais potente não carrega mais rápido."
  - "Com wallbox de 7,2 kW, a carga completa leva aproximadamente 8 horas, adequada para recarga noturna."
  - "Em tomada doméstica convencional, a carga completa pode levar mais de 24 horas; a tomada é adequada apenas para recargas parciais de emergência."
  - "O Yuan Plus aceita carregamento DC de até 80 kW, que leva a bateria de 30% a 80% em cerca de 30 minutos."
  - "O app BYD Link permite agendar a recarga para horários de tarifa elétrica reduzida, reduzindo o custo mensal de energia."
fontes:
  - { titulo: "BYD Yuan Plus 2026: ficha técnica oficial (BYD Brasil)", url: "https://www.byd.com/br/car/yuan-plus" }
  - { titulo: "Quanto tempo demora para carregar um carro elétrico: guia 2026 (Descarbonize)", url: "https://descarbonizesolucoes.com.br/blog/tempo-para-carregar-carro-eletrico" }
  - { titulo: "MODELO BYD YUAN PLUS: carregamento e especificações (EVPlace)", url: "https://evplace.com.br/modelo-byd-yuan-plus/" }
draft: false
---

O **carregamento AC lento do BYD Yuan Plus** é uma das principais queixas de proprietários que esperavam conectar o carro a um wallbox de 11 kW ou 22 kW e carregar mais rapidamente. A limitação é real e está no projeto do veículo: o carregador onboard (OBC) instalado no Yuan Plus tem potência máxima de 7,2 kW em corrente alternada, independentemente do wallbox usado.

Entender o que limita a velocidade de carregamento, o que é possível fazer em casa e quando usar os carregadores DC públicos é o que separa um proprietário que usa o Yuan Plus com autonomia de um que depende de uma infraestrutura que não atende às expectativas.

## Por que o Yuan Plus carrega a 7,2 kW no máximo em AC

O carregamento em corrente alternada de um veículo elétrico passa por um componente instalado dentro do próprio carro: o OBC (On-Board Charger), ou carregador de bordo. O OBC converte a corrente alternada da rede elétrica para corrente contínua que alimenta a bateria de alta tensão.

A potência máxima que o carro consegue absorver em carregamento AC é determinada pelo OBC, não pelo wallbox. O OBC do Yuan Plus é de 7,2 kW. Isso significa que, se você conectar o carro a um wallbox de 22 kW, o carro vai pedir somente 7,2 kW ao wallbox e carregar com a mesma velocidade de um wallbox de 7 kW.

É uma escolha de projeto da BYD. Carregadores OBC mais potentes (11 kW ou 22 kW) são mais pesados, mais caros e mais complexos. Para um veículo elétrico com bateria de 60,5 kWh que é recarregado principalmente à noite, um OBC de 7,2 kW que carrega a bateria completa em 8 horas é suficiente para a maioria dos usuários.

O ponto de frustração aparece quando o proprietário instala um wallbox de 11 kW esperando carregar em 5 horas e descobre que o resultado é o mesmo que teria com um wallbox de 7 kW.

## Tabela de tempo de recarga nas diferentes fontes

| Fonte de recarga | Potência | Tempo (0% a 100%) | Tempo (20% a 80%) |
|---|---|---|---|
| Tomada 110V 15A | 1,4 kW | mais de 40 horas | não recomendado |
| Tomada 220V 10A | 2,2 kW | 27 horas | 16 horas |
| Tomada 220V 20A | 4,4 kW | 14 horas | 8 horas |
| Wallbox 7 kW | 7,2 kW | 8,5 horas | 5 horas |
| Wallbox 11 kW | 7,2 kW (limitado) | 8,5 horas | 5 horas |
| DC 50 kW | 50 kW | 1,2 horas | 40 min |
| DC 80 kW | 80 kW | menos de 1 hora | 30 min |

A tabela deixa claro que um wallbox de 7 kW é o ponto de eficiência ideal para o Yuan Plus: não é possível carregar mais rápido em AC independentemente da potência instalada.

<aside class="telltale info" role="note">
  <span aria-hidden="true">ℹ️</span>
  <p><strong>O wallbox certo para o Yuan Plus.</strong> Um wallbox de 7 kW (32A em 220V) é o adequado para o Yuan Plus. Wallbox de 11 kW ou 22 kW não oferecem vantagem de velocidade para esse carro. Se a intenção for usar o mesmo ponto de recarga para outro veículo futuro com OBC mais potente, um wallbox de 11 kW pode fazer sentido para o uso compartilhado.</p>
</aside>

## Carregamento noturno: o modelo ideal de uso

O Yuan Plus foi projetado para ser carregado principalmente à noite, enquanto o proprietário dorme. Com 8 horas de recarga noturna em wallbox de 7,2 kW, a bateria sai de 20% (nível típico após o uso diário) para 90% no período entre as 23h e as 7h.

Esse modelo de uso é adequado para quem percorre até 200 km por dia, o que cobre a grande maioria dos proprietários urbanos. Quem percorre mais de 200 km diariamente pode precisar de uma recarga parcial no trabalho ou em pontos de carga públicos.

A BYD recomenda carregar habitualmente até 80% para preservar a longevidade da bateria Blade LFP. A carga para 100% é recomendada apenas antes de viagens longas. O agendamento pelo app BYD Link permite configurar o limite de carga automaticamente.

## O custo de instalar um wallbox residencial

O custo total de um wallbox de 7 kW instalado em residência no Brasil inclui:

O equipamento (wallbox): de R$ 1.500 a R$ 3.000 dependendo da marca e do modelo. Wallbox com gestão de carga (que ajusta a potência automaticamente) custam mais, mas são desnecessários para uso residencial com um único veículo.

A instalação elétrica: de R$ 800 a R$ 2.000 dependendo da adequação necessária. Uma instalação elétrica já em boas condições com circuito de 220V disponível perto da garagem tem custo de instalação mais baixo.

Total típico: de R$ 3.000 a R$ 5.000 para wallbox instalado e funcionando.

O custo de energia elétrica para uma carga completa (60,5 kWh) com tarifa média de R$ 0,80/kWh fica em R$ 48. Comparado ao abastecimento de um carro com consumo médio de 12 km/l na gasolina a R$ 6,00 para percorrer 294 km (custo de R$ 147), a economia por "abastecimento" equivalente é de quase R$ 100.

<aside class="telltale warning" role="note">
  <span aria-hidden="true">⚠️</span>
  <p><strong>Tomada doméstica para carga regular não é recomendada.</strong> Carregar regularmente pela tomada doméstica convencional não apenas demora muito mais, como sobrecarrega a instalação elétrica residencial. Tomadas convencionais não são projetadas para uso contínuo de 8 a 14 horas. Use o wallbox para carregamento regular e reserve a tomada para emergências.</p>
</aside>

## A rede de carregamento DC no Brasil

Para quem precisa de recarga rápida em viagens ou de uma carga de emergência, o carregamento DC é a solução. O Yuan Plus aceita recarga DC de até 80 kW.

A rede de carregadores DC no Brasil está em expansão, com postos nas principais rodovias e em shopping centers das capitais. As plataformas PlugShare, ABETTERrouteplanner e o próprio app BYD indicam a localização dos postos compatíveis.

O padrão de conector DC do Yuan Plus no Brasil é o CCS2 (Combined Charging System). Confirme o padrão do seu modelo específico antes de chegar a um posto, pois alguns postos instalados antes da padronização usam CHAdeMO, que não é compatível com o CCS2.

Um carregador DC de 50 kW adiciona cerca de 125 km de autonomia PBEV em 30 minutos. Um carregador de 80 kW adiciona cerca de 200 km em 30 minutos.

## Resumo

O **carregamento AC do BYD Yuan Plus** é limitado a 7,2 kW pelo carregador onboard interno; um wallbox de 7 kW é o adequado e carrega a bateria completa em 8 horas. Para viagens longas, o carregamento DC de 80 kW leva a bateria de 30% a 80% em 30 minutos. Use o app BYD Link para agendar a recarga noturna em horário de tarifa elétrica reduzida. Instalar um wallbox residencial tem custo de R$ 3.000 a R$ 5.000 e é o investimento que torna o uso diário do Yuan Plus prático e previsível.

## Fontes

- [BYD Yuan Plus: especificações de recarga (BYD Brasil)](https://www.byd.com/br/car/yuan-plus)
- [Quanto tempo demora para carregar um carro elétrico (Descarbonize)](https://descarbonizesolucoes.com.br/blog/tempo-para-carregar-carro-eletrico)
- [BYD Yuan Plus: ficha técnica de carregamento (EVPlace)](https://evplace.com.br/modelo-byd-yuan-plus/)
