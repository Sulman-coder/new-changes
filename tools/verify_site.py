"""Check static portfolio references and image metadata, optionally via HTTP."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import quote, unquote, urlsplit
from urllib.request import urlopen
import re
import sys

ROOT = Path(__file__).resolve().parents[1]


class Page(HTMLParser):
    def __init__(self, text):
        super().__init__()
        self.refs = []
        self.ids = []
        self.images = []
        self.feed(text)

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if 'id' in attrs:
            self.ids.append(attrs['id'])
        if tag == 'img' and attrs.get('src'):
            self.images.append(attrs)
        for key in ('src', 'href', 'data-lightbox'):
            if attrs.get(key):
                self.refs.append(attrs[key])


pages = {p.name: Page(p.read_text(encoding='utf-8')) for p in ROOT.glob('*.html')}
errors = []
resources = set()
reference_count = 0
for name, page in pages.items():
    resources.add(ROOT / name)
    if len(page.ids) != len(set(page.ids)):
        errors.append(f'{name}: duplicate IDs')
    for ref in page.refs:
        url = urlsplit(ref)
        if url.scheme or url.netloc:
            continue
        path = ROOT / unquote(url.path) if url.path else ROOT / name
        reference_count += 1
        resources.add(path)
        if not path.is_file():
            errors.append(f'{name}: missing {ref}')
        if url.fragment and path.name in pages and url.fragment not in pages[path.name].ids:
            errors.append(f'{name}: missing anchor {ref}')
    for image in page.images:
        if urlsplit(image['src']).scheme:
            errors.append(f'{name}: remotely hosted image {image["src"]}')

for css in (ROOT / 'css').glob('*.css'):
    for ref in re.findall(r'url\([\"\']?([^\)\"\']+)', css.read_text(encoding='utf-8')):
        if urlsplit(ref).scheme:
            errors.append(f'{css.name}: external dependency {ref}')
            continue
        reference_count += 1
        path = (css.parent / ref).resolve()
        resources.add(path)
        if not path.is_file():
            errors.append(f'{css.name}: missing {ref}')

families = set(re.findall(r"font-family: '([^']+)'", (ROOT / 'css/fonts.css').read_text()))
if families != {'Montserrat', 'Poppins', 'Playfair Display'}:
    errors.append(f'Unexpected fonts: {families}')

try:
    from PIL import Image
except ImportError:
    print('Image metadata check skipped: install Pillow to enable it.')
else:
    for name, page in pages.items():
        for attrs in page.images:
            if urlsplit(attrs['src']).scheme:
                continue
            with Image.open(ROOT / attrs['src']) as image:
                if attrs.get('width') and attrs.get('height'):
                    ratio = int(attrs['width']) / int(attrs['height'])
                    if abs(ratio / (image.width / image.height) - 1) > .03:
                        errors.append(f'{name}: image dimensions mismatch for {attrs["src"]}')
    print('Image files decode and intrinsic dimensions match.')

http_count = 0
if len(sys.argv) > 1:
    base = sys.argv[1].rstrip('/')
    for path in sorted(resources):
        with urlopen(base + '/' + quote(path.relative_to(ROOT).as_posix()), timeout=10) as response:
            if response.status != 200:
                errors.append(f'HTTP {response.status}: {path.name}')
            http_count += 1

print(f'Pages: {len(pages)}; local references/anchors: {reference_count}; HTTP resources: {http_count}.')
print('Font families: ' + ', '.join(sorted(families)))
if errors:
    print('\n'.join(errors))
    raise SystemExit(1)
print('PASS: no missing local resources, broken anchors, duplicate IDs or external image dependencies.')
