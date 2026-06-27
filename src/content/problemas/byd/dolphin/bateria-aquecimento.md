---
title: "BYD Dolphin Mini: aquecimento da bateria na recarga"
pubDate: 2026-06-21
updatedDate: 2026-06-21
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
    resposta: "Em condições ideais de temperatura, o carregador DC de até 60 kW (conforme especificação BYD) carrega a faixa de 20% a 80% em aproximadamente 30 a 35 minutos. Acima de 80% o ritmo cai progressivamente."
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
  - titulo: "BYD Dolphin Mini: especificações técnicas oficiais (bateria e recarga)"
    url: "https://www.byd.com/br/car/dolphinmini.html"
  - titulo: "Como funciona o BMS em baterias LFP de veículos elétricos"
    url: "https://www.electrive.com/2024/03/15/bms-lfp-charging-throttle-explained/"
relacionados:
  - titulo: "BYD Dolphin Mini: autonomia real no dia a dia"
    url: "/problemas/byd/dolphin/autonomia-real-abaixo-estimada/"
  - titulo: "Como calibrar a bateria de carro elétrico BYD"
    url: "/eletricos/"
---

O BYD Dolphin Mini usa uma bateria de litio-ferro-fosfato (LFP) com capacidade de 38,88 kWh. Essa química oferece longa vida util e segurança elevada, mas apresenta uma caracteristica bem conhecida: aquece mais rapidamente do que baterias NMC quando a carga DC é aplicada em estados de carga (SoC) acima de 80 a 90%.

O BMS (Battery Management System) monitora continuamente a temperatura e a tensão de cada celula. Quando detecta que o pack esta superando a faixa segura de operacao durante a recarga rapida, ele reduz automaticamente a corrente de entrada. O resultado visivel para o motorista e a queda brusca na potencia de carga, que pode ir de 40 a 60 kW para menos de 10 kW nas etapas finais da sessao.

Esse comportamento nao e um defeito isolado do Dolphin Mini. E uma consequencia esperada da combinacao entre a quimica LFP e a recarga DC em SoC elevado. O mesmo padrao ocorre em outros veiculos com baterias LFP, como versoes do Tesla Model 3 e varios modelos chineses vendidos no Brasil.

Para o uso cotidiano, a solucao mais eficaz e configurar o limite maximo de carga entre 80% e 85% no menu do veiculo. Nas raras ocasioes em que o SoC de 100% for necessario (viagens longas, por exemplo), o ideal e completar a carga via tomada AC lenta, que gera muito menos calor e nao aciona o throttling do BMS.

Se o problema aparecer abaixo de 80% de SoC ou com frequencia fora do esperado, vale verificar junto a uma concessionaria BYD autorizada se ha atualizacao de firmware disponivel para o modulo de gestao da bateria.
