@echo off
REM Ciclo diario de indexacao do Hachiroku (Tarefa Agendada do Windows).
REM build -> Google Indexing (proximas 200 nao enviadas) -> IndexNow. Loga em .secrets\.
setlocal
cd /d "C:\Users\User\Saquad de seo\hachiroku"
set LOG=.secrets\daily-index.log

echo. >> "%LOG%"
echo ===== INICIO %DATE% %TIME% ===== >> "%LOG%"

REM Sincroniza com o remoto sem criar conflitos (tolerante a falha).
call git pull --ff-only origin master >> "%LOG%" 2>&1

REM Gera o sitemap atualizado.
call npm run build >> "%LOG%" 2>&1

REM Google: proximas 200 URLs ainda nao notificadas (estado em .secrets).
call node scripts\google-index.mjs >> "%LOG%" 2>&1

REM IndexNow: Bing/Yandex/Seznam (so efetiva apos a verificacao do dominio).
call node scripts\indexnow-submit.mjs >> "%LOG%" 2>&1

echo ===== FIM %DATE% %TIME% ===== >> "%LOG%"
endlocal
