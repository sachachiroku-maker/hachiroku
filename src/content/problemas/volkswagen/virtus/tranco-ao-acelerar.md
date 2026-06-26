---
title: "Volkswagen Virtus: Tranco ao acelerar — câmbio automático 6AT / DSG"
seoTitle: "Volkswagen Virtus"
description: "Tudo sobre Tranco ao acelerar — câmbio automático 6AT / DSG no Volkswagen Virtus --- diagnostico, causas, custos e como resolver. Guia pratico com informacoes verificadas."
entidade:
  marca: "Volkswagen"
  modelo: "Virtus"
  motor: "EA211 1.0 TSI"
  geracao: "2018-atual"
defeito: "Tranco ao acelerar — câmbio automático 6AT / DSG"
kicker: "PROBLEMA DOCUMENTADO · VW VIRTUS"
entidadesEssenciais:
  - "EA211 1.0 TSI"
  - "câmbio automático 6AT Aisin"
  - "câmbio DSG DQ200"
  - "adaptação de câmbio"
  - "tranco na troca de marcha"
pontosChave:
  - "Virtus 1.0 TSI oferece câmbio automático 6AT (Aisin) ou DSG 7 marchas (DQ200) dependendo da versão."
  - "Tranco do DSG em velocidade baixa (0-20 km/h) é característica conhecida do DQ200 (câmbio seco)."
  - "Tranco do 6AT indica ATF degradado ou válvula solenoide com defeito."
  - "Atualização de software da ECU do câmbio pode resolver trancos em DSG nas primeiras 60.000 km."
  - "Adaptação da embreagem (procedimento em scanner) é necessária após qualquer troca de fluido no DSG."
faq:
  - pergunta: "Por que o Virtus 1.0 TSI dá trancos ao acelerar?"
    resposta: "Depende do câmbio: (1) DSG DQ200 (7 marchas seco): trancos em velocidade baixa são conhecidos e podem piorar com fluido degradado. Solução: troca do fluido DSG (G052182A2) + adaptação da embreagem. (2) Automático 6AT Aisin: trancos indicam ATF degradado ou variação de pressão no circuito hidráulico. Solução: troca do ATF (Dexron VI)."
  - pergunta: "A VW tem atualização de software para o tranco do DSG?"
    resposta: "Sim. Em vários casos, a VW emitiu atualizações de software do TCM (Transmission Control Module) para o DQ200 que melhoram o comportamento em velocidades baixas. Verificar em concessionária VW se há TSB (Technical Service Bulletin) aplicável para o ano/versão do seu Virtus."
  - pergunta: "Quanto custa resolver o tranco do câmbio DSG do Virtus?"
    resposta: "Troca do fluido DSG: R$ 350-600 (fluido + mão de obra). Adaptação da embreagem após troca: R$ 100-200 (tempo de scanner). Atualização de software: geralmente gratuita em concessionária se o veículo ainda está na garantia. Total: R$ 450-800 no pior caso."
passos:
  - nome: "Identificar o câmbio (DSG ou automático 6AT)"
    texto: "Verificar no manual ou na plaqueta do câmbio. DSG = alavanca com posições P/R/N/D/S e '+/-'. Automático = alavanca convencional com posições P/R/N/D/3/2/L."
  - nome: "Verificar se há código de falha no câmbio"
    texto: "Scanner OBD2 pode ler códigos do TCM (Transmission Control Module). Código P07XX ou P08XX indica falha de troca de marcha. Atualização de software pode resolver se não há defeito mecânico."
  - nome: "Trocar o fluido do câmbio"
    texto: "DSG DQ200: fluido G052182A2. AT 6AT: Dexron VI. Nunca usar fluido genérico. Após troca, executar adaptação da embreagem (procedimento no scanner)."
  - nome: "Solicitar atualização de software em concessionária"
    texto: "Levar à concessionária com veículo na garantia. Informar o sintoma específico (tranco na faixa de X km/h). Verificar se há TSB aplicável."
autor:
  nome: "Redação Hachiroku"
pubDate: 2026-06-25
updatedDate: 2026-06-25
relacionados:
  - titulo: "Câmbio DCT/DSG: como funciona"
    url: "/tecnico/cambio-dct-como-funciona/"
  - titulo: "VW Polo TSI: problemas de câmbio"
    url: "/problemas/volkswagen/polo-tsi/consumo-alto-combustivel/"
  - titulo: "Câmbio automático: troca de ATF"
    url: "/manutencao/troca-oleo-cambio-automatico/"
draft: false
---

O tranco do câmbio é a queixa mais frequente do Virtus 1.0 TSI no Brasil — especialmente nas versões com câmbio DSG de 7 marchas. É um problema conhecido, com solução documentada pela VW.

## Por que o DSG DQ200 dá tranco no tráfego lento

O câmbio DSG DQ200 é um câmbio de dupla embreagem a seco. Embreagens a seco não possuem fluido para resfriamento entre as placas de atrito — quando o veículo opera na faixa crítica de 0-20 km/h (onde a embreagem precisa "patinar" para acomodar a diferença de velocidade), o calor acumula mais rapidamente.

O software do câmbio protege as embreagens limitando a quantidade de deslizamento — essa limitação se manifesta como o tranco que os usuários sentem ao sair lentamente de posição estacionada.

**Situações que pioram o tranco:**
- Tráfego stop-and-go intenso (aquece as embreagens)
- Subida lenta em rampa
- Temperatura ambiente alta (acima de 35°C)
- Fluido DSG degradado

## Diagnóstico: DSG vs. AT convencional

| Câmbio | Quando tranca | Causa | Solução |
|--------|-------------|-------|---------|
| DSG DQ200 (seco) | 0-20 km/h, tráfego lento | Característica + fluido | Fluido + software |
| DSG DQ250 (molhado) | Menos comum | Fluido degradado | Troca fluido |
| AT 6AT Aisin | Em qualquer velocidade | ATF degradado | Troca ATF |

O DQ250 (câmbio molhado, usado no Virtus 1.4 TSI e Taos) é significativamente mais tranquilo que o DQ200 em tráfego urbano.
