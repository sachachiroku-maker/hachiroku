---
title: "Virtus 1.0 TSI: check engine P0136/P0141 sensor lambda"
seoTitle: "Virtus 1.0 TSI: check engine P0136/P0141 sensor"
description: "Volkswagen Virtus 1.0 TSI Highline acende check engine com P0136 ou P0141: sensor lambda pós-catalisador com falha precoce no EA211. Causas, diagnóstico e solução."
entidade:
  marca: "Volkswagen"
  modelo: "Virtus"
  motor: "1.0 TSI (EA211)"
defeito: "luz check engine com código P0136 ou P0141 — sensor de oxigênio pós-catalisador com falha precoce"
kicker: "DEFEITO DOCUMENTADO"
intencao: "Diagnóstico"
entidadesEssenciais:
  - "sensor lambda pós-catalisador"
  - "motor 1.0 TSI EA211"
  - "código P0136"
  - "código P0141"
  - "catalisador Virtus"
  - "sonda lambda VW"
  - "OBD2 Virtus"
autor:
  nome: "Redação Hachiroku"
pubDate: 2026-06-21
updatedDate: 2026-06-21
disclaimer: "As informações deste artigo são de caráter técnico e educativo. O diagnóstico definitivo exige leitura dos códigos com scanner OBD2 e avaliação presencial por profissional habilitado. Não substitua peças sem diagnóstico confirmado."
imagem: "/logos/hachiroku-badge-86.png"
imagemAlt: "Luz check engine acesa no painel do Volkswagen Virtus 1.0 TSI com código P0136 ou P0141"
draft: false
pontosChave:
  - "Sintoma: luz check engine acende com os códigos P0136 ou P0141 no painel do Virtus 1.0 TSI Highline, em geral entre 30.000 e 80.000 km."
  - "Causa: sensor de oxigênio pós-catalisador (sonda lambda downstream) com falha precoce por contaminação, superaquecimento ou degradação do elemento sensor no motor EA211."
  - "Ação: confirmar o código com scanner OBD2, inspecionar vazamentos de escapamento antes do sensor e substituir o sensor lambda pós-catalisador com peça de especificação VW."
passos:
  - nome: "Confirme o código com scanner OBD2"
    texto: "A luz check engine acende por dezenas de motivos diferentes. Antes de qualquer ação, conecte um scanner OBD2 na porta de diagnóstico do Virtus (localizada abaixo do volante, lado esquerdo) e leia os códigos armazenados. Os códigos P0136 e P0141 indicam especificamente o sensor de oxigênio do banco 1, sensor 2, que é o sensor pós-catalisador. Se aparecerem outros códigos além desses, como P0420 (eficiência do catalisador abaixo do esperado), o diagnóstico se expande e pode envolver o próprio catalisador."
  - nome: "Identifique qual sensor está com falha"
    texto: "O motor 1.0 TSI EA211 do Virtus tem dois sensores de oxigênio: o sensor 1 (pré-catalisador, upstream) e o sensor 2 (pós-catalisador, downstream). O P0136 indica tensão de sinal fora da faixa esperada no sensor 2. O P0141 indica falha no circuito de aquecimento do mesmo sensor. Os dois códigos juntos costumam confirmar que o sensor em si está defeituoso, e não apenas o chicote elétrico."
  - nome: "Inspecione o escapamento e o chicote elétrico"
    texto: "Antes de trocar o sensor, verifique se há vazamentos de gases no coletor de escapamento ou nas juntas entre o motor e o catalisador. Um vazamento de gases quentes próximo ao sensor pode contaminar a leitura e queimar o elemento sensor precocemente. Verifique também o estado do chicote elétrico que conecta o sensor à central: fios partidos, conectores oxidados ou chicote encostando no escapamento quente causam falha de circuito e geram P0141 mesmo com o sensor em bom estado."
  - nome: "Substitua o sensor lambda pós-catalisador"
    texto: "Confirmado que o sensor está defeituoso, a substituição é o caminho. O sensor pós-catalisador do Virtus 1.0 TSI fica rosqueado na saída do catalisador, no trecho inferior do escapamento. Use a ferramenta específica para sensor lambda (soquete com fenda para o chicote) e aplique produto antitravamento nas roscas antes de instalar o sensor novo. Peça original VW ou similar de fabricantes como Bosch, Delphi ou NGK são as opções recomendadas. Evite sensores universais sem a ficha de encaixe correto."
  - nome: "Apague os códigos e monitore o sistema"
    texto: "Após a substituição, apague os códigos com o scanner OBD2 e faça um ciclo de condução de pelo menos 20 km com variações de aceleração, incluindo trechos em velocidade constante acima de 60 km/h. O sistema de gestão eletrônica do EA211 precisa completar os ciclos de monitoramento (readiness monitors) para confirmar que o sensor está funcionando corretamente. Se a luz check engine voltar com P0136 ou P0141, o problema pode estar no catalisador ou em outra parte do circuito que não foi identificada na primeira inspeção."
  - nome: "Verifique o catalisador se o P0420 aparecer junto"
    texto: "Se junto ao P0136 ou P0141 aparecer o código P0420 (eficiência do catalisador abaixo do esperado), a situação é mais complexa. O sensor lambda pós-catalisador monitora exatamente a eficiência do catalisador: se o catalisador está saturado ou danificado, o sinal do sensor fica errático, o que pode gerar falha falsa no sensor. Nesse caso, substituir apenas o sensor não resolve. É necessário avaliar o estado do catalisador antes de decidir qual peça trocar primeiro."
afiliados:
  - produto: "Scanner OBD2 Bluetooth para diagnóstico"
    nota: "lê e apaga códigos P0136 e P0141 sem ir à oficina"
    busca: "scanner OBD2 bluetooth ELM327 carro"
    programa: amazon
    cta: "Ver opções na Amazon"
  - produto: "Sensor lambda pós-catalisador Bosch para VW 1.0 TSI"
    nota: "compatível com motor EA211 do Virtus e Polo"
    busca: "sensor lambda oxigenio VW 1.0 TSI Bosch"
    programa: amazon
    cta: "Ver opções na Amazon"
  - produto: "Soquete removedor de sensor lambda"
    nota: "ferramenta essencial para não danificar o chicote na troca"
    busca: "soquete removedor sensor lambda oxigenio"
    programa: amazon
    cta: "Ver opções na Amazon"
  - produto: "Produto antitravamento para roscas de alta temperatura"
    nota: "evita que o sensor novo gripe nas roscas do escapamento"
    busca: "anti travamento rosca alta temperatura escapamento"
    programa: amazon
    cta: "Ver opções na Amazon"
faq:
  - pergunta: "O código P0136 no Virtus significa que o catalisador está com problema?"
    resposta: "Não necessariamente. O P0136 indica que o sinal do sensor de oxigênio pós-catalisador está fora da faixa esperada, mas isso pode ser causado pelo próprio sensor com defeito e não pelo catalisador. Se o catalisador estiver degradado, o código que aparece é o P0420. Os dois podem surgir juntos, mas o P0136 isolado quase sempre aponta para o sensor, não para o catalisador."
  - pergunta: "Posso continuar dirigindo o Virtus com a luz check engine acesa por P0136 ou P0141?"
    resposta: "O carro continua funcionando, mas há dois riscos práticos. Primeiro, o motor entra em modo de proteção e pode apresentar desempenho reduzido ou consumo de combustível maior, pois a gestão eletrônica perde a referência do sensor lambda pós-catalisador para ajustar a mistura. Segundo, se o catalisador estiver comprometido, adiar o diagnóstico pode acelerar o dano. O ideal é resolver o problema em até duas semanas após o acendimento da luz."
  - pergunta: "Qual a diferença entre P0136 e P0141 no motor 1.0 TSI?"
    resposta: "Os dois códigos se referem ao mesmo sensor (banco 1, sensor 2, pós-catalisador), mas indicam tipos de falha diferentes. O P0136 é uma falha de sinal de tensão: o sensor não está enviando um sinal dentro da faixa esperada pelo módulo de gestão. O P0141 é uma falha no circuito de aquecimento interno do sensor: o resistor de aquecimento do sensor não está funcionando corretamente, o que impede o sensor de atingir a temperatura de trabalho. Os dois podem aparecer juntos ou separados."
  - pergunta: "Quanto custa trocar o sensor lambda pós-catalisador no Virtus 1.0 TSI?"
    resposta: "O sensor lambda pós-catalisador em peça original VW fica entre R$ 350 e R$ 550. Peças de fabricantes como Bosch ou Delphi ficam entre R$ 200 e R$ 380. A mão de obra em oficinas independentes costuma ser entre R$ 80 e R$ 150, pois o sensor é acessível no escapamento. O diagnóstico com scanner OBD2 pode ser cobrado à parte, entre R$ 50 e R$ 100, ou embutido na mão de obra. O custo total fica em torno de R$ 300 a R$ 650 dependendo da peça escolhida e da oficina."
  - pergunta: "O problema P0136/P0141 no Virtus tem cobertura de garantia VW?"
    resposta: "Sim, se o carro estiver dentro da garantia de 3 anos ou 100.000 km da Volkswagen. O sensor lambda é uma peça do sistema de emissões, e sua falha dentro do período de garantia deve ser coberta sem custo. Leve o carro à concessionária com o código P0136 ou P0141 armazenado no módulo. Não apague o código antes de ir, pois o histórico de falhas é a evidência que o técnico da concessionária vai usar para confirmar a cobertura."
  - pergunta: "O Polo 1.0 TSI e o T-Cross 1.0 TSI têm o mesmo problema com o sensor lambda?"
    resposta: "Sim. O motor 1.0 TSI EA211 é compartilhado entre Virtus, Polo e T-Cross. O sistema de controle de emissões e o posicionamento dos sensores lambda são iguais nos três modelos. Relatos de P0136 e P0141 aparecem nos três, geralmente na mesma faixa de quilometragem, entre 40.000 e 80.000 km."
  - pergunta: "O sensor lambda pós-catalisador do Virtus fica onde exatamente?"
    resposta: "O sensor pós-catalisador (sensor 2) fica rosqueado na parte traseira do catalisador, já na saída dos gases tratados, antes do silencioso intermediário. No Virtus 1.0 TSI, o acesso é feito por baixo do carro, com o veículo levantado em elevador ou rampa. O sensor tem uma ficha elétrica que se desconecta antes de rosqueá-lo. A remoção exige a ferramenta específica (soquete de sensor lambda, 22 mm com fenda), pois o chicote impede o uso de um soquete convencional."
relacionados:
  - titulo: "Motor 1.0 TSI do Virtus consome óleo: causa, sintomas e o que fazer"
    url: "/problemas/volkswagen/virtus/consumo-de-oleo-tsi"
  - titulo: "Virtus com trancos no câmbio automático Aisin: diagnóstico"
    url: "/problemas/volkswagen/virtus/cambio-aisin-trancos"
  - titulo: "Bomba d'água do Virtus 1.0 TSI: falha precoce no EA211"
    url: "/problemas/volkswagen/virtus/bomba-agua-ea211"
fontes:
  - { titulo: "OBD Codes P0136 — O2 Sensor Circuit Low Voltage (Bank 1, Sensor 2)", url: "https://www.obd-codes.com/p0136" }
  - { titulo: "OBD Codes P0141 — O2 Sensor Heater Circuit Malfunction (Bank 1, Sensor 2)", url: "https://www.obd-codes.com/p0141" }
  - { titulo: "Defeitos comuns do motor VW TSI (Canal da Peça)", url: "https://www.canaldapeca.com.br/blog/defeitos-comuns-do-motor-vw-tsi/" }
---

A **luz check engine acesa com os códigos P0136 ou P0141** no Volkswagen Virtus 1.0 TSI Highline é um defeito documentado no motor EA211 e aparece com frequência entre 30.000 e 80.000 km de uso. Os dois códigos apontam para o mesmo componente: o sensor de oxigênio pós-catalisador, também chamado de sonda lambda downstream.

O sensor falha precocemente nesse motor por razões que têm a ver com o ciclo térmico do escapamento e, em alguns casos, com contaminação por óleo queimado. A boa notícia é que o reparo é direto, com custo controlado, desde que o diagnóstico seja feito corretamente antes de substituir qualquer peça.

## O que são os códigos P0136 e P0141

O sistema OBD2 do Virtus monitora continuamente os sensores de oxigênio do motor. Existem dois sensores no sistema de escapamento do 1.0 TSI EA211: um antes do catalisador (upstream, sensor 1) e um depois do catalisador (downstream, sensor 2).

Os códigos P0136 e P0141 são específicos do sensor 2, o pós-catalisador.

O **P0136** indica que a tensão de saída do sensor está fora da faixa esperada pelo módulo de controle do motor. O sensor manda um sinal que varia entre 0,1 V e 0,9 V de acordo com a concentração de oxigênio nos gases de escape. Quando esse sinal fica fixo ou varia fora dos limites programados, o módulo registra a falha.

O **P0141** indica que o circuito de aquecimento interno do sensor não está funcionando. O sensor lambda downstream tem um resistor interno que aquece o elemento cerâmico até a temperatura de trabalho (em torno de 300 a 400 graus Celsius) rapidamente após a partida. Quando esse resistor queima ou o chicote elétrico apresenta falha, o aquecimento não ocorre e o módulo registra P0141.

Os dois códigos podem aparecer juntos ou separados. Quando surgem juntos, é quase sempre o sensor físico com defeito.

## Por que esse sensor falha precocemente no EA211

O motor 1.0 TSI EA211 opera com ciclos térmicos mais intensos do que motores aspirados de mesma cilindrada, porque a turbina eleva a temperatura dos gases de escape. O sensor pós-catalisador fica exposto a esses gases continuamente.

Há três causas documentadas para a falha precoce nesse motor:

A primeira é a **degradação térmica do elemento cerâmico**. O sensor funciona a altas temperaturas por longos períodos. Com o tempo, o elemento sensor perde sensibilidade e começa a enviar leituras imprecisas, o que gera o P0136.

A segunda é a **contaminação por silicone ou óleo**. Se o motor estiver consumindo óleo (um problema separado, também documentado no EA211), parte desse óleo pode passar pelo catalisador e contaminar o elemento sensor do sensor 2. Silicone proveniente de vedantes inadequados também contamina o sensor.

A terceira é a **falha no circuito de aquecimento**. O resistor interno do sensor tem vida útil limitada. Em motores com muitos ciclos de partida e desligamento (uso urbano intenso), o resistor pode queimar antes do esperado, gerando o P0141.

<aside class="telltale" role="note"><span aria-hidden="true">⚠️</span><p><strong>Não confunda com catalisador ruim.</strong> O código P0420, que indica eficiência do catalisador abaixo do esperado, é diferente do P0136 e do P0141. Se apenas P0136 ou P0141 aparecerem no scanner, o problema está no sensor, não no catalisador. Trocar o catalisador sem confirmar o diagnóstico é um erro caro e desnecessário.</p></aside>

## O papel do sensor lambda pós-catalisador no sistema do EA211

O sensor pré-catalisador (sensor 1) é o que o módulo usa para ajustar a mistura de combustível em tempo real. Já o sensor pós-catalisador (sensor 2) tem uma função diferente: ele monitora a eficiência do catalisador.

Se o catalisador estiver funcionando corretamente, os gases que saem dele têm uma composição diferente dos que entram. O sensor 2 lê essa diferença. Quando o catalisador está degradado, a composição dos gases na saída se aproxima da entrada, e o módulo registra o P0420.

Quando o sensor 2 em si está com defeito, o módulo não consegue fazer essa leitura e registra P0136 ou P0141. O sistema entra em modo de segurança, pode aumentar o consumo de combustível e a gestão da mistura fica parcialmente comprometida.

## Como confirmar o diagnóstico antes de trocar qualquer peça

O primeiro passo é a leitura com scanner OBD2. Qualquer scanner ELM327 com aplicativo compatível já é suficiente para ler os códigos e verificar o histórico de falhas. Confirme que os códigos são P0136 e/ou P0141 e verifique se há outros códigos no histórico.

Com os códigos confirmados, o passo seguinte é inspecionar o escapamento em busca de vazamentos antes do sensor. Um vazamento de gases quentes próximo ao sensor pode causar leituras erráticas e gerar falsa indicação de defeito no sensor. Verifique as juntas do coletor de escapamento e as conexões entre o motor e o catalisador.

Inspecione o chicote elétrico do sensor 2. Procure fios partidos, conectores oxidados ou trechos do chicote encostando na parte quente do escapamento. Chicote danificado gera P0141 sem que o sensor esteja defeituoso.

Se o escapamento estiver sem vazamentos e o chicote estiver íntegro, o sensor é o componente defeituoso.

<aside class="telltale ok" role="note"><span aria-hidden="true">✅</span><p><strong>Teste rápido de chicote.</strong> Com o carro frio e desligado, desconecte o conector do sensor 2 e meça a resistência entre os pinos do circuito de aquecimento com um multímetro. A resistência esperada fica entre 2 e 30 ohms dependendo do sensor. Resistência infinita (circuito aberto) confirma que o resistor interno do sensor queimou, gerando P0141.</p></aside>

## A substituição do sensor

O sensor pós-catalisador do Virtus 1.0 TSI fica rosqueado na parte traseira do catalisador, acessível por baixo do carro. A troca exige o soquete específico para sensor lambda, com fenda lateral para passar o chicote, geralmente de 22 mm.

Antes de remover o sensor, aplique penetrante nas roscas se o carro tiver muitos quilômetros, pois a exposição ao calor e à ferrugem pode gripar o sensor no corpo do escapamento. Aplique produto antitravamento para alta temperatura nas roscas do sensor novo antes de instalar.

Use peça de fabricantes de qualidade: Bosch, Delphi e NGK fabricam sensores lambda compatíveis com o EA211, com a ficha de conexão correta para o chicote original do Virtus. Sensores universais que exigem emenda no chicote devem ser evitados.

Após a instalação, apague os códigos com o scanner e faça um ciclo de condução completo. O sistema de monitoramento do motor precisa completar os ciclos de diagnóstico (readiness monitors) para confirmar que o sensor está operando dentro dos parâmetros corretos.

## O que fazer se a luz voltar após a troca

Se o P0136 ou P0141 retornar após a troca do sensor, há quatro possibilidades a investigar.

A primeira é que o sensor instalado seja incompatível ou com defeito de fabricação. Confirme a compatibilidade da peça com o número da parte original VW.

A segunda é que o chicote elétrico tenha um problema intermitente que não foi identificado na inspeção inicial. Mancais de conector com oxidação sutil podem reaparecer como falha após algumas horas de uso.

A terceira é que haja um vazamento no escapamento que estava presente na inspeção e não foi identificado, contaminando o novo sensor.

A quarta, e mais complexa, é que o catalisador esteja deteriorado e esteja gerando leituras que levam o módulo a interpretar o sinal do sensor como falha. Nesse caso, o P0420 costuma surgir junto ou aparecer logo após a troca do sensor.

<aside class="telltale danger" role="note"><span aria-hidden="true">⛔</span><p><strong>Não troque o catalisador sem diagnóstico confirmado.</strong> O catalisador do Virtus 1.0 TSI é uma peça cara, entre R$ 2.500 e R$ 5.000 em peça original. Trocar o catalisador sem confirmar o P0420 no scanner, ou sem afastar o sensor como causa do problema, é um erro de diagnóstico que não resolve a falha e gera custo desnecessário.</p></aside>

## Custo e cobertura de garantia

O sensor lambda pós-catalisador em peça original VW fica entre R$ 350 e R$ 550. Peças de fabricantes como Bosch ou Delphi ficam entre R$ 200 e R$ 380. A mão de obra em oficinas independentes fica em torno de R$ 80 a R$ 150, tornando o custo total entre R$ 300 e R$ 650.

Se o Virtus estiver dentro da garantia VW (3 anos ou 100.000 km, o que vier primeiro), a substituição do sensor lambda é coberta pela garantia. Leve o carro à concessionária com o código armazenado no módulo sem apagá-lo previamente. O histórico de falhas é a evidência que o técnico usa para confirmar a cobertura.

## Resumo do diagnóstico

O check engine com P0136 ou P0141 no Virtus 1.0 TSI indica falha no sensor de oxigênio pós-catalisador, um defeito documentado no motor EA211 com aparecimento típico entre 30.000 e 80.000 km.

O diagnóstico correto começa com a leitura dos códigos no scanner OBD2, passa pela inspeção do escapamento e do chicote elétrico, e confirma o sensor como causa antes de qualquer troca. A substituição com peça de fabricante reconhecido e a verificação dos readiness monitors após a troca fecham o reparo na esmagadora maioria dos casos.

Problemas que persistem após a troca do sensor apontam para catalisador degradado ou falha no chicote elétrico, exigindo diagnóstico mais aprofundado antes de avançar para peças de maior custo.
