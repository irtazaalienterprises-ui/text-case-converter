import urllib.request
import xml.etree.ElementTree as ET
import re
import csv
from datetime import datetime

sitemap_url = "https://theconvertertool.com/sitemap.xml"
headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'}

print("Fetching live sitemap...")
req = urllib.request.Request(sitemap_url, headers=headers)
with urllib.request.urlopen(req) as resp:
    sitemap_data = resp.read()

root = ET.fromstring(sitemap_data)
urls = [elem.text for elem in root.iter('{http://www.sitemaps.org/schemas/sitemap/0.9}loc')]

print(f"Total live sitemap URLs: {len(urls)}")

results = []
for u in urls:
    try:
        r = urllib.request.Request(u, headers=headers)
        with urllib.request.urlopen(r) as response:
            status = response.status
            body = response.read().decode('utf-8', errors='ignore')
            
            title_m = re.search(r'<title>(.*?)</title>', body, re.IGNORECASE | re.DOTALL)
            title = title_m.group(1).strip() if title_m else "MISSING"
            
            canon_m = re.search(r'<link\s+rel=["\']canonical["\']\s+href=["\'](.*?)["\']', body, re.IGNORECASE)
            canon = canon_m.group(1).strip() if canon_m else "MISSING"
            
            robots_m = re.search(r'<meta\s+name=["\']robots["\']\s+content=["\'](.*?)["\']', body, re.IGNORECASE)
            robots = robots_m.group(1).strip() if robots_m else "none"
            
            canon_ok = (canon == u)
            
            results.append({
                'URL': u,
                'HTTP': status,
                'Title': title,
                'Canonical': canon,
                'CanonOK': canon_ok,
                'Robots': robots
            })
            print(f"[{status}] CanonOK={canon_ok} | {u}")
    except Exception as e:
        results.append({
            'URL': u,
            'HTTP': 'ERR',
            'Title': str(e),
            'Canonical': '',
            'CanonOK': False,
            'Robots': ''
        })
        print(f"[ERR] {u} : {e}")

# Save clean CSV
csv_filename = f"audit/clean-live-audit-{datetime.now().strftime('%Y%m%d-%H%M%S')}.csv"
with open(csv_filename, 'w', newline='', encoding='utf-8') as f:
    writer = csv.DictWriter(f, fieldnames=['URL', 'HTTP', 'Title', 'Canonical', 'CanonOK', 'Robots'])
    writer.writeheader()
    writer.writerows(results)

print(f"\nSaved clean live audit to {csv_filename}")
