from fastapi import APIRouter, HTTPException
import requests
import time
import json
import os
from . import military_assets

router = APIRouter(prefix="/api/feeds", tags=["Live Feeds"])

# opensky cache — 15s window to dodge 429s
_cache = {"ts": 0, "data": None}
CACHE_TTL = 15

def _load_fallback():
    """grab canned data when opensky is down"""
    try:
        p = os.path.join(os.path.dirname(__file__), "fallback_flights.json")
        with open(p, "r") as f:
            d = json.load(f)
            return {"status": "success", "count": len(d.get("states", [])), "data": d.get("states", [])}
    except Exception as e:
        print("fallback load failed:", e)
        return {"status": "error", "message": "rate limited and fallback broke too"}

@router.get("/flights")
def get_live_flights(bbox: str = None):
    global _cache

    # serve cached if fresh and no bbox filter
    if not bbox and time.time() - _cache["ts"] < CACHE_TTL and _cache["data"]:
        print("serving flights from cache")
        return _cache["data"]

    url = "https://opensky-network.org/api/states/all"

    try:
        if bbox:
            lamin, lomin, lamax, lomax = bbox.split(',')
            url += f"?lamin={lamin}&lomin={lomin}&lamax={lamax}&lomax={lomax}"

        print(f"fetching flights: {url}")

        hdr = {"User-Agent": "GodView_App/1.0"}
        resp = requests.get(url, headers=hdr, timeout=10)

        if resp.status_code == 200:
            try:
                raw = resp.json()
            except Exception:
                print("json decode failed, returning cache")
                if _cache["data"]: return _cache["data"]
                return _load_fallback()

            # tag each state with military flag
            out = []
            for st in raw.get("states", []):
                icao = st[0] if len(st) > 0 else None
                cs = st[1] if len(st) > 1 else None
                mil = military_assets.is_military(icao, cs)
                st.append(mil)
                out.append(st)

            result = {"status": "success", "count": len(out), "data": out}

            if not bbox:
                _cache = {"ts": time.time(), "data": result}

            return result
        elif resp.status_code == 429:
            print("opensky 429 — falling back")
            if _cache["data"]: return _cache["data"]
            return _load_fallback()
        else:
            print(f"opensky {resp.status_code} — falling back")
            if _cache["data"]: return _cache["data"]
            return _load_fallback()

    except Exception as e:
        print(f"opensky exception: {e}")
        if _cache["data"]: return _cache["data"]
        return _load_fallback()

@router.get("/geocode")
def geocode_location(q: str):
    # proxy to nominatim — avoids cors in browser
    url = f"https://nominatim.openstreetmap.org/search?q={q}&format=json&limit=1"
    hdr = {"User-Agent": "GodView_App/1.0 (local_dev)"}
    try:
        resp = requests.get(url, headers=hdr, timeout=10)
        if resp.status_code == 200:
            return {"status": "success", "data": resp.json()}
        return {"status": "error", "message": f"nominatim returned {resp.status_code}"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/satellites")
def get_satellites(group: str = "active"):
    # celestrak tle fetch — returns structured json array
    url = f"https://celestrak.org/NORAD/elements/gp.php?GROUP={group}&FORMAT=tle"
    hdr = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"}

    try:
        resp = requests.get(url, headers=hdr, timeout=30)
        if resp.status_code == 200:
            lines = resp.text.strip().split('\n')

            # tle = 3 lines per sat (name, line1, line2)
            sats = []
            for i in range(0, len(lines), 3):
                if i + 2 < len(lines):
                    nm = lines[i].strip()
                    l1 = lines[i+1].strip()
                    l2 = lines[i+2].strip()
                    # validate — celestrak sometimes returns html on error
                    if l1.startswith('1 ') and l2.startswith('2 '):
                        sats.append({"name": nm, "line1": l1, "line2": l2})

            return {"status": "success", "count": len(sats), "data": sats}
        return {"status": "error", "message": f"celestrak returned {resp.status_code}"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
