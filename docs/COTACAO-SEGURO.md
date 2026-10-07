# Cotação de seguro auto: portas públicas

Função: `api/cotacao.js` (Vercel Function). Formulário: `src/components/ui/CotacaoSeguro.astro`.
Gate: `node scripts/check-cotacao.mjs` (sem rede).

## Variáveis de ambiente novas (Vercel: Settings, Environment Variables)

| Variável | Obrigatória | O que é |
|---|---|---|
| `COTACAO_SEGREDO` | sim | Segredo do token do formulário, 16 caracteres ou mais (sugestão: 48 hex, `node -e "console.log(require('crypto').randomBytes(24).toString('hex'))"`). Sem ela, GET e POST respondem 503 e o log diz só que falta. Trocar o valor invalida os tokens de quem está com o pop-up aberto (a pessoa vê o aviso de erro e tenta de novo). |
| `COTACAO_ORIGENS_EXTRAS` | não | Origens https extras aceitas no POST, separadas por vírgula, comparação exata (ex.: `https://hachiroku-git-main-equipe.vercel.app`). Valor em http, com caminho ou com curinga é ignorado. |

As de antes continuam: `CRM_URL`, `CRM_CHAVE`, `GOOGLE_SA_JSON`, `COTACAO_SHEET_ID`,
`COTACAO_SHEET_TAB`, `RESEND_API_KEY`, `EMAIL_ADMIN`, `EMAIL_REMETENTE`, `CRON_SECRET`.

## Regras do POST /api/cotacao/

1. **Origem**: só `https://hachiroku.com.br`, `https://www.hachiroku.com.br` e as de
   `COTACAO_ORIGENS_EXTRAS`. Nenhum curinga: um preview `*.vercel.app` qualquer recebe 403.
   `localhost` só em desenvolvimento (`VERCEL_ENV=development`, ou fora da Vercel sem
   `NODE_ENV=production`).
2. **Limite por IP**: 5 envios a cada 10 minutos (janela deslizante), IP pelo primeiro valor
   do `x-forwarded-for` (ou `x-real-ip`). Acima disso, 429 com mensagem genérica. Vale **por
   instância** da função: com várias instâncias no ar, cada uma conta os seus.
3. **Tamanho**: até 8 KB em bytes. `Content-Length` acima disso recusa sem ler; sem ele, a
   leitura em fluxo para no primeiro byte a mais. Resposta 413.
4. **Token do servidor**: o pop-up pede `GET /api/cotacao/` ao abrir (nunca antes) e recebe
   `{ token }`, com `Cache-Control: no-store`. O token é
   `base64url("<ms>.<aleatório>.<HMAC-SHA256(COTACAO_SEGREDO, "<ms>.<aleatório>")>")`.
   O POST trata como robô (responde 200 e descarta, sem ensinar o robô) o token ausente,
   forjado (assinatura comparada em tempo constante), com menos de 2,5 s ou mais de 2 h no
   relógio do servidor, ou já usado num pedido aceito nesta instância. Depois de um 502 ou
   de um 422 o mesmo token segue valendo, para a pessoa tentar de novo. O `tempoMs` do
   navegador e a armadilha `empresa` continuam como sinais extras.
5. **Log**: só códigos e motivos fixos (ex.: `GOOGLE_SA_JSON inválido`, `Sheets HTTP 403`,
   `token vencido`). Nunca a mensagem crua do erro (o `JSON.parse` ecoa trecho da chave),
   nem o segredo, nem dado do pedido.

O formulário renova o token se ele tiver mais de 1 h 50 min e, se o token for recém-pedido,
espera completar 2,6 s antes de enviar. Sem token (rede caiu), mostra o aviso de erro em vez
de enviar um pedido que seria descartado calado.

## Regra recomendada no Firewall da Vercel

O limite em memória é por instância. O teto que vale para o site inteiro fica no Firewall
da Vercel (projeto, aba Firewall, Configure, New Rule), como regra personalizada:

| Campo | Valor sugerido |
|---|---|
| Nome | Cotação: rate limit por IP |
| Se | Request Path **starts with** `/api/cotacao` **e** Method **equals** `POST` |
| Então | Rate Limit, algoritmo de janela fixa, chave **IP**, **5 requisições a cada 600 s** |
| Ação ao exceder | Deny (429) |

Uma segunda regra, mais folgada, cobre o GET do token (abrir o pop-up):
Path starts with `/api/cotacao` e Method equals `GET`, chave IP, 30 requisições a cada 600 s.

Antes de salvar, confira no painel se o plano da conta permite a janela de 600 s e o número
de regras de rate limit; se a janela máxima for menor, mantenha a proporção (ex.: 1 a cada
60 s). Publique a regra primeiro em modo **Log** por um dia, confira em Firewall, Traffic,
que só robôs batem no limite, e então troque para **Deny**.
