import json, io, os, time, hashlib, re, requests
from PIL import Image, ImageDraw, ImageFont
H = {'User-Agent': 'GoOutToday-image-localizer/1.0 (https://github.com/lucavkrueger/goouttoday)'}
API = 'https://commons.wikimedia.org/w/api.php'
os.makedirs('out/images', exist_ok=True)
def get(url, **kw):
    for a in range(5):
        r = requests.get(url, headers=H, timeout=40, **kw)
        if r.status_code != 429: return r
        time.sleep(5 * (a + 1))
    return r
def meta(ii):
    em = ii.get('extmetadata', {}); s = lambda v: re.sub('<[^>]+>', '', (v or {}).get('value', '')).strip()
    return {'artist': s(em.get('Artist'))[:120], 'license': s(em.get('LicenseShortName')), 'page': ii.get('descriptionurl', '')}
res, rev = {}, []
for q in json.load(open('.github/data/queries.json')):
    time.sleep(0.5)
    d = get(API, params={'action': 'query', 'format': 'json', 'formatversion': 2, 'generator': 'search', 'gsrsearch': q['query'] + ' filetype:bitmap',
            'gsrnamespace': 6, 'gsrlimit': 10, 'prop': 'imageinfo', 'iiprop': 'url|extmetadata|size', 'iiurlwidth': 960}).json()
    pages = sorted(d.get('query', {}).get('pages', []), key=lambda p: p.get('index', 99))
    pick = None
    for p in pages:
        ii = (p.get('imageinfo') or [{}])[0]; lic = meta(ii)['license'].lower()
        if ii.get('width', 0) >= 700 and ii['width'] >= ii['height'] * 1.1 and ('cc' in lic or 'public domain' in lic or 'pd' in lic) and ii.get('thumburl'):
            pick = (p['title'], ii); break
    e = {'label': q['label'], 'query': q['query']}
    if pick:
        h = hashlib.sha1(q['url'].encode()).hexdigest()[:10]
        im = Image.open(io.BytesIO(get(pick[1]['thumburl']).content)).convert('RGB'); im.thumbnail((960, 960))
        e['path'] = f'images/s_{h}.webp'; im.save('out/' + e['path'], 'WEBP', quality=70, method=6)
        e.update(file=pick[0], source='wikimedia', **meta(pick[1])); rev.append((e, im))
    res[q['url']] = e; print(q['query'], '->', e.get('file'))
json.dump(res, open('out/search-map.json', 'w'), ensure_ascii=False, indent=1)
cols, tw, th = 5, 300, 190; font = ImageFont.load_default()
rows = (len(rev) + cols - 1) // cols
sheet = Image.new('RGB', (cols * tw, rows * (th + 30)), 'white'); dr = ImageDraw.Draw(sheet)
for j, (e, im) in enumerate(rev):
    x, y = (j % cols) * tw, (j // cols) * (th + 30); t = im.copy(); t.thumbnail((tw - 6, th)); sheet.paste(t, (x + 3, y))
    dr.text((x + 3, y + th + 2), f"{j + 1}. {e['label'][:40]}", fill='black', font=font); dr.text((x + 3, y + th + 14), e['query'][:45], fill='gray', font=font)
sheet.save('out/search_review.jpg', quality=72)
