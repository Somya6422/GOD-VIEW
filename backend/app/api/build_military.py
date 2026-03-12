import re
import os

# one-shot script to extract packed military hex data from worldmonitor ts source
# and generate the python lookup module — not used at runtime

ts_path = r"C:\Users\Smruti\.gemini\antigravity\scratch\GOD VIEW\temp_worldmonitor\server\worldmonitor\military\v1\_shared.ts"
py_path = r"C:\Users\Smruti\.gemini\antigravity\scratch\GOD VIEW\backend\app\api\military_assets.py"

with open(ts_path, 'r', encoding='utf-8') as f:
    src = f.read()

hex_m = re.search(r'const _HEX_PACKED = "(.*?)";', src)
hex_packed = hex_m.group(1) if hex_m else ""

pfx_m = re.search(r'export const MILITARY_PREFIXES = \[(.*?)\];', src, re.DOTALL)
pfx = pfx_m.group(1) if pfx_m else ""
pfx = [p.strip().strip("'").strip('"') for p in pfx.split(',') if p.strip()]

short_m = re.search(r'const SHORT_MILITARY_PREFIXES = \[(.*?)\];', src, re.DOTALL)
short = short_m.group(1) if short_m else ""
short = [p.strip().strip("'").strip('"') for p in short.split(',') if p.strip()]

air_m = re.search(r'export const AIRLINE_CODES = new Set\(\[(.*?)\]\);', src, re.DOTALL)
air = air_m.group(1) if air_m else ""
air = [p.strip().strip("'").strip('"') for p in air.split(',') if p.strip()]

py_code = f'''import re

_HEX_PACKED = "{hex_packed}"
MILITARY_HEX_SET = set(_HEX_PACKED[i:i+6] for i in range(0, len(_HEX_PACKED), 6))

MILITARY_PREFIXES = {pfx}

SHORT_MILITARY_PREFIXES = {short}

AIRLINE_CODES = set({air})

def is_military_hex(hex_id):
    if not hex_id: return False
    return str(hex_id).replace("~", "").lower() in MILITARY_HEX_SET

def is_military_callsign(callsign):
    if not callsign: return False
    cs = str(callsign).upper().strip()
    
    for prefix in MILITARY_PREFIXES:
        if cs.startswith(prefix): return True
        
    for prefix in SHORT_MILITARY_PREFIXES:
        if cs.startswith(prefix) and len(cs) > len(prefix) and cs[len(prefix)].isdigit():
            return True
            
    if re.match(r'^[A-Z]{{3}}\\d{{1,2}}$', cs):
        prefix = cs[:3]
        if prefix not in AIRLINE_CODES:
            return True
            
    return False

def is_military(hex_id, callsign):
    return is_military_hex(hex_id) or is_military_callsign(callsign)
'''

with open(py_path, 'w', encoding='utf-8') as f:
    f.write(py_code)

print("generated military_assets.py")
