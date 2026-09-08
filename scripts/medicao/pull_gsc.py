"""Coletor GSC do Hachiroku. Grava JSON datado em scripts/medicao/dados/.

Uso:  python pull_gsc.py 2026-09-05
Sem argumento, usa a data de hoje menos 3 dias (latencia do GSC).

Credencial: hachiroku/.secrets/google-indexing.json (SA fit-82@fits-493115, siteOwner).
Escopo: webmasters.readonly. Nada aqui escreve no GSC.
"""
import sys, json, datetime as dt
from pathlib import Path
sys.stdout.reconfigure(encoding='utf-8')
from google.oauth2 import service_account
from googleapiclient.discovery import build

BASE = Path(__file__).resolve().parents[2]
KEY = BASE / ".secrets" / "google-indexing.json"
DEST = Path(__file__).resolve().parent / "dados"
SITE = "sc-domain:hachiroku.com.br"
INICIO_SERIE = "2026-06-24"   # primeiro dia com dado. Nada existe antes.

def main():
    fim = dt.date.fromisoformat(sys.argv[1]) if len(sys.argv) > 1 else dt.date.today() - dt.timedelta(days=3)
    creds = service_account.Credentials.from_service_account_file(
        str(KEY), scopes=["https://www.googleapis.com/auth/webmasters.readonly"])
    svc = build("searchconsole", "v1", credentials=creds, cache_discovery=False)

    def q(dias, dims, limite=25000, tipo="web", filtro=None):
        corpo = {"startDate": str(fim - dt.timedelta(days=dias)), "endDate": str(fim),
                 "dimensions": dims, "rowLimit": limite, "type": tipo}
        if filtro:
            corpo["dimensionFilterGroups"] = filtro
        linhas, saida = svc.searchanalytics().query(siteUrl=SITE, body=corpo).execute().get("rows", []), []
        for r in linhas:
            saida.append({"chaves": r.get("keys", []), "cliques": r["clicks"], "impressoes": r["impressions"],
                          "ctr": round(r["ctr"], 5), "posicao": round(r["position"], 2)})
        return saida

    d = {"coletado_em": str(dt.date.today()), "fim_janela": str(fim), "inicio_serie": INICIO_SERIE,
         "site": SITE}
    d["total_90d"] = q(90, [])
    d["total_28d"] = q(28, [])
    d["serie_diaria"] = q(180, ["date"])
    d["paginas_90d"] = q(90, ["page"])          # sem truncar
    d["queries_90d"] = q(90, ["query"])         # sem truncar
    d["marca_180d"] = q(180, ["query"], filtro=[{"filters": [
        {"dimension": "query", "operator": "contains", "expression": "hachiroku"}]}])
    d["marca_hachi_180d"] = q(180, ["query"], filtro=[{"filters": [
        {"dimension": "query", "operator": "contains", "expression": "hachi"}]}])
    d["device_90d"] = q(90, ["device"])
    d["pais_90d"] = q(90, ["country"])
    d["imagem_90d"] = q(90, ["page"], tipo="image")

    # cobertura real da dimensao query, o numero que precisa constar em todo relatorio
    tot = d["total_90d"][0] if d["total_90d"] else {"cliques": 0, "impressoes": 0}
    sq = {"cliques": sum(r["cliques"] for r in d["queries_90d"]),
          "impressoes": sum(r["impressoes"] for r in d["queries_90d"]),
          "linhas": len(d["queries_90d"])}
    d["cobertura_dimensao_query"] = {
        "cliques_atribuidos": sq["cliques"], "cliques_totais": tot["cliques"],
        "impressoes_atribuidas": sq["impressoes"], "impressoes_totais": tot["impressoes"],
        "pct_cliques": round(100 * sq["cliques"] / tot["cliques"], 2) if tot["cliques"] else None,
        "pct_impressoes": round(100 * sq["impressoes"] / tot["impressoes"], 2) if tot["impressoes"] else None,
        "queries_distintas": sq["linhas"]}

    DEST.mkdir(parents=True, exist_ok=True)
    alvo = DEST / f"gsc-{fim}.json"
    alvo.write_text(json.dumps(d, ensure_ascii=False, indent=1), encoding="utf-8")
    print("gravado em", alvo)
    print("total 90d:", json.dumps(tot, ensure_ascii=False))
    print("cobertura da dimensao query:", json.dumps(d["cobertura_dimensao_query"], ensure_ascii=False))
    print("paginas com impressao:", len(d["paginas_90d"]), "| queries distintas:", sq["linhas"])
    print("marca (contem 'hachi'), 180d:")
    for r in sorted(d["marca_hachi_180d"], key=lambda x: -x["impressoes"]):
        print(f"   {r['impressoes']:>4} impr {r['cliques']:>3} cli pos {r['posicao']:>5}  {r['chaves'][0]}")

if __name__ == "__main__":
    main()
