# -*- coding: utf-8 -*-
"""Fetch the Google Fonts CSS, keep only the latin + arabic subsets we actually use,
download the woff2 files and emit (a) real files + a css block, (b) an inlined
data:-URI css block for the single-file build."""
import re, os, base64, json, urllib.request

import os
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

UA = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 '
                    '(KHTML, like Gecko) Chrome/125.0 Safari/537.36'}
URL = ('https://fonts.googleapis.com/css2?'
       'family=IBM+Plex+Mono:wght@400;500&'
       'family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&'
       'family=IBM+Plex+Sans:wght@400;500;600;700&display=swap')

OUT = os.path.join(ROOT, 'dist', 'assets', 'fonts')
os.makedirs(OUT, exist_ok=True)

css = urllib.request.urlopen(urllib.request.Request(URL, headers=UA), timeout=60).read().decode()

# Google emits each face once per unicode subset, preceded by a /* subset */ comment.
blocks = re.findall(r'/\*\s*([\w\-\[\]]+)\s*\*/\s*(@font-face\s*\{[^}]*\})', css)
KEEP = {'latin', 'arabic'}
kept, files, inline = [], {}, []

for subset, block in blocks:
    if subset not in KEEP:
        continue
    fam = re.search(r"font-family:\s*'([^']+)'", block).group(1)
    wt = re.search(r'font-weight:\s*(\d+)', block).group(1)
    url = re.search(r'url\((https://fonts\.gstatic\.com[^)]+)\)', block).group(1)
    name = '%s-%s-%s.woff2' % (fam.lower().replace(' ', ''), wt, subset)
    if name not in files:
        data = urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=60).read()
        open(os.path.join(OUT, name), 'wb').write(data)
        files[name] = data
    kept.append((subset, fam, wt, name, block))

def face(block, src):
    b = re.sub(r'src:\s*url\([^)]+\)\s*format\(\'woff2\'\);', "src:url(%s) format('woff2');" % src, block)
    return re.sub(r'\s+', ' ', b).strip()

file_css = '\n'.join(face(b, '../assets/fonts/' + n) for _, _, _, n, b in kept)
inline_css = '\n'.join(
    face(b, 'data:font/woff2;base64,' + base64.b64encode(files[n]).decode())
    for _, _, _, n, b in kept)

json.dump(dict(file_css=file_css, inline_css=inline_css),
          open(os.path.join(ROOT, 'tools', 'fonts.json'), 'w'))
print('faces kept: %d   files: %d   raw: %d KB   inline b64: %d KB'
      % (len(kept), len(files), sum(len(v) for v in files.values()) / 1024, len(inline_css) / 1024))
for n in sorted(files):
    print('   %-40s %5d KB' % (n, len(files[n]) / 1024))
