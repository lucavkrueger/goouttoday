import re, glob, json, io, os, sys, concurrent.futures as cf
import requests
from PIL import Image, ImageDraw, ImageFont

# Collect image URLs with a label (nearest title before the image, or map key)
items = {}
for f in glob.glob('src/**/*.ts*', recursive=True):
    s = open(f, encoding='utf-8').read()
    last_title = None
    for m in re.finditer(r'"?title"?\s*:\s*"([^"]+)"|"?image"?\s*:\s*"(https?://[^"]+)"|"([^"]{2,60})"\s*:\s*"(https?://[^"]+\.(?:jpg|jpeg|png|webp)[^"]*|https?://images\.unsplash\.com[^"]+|https?://commons\.wikimedia\.org[^"]+)"', s):
        if m.group(1):
            last_title = m.group(1)
        elif m.group(2):
            items.setdefault(m.group(2), set()).add(last_title or os.path.basename(f))
        elif m.group(4):
            items.setdefault(m.group(4), set()).add(m.group(3))
    for u in re.findall(r'["\'](https://(?:images\.unsplash\.com|commons\.wikimedia\.org)[^"\']+)["\']', s):
        items.setdefault(u, set()).add(os.path.basename(f))

urls = sorted(items)
print('urls', len(urls))
H = {'User-Agent': 'GoOutToday-image-check/1.0 (github.com/lucavkrueger/goouttoday)'}

def check(u):
    try:
        r = requests.get(u, headers=H, timeout=30, allow_redirects=True)
        res = {'url': u, 'status': r.status_code, 'type': r.headers.get('content-type', ''), 'final': r.url}
        if r.status_code == 200 and 'image' in res['type']:
            im = Image.open(io.BytesIO(r.content)); im.load()
            res['w'], res['h'] = im.size
            g = im.convert('RGB').resize((32, 32))
            px = list(g.getdata())
            res['sat'] = round(sum(max(p) - min(p) for p in px) / len(px), 1)
            res['_img'] = im.convert('RGB')
        return res
    except Exception as e:
        return {'url': u, 'status': 'ERR', 'error': str(e)[:120]}

with cf.ThreadPoolExecutor(8) as ex:
    results = list(ex.map(check, urls))

os.makedirs('report', exist_ok=True)
for i, r in enumerate(results):
    r['id'] = i + 1
    r['labels'] = sorted(x for x in items[r['url']] if x)[:3]

# contact sheets
ok = [r for r in results if '_img' in r]
cols, rows, tw, th = 6, 7, 260, 170
font = ImageFont.load_default()
for si in range(0, len(ok), cols * rows):
    chunk = ok[si:si + cols * rows]
    sheet = Image.new('RGB', (cols * tw, rows * (th + 30)), 'white')
    d = ImageDraw.Draw(sheet)
    for j, r in enumerate(chunk):
        x, y = (j % cols) * tw, (j // cols) * (th + 30)
        im = r['_img'].copy(); im.thumbnail((tw - 6, th))
        sheet.paste(im, (x + 3, y))
        d.text((x + 3, y + th + 2), f"#{r['id']} {(r['labels'] or ['?'])[0][:34]}", fill='black', font=font)
        d.text((x + 3, y + th + 14), f"{r['w']}x{r['h']}", fill='gray', font=font)
    sheet.save(f'report/sheet_{si // (cols * rows) + 1:02d}.jpg', quality=70)

for r in results:
    r.pop('_img', None)
json.dump(results, open('report/report.json', 'w'), ensure_ascii=False, indent=1)
bad = [r for r in results if r.get('status') != 200 or 'image' not in r.get('type', 'image')]
print('ok', len(ok), 'bad', len(bad))
for r in bad: print('BAD', r['status'], r['url'][:110], r['labels'])
