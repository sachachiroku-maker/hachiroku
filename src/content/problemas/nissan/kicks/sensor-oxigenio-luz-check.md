---
title: "Sensor de oxigênio Nissan Kicks 1.6: P0136 e P0141"
description: "Check engine acesa no Nissan Kicks 1.6? Códigos P0136 e P0141 indicam falha no sensor lambda pós-catalisador. Veja sintomas, diagnóstico e como resolver."
entidade:
  marca: "Nissan"
  modelo: "Kicks"
  motor: "1.6 16V aspirado (HR16DE)"
  geracao: "1ª geração (P15, 2016 a 2024)"
defeito: "sensor de oxigênio (lambda) pós-catalisador com defeito, códigos P0136 e P0141"
kicker: "DEFEITO REPORTADO"
intencao: "Diagnóstico e reparo"
entidadesEssenciais:
  - "sensor de oxigênio (sonda lambda)"
  - "sensor pós-catalisador (sonda 2, banco 1)"
  - "luz check engine (MIL)"
  - "código P0136 e P0141"
  - "catalisador"
  - "módulo de controle do motor (ECM)"
  - "mistura ar-combustível"
autor:
  nome: "Redação Hachiroku"
pubDate: 2026-06-21
updatedDate: 2026-06-21
disclaimer: "O diagnóstico correto exige scanner com leitura de dados ao vivo (live data) do sensor de oxigênio. Não substitua peças sem confirmar o defeito com um profissional. Este conteúdo é informativo."
imagem: "/logos/hachiroku-badge-86.png"
imagemAlt: "Sensor de oxigênio pós-catalisador do Nissan Kicks 1.6 16V"
pontosChave:
  - "Sintoma: luz check engine (MIL) acesa de forma contínua, eventualmente acompanhada de leve aumento no consumo de combustível e falha na aprovação no teste de emissões."
  - "Causa: sensor lambda pós-catalisador (sonda 2, banco 1) com resposta lenta, circuito aberto ou aquecedor interno rompido, gerando os códigos P0136 (circuito do sensor) e P0141 (aquecedor do sensor)."
  - "Ação: leitura com scanner para confirmar o código e verificar o sinal ao vivo do sensor, seguida de substituição do sensor de oxigênio pós-catalisador pelo componente compatível com o HR16DE."
faq:
  - pergunta: "O que são os códigos P0136 e P0141 no Nissan Kicks?"
    resposta: "São códigos de diagnóstico (DTCs) armazenados pelo módulo de controle do motor (ECM) quando ele detecta problema no sensor de oxigênio pós-catalisador do banco 1. O P0136 indica que o sinal de tensão do sensor está fora da faixa esperada, o que pode apontar circuito aberto, curto ou sensor contaminado. O P0141 indica falha no circuito de aquecimento interno do sensor, elemento resistivo que mantém o sensor na temperatura de trabalho cedo no ciclo de funcionamento. Os dois costumam aparecer juntos porque, quando o aquecedor falha (P0141), o sensor demora a entrar em operação e o ECM registra também o P0136 por ausência de sinal válido."
  - pergunta: "Por que o sensor de oxigênio pós-catalisador falha?"
    resposta: "Os motivos mais comuns são envelhecimento natural (o sensor tem vida útil limitada, em geral 80 mil a 120 mil km dependendo do uso), contaminação por óleo queimado ou aditivos de combustível incompatíveis, umidade infiltrada no conector, superaquecimento por catalisador comprometido e falha do aquecedor interno por ciclos térmicos repetidos. No Kicks 1.6 com quilometragem elevada ou histórico de manutenção irregular, a falha do sensor pós-catalisador é uma das ocorrências mais comuns de check engine."
  - pergunta: "A luz check engine acesa com P0136/P0141 é perigosa para o motor?"
    resposta: "Não representa risco imediato para o motor, porque o sensor pós-catalisador é usado principalmente para monitorar a eficiência do catalisador e não para ajustar a mistura em tempo real, função que compete ao sensor pré-catalisador (sonda 1). Mesmo assim, a luz acesa bloqueia a percepção de novas falhas que poderiam ser graves, pode causar reprovação no teste de emissões e, em rodagem prolongada com sensor defeituoso, o ECM pode adotar modos de operação conservadores que afetam o consumo. O recomendado é diagnosticar e resolver sem postergar muito."
  - pergunta: "Qual a diferença entre o sensor pré-catalisador e o pós-catalisador?"
    resposta: "O sensor pré-catalisador (sonda 1, montado antes do catalisador) lê o teor de oxigênio dos gases do escape para que o ECM ajuste a mistura ar-combustível em tempo real, afetando diretamente o desempenho e o consumo. O sensor pós-catalisador (sonda 2, montado após o catalisador) monitora se o catalisador está funcionando corretamente ao comparar o sinal com o da sonda 1. Os códigos P0136 e P0141 referem-se exclusivamente ao sensor pós-catalisador. Por isso, o impacto no desempenho imediato costuma ser menor, mas o alerta não deve ser ignorado."
  - pergunta: "Posso apagar o código e continuar rodando sem trocar o sensor?"
    resposta: "Apagar o código com um scanner não resolve o defeito. Se o sensor estiver com falha real, o código volta a ser registrado dentro de poucos ciclos de condução, e a luz check engine acende novamente. Além disso, apagar o código reseta os monitores do OBD, o que faz o carro reprovar em testes de emissões até que os ciclos de verificação sejam concluídos. A solução definitiva é substituir o sensor defeituoso por um compatível com o motor HR16DE."
  - pergunta: "Qual sensor devo comprar para substituir no Kicks 1.6?"
    resposta: "O sensor correto é o de oxigênio pós-catalisador compatível com o motor HR16DE do Kicks 1ª geração (2016 a 2024). Verifique sempre a posição (banco 1, sensor 2, montado após o catalisador) e o número de fios do conector original. Marcas como Bosch, Denso e NTK fabricam sensores de reposição com especificação compatível. Evite sensores universais de fios livres para soldar, que costumam ter vida útil muito menor e podem gerar novos problemas de leitura."
  - pergunta: "A troca do sensor de oxigênio exige scanner depois?"
    resposta: "Sim. Após a substituição do sensor, é necessário apagar os códigos com um scanner para que o ECM reconheça a peça nova e reinicie os monitores de emissões. Em seguida, realize um ciclo de condução normal para que o ECM valide o funcionamento do novo sensor e os monitores fiquem prontos. Se o código não voltar após esse procedimento, o reparo está concluído."
passos:
  - nome: "Leia o código com um scanner OBD2"
    texto: "Conecte um scanner OBD2 ao conector de diagnóstico do Kicks (localizado abaixo do painel, no lado do motorista) e leia os DTCs armazenados. Confirme a presença de P0136 e/ou P0141 e anote quaisquer outros códigos presentes. Se houver códigos relacionados à sonda 1 (pré-catalisador) ou ao catalisador, o diagnóstico precisa ir além do sensor pós-catalisador."
  - nome: "Verifique o sinal ao vivo do sensor pós-catalisador"
    texto: "Com o scanner em modo de dados ao vivo (live data), acesse o sinal de tensão da sonda 2 com o motor quente. Um sensor saudável deve mostrar tensão relativamente estável entre 0,5 V e 0,8 V após o motor atingir temperatura de trabalho. Oscilações muito lentas, sinal fixo próximo de 0 V ou ausência de sinal confirmam o defeito. Verifique também o circuito do aquecedor: em alguns scanners é possível comandar o aquecedor e medir a corrente."
  - nome: "Inspecione o conector e o chicote elétrico"
    texto: "Antes de substituir o sensor, inspecione o conector do sensor pós-catalisador por corrosão, pinos empurrados para dentro ou chicote danificado. Uma falha de conector pode gerar os mesmos códigos com o sensor em perfeito estado. Limpe os terminais com spray limpa-contatos se houver oxidação e verifique se o chicote não está roteado perto de partes quentes do escapamento a ponto de ter derretido o isolamento."
  - nome: "Substitua o sensor pós-catalisador"
    texto: "Com o motor frio, localize o sensor pós-catalisador montado no cano de escape após o catalisador. Use uma chave de sonda (22 mm ou 7/8 pol.) para remover o sensor com cuidado: se estiver preso por ferrugem, aplique penetrante e aguarde antes de forçar para não quebrar o rosqueado no cano. Instale o sensor novo com torque correto (em geral 40 a 50 N.m) e reconecte o chicote. Use pasta anti-gripa nas roscas se o fabricante recomendar."
  - nome: "Apague os códigos e valide o reparo"
    texto: "Após a substituição, apague os DTCs com o scanner e faça um ciclo de condução com variação de carga e velocidade para que o ECM conclua os monitores de emissões. Leia os dados ao vivo novamente para confirmar que o novo sensor está respondendo corretamente. Se o código não retornar e a luz check engine permanecer apagada após 2 a 3 dias de uso normal, o reparo está concluído."
afiliados:
  - produto: "Sensor de oxigênio pós-catalisador para Nissan Kicks 1.6"
    nota: "Compatível com o motor HR16DE, banco 1, sensor 2. Verifique a posição e o número de fios antes de comprar."
    busca: "sensor oxigenio sonda lambda nissan kicks 1.6 pos catalisador"
    programa: amazon
    cta: "Ver sensor compatível"
  - produto: "Scanner OBD2 Bluetooth com live data"
    nota: "Indispensável para confirmar o código, checar o sinal ao vivo do sensor e apagar os DTCs após o reparo."
    busca: "scanner obd2 bluetooth live data"
    programa: amazon
    cta: "Ver scanner OBD2"
fontes:
  - titulo: "OBD-Codes — P0136 O2 Sensor Circuit Malfunction (Bank 1, Sensor 2)"
    url: "https://www.obd-codes.com/p0136"
  - titulo: "OBD-Codes — P0141 O2 Sensor Heater Circuit Malfunction (Bank 1, Sensor 2)"
    url: "https://www.obd-codes.com/p0141"
relacionados:
  - titulo: "Câmbio CVT do Nissan Kicks: sintomas, manutenção e o erro que custa caro"
    url: "/problemas/nissan/kicks/cambio-cvt"
  - titulo: "Suspensão e coxins do Nissan Kicks: barulhos, desgaste e o que verificar"
    url: "/problemas/nissan/kicks/suspensao-coxins"
draft: false
---

A **luz check engine acesa no Nissan Kicks 1.6** com os códigos **P0136** e **P0141** é um dos registros mais comuns de falha elétrica no modelo. Os dois DTCs apontam para o mesmo componente: o **sensor de oxigênio pós-catalisador** (sonda lambda 2, banco 1), aquele montado no escapamento logo após o catalisador.

A boa notícia é que, diferente de uma falha no câmbio CVT ou no motor, esse defeito tem diagnóstico direto e reparo acessível. O que não convém é ignorar a luz e continuar rodando sem investigar.

Vamos destrinchar o que esses códigos significam, por que o sensor falha, como diagnosticar e como resolver de vez.

## O que fazem os sensores de oxigênio no Kicks 1.6

O motor HR16DE do Kicks trabalha com dois sensores de oxigênio no escapamento. O **sensor pré-catalisador** (sonda 1) fica antes do catalisador e é o que manda: ele lê o teor de oxigênio dos gases a cada fração de segundo e devolve essa informação ao ECM (módulo de controle do motor), que ajusta a injeção de combustível em tempo real para manter a mistura na relação ideal.

O **sensor pós-catalisador** (sonda 2) fica depois do catalisador e tem uma função diferente: comparar o sinal de saída com o de entrada para verificar se o catalisador está convertendo os gases de forma eficiente. Se os dois sinais forem muito parecidos, o ECM conclui que o catalisador não está funcionando e registra uma falha própria. Se o sensor pós-catalisador não mandar sinal nenhum, o ECM registra P0136 e P0141.

<aside class="telltale info" role="note"><span aria-hidden="true">ℹ️</span><p><strong>O que cada código indica.</strong> P0136 aponta problema no circuito de sinal do sensor, tensão fora da faixa esperada, circuito aberto ou sensor contaminado. P0141 aponta falha no aquecedor interno do sensor, elemento resistivo que acelera o aquecimento da sonda para ela entrar em operação logo no início do funcionamento do motor. Os dois aparecem juntos porque, quando o aquecedor falha, o sensor demora a responder e o ECM registra ambos.</p></aside>

## Por que o sensor pós-catalisador falha no Kicks

O sensor de oxigênio tem vida útil limitada por natureza: trabalha em temperaturas que chegam a mais de 700 graus Celsius, em ambiente corrosivo e com ciclos térmicos contínuos. Com o tempo, o elemento sensível se degrada e a resposta fica lenta ou para completamente.

No Kicks 1.6, os fatores que mais contribuem para a falha prematura são:

- **Quilometragem elevada sem inspeção do sensor:** após 80 mil a 100 mil km de uso regular, a degradação natural começa a aparecer.
- **Contaminação por óleo queimado:** se o motor consome óleo, os gases carregam resíduos que envenenam o elemento sensível ao longo do tempo.
- **Conector oxidado ou chicote danificado:** o trecho do chicote próximo ao escapamento sofre muito com o calor. Corrosão no conector gera resistência no circuito e pode simular sensor defeituoso.
- **Catalisador comprometido:** um catalisador parcialmente entupido ou danificado eleva a temperatura dos gases pós-catalisador e destrói o sensor mais rápido.

<aside class="telltale warning" role="note"><span aria-hidden="true">⚠️</span><p><strong>Não substitua o sensor sem checar o conector primeiro.</strong> Oxidação nos pinos do conector ou dano no chicote elétrico geram os mesmos códigos P0136 e P0141 com o sensor em perfeito estado. Uma inspeção de 5 minutos no chicote pode poupar o custo de uma peça trocada sem necessidade.</p></aside>

## Como o defeito se manifesta no dia a dia

O sintoma mais evidente é a **luz check engine acesa de forma contínua** no painel. Como o sensor pós-catalisador não controla a mistura em tempo real, o motorista raramente sente diferença perceptível no desempenho ou no consumo imediato.

Em alguns casos há um leve aumento no consumo a longo prazo, porque o ECM pode adotar parâmetros de injeção mais conservadores na ausência de confirmação do sensor pós-catalisador. O efeito mais concreto no cotidiano é a **reprovação automática no teste de emissões** (DETRAN/inspeção veicular), já que a luz MIL acesa é critério de reprovação imediata independentemente dos valores medidos no escapamento.

<aside class="telltale danger" role="note"><span aria-hidden="true">⛔</span><p><strong>Atenção ao teste de emissões.</strong> Com a luz check engine acesa, o Kicks reprova na vistoria e na inspeção veicular sem nem chegar ao medidor de gases. Resolver o P0136 e o P0141 antes da vistoria evita a burocracia de uma segunda visita.</p></aside>

## Diagnóstico passo a passo

O diagnóstico correto segue uma lógica simples: confirmar o código, observar o sinal ao vivo do sensor com o motor quente e inspecionar o circuito antes de trocar qualquer peça.

Com um scanner OBD2 capaz de exibir dados em tempo real (live data), acesse o canal de tensão da sonda 2 com o motor quente. Um sensor pós-catalisador saudável apresenta sinal relativamente estável, tipicamente entre 0,5 V e 0,8 V após o catalisador aquecido. Sinal fixo em zero, ausência de sinal ou tensão errática com motor quente confirmam o defeito.

Se o sinal parecer normal mas o código persistir, verifique o circuito do aquecedor: o aquecedor interno é um resistor de poucos ohms (em geral 2 a 20 ohms dependendo do modelo). Medir com multímetro diretamente nos pinos do conector descarta falha de circuito antes de culpar o sensor.

| Leitura com scanner (motor quente) | Interpretação |
| --- | --- |
| Tensão estável entre 0,5 V e 0,8 V | Sensor funcionando normalmente |
| Tensão fixa em 0 V ou ausente | Circuito aberto, sensor morto ou conector com problema |
| Tensão fixa em 1,2 V ou acima | Curto, contaminação severa ou problema de aterramento |
| Sinal muito lento a variar | Sensor envelhecido, aquecedor fraco ou catalisador entupido |

<aside class="telltale ok" role="note"><span aria-hidden="true">✅</span><p><strong>Checagem rápida de conector.</strong> Desconecte o conector do sensor, inspecione os pinos por oxidação (tom verde-acinzentado ou pinos pretos), limpe com spray limpa-contatos e reconecte com firmeza. Em vários casos de P0136 e P0141, o problema estava no conector, não no sensor. Teste antes de comprar peça.</p></aside>

## Substituição do sensor pós-catalisador

Se o diagnóstico confirmar o sensor defeituoso, a substituição é direta. Veja os pontos de atenção:

**Identifique o sensor correto.** O Kicks 1.6 tem dois sensores no escapamento. O sensor pós-catalisador fica montado no cano logo após o volume do catalisador, mais próximo da parte traseira do motor. Confirme o número de fios do conector do original para garantir a compatibilidade com o sensor de reposição.

**Cuidado com o rosqueado.** Sensores presos por ferrugem podem girar mais o cano do que o próprio sensor ao ser retirados com força excessiva. Use penetrante com antecedência, em especial em carros com mais de 5 anos ou que rodam próximo ao litoral. Uma chave de sonda (22 mm ou 7/8 pol.) facilita a remoção sem danificar o conector.

**Especificação da peça.** Marcas como Bosch, Denso e NTK produzem sensores de reposição com especificação compatível para o HR16DE. Evite sensores universais de fios livres para emenda: a qualidade do contato na emenda costuma comprometer a leitura e gerar falhas intermitentes.

**Após a instalação, apague os DTCs com o scanner** e conduza o veículo em ciclo variado (cidade e estrada) para que o ECM valide o funcionamento do novo sensor e complete os monitores de emissões. Se o código não retornar, o reparo está concluído.

## Resumo do diagnóstico

Os códigos **P0136 e P0141 no Nissan Kicks 1.6** indicam falha no sensor de oxigênio pós-catalisador, um componente de custo acessível e reparo direto. O defeito não coloca o motor em risco imediato, mas acende a check engine de forma permanente, pode elevar o consumo a longo prazo e causa reprovação automática em qualquer inspeção de emissões.

O caminho correto é confirmar o código com scanner, checar o sinal ao vivo do sensor e inspecionar o conector antes de comprar a peça. Conector oxidado resolve com limpeza. Sensor morto resolve com troca. Em ambos os casos, a solução é barata e o resultado é a luz check engine apagada e o carro apto para qualquer vistoria.
