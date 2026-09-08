# Adendo ao diagnóstico: censo de índice das 411 URLs mudas

**Corrige a seção 2.5 e a Frente E do diagnóstico de 2026-09-08.** Aquilo era projeção de uma amostra
de 30. Isto é censo: as 411 URLs mudas mais as 7 órfãs, todas inspecionadas pela URL Inspection API em
2026-09-08, zero erro. Dado bruto em `marco-zero-2026-09-08/censo-indice.json`.

## 1. O que o censo mostra

| Estado no índice | URLs | % das mudas |
|---|---|---|
| Detectada, mas não indexada no momento | 218 | 53,0% |
| **Enviada e indexada** | **139** | **33,8%** |
| O Google não reconhece o URL | 52 | 12,7% |
| Rastreada, mas não indexada no momento | 2 | 0,5% |

A projeção anterior era de ordem de 200 fora do índice, com intervalo de confiança de 33,2% a 66,8%.
O número real é **272 fora do índice, 66,2%**, no topo do intervalo. A projeção não estava errada, mas
era larga demais para orientar decisão, e o censo custou uma execução de API.

## 2. A correção que muda o plano

O diagnóstico tratava as 411 como um problema só, do portão 1. O censo mostra **três problemas
distintos**, que pedem remédios diferentes e não devem ser atacados juntos.

| Grupo | n | O que é | Remédio |
|---|---|---|---|
| Indexadas e mudas | 139 | Estão no índice. 132 delas foram rastreadas nos **últimos 7 dias**, mediana de 3 dias. O Google busca, indexa e não serve. | Não é portão 1. É portão 2, relevância: a página não casa com demanda existente, ou casa e perde. Vai para a rodada da Onda 6, não para a Onda 2. |
| Detectadas e não indexadas | 218 | Descobertas, associadas ao sitemap, não selecionadas. | Seleção. Reenviar não resolve, já foi provado. O que muda seleção é qualidade percebida e sinal interno. |
| Sem registro no índice | 52 | O Google não tem dado nenhum sobre elas. | Descoberta. Ver a seção 3, que é o achado novo. |

**Um terço das URLs mudas não tem problema de indexação.** Qualquer trabalho de "destravar indexação"
aplicado a elas seria esforço no portão errado, que é exatamente o que este diagnóstico existe para
evitar.

## 3. As 52 sem registro: o achado novo

Foram testadas uma a uma, e o resultado elimina as explicações fáceis:

| Hipótese | Teste | Resultado |
|---|---|---|
| Não existem, ou devolvem erro | `curl` nas 51 com linha completa | **200 em 51 de 51** |
| São novas demais | data de criação no git dos 47 arquivos-fonte localizáveis | **todas de junho de 2026**, mesmo mês do grupo de controle |
| Não estão no sitemap | comparação com o `sitemap-0.xml` servido | **52 de 52 presentes** |
| O sitemap não chegou ao Google | API de sitemaps do Search Console | índice **baixado em 2026-09-08 às 16:32**, 760 URLs declaradas, **0 erro e 0 aviso** |
| São órfãs de link interno | grafo do build | o site inteiro tem 2 órfãs de corpo, e nenhuma delas está aqui |

Sobra uma leitura: as URLs existem, estão declaradas, estão linkadas, e o Google não as buscou.

**Ressalva honesta sobre o que o dado prova.** "O Google não reconhece o URL" é a forma da API dizer
que não há registro daquela URL nesta propriedade **no momento da consulta**. Não prova que o
Googlebot nunca passou; prova que não existe registro agora. A conclusão que se sustenta é sobre o
estado, não sobre a história.

Distribuição por silo: 31 em `/problemas/`, 9 em `/guia-de-compra/`, 6 em `/manutencao/`, 3 em
`/ficha-tecnica/`, 2 em `/tecnico/`, 1 em `/motor/`.

## 4. O teste de referência interna, e o que ele não prova

O campo `referringUrls` da API foi coletado para testar se a mudez se concentra em URLs sem
referência registrada.

| Grupo | Com referência reportada |
|---|---|
| Indexadas | 40,3% (56 de 139) |
| Detectadas e não indexadas | 28,4% (62 de 218) |
| Sem registro no índice | 0% (0 de 52) |
| Rastreadas e não indexadas | 0% (0 de 2) |

A diferença entre 40,3% e 28,4% é direcional e fraca, e o campo é descrito pela própria documentação
como exemplo, não como censo de backlinks internos. **Isso não sustenta causa.** O que sustenta
alguma coisa é o zero absoluto do terceiro grupo, e mesmo ele é coerente com a leitura simples de que
não existe registro nenhum sobre aquelas URLs, referência incluída.

## 5. As 7 órfãs, uma a uma

| URL | Estado | Último rastreio |
|---|---|---|
| `/problemas/chevrolet/onix/consumo-alto-combustivel-automatico/` | Enviada e indexada | **2026-06-26** |
| `/manutencao/como-verificar-bateria-carro/` | Enviada e indexada | 2026-06-26 |
| `/manutencao/como-verificar-oleo-do-motor/` | Enviada e indexada | 2026-06-30 |
| `/manutencao/sinais-alternador-com-problema/` | Enviada e indexada | 2026-06-30 |
| `/manutencao/verificar-nivel-oleo-motor/` | Rastreada, não indexada | 2026-06-26 |
| `/problemas/fiat/palio/fiat-palio-superaquecendo-causas-junta-de-cabecote-e-o/` | Sem registro | — |
| `/problemas/hyundai/hb20s/cambio-dificil-engatar/` | Sem registro | — |

**Isto dá urgência à trava do redirect, e o motivo é uma data.** A primeira linha segura 321
impressões e 2 cliques em 90 dias, enquanto o destino canônico tem zero impressão. Ela está indexada,
e o último rastreio é de **2026-06-26**. O stub que a substituiu, servido como HTTP 200 com `noindex`,
entrou em 2026-07-02, seis dias depois.

Ou seja: o Google ainda não viu o `noindex`. As 321 impressões vêm do conteúdo anterior ao stub, e
elas caem no dia em que ele recrawlar. A janela para trocar o stub por um 301 de verdade é finita e
já está aberta há 74 dias.

## 6. O que muda no plano

1. A Onda 2 deixa de mirar 411 URLs e passa a mirar 270: as 218 de seleção mais as 52 de descoberta.
2. As 139 indexadas e mudas saem do portão 1 e entram na rodada de relevância da Onda 6, com o recorte
   já pronto.
3. As 52 sem registro ganham item próprio na Onda 2, com o remédio de descoberta, e não o de
   indexação, que já foi provado nulo.
4. O conserto do redirect sobe de prioridade dentro da Onda 2, porque o ativo que ele protege está
   com prazo de validade contado pelo próximo rastreio.
5. A linha de medição "estado de índice na amostra travada, seed 11, 30 URLs" é substituída pelo censo
   das 411, que passa a ser o marco zero e é recapturável pelo mesmo script.
