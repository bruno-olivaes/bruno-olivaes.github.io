import urllib.request
import re
import ssl

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

url = "https://bruno-olivaes.github.io/"
headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"}

print(f"Connecting to {url}...")
req = urllib.request.Request(url, headers=headers)
with urllib.request.urlopen(req, timeout=15, context=ctx) as r:
    html = r.read().decode("utf-8")

print(f"Loaded {len(html)} bytes from index.html.")

raw_links = re.findall(r'href=["\'](.*?)["\']', html)
unique_links = sorted(list(set(raw_links)))

print(f"Found {len(unique_links)} unique href links.\nChecking targets...")

successes = 0
failures = 0

for link in unique_links:
    if link.startswith("#") or link.startswith("mailto:"):
        continue
    target = link if link.startswith("http") else url + link.lstrip("/")
    try:
        req_target = urllib.request.Request(target, headers=headers)
        with urllib.request.urlopen(req_target, timeout=12, context=ctx) as resp:
            print(f"[OK {resp.status}] {target}")
            successes += 1
    except urllib.error.HTTPError as e:
        print(f"[HTTP {e.code}] {target} ({e.reason})")
        # Zenodo or academia might return 403 or 429 to automated scrapers, let's note it
        if e.code in [403, 429]:
            print(f"    (Note: {e.code} often reflects anti-bot protection on DOI/Academia gateways)")
        else:
            failures += 1
    except Exception as e:
        print(f"[ERROR] {target} -> {e}")
        failures += 1

print(f"\nAudit Complete: {successes} successful links verified.")

