import os
import re
from html.parser import HTMLParser

class LinkExtractor(HTMLParser):
    def __init__(self):
        super().__init__()
        self.links = []
        self.scripts = []
        self.styles = []
        self.images = []

    def handle_starttag(self, tag, attrs):
        attr_dict = dict(attrs)
        if tag == 'a' and 'href' in attr_dict:
            self.links.append(attr_dict['href'])
        elif tag == 'script' and 'src' in attr_dict:
            self.scripts.append(attr_dict['src'])
        elif tag == 'link' and attr_dict.get('rel') == 'stylesheet' and 'href' in attr_dict:
            self.styles.append(attr_dict['href'])
        elif tag == 'img' and 'src' in attr_dict:
            self.images.append(attr_dict['src'])

html_files = ['index.html', 'science.html', 'public-awareness.html', 'research.html', 'science/index.html']

for hf in html_files:
    if not os.path.exists(hf):
        continue
    print('=== Analyzing', hf, '===')
    with open(hf, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()
    parser = LinkExtractor()
    parser.feed(content)
    
    print('Stylesheets:')
    for s in parser.styles:
        if s.startswith('http://') or s.startswith('https://'):
            print('  [ext]', s)
        else:
            base_dir = os.path.dirname(hf)
            target = os.path.normpath(os.path.join(base_dir, s))
            exists = os.path.exists(target)
            print(f'  [local] {s} -> {target} (exists: {exists})')
            
    print('Scripts:')
    for sc in parser.scripts:
        if sc.startswith('http://') or sc.startswith('https://'):
            print('  [ext]', sc)
        else:
            base_dir = os.path.dirname(hf)
            target = os.path.normpath(os.path.join(base_dir, sc))
            exists = os.path.exists(target)
            print(f'  [local] {sc} -> {target} (exists: {exists})')

    print('Images:')
    for im in parser.images:
        if im.startswith('http://') or im.startswith('https://') or im.startswith('data:'):
            print('  [ext/data]', im[:30])
        else:
            base_dir = os.path.dirname(hf)
            target = os.path.normpath(os.path.join(base_dir, im))
            exists = os.path.exists(target)
            print(f'  [local] {im} -> {target} (exists: {exists})')

    print('Links (href):')
    for lk in parser.links:
        if lk.startswith('http://') or lk.startswith('https://'):
            print('  [ext]', lk)
        elif lk.startswith('#'):
            id_name = lk[1:]
            has_id = f'id="{id_name}"' in content or f'id=\'{id_name}\'' in content or f'name="{id_name}"' in content
            print(f'  [anchor] {lk} (id found: {has_id})')
        else:
            base_dir = os.path.dirname(hf)
            clean_lk = lk.split('#')[0]
            target = os.path.normpath(os.path.join(base_dir, clean_lk))
            exists = os.path.exists(target)
            print(f'  [local] {lk} -> {target} (exists: {exists})')

print("\n=== Checking JS dynamic asset references ===")
js_files = ['assets/js/public-awareness.js', 'assets/js/main.js', 'assets/js/scientific-charts.js', 'assets/js/scientific-data.js']
for jf in js_files:
    with open(jf, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()
    print('Analyzing JS:', jf)
    matches = re.findall(r"['\"]([^'\"]*?\.(?:png|jpg|jpeg|svg|html|css|js))['\"]", content)
    for m in matches:
        clean = m.lstrip('/')
        exists_root = os.path.exists(clean)
        print(f"  Ref: {m} (exists: {exists_root})")

print("\n=== Checking image filenames in scientific-charts.js and scientific-data.js ===")
with open('assets/js/scientific-charts.js', 'r', encoding='utf-8') as f:
    s = f.read()
for line in s.splitlines():
    if '.png' in line or 'assets/images' in line or 'img' in line and 'src' in line or 'image' in line.lower() and 'url' in line.lower():
        print("  Chart line:", line.strip())

with open('assets/js/scientific-data.js', 'r', encoding='utf-8') as f:
    s = f.read()
for line in s.splitlines():
    if '.png' in line or 'assets/images' in line:
        print("  Data line:", line.strip())

print("\n=== Checking dynamic maps in scientific-charts.js ===")
# Let's inspect events and variables in scientific-charts.js or scientific-data.js
with open('assets/js/scientific-charts.js', 'r', encoding='utf-8') as f:
    code = f.read()
import re
vars_match = re.search(r'const validVars\s*=\s*\[(.*?)\]', code)
events_match = re.search(r'const validEvents\s*=\s*\[(.*?)\]', code)
print("validVars:", vars_match.group(0) if vars_match else "not found")
print("validEvents:", events_match.group(0) if events_match else "not found")

print("\n=== Context of mapImg.src in scientific-charts.js ===")
with open('assets/js/scientific-charts.js', 'r', encoding='utf-8') as f:
    lines = f.readlines()
for i, line in enumerate(lines):
    if 'mapImg' in line or 'filename' in line:
        for j in range(max(0, i-5), min(len(lines), i+6)):
            print(f"{j+1}: {lines[j].rstrip()}")
        break

print("\n=== Checking Spatial Map Dropdown Images ===")
with open('science.html', 'r', encoding='utf-8') as f:
    text = f.read()

var_select = re.search(r'<select[^>]*id=[\'"]spatialVarSelect[\'"].*?</select>', text, re.DOTALL)
event_select = re.search(r'<select[^>]*id=[\'"]spatialEventSelect[\'"].*?</select>', text, re.DOTALL)

vars_opts = re.findall(r'value=[\'"]([^\'"]*)[\'"]', var_select.group(0)) if var_select else []
events_opts = re.findall(r'value=[\'"]([^\'"]*)[\'"]', event_select.group(0)) if event_select else []

print('Vars options:', vars_opts)
print('Events options:', events_opts)

missing = []
for v in vars_opts:
    for ev in events_opts:
        fn = f'map_{v}_{ev}.png'
        path = os.path.join('assets', 'images', fn)
        if not os.path.exists(path):
            missing.append(path)
print(f'Total tested: {len(vars_opts) * len(events_opts)}, Missing: {len(missing)}')
if missing:
    print('Missing files:', missing)

print("\n=== All interactive elements in index.html ===")
with open('index.html', 'r', encoding='utf-8') as f:
    text = f.read()

import re
buttons = re.findall(r'<button[^>]*>', text)
for b in buttons:
    print('Button:', b)

links = re.findall(r'<a[^>]*>.*?</a>', text, re.DOTALL)
for lk in links:
    print('Link:', lk.strip())
