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
