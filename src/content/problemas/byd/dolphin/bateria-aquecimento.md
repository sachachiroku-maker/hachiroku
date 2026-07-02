---
title: "BYD Dolphin Mini: aquecimento da bateria na recarga"
pubDate: 2026-06-21
updatedDate: 2026-07-02
draft: false
autor:
  nome: "Redação Hachiroku"
entidade:
  marca: "BYD"
  modelo: "Dolphin Mini"
  motor: "Elétrico puro"
defeito: "Aquecimento da bateria LFP 38,88 kWh em recargas rápidas (DC) acima de 90%, com o BMS limitando a potência de carga para proteger as células"
description: "BYD Dolphin Mini perde velocidade de carga DC acima de 90%? Entenda o aquecimento da bateria LFP e o que o BMS faz para proteger as células."
pontosChave:
  - "Sintoma: a potência de recarga DC cai bruscamente quando o estado de carga (SoC) ultrapassa 90%, alongando o tempo de sessão."
  - "Causa: a bateria LFP (litio-ferro-fosfato) aquece durante carga rápida em SoC elevado; o BMS reduz a corrente para manter as células dentro da faixa segura de temperatura."
  - "Ação: encerrar a recarga DC entre 80% e 85% no dia a dia; usar carga AC lenta para completar até 100% quando necessário e com tempo disponível."
faq:
  - pergunta: "Por que o BYD Dolphin Mini carrega mais devagar perto de 100%?"
    resposta: "O BMS (sistema de gestão da bateria) detecta o aumento de temperatura nas células LFP em estados de carga elevados e reduz automaticamente a corrente de entrada. É um recurso de proteção, não um defeito de fabricação."
  - pergunta: "A bateria LFP do Dolphin Mini suporta carga rápida DC todos os dias?"
    resposta: "Sim, a química LFP é mais tolerante a ciclos frequentes do que baterias NMC. O problema de aquecimento acima de 90% é pontual e o BMS o gerencia automaticamente. Para uso diário, mantenha o limite entre 80% e 85%."
  - pergunta: "Quanto tempo leva para carregar o Dolphin Mini de 20% a 80% num carregador DC?"
    resposta: "Em condições ideais de temperatura, o carregador DC no pico de 40 kW (conforme a ficha técnica oficial da BYD) carrega a faixa de 30% a 80% em aproximadamente 30 minutos. Acima de 80% o ritmo cai progressivamente."
  - pergunta: "Existe atualização de software (OTA) que resolve o aquecimento?"
    resposta: "A BYD pode ajustar os parâmetros do BMS via atualização OTA. Verifique na concessionária se há versão de firmware disponível para o seu veículo, especialmente se perceber throttling abaixo de 85%."
  - pergunta: "Carregar até 100% todos os dias danifica a bateria do Dolphin Mini?"
    resposta: "A bateria LFP suporta ciclos completos melhor do que outras químicas, mas a recarga DC forçada até 100% com aquecimento frequente pode acelerar o desgaste das células a longo prazo. O recomendado para longevidade é manter o SoC habitual entre 20% e 80%."
  - pergunta: "O aquecimento aparece como alerta no painel do Dolphin Mini?"
    resposta: "Em geral não há aviso visual explícito de temperatura da bateria na tela central. O único indício perceptível ao motorista é a queda na potência de carga, visível na tela do carregador ou no app BYD."
passos:
  - nome: "Verifique o limite de carga configurado no veículo"
    texto: "Acesse o menu de configurações de energia no painel central do Dolphin Mini e cheque se o limite máximo de carga está definido entre 80% e 85%. Muitos motoristas esquecem esse ajuste após adquirir o veículo."
  - nome: "Monitore a temperatura antes de iniciar a sessão DC"
    texto: "Baterias frias (abaixo de 15 graus Celsius) ou muito quentes (acima de 40 graus, comum em dias de sol forte) agravam o throttling do BMS. Sempre que possível, inicie a recarga com o veículo em temperatura ambiente e a bateria na faixa de 20% a 40% de SoC."
  - nome: "Use o pré-condicionamento térmico antes de recargas longas"
    texto: "Quando disponível via app BYD, ative o pré-condicionamento da bateria antes de chegar ao ponto de recarga DC. Isso eleva gradualmente a temperatura das células para a faixa ideal (25 a 35 graus Celsius), reduzindo o throttling nas primeiras etapas da sessão."
  - nome: "Migre para carga AC (lenta) ao completar acima de 85%"
    texto: "Se precisar atingir 100% de carga, conecte o Dolphin Mini a um carregador AC de 7 kW ou à tomada doméstica (wallbox) durante a noite. A carga lenta gera muito menos calor nas células LFP e não aciona o limite de potência do BMS."
  - nome: "Comunique a concessionária se o throttling ocorrer abaixo de 80%"
    texto: "Se a potência de carga cair bruscamente antes dos 80% de SoC, isso pode indicar degradação acelerada de células ou parâmetro de BMS fora da especificação de fábrica. Leve o veículo a uma concessionária BYD autorizada para diagnóstico com o scanner oficial."
afiliados:
  - produto: "Wallbox carregador AC 7 kW para veículos elétricos"
    nota: "essencial para completar a carga em casa sem estressar as células"
    busca: "wallbox carregador AC 7kW carro elétrico"
    programa: amazon
    cta: "Ver wallboxes AC no site"
  - produto: "Medidor de temperatura infravermelho para baterias"
    nota: "útil para monitorar externamente o pack durante sessões de carga"
    busca: "termômetro infravermelho automotivo bateria elétrica"
    programa: amazon
    cta: "Ver termômetros infravermelhos"
fontes:
  - titulo: "BYD Dolphin Mini: página e ficha técnica oficiais (bateria Blade LFP e recarga)"
    url: "https://www.byd.com/br/car/dolphin-mini"
  - titulo: "Quanto custa carregar o BYD Dolphin Mini: consumo real em diferentes carregadores (Portal AMJ)"
    url: "https://www.portalamj.com.br/post/quanto-custa-carregar-o-byd-dolphin-mini-veja-o-consumo-real-em-diferentes-carregadores"
  - titulo: "BYD Dolphin Mini: quanto dura a bateria, autonomia e quando trocar (Carro Das Notícias)"
    url: "https://carro.blog.br/carros/byd/byd-dolphin-mini-quanto-dura-a-bateria-autonomia-e-quando-trocar.html"
relacionados:
  - titulo: "BYD Dolphin Mini: autonomia real no dia a dia"
    url: "/problemas/byd/dolphin/autonomia-real-abaixo-estimada/"
  - titulo: "Como calibrar a bateria de carro elétrico BYD"
    url: "/eletricos/"
---

**O BYD Dolphin Mini** usa uma bateria Blade de lítio-ferro-fosfato (LFP) com cerca de 38,88 kWh (a ficha técnica oficial da BYD arredonda para 38 kWh). Essa química é durável e segura, mas tem uma característica conhecida: aquece mais rápido do que baterias de níquel quando a recarga rápida em corrente contínua (DC) é aplicada com a bateria já bem cheia. Quando o estado de carga passa de 80%, o sistema de gestão da bateria começa a reduzir a potência para proteger as células, e a partir de 90% essa redução fica bem visível. É por isso que o carregador que marcava 40 kW de repente cai para menos de 10 kW nos minutos finais. Não é defeito: é proteção. Ainda assim, o comportamento incomoda quem esperava terminar a sessão rápido, então vale entender por que acontece e como conviver com ele.

## Por que a bateria esquenta na recarga rápida

Carregar uma bateria é empurrar energia para dentro das células em pouco tempo. Quanto maior a potência do carregador, mais corrente passa pelo pack, e corrente alta sempre gera calor. Esse é o preço físico da recarga rápida em qualquer carro elétrico.

No Dolphin Mini, o pico de potência em corrente contínua é de 40 kW, segundo a ficha técnica oficial da BYD. Com a bateria entre 30% e 80%, o carro aceita esse ritmo com folga e completa a faixa em torno de 30 minutos. O problema aparece quando o estado de carga sobe e as células ficam mais cheias.

Uma bateria quase cheia tem menos espaço interno para receber energia sem aquecer. A resistência ao carregamento aumenta, o calor sobe e o carro precisa frear o ritmo para não estressar o pack. Por isso a última fatia de carga, de 80% a 100%, é sempre a mais lenta, e não só no BYD.

## O que o BMS faz quando as células aquecem

O BMS, sigla para sistema de gestão da bateria, é o cérebro que vigia cada célula. Ele mede temperatura e tensão o tempo todo e decide quanta corrente pode entrar em cada instante.

Quando o BMS percebe que o pack está passando da faixa segura durante a recarga, ele corta a corrente de entrada de forma automática. O motorista não recebe um alerta na tela central: o único sinal perceptível é a potência de carga despencando no visor do carregador ou no aplicativo da BYD.

Esse corte é gradual e proporcional. Em uma bateria fria demais ou muito quente, o BMS é ainda mais conservador, porque temperatura fora da faixa ideal, em qualquer extremo, é o que mais desgasta as células ao longo dos anos.

<aside class="telltale info" role="note"><span aria-hidden="true">ℹ️</span><p><strong>A queda de potência é o recurso funcionando.</strong> Um carro que continuasse aceitando 40 kW com a bateria a 95% estaria cozinhando as próprias células. O throttling do BMS troca alguns minutos a mais de recarga por anos a mais de vida útil do pack. Ver a potência cair perto do fim é sinal de que a proteção está ativa, não de que algo quebrou.</p></aside>

## LFP contra baterias de níquel: por que a química muda tudo

A bateria do Dolphin Mini é do tipo LFP, enquanto muitos elétricos mais caros usam química de níquel (NMC ou NCA). A diferença explica boa parte do comportamento na recarga.

A LFP é mais barata, mais estável termicamente em caso de acidente e suporta muito bem ciclos completos de carga e descarga no dia a dia. Em troca, ela costuma ser um pouco mais sensível ao calor durante a recarga rápida em estados de carga altos, e tem uma curva de tensão mais plana que dificulta a leitura precisa do estado de carga perto dos extremos.

Na prática, isso significa que o dono de um LFP pode usar a bateria de forma mais folgada no cotidiano, sem o medo de degradação rápida que assombra os donos de baterias de níquel. O ponto de atenção é justamente a recarga rápida acima de 80%, onde a curva de potência cai mais cedo do que em um pack de níquel equivalente.

| Característica | Bateria LFP (Dolphin Mini) | Bateria de níquel (NMC / NCA) |
| --- | --- | --- |
| Custo | Menor | Maior |
| Segurança térmica em acidente | Alta | Menor |
| Tolerância a ciclos completos diários | Alta, aceita carga a 100% com frequência | Menor, pede limite de 80% a 90% |
| Aquecimento na recarga rápida em SoC alto | Mais sensível, potência cai mais cedo | Sustenta potência por mais tempo |
| Leitura do estado de carga | Menos precisa nos extremos | Mais precisa |

## Quanto tempo demora para carregar

A conta de tempo do Dolphin Mini muda conforme o tipo de tomada e a faixa de carga. A recarga rápida DC só faz sentido para a fatia do meio, de 30% a 80%. O resto do tempo, a carga lenta em casa resolve sem estressar a bateria.

| Cenário de recarga | Potência aproximada | Faixa | Tempo estimado |
| --- | --- | --- | --- |
| Carregador rápido DC | Até 40 kW (pico) | 30% a 80% | Cerca de 30 minutos |
| Carregador rápido DC | Cai para menos de 10 kW | 80% a 100% | Lento e progressivo |
| Wallbox residencial AC | 7 kW | 0% a 100% | Aproximadamente 6 a 7 horas |
| Tomada doméstica comum | Baixa | 0% a 100% | Muitas horas, ideal durante a noite |

Repare no salto entre as duas primeiras linhas. Terminar de 80% a 100% no carregador rápido pode levar quase tanto tempo quanto ir de 30% a 80%, com a agravante de aquecer mais a bateria. É por isso que a recomendação é encerrar a sessão DC em torno de 80% e seguir viagem.

## Pré-condicionamento térmico: como reduzir o throttling

Existe um jeito de amenizar a queda de potência: chegar ao carregador com a bateria já na temperatura certa. É o que se chama de pré-condicionamento térmico.

Quando disponível pelo aplicativo da BYD, o pré-condicionamento aquece ou resfria o pack de forma gradual antes da recarga, buscando a faixa ideal de cerca de 25 a 35 graus Celsius. Uma bateria que chega nessa temperatura aceita a corrente com menos resistência, o que reduz o corte de potência nas primeiras etapas da sessão.

O efeito é mais notável em dias muito frios ou muito quentes. Numa manhã fria, uma bateria a 10 graus vai receber carga bem devagar até esquentar sozinha; se já chega aquecida, a sessão rende desde o início. Em dias de sol forte, o raciocínio se inverte, e vale evitar carregar com o pack já superaquecido pelo asfalto.

<aside class="telltale" role="note"><span aria-hidden="true">⚠️</span><p><strong>Temperatura importa nas duas pontas.</strong> Bateria fria demais e bateria quente demais pioram o throttling do mesmo jeito. Sempre que possível, inicie a recarga rápida com o carro em temperatura ambiente e o estado de carga entre 20% e 40%. É a janela em que o Dolphin Mini aceita a maior potência por mais tempo.</p></aside>

## O limite de 80% a 85% no dia a dia

A recomendação prática para o uso cotidiano é simples: configure o limite máximo de carga entre 80% e 85% no menu de energia do veículo. Muitos motoristas nem sabem que esse ajuste existe e deixam o carro sempre buscando 100%.

Manter o teto em 80% a 85% traz três ganhos de uma vez. A recarga termina mais rápido, porque você evita justamente a fatia lenta do fim. A bateria aquece menos, porque não força a etapa mais crítica. E a vida útil do pack tende a se prolongar, já que carga cheia constante acelera o desgaste de qualquer bateria.

Nas ocasiões em que os 100% forem realmente necessários, como uma viagem longa, o ideal é completar a carga na tomada AC lenta ou no wallbox durante a noite. A carga lenta gera pouco calor e não aciona o corte de potência do BMS, então você chega aos 100% sem estressar as células.

<aside class="telltale ok" role="note"><span aria-hidden="true">✅</span><p><strong>A rotina que preserva a bateria.</strong> No dia a dia, viva entre 20% e 80%, carregando em casa devagar. Guarde a recarga rápida DC para viagens e para a faixa do meio. Deixe os 100% apenas para vésperas de trajetos longos, e prefira completar essa última fatia na tomada lenta.</p></aside>

## O que dizem os donos brasileiros

Os relatos de proprietários no Brasil ajudam a separar o comportamento normal de um problema de verdade. A maioria confirma a robustez da química LFP: há motoristas de aplicativo que passaram de 150 mil km rodados sem perda relevante de autonomia, um sinal de que o pack aguenta o uso intenso.

Por outro lado, aparecem queixas pontuais. Em uma reclamação pública, um dono relatou queda de saúde da bateria para 92% após um ano e cerca de 16 mil km, o equivalente a uma degradação de 8% no período. Números assim fogem do esperado para uma LFP e merecem verificação técnica.

A leitura honesta é esta: a queda de potência perto do fim da recarga rápida é normal e acontece com todo Dolphin Mini. Já perda acentuada de autonomia ou degradação rápida de bateria em pouca quilometragem não é esperado e pede diagnóstico na concessionária.

## Quando o aquecimento vira um problema real

Nem toda queda de potência é motivo de preocupação, mas alguns sinais indicam que algo passou do comportamento normal e merece atenção de um profissional.

- A potência de carga despenca antes dos 80% de estado de carga, e não só perto do fim.
- A autonomia real cai de forma acentuada em relação ao que o carro entregava antes.
- O throttling ocorre mesmo com a bateria em temperatura amena e estado de carga baixo.
- O aplicativo aponta degradação de saúde da bateria fora do esperado para a quilometragem.

Se qualquer um desses pontos aparecer, vale procurar uma concessionária BYD autorizada. A marca pode ajustar os parâmetros do BMS por atualização de software, e o scanner oficial identifica se há célula fora de especificação ou parâmetro de fábrica alterado.

<aside class="telltale info" role="note"><span aria-hidden="true">ℹ️</span><p><strong>Software pode ser parte da solução.</strong> A BYD tem como refinar o comportamento do BMS por atualização remota. Se você percebe corte de potência abaixo de 85% com frequência, pergunte na concessionária se há versão de firmware mais recente para o módulo de gestão da bateria do seu veículo.</p></aside>

## Resumo do diagnóstico

O aquecimento da bateria do BYD Dolphin Mini na recarga rápida é um comportamento esperado, não um defeito. A química LFP é sensível ao calor quando a bateria está bem cheia, e o BMS reduz a potência acima de 80%, de forma mais visível a partir de 90%, para proteger as células. Ver o carregador cair de 40 kW para menos de 10 kW nos minutos finais faz parte do funcionamento normal.

Para conviver bem com isso, a receita é clara: limite a carga a 80% ou 85% no dia a dia, use pré-condicionamento térmico antes de recargas longas, complete os 100% na tomada lenta quando precisar e reserve a recarga rápida DC para a faixa de 30% a 80%.

O ponto de alerta é diferente do throttling normal. Queda de potência muito cedo, perda acentuada de autonomia ou degradação rápida em baixa quilometragem não são esperados em uma LFP e pedem diagnóstico com o scanner oficial em uma concessionária BYD autorizada.
