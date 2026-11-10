import re, glob, json, io, os, time, hashlib, urllib.parse
import requests
from PIL import Image, ImageDraw, ImageFont

H = {'User-Agent': 'GoOutToday-image-localizer/1.0 (https://github.com/lucavkrueger/goouttoday)'}
API = 'https://commons.wikimedia.org/w/api.php'
OUT = 'out'; os.makedirs(f'{OUT}/images', exist_ok=True)

# ---- collect URLs + labels
items = {}
for f in glob.glob('src/**/*.ts*', recursive=True):
    s = open(f, encoding='utf-8').read()
    last = None
    for m in re.finditer(r'"?title"?\s*:\s*"([^"]+)"|(https://(?:images\.unsplash\.com|commons\.wikimedia\.org)[^"\'\s`]+)', s):
        if m.group(1): last = m.group(1)
        else:
            u = m.group(2)
            # map-style key  "keyword": "url"
            pre = s[max(0, m.start() - 80):m.start()]
            k = re.search(r'"([^"]{2,60})"\s*:\s*["\']$', pre)
            items.setdefault(u, [])
            lab = k.group(1) if k else last
            if lab and lab not in items[u]: items[u].append(lab)
urls = sorted(items)
print('urls', len(urls))

def get(url, **kw):
    for attempt in range(5):
        r = requests.get(url, headers=H, timeout=40, **kw)
        if r.status_code == 429:
            time.sleep(5 * (attempt + 1)); continue
        return r
    return r

def api(params):
    params.update(format='json', formatversion=2)
    time.sleep(0.4)
    return get(API, params=params).json()

def meta_of(ii):
    em = ii.get('extmetadata', {})
    strip = lambda v: re.sub('<[^>]+>', '', (v or {}).get('value', '')).strip()
    return {'artist': strip(em.get('Artist'))[:120], 'license': strip(em.get('LicenseShortName')), 'page': ii.get('descriptionurl', '')}

def save(img_bytes, name):
    im = Image.open(io.BytesIO(img_bytes)).convert('RGB')
    im.thumbnail((960, 960))
    path = f'images/{name}.webp'
    im.save(f'{OUT}/{path}', 'WEBP', quality=70, method=6)
    return path, im

def commons_files(names):
    res = {}
    for i in range(0, len(names), 40):
        d = api({'action': 'query', 'prop': 'imageinfo', 'iiprop': 'url|extmetadata|size', 'iiurlwidth': 960,
                 'titles': '|'.join('File:' + n for n in names[i:i + 40])})
        norm = {x['to']: x['from'] for x in d['query'].get('normalized', [])}
        for p in d['query']['pages']:
            if 'imageinfo' in p:
                res[norm.get(p['title'], p['title'])[5:]] = p['imageinfo'][0]
    return res

def commons_search(q):
    d = api({'action': 'query', 'generator': 'search', 'gsrsearch': q + ' filetype:bitmap', 'gsrnamespace': 6, 'gsrlimit': 8,
             'prop': 'imageinfo', 'iiprop': 'url|extmetadata|size', 'iiurlwidth': 960})
    pages = sorted(d.get('query', {}).get('pages', []), key=lambda p: p.get('index', 99))
    for p in pages:
        ii = (p.get('imageinfo') or [{}])[0]
        w, h = ii.get('width', 0), ii.get('height', 0)
        lic = meta_of(ii)['license'].lower()
        if w >= 800 and w >= h * 1.1 and ('cc' in lic or 'public domain' in lic or 'pd' in lic) and ii.get('thumburl'):
            return p['title'], ii
    return None, None

STOP = {'im', 'in', 'am', 'an', 'der', 'die', 'das', 'den', 'dem', 'und', 'zum', 'zur', 'auf', 'mit', 'durch', 'von', 'bei', 'besuch', 'besuchen', 'tour', 'erkunden', 'entdecken', 'berlin'}
def queries(label):
    words = [w for w in re.split(r'[^\wäöüÄÖÜß-]+', label) if w and w.lower() not in STOP]
    qs = [label, ' '.join(words) + ' Berlin', ' '.join(words[:2]) + ' Berlin', ' '.join(words)]
    seen, outq = set(), []
    for q in qs:
        q = q.strip()
        if q and q not in seen: seen.add(q); outq.append(q)
    return outq

# ---- process
wm_names = {u: urllib.parse.unquote(u.split('Special:FilePath/')[1].split('?')[0]) for u in urls if 'Special:FilePath' in u}
wm_info = commons_files(sorted(set(wm_names.values())))
mapping, review = {}, []
for u in urls:
    h = hashlib.sha1(u.encode()).hexdigest()[:10]
    labels = [l for l in items[u] if not l.endswith(('.ts', '.tsx'))]
    entry = {'labels': labels[:3]}
    try:
        if u in wm_names:
            ii = wm_info.get(wm_names[u].replace('_', ' ')) or wm_info.get(wm_names[u])
            if not ii: entry['status'] = 'wm_missing'; mapping[u] = entry; print('MISSING', u); continue
            r = get(ii['thumburl']); entry['path'], _ = save(r.content, 'c_' + h)
            entry.update(source='wikimedia', **meta_of(ii)); entry['status'] = 'ok'
        else:
            r = get(u)
            if r.status_code == 200 and 'image' in r.headers.get('content-type', ''):
                entry['path'], _ = save(r.content, 'u_' + h); entry.update(source='unsplash', status='ok')
            else:
                found = None
                for q in (queries(labels[0]) if labels else []):
                    t, ii = commons_search(q)
                    if t: found = (q, t, ii); break
                if found:
                    q, t, ii = found
                    rr = get(ii['thumburl']); entry['path'], im = save(rr.content, 'r_' + h)
                    entry.update(source='wikimedia', query=q, file=t, status='replaced', **meta_of(ii))
                    review.append((entry, im))
                else:
                    entry['status'] = 'dead_no_replacement'
    except Exception as e:
        entry['status'] = 'error'; entry['error'] = str(e)[:150]
    mapping[u] = entry
    print(entry.get('status'), labels[:1], entry.get('file', ''))

json.dump(mapping, open(f'{OUT}/image-map.json', 'w'), ensure_ascii=False, indent=1)

# contact sheets of replacements for review
cols, rows, tw, th = 5, 6, 300, 190
font = ImageFont.load_default()
for si in range(0, len(review), cols * rows):
    chunk = review[si:si + cols * rows]
    sheet = Image.new('RGB', (cols * tw, rows * (th + 30)), 'white'); d = ImageDraw.Draw(sheet)
    for j, (e, im) in enumerate(chunk):
        x, y = (j % cols) * tw, (j // cols) * (th + 30)
        t = im.copy(); t.thumbnail((tw - 6, th)); sheet.paste(t, (x + 3, y))
        d.text((x + 3, y + th + 2), f"{si + j + 1}. {(e['labels'] or ['?'])[0][:40]}", fill='black', font=font)
        d.text((x + 3, y + th + 14), e['file'][5:50], fill='gray', font=font)
        e['review_no'] = si + j + 1
    sheet.save(f'{OUT}/review_{si // (cols * rows) + 1:02d}.jpg', quality=72)
json.dump(mapping, open(f'{OUT}/image-map.json', 'w'), ensure_ascii=False, indent=1)
from collections import Counter
print(Counter(e.get('status') for e in mapping.values()))
