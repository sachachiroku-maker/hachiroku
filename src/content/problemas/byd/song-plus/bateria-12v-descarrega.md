---
title: "BYD Song Plus DM-i: Bateria de 12V Descarrega — Diagnóstico"
description: "Bateria de 12V do BYD Song Plus DM-i descarrega? Entenda por que isso acontece em híbridos plug-in e como diagnosticar com multímetro. (156 chars)"
entidade:
  marca: "BYD"
  modelo: "Song Plus"
  motor: "DM-i 1.5 NA + motor elétrico"
  geracao: "Primeira geração (2022–)"
defeito: "Bateria auxiliar de 12V descarrega com carro parado ou após uso frequente"
kicker: "DEFEITO CRÔNICO"
intencao: "Diagnóstico"
entidadesEssenciais: ["BYD Song Plus DM-i", "bateria 12V auxiliar", "sistema híbrido plug-in"]
autor:
  nome: "Redação Hachiroku"
pubDate: 2026-06-20
updatedDate: 2026-06-20
disclaimer: "Este artigo é educativo. Sempre consulte um técnico especializado em veículos eletrificados antes de intervir no sistema elétrico do seu veículo."
imagem: "/logos/hachiroku-badge-86.png"
imagemAlt: "Diagnóstico de bateria 12V descarregando no BYD Song Plus DM-i"
faq:
  - pergunta: "A bateria de 12V do BYD Song Plus é a mesma que move o carro?"
    resposta: "Não. O Song Plus DM-i possui duas baterias separadas: a de tração (8,3 kWh de lítio-ferro-fosfato) e a auxiliar de 12V de chumbo-ácido, que alimenta o sistema elétrico convencional, como central multimídia, módulos de controle e iluminação."
  - pergunta: "Por que a bateria de 12V descarrega mesmo com o carro na garagem?"
    resposta: "Módulos eletrônicos do Song Plus (BMS, central de conectividade, alarme e outros) mantêm consumo parasita quando o veículo está desligado. Se esse consumo ultrapassar 50 mA por período prolongado, a bateria de 12V esvazia em 2 a 5 dias."
  - pergunta: "Como medir o consumo parasita no BYD Song Plus DM-i?"
    resposta: "Com multímetro em modo amperímetro, desconecte o terminal negativo da bateria de 12V e insira o multímetro em série entre o cabo e o terminal. Aguarde 10 minutos para os módulos entrarem em modo sleep. Leitura acima de 50 mA indica corrente de fuga."
  - pergunta: "O alternador do Song Plus DM-i carrega a bateria de 12V da mesma forma que um carro convencional?"
    resposta: "Não exatamente. No DM-i, a recarga da bateria de 12V é feita por um DC-DC converter que retira energia da bateria de tração. Quando a bateria de tração está muito baixa, a recarga da 12V pode ser insuficiente, acelerando o desgaste da auxiliar."
  - pergunta: "Quanto tempo dura a bateria de 12V do BYD Song Plus?"
    resposta: "Em uso normal, a bateria auxiliar de 12V dura entre 2 e 4 anos. Em híbridos plug-in, o ciclo de recarga é diferente do convencional, o que pode reduzir a vida útil para 18 a 24 meses em casos de uso intenso ou descargas profundas repetidas."
passos:
  - nome: "Meça a tensão da bateria de 12V em repouso"
    texto: "Com o carro desligado por pelo menos 2 horas, use um multímetro nos terminais da bateria de 12V. Tensão abaixo de 12,4 V indica bateria parcialmente descarregada. Abaixo de 12,0 V, a bateria já está comprometida e precisa de recarga imediata."
  - nome: "Verifique o consumo parasita (corrente de fuga)"
    texto: "Desligue todos os acessórios e conecte o multímetro em série no terminal negativo. Aguarde 10 a 15 minutos para que os módulos entrem em modo sleep. Leituras acima de 50 mA indicam corrente de fuga anormal. Identifique o circuito culpado retirando fusíveis um a um."
  - nome: "Cheque o funcionamento do DC-DC converter"
    texto: "Com o carro em modo READY (pronto para uso), meça a tensão na bateria de 12V. O DC-DC converter deve manter entre 13,5 V e 14,5 V. Tensão abaixo de 13,5 V com o sistema ativo indica falha no converter ou na bateria de tração com carga insuficiente."
  - nome: "Teste a capacidade real da bateria com carga"
    texto: "Use um testador de bateria de condutância (padrão CCA) compatível com baterias de chumbo-ácido. Compare o resultado com a especificação da bateria original do Song Plus. Capacidade abaixo de 70% do valor nominal indica substituição necessária."
  - nome: "Verifique atualizações de software e recalls"
    texto: "Leve o veículo à concessionária BYD autorizada para verificar se há atualizações de firmware do BMS ou TSBs (Boletins de Serviço Técnico) relacionados ao consumo parasita. Alguns lotes do Song Plus receberam atualização que corrige o comportamento do módulo de conectividade."
afiliados:
  - produto: "Multímetro digital automotivo com função amperímetro"
    nota: "Essencial para medir tensão e corrente de fuga na bateria de 12V. Escolha um modelo com capacidade de leitura até 10A em corrente contínua."
    busca: "multímetro digital automotivo amperímetro"
    programa: "amazon"
    cta: "Ver produto"
  - produto: "Testador de bateria automotivo condutância CCA"
    nota: "Permite testar a capacidade real da bateria de 12V sem desconectá-la do veículo. Compatível com baterias de chumbo-ácido."
    busca: "testador bateria automotivo condutancia CCA"
    programa: "mercadoLivre"
relacionados:
  - titulo: "Toyota Yaris: Bateria Fraca Descarrega — Diagnóstico"
    url: "/problemas/toyota/yaris/bateria-fraca-descarrega"
  - titulo: "Renault Sandero: Bateria Descarrega — Corrente de Fuga"
    url: "/problemas/renault/sandero/bateria-fraca-descarrega"
pontosChave:
  - "Sintoma: BYD Song Plus DM-i não dá partida após ficar parado por 2 a 5 dias, central multimídia não inicializa ou aparece mensagem de sistema elétrico fraco"
  - "Causa: corrente de fuga de módulos eletrônicos acima de 50 mA, falha no DC-DC converter ou bateria de 12V envelhecida com capacidade abaixo de 70%"
  - "Acao: medir tensão em repouso, identificar consumo parasita com multímetro em série, verificar funcionamento do DC-DC converter e testar capacidade da bateria"
  - "Atencao: nunca deixar o Song Plus plugado na tomada de CA por dias sem verificar a saúde da bateria de 12V — o sistema de carregamento da tração não garante recarga da auxiliar em todos os cenários"
fontes:
  - { titulo: "BYD Song Plus DM-i — Manual do Proprietário (versão BR)", url: "https://www.byd.com/br" }
  - { titulo: "SAE J537 — Storage Batteries (especificação de bateria automotiva)", url: "https://www.sae.org/standards/content/j537_202111/" }
  - { titulo: "ABNT NBR 15938 — Veículos Elétricos e Híbridos: requisitos de segurança", url: "https://www.abnt.org.br" }
draft: false
---

<strong>A bateria de 12V do BYD Song Plus DM-i descarrega e deixa o carro sem vida. O motor elétrico e a bateria de tração estão perfeitos, mas o carro não dá partida.</strong> Esse cenário confunde proprietários que esperam que um híbrido plug-in seja imune a esse tipo de problema. A realidade é que o Song Plus carrega consigo dois sistemas elétricos distintos, e o mais vulnerável é exatamente o mais antigo: a boa e velha bateria de 12V de chumbo-ácido.

Este artigo explica por que esse problema acontece, como identificá-lo com equipamentos simples e o que você pode fazer antes de ir à concessionária.

## Por que o BYD Song Plus tem duas baterias?

O Song Plus DM-i é um híbrido plug-in (PHEV). Isso significa que ele possui um motor de combustão 1.5 NA trabalhando em conjunto com um motor elétrico alimentado por uma bateria de tração de 8,3 kWh de lítio-ferro-fosfato (LFP).

Essa bateria de alta tensão é responsável por mover o carro. Ela opera em tensões que chegam a centenas de volts e possui seu próprio sistema de gestão eletrônico, o BMS (Battery Management System).

A bateria de 12V, por outro lado, é a bateria convencional. Ela alimenta tudo que você conhece de um carro tradicional: central multimídia, módulos de controle eletrônico, iluminação interna, alarme, trava elétrica das portas e o próprio BMS em modo de espera.

<aside class="telltale info" role="note"><span aria-hidden="true">ℹ️</span><p><strong>Dois sistemas, um problema.</strong> A bateria de tração pode estar com 80% de carga e o carro mesmo assim não liga se a bateria de 12V estiver morta. São circuitos completamente independentes.</p></aside>

Nos carros convencionais, o alternador recarrega a bateria de 12V enquanto o motor funciona. No DM-i, quem faz esse trabalho é um conversor DC-DC. Ele pega energia da bateria de alta tensão e a converte em 12V-14V para manter a auxiliar carregada.

Esse processo funciona quando o veículo está no modo READY (pronto para uso). Quando o carro fica parado por dias sem ser ligado, a recarga não acontece e os consumidores em standby drenam a bateria de 12V até zerá-la.

## Sintomas que indicam problema na bateria de 12V

Reconhecer o sintoma certo evita diagnósticos errados e custos desnecessários. No Song Plus DM-i, a bateria de 12V fraca ou descarregada se manifesta de formas específicas.

O sintoma mais claro é o carro que não responde ao botão de partida. Você aperta o botão, nada acontece. As luzes do painel podem piscar fracamente ou nem acender. A central multimídia fica preta.

Em casos menos graves, o carro pode até entrar em modo READY, mas apresentar mensagens de alerta no painel como "Sistema Elétrico: Verifique" ou "Energia Auxiliar Baixa". A multimídia pode reinicializar sozinha durante a viagem.

<aside class="telltale danger" role="note"><span aria-hidden="true">⛔</span><p><strong>Não ignore os alertas de sistema elétrico.</strong> Mensagens de energia auxiliar baixa no Song Plus indicam que a bateria de 12V está próxima do limite crítico. Ignorar pode resultar em pane elétrica total longe de casa.</p></aside>

Outro sintoma comum é o carro que funciona normalmente durante o dia, mas na manhã seguinte não liga. Isso acontece quando a bateria já tem capacidade reduzida e o consumo parasita noturno é suficiente para esvaziá-la.

## O papel do consumo parasita (corrente de fuga)

Todo carro moderno tem consumo elétrico em standby. O Song Plus, com seus múltiplos módulos de conectividade, sistema de alarme sofisticado e BMS ativo, tem consumo parasita mais alto que um carro convencional de mesma categoria.

O valor aceitável para consumo parasita em veículos modernos é de até 50 mA (miliamperes) após os módulos entrarem em modo sleep, que normalmente ocorre entre 5 e 15 minutos após desligar o carro. Valores acima disso indicam que algum módulo está em estado de alerta ou com defeito.

<aside class="telltale" role="note"><span aria-hidden="true">⚠️</span><p><strong>Cuidado com acessórios instalados após a venda.</strong> Rastreadores, câmeras de ré adicionais e alarmes aftermarket são fontes comuns de consumo parasita excessivo no Song Plus. Sempre verifique instalações acessórias antes de suspeitar de falha original de fábrica.</p></aside>

Com 100 mA de consumo parasita e uma bateria de 45 Ah (especificação típica da auxiliar do Song Plus), o cálculo é simples: a bateria se esvazia em aproximadamente 450 horas, ou cerca de 18 dias, se estiver com 100% de capacidade. Com uma bateria desgastada com 50% de capacidade real, esse tempo cai para menos de 9 dias.

Na prática, proprietários relatam descarga em 2 a 5 dias, o que indica consumo parasita acima do normal combinado com bateria já envelhecida.

## Como medir a tensão da bateria de 12V

Esta é a primeira medição que você deve fazer. Você precisa de um multímetro digital básico, disponível por menos de R$ 80 em qualquer loja de autopeças.

Localize a bateria de 12V no compartimento do motor do Song Plus. Ela fica no lado esquerdo do compartimento, identificada com os terminais positivo (vermelho, com sinal +) e negativo (preto, com sinal -).

Com o carro completamente desligado por pelo menos 2 horas, conecte as pontas do multímetro nos terminais correspondentes. Selecione a função de tensão em corrente contínua (DCV ou VDC).

Interprete os resultados assim:

- 12,6 V a 12,8 V: bateria totalmente carregada e saudável
- 12,4 V a 12,6 V: bateria com carga parcial, aceitável
- 12,0 V a 12,4 V: bateria descarregada, precisa de recarga
- Abaixo de 12,0 V: bateria em estado crítico, risco de sulfatação

<aside class="telltale ok" role="note"><span aria-hidden="true">✅</span><p><strong>Dica de medição.</strong> Para resultado mais preciso, realize a medição de manhã cedo, antes de qualquer tentativa de ligar o carro. A tensão em repouso após 8 horas é o indicador mais confiável do estado real da bateria.</p></aside>

## Como medir o consumo parasita com multímetro

Esta medição exige um pouco mais de atenção, mas é totalmente acessível para quem tem alguma familiaridade com ferramentas básicas.

Você vai precisar de um multímetro com função de amperímetro capaz de medir até 10A em corrente contínua. A maioria dos multímetros digitais de entrada inclui essa função.

Primeiro, desligue o carro completamente e aguarde 15 minutos com as portas fechadas. Isso permite que todos os módulos entrem em modo sleep. Com o carro já em repouso, desconecte o cabo do terminal negativo da bateria de 12V.

Configure o multímetro em modo amperímetro (A DC). Conecte a ponta vermelha do multímetro ao cabo que você acabou de desconectar e a ponta preta ao terminal negativo da bateria. Agora o multímetro está em série no circuito e mede toda a corrente de fuga.

Aguarde 10 minutos com tudo assim e leia o valor. Lembre-se: acima de 50 mA é anormal para o Song Plus em repouso.

<aside class="telltale danger" role="note"><span aria-hidden="true">⛔</span><p><strong>Atenção ao conectar o amperímetro.</strong> Nunca conecte o multímetro em modo amperímetro diretamente nos terminais da bateria sem o circuito em série. Isso cria um curto-circuito e pode danificar o multímetro ou a bateria.</p></aside>

Se a leitura estiver alta, comece a retirar fusíveis um a um do bloco de fusíveis do Song Plus, localizado no compartimento do motor. Quando a leitura cair subitamente, o circuito correspondente ao fusível removido é o responsável pela corrente de fuga excessiva.

## O DC-DC converter: o "alternador" do Song Plus

Em carros convencionais, o alternador é o componente que mantém a bateria de 12V carregada enquanto o motor funciona. No Song Plus DM-i, essa função pertence ao conversor DC-DC.

O conversor pega a energia de alta tensão da bateria de tração e a converte em 12V-14V para alimentar o sistema auxiliar e recarregar a bateria de 12V.

Para verificar se o DC-DC está funcionando corretamente, ligue o carro em modo READY (com o botão de partida pressionado completamente, com o pé no freio) e meça a tensão na bateria de 12V novamente.

Com o sistema ativo, você deve ver tensão entre 13,5 V e 14,5 V. Esse é o sinal de que o conversor está injetando energia na bateria de 12V, assim como faria um alternador convencional.

<aside class="telltale" role="note"><span aria-hidden="true">⚠️</span><p><strong>Bateria de tração muito baixa afeta a recarga da 12V.</strong> Se o Song Plus estiver com a bateria de tração abaixo de 15% de carga, o conversor DC-DC pode operar com potência reduzida. Sempre mantenha a bateria de tração com pelo menos 20% para garantir recarga adequada da auxiliar.</p></aside>

Se a tensão no modo READY ficar abaixo de 13,5 V, o diagnóstico aponta para falha no DC-DC converter ou para um problema no BMS que está limitando a transferência de energia. Esse diagnóstico específico requer scanner automotivo compatível com BYD para leitura de dados ao vivo.

## Testando a capacidade real da bateria

Medir a tensão em repouso indica o estado de carga atual, mas não revela a capacidade real da bateria. Uma bateria pode mostrar 12,6 V em repouso e mesmo assim não ter energia suficiente para manter o Song Plus operando por mais de 24 horas parado.

O teste mais preciso usa um testador de bateria por condutância elétrica, também chamado de testador CCA. Esse equipamento aplica uma carga controlada na bateria por milissegundos e calcula a capacidade real com base na resposta elétrica, sem descarregar a bateria.

O resultado é mostrado em porcentagem da capacidade nominal. Baterias com menos de 70% da capacidade original precisam ser substituídas, mesmo que a tensão em repouso pareça normal.

<aside class="telltale info" role="note"><span aria-hidden="true">ℹ️</span><p><strong>Especificação da bateria original.</strong> O BYD Song Plus DM-i utiliza bateria auxiliar de 12V com capacidade entre 40 Ah e 45 Ah e especificação CCA compatível com o mercado brasileiro. Consulte o manual ou a concessionária para confirmar a especificação exata antes de substituir.</p></aside>

## Atualização de software e boletins técnicos

Alguns proprietários do Song Plus no Brasil relataram melhora no consumo parasita após atualização de firmware realizada pela concessionária. O módulo de conectividade do veículo, responsável pela comunicação com o aplicativo BYD e pelos sistemas de acesso remoto, foi apontado como um dos componentes com comportamento anormal em standby em lotes iniciais.

Antes de substituir a bateria de 12V, leve o veículo a uma concessionária BYD autorizada e solicite explicitamente a verificação de TSBs (Technical Service Bulletins) relacionados ao sistema elétrico auxiliar e ao consumo parasita.

<aside class="telltale ok" role="note"><span aria-hidden="true">✅</span><p><strong>Peça o relatório de diagnóstico.</strong> A concessionária tem acesso ao scanner BYD Diag que lê falhas específicas do sistema de gestão de energia. Solicite a impressão do relatório para ter documentado o diagnóstico antes de autorizar qualquer serviço.</p></aside>

## Quando substituir a bateria de 12V

A substituição é necessária quando qualquer uma destas condições for confirmada:

- Tensão em repouso abaixo de 12,0 V mesmo após recarga completa
- Capacidade real abaixo de 70% no teste de condutância CCA
- Bateria com mais de 3 anos de uso em híbrido plug-in
- Episódios repetidos de descarga completa (sulfatação acumulada)

A bateria de 12V do Song Plus é uma bateria convencional de chumbo-ácido AGM ou convencional, dependendo da especificação do lote. A substituição pode ser feita por qualquer técnico automotivo competente, não exigindo equipamento de alta tensão.

<aside class="telltale" role="note"><span aria-hidden="true">⚠️</span><p><strong>Cuidado com a codificação da bateria.</strong> Alguns sistemas do Song Plus, como o módulo de controle de energia, podem precisar ser informados sobre a troca da bateria via scanner. Confirme com o técnico se há procedimento de codificação após a substituição.</p></aside>

## Dicas para prolongar a vida da bateria de 12V

Uma vez resolvido o problema imediato, algumas práticas ajudam a evitar a recorrência.

Evite deixar o Song Plus parado por mais de 5 dias sem ligá-lo pelo menos uma vez para que o DC-DC converter recarregue a auxiliar. Se você vai viajar e o carro vai ficar na garagem, conecte-o à tomada de CA para que o sistema de gerenciamento mantenha os níveis de energia.

Desinstale acessórios aftermarket que ficam ligados em standby, como rastreadores de baixa qualidade ou câmeras com módulo de estacionamento sempre ativo. Esses equipamentos consomem energia constantemente e aceleram a descarga da bateria de 12V.

<aside class="telltale info" role="note"><span aria-hidden="true">ℹ️</span><p><strong>Carregador de manutenção.</strong> Um carregador inteligente de bateria de 12V (tipo "float charger" ou carregador de manutenção) conectado ao terminal da auxiliar durante períodos de inatividade prolongada é uma solução prática e econômica para evitar descargas profundas.</p></aside>

Mantenha a bateria de tração com pelo menos 20% de carga. O DC-DC converter opera com máxima eficiência quando a bateria de alta tensão tem carga suficiente para alimentar o sistema auxiliar adequadamente.

## Resumo do diagnóstico

O problema de bateria de 12V descarregando no BYD Song Plus DM-i tem três causas principais: consumo parasita excessivo de módulos eletrônicos, falha ou operação limitada do DC-DC converter e bateria de 12V envelhecida com capacidade insuficiente.

O diagnóstico correto segue uma sequência lógica: primeiro medir a tensão em repouso, depois verificar o consumo parasita com amperímetro, em seguida checar o funcionamento do DC-DC converter com o carro em modo READY e por fim testar a capacidade real da bateria com testador de condutância CCA.

<aside class="telltale ok" role="note"><span aria-hidden="true">✅</span><p><strong>Não descarte a busca por atualizações.</strong> Antes de gastar com substituição de peças, verifique se há TSBs ou atualizações de firmware disponíveis para o seu Song Plus. A BYD Brasil disponibilizou atualizações que corrigiram o consumo parasita em lotes específicos sem custo para o proprietário.</p></aside>

O Song Plus DM-i é um veículo confiável, mas a bateria de 12V é o seu ponto de atenção mais recorrente. Tratar esse componente com o mesmo cuidado que se dá à bateria de tração resolve a grande maioria dos casos relatados por proprietários brasileiros.
