"""Censo de indice das 411 URLs mudas + as 7 orfas. Grava coverageState,
lastCrawlTime e referringUrls. Item 2.8 e 0.4 do plano."""
import sys, json, time, datetime as dt
sys.stdout.reconfigure(encoding='utf-8')
from google.oauth2 import service_account
from googleapiclient.discovery import build

KEY = r"C:\Users\User\Saquad de seo\hachiroku\.secrets\google-indexing.json"
SITE = "sc-domain:hachiroku.com.br"
S = r"C:\Users\User\AppData\Local\Temp\claude\C--Users-User-Saquad-de-seo\5acc98ea-0ebb-43cb-b5d0-2b1192d8e0dc\scratchpad"
DEST = r"C:\Users\User\Saquad de seo\hachiroku\outputs\entity-ops\marco-zero-2026-09-08"

creds = service_account.Credentials.from_service_account_file(
    KEY, scopes=["https://www.googleapis.com/auth/webmasters.readonly"])
svc = build("searchconsole", "v1", credentials=creds, cache_discovery=False)

cob = json.load(open(S + r"\cobertura.json", encoding="utf-8"))
alvos = [("muda", u) for u in cob["zero"]] + [("orfa", u) for u in cob["orfas"]]
print("alvos:", len(alvos), flush=True)

res, erros = [], 0
for i, (tag, u) in enumerate(alvos, 1):
    try:
        r = svc.urlInspection().index().inspect(body={
            "inspectionUrl": u, "siteUrl": SITE, "languageCode": "pt-BR"}).execute()
        idx = r.get("inspectionResult", {}).get("indexStatusResult", {})
        res.append({"tag": tag, "url": u,
                    "verdict": idx.get("verdict"), "coverage": idx.get("coverageState"),
                    "robots": idx.get("robotsTxtState"), "indexing": idx.get("indexingState"),
                    "crawled": idx.get("lastCrawlTime"), "fetch": idx.get("pageFetchState"),
                    "canonical_google": idx.get("googleCanonical"),
                    "canonical_user": idx.get("userCanonical"),
                    "referring": idx.get("referringUrls", []),
                    "sitemaps": idx.get("sitemap", [])})
    except Exception as e:
        erros += 1
        res.append({"tag": tag, "url": u, "erro": str(e)[:160]})
    if i % 50 == 0:
        print(f"  {i}/{len(alvos)} (erros: {erros})", flush=True)
    time.sleep(0.35)

import os, collections
os.makedirs(DEST, exist_ok=True)
json.dump({"coletado_em": "2026-09-08", "site": SITE, "n": len(res), "registros": res},
          open(DEST + r"\censo-indice.json", "w", encoding="utf-8"), ensure_ascii=False, indent=1)

c = collections.Counter(r.get("coverage") or r.get("erro", "ERRO")[:40] for r in res if r["tag"] == "muda")
print("\n=== COBERTURA das mudas ===")
for k, v in c.most_common(): print(f"  {v:>4}  {k}")
so_sitemap = sum(1 for r in res if r["tag"] == "muda" and len(r.get("referring") or []) == 0)
com_ref = sum(1 for r in res if r["tag"] == "muda" and (r.get("referring") or []))
print(f"\nmudas sem referringUrls reportada: {so_sitemap} | com referencia: {com_ref}")
print("\n=== as 7 orfas ===")
for r in res:
    if r["tag"] == "orfa":
        print(f"  {str(r.get('coverage'))[:44]:<45} crawl={str(r.get('crawled'))[:10]}  {r['url'].replace('https://hachiroku.com.br','')}")
# cruzamento indexada x referencia
idxd = [r for r in res if r["tag"] == "muda" and r.get("coverage") == "Enviada e indexada"]
nidx = [r for r in res if r["tag"] == "muda" and r.get("coverage") == "Detectada, mas não indexada no momento"]
def pct(g): return round(100*sum(1 for r in g if (r.get("referring") or []))/len(g),1) if g else None
print(f"\nteste da hipotese de referencia:")
print(f"  indexadas com referencia reportada: {pct(idxd)}%  (n={len(idxd)})")
print(f"  detectadas-nao-indexadas com referencia: {pct(nidx)}%  (n={len(nidx)})")
print("\ngravado em", DEST + r"\censo-indice.json")
