"""로킷 크리스마스 마켓 캐러셀 HTML 생성기 (1080x1350, 7장)."""
import json, math, random, os, sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, '..', '..'))  # marketing/
from common import brand, MAP

geo = json.load(open(os.path.join(MAP, 'sgg.json')))

LNG0, LAT0 = 126.76, 37.70
COS = math.cos(math.radians(37.56))


def w(lng, lat):
    return ((lng - LNG0) * COS * 111.32, (LAT0 - lat) * 110.57)


NAMES = {
    '11110': '종로구', '11140': '중구', '11170': '용산구', '11200': '성동구', '11215': '광진구',
    '11230': '동대문구', '11260': '중랑구', '11290': '성북구', '11305': '강북구', '11320': '도봉구',
    '11350': '노원구', '11380': '은평구', '11410': '서대문구', '11440': '마포구', '11470': '양천구',
    '11500': '강서구', '11530': '구로구', '11545': '금천구', '11560': '영등포구', '11590': '동작구',
    '11620': '관악구', '11650': '서초구', '11680': '강남구', '11710': '송파구', '11740': '강동구',
}

# 수도권 일대만 사용
paths, centroids = [], {}
for f in geo['features']:
    code = f['properties']['code']
    if not (code.startswith('11') or code.startswith('41') or code.startswith('28')):
        continue
    g = f['geometry']
    polys = g['coordinates'] if g['type'] == 'MultiPolygon' else [g['coordinates']]
    d, pts = [], []
    for poly in polys:
        for ring in poly:
            ring_pts = [w(*p) for p in ring]
            if not ring_pts:
                continue
            xs = [p[0] for p in ring_pts]
            if max(xs) < -30 or min(xs) > 70:
                continue
            pts += ring_pts
            d.append('M' + 'L'.join(f'{x:.2f},{y:.2f}' for x, y in ring_pts) + 'Z')
    if d:
        paths.append(''.join(d))
        if code in NAMES:
            centroids[code] = (sum(p[0] for p in pts) / len(pts), sum(p[1] for p in pts) / len(pts))

# 한강 (근사 중심선)
HAN = [(126.76, 37.605), (126.80, 37.592), (126.835, 37.582), (126.87, 37.572), (126.895, 37.553),
       (126.915, 37.540), (126.94, 37.532), (126.965, 37.519), (126.99, 37.512), (127.012, 37.518),
       (127.03, 37.527), (127.05, 37.531), (127.065, 37.527), (127.08, 37.522), (127.095, 37.527),
       (127.11, 37.538), (127.125, 37.549), (127.15, 37.560), (127.175, 37.572), (127.20, 37.585)]
# 한강: 강북/강남 구가 맞닿는 경계점으로 중심선 추출
def _river_y(x):
    pts = [w(*p) for p in HAN]
    for (x1, y1), (x2, y2) in zip(pts, pts[1:]):
        if x1 <= x <= x2:
            return y1 + (y2 - y1) * (x - x1) / (x2 - x1)
    return None
from collections import defaultdict
owner = defaultdict(set)
for f in geo['features']:
    code = f['properties']['code']
    if not (code.startswith('11') or code.startswith('41')):
        continue
    g = f['geometry']
    polys = g['coordinates'] if g['type'] == 'MultiPolygon' else [g['coordinates']]
    allp = [w(*p) for poly in polys for ring in poly for p in ring]
    if not allp:
        continue
    cx_ = sum(p[0] for p in allp) / len(allp); cy_ = sum(p[1] for p in allp) / len(allp)
    ry = _river_y(cx_)
    if ry is None:
        continue
    side = 'N' if cy_ < ry else 'S'
    for poly in polys:
        for ring in poly:
            for lng, lat in ring:
                owner[(round(lng, 4), round(lat, 4))].add(side)
shared = []
for (lng, lat), sides in owner.items():
    if len(sides) == 2:
        x, y = w(lng, lat)
        ry = _river_y(x)
        if ry is not None and abs(y - ry) < 2.2:
            shared.append((x, y))
shared.sort()
# 1km 구간별 평균으로 매끈하게
bins = defaultdict(list)
for x, y in shared:
    bins[round(x / 0.6)].append((x, y))
line = [(sum(p[0] for p in v) / len(v), sum(p[1] for p in v) / len(v)) for _, v in sorted(bins.items())]
print('river points', len(shared), 'bins', len(line))
han_d = 'M' + 'L'.join(f'{x:.2f},{y:.2f}' for x, y in line)

LAND = ''.join(f'<path d="{p}"/>' for p in paths)


def map_svg(cx, cy, vw, sw, sh, label_size, show_labels=True, highlight=None, avoid=(), hide=(), top_clear=190, bottom_clear=0):
    """cx,cy(km) 중심, vw(km) 가로 폭으로 sw x sh 화면에 지도를 그린다."""
    vh = vw * sh / sw
    vx, vy = cx - vw / 2, cy - vh / 2
    k = sw / vw
    labels = ''
    if show_labels:
        for code, (x, y) in centroids.items():
            if highlight and code == highlight:
                continue
            px, py = (x - vx) * k, (y - vy) * k
            if py < top_clear or py > sh - bottom_clear or px < 80 or px > sw - 80:
                continue
            if any(x0 - 60 < px < x1 + 60 and y0 - 30 < py < y1 + 70 for x0, y0, x1, y1 in hide):
                continue
            if any(abs(px - (ax - vx) * k) < 120 and -40 < (ay - vy) * k - py < 190 for ax, ay in avoid):
                continue
            labels += f'<div class="mlabel" style="left:{px:.0f}px;top:{py:.0f}px;font-size:{label_size}px">{NAMES[code]}</div>'
    hl = ''
    if highlight:
        hl = f'<path d="{paths_by_code[highlight]}" fill="rgba(110,234,228,0.10)" stroke="rgba(110,234,228,0.55)" stroke-width="{2.2/k:.4f}"/>'
    svg = (f'<svg class="map" viewBox="{vx:.3f} {vy:.3f} {vw:.3f} {vh:.3f}" preserveAspectRatio="xMidYMid slice">'
           f'<rect x="{vx-50}" y="{vy-50}" width="{vw+100}" height="{vh+100}" fill="#3E5A6E"/>'
           f'<g fill="#2C2D31" stroke="#45464C" stroke-width="{1.4/k:.4f}" stroke-linejoin="round">{LAND}</g>'
           f'<path d="{han_d}" fill="none" stroke="#3E5A6E" stroke-width="0.95" stroke-linecap="round" stroke-linejoin="round"/>'
           f'{hl}</svg>')
    return svg + labels, (vx, vy, k)


paths_by_code = {}
for f in geo['features']:
    code = f['properties']['code']
    if code in NAMES:
        g = f['geometry']
        polys = g['coordinates'] if g['type'] == 'MultiPolygon' else [g['coordinates']]
        paths_by_code[code] = ''.join('M' + 'L'.join(f'{x:.2f},{y:.2f}' for x, y in (w(*p) for p in ring)) + 'Z'
                                      for poly in polys for ring in poly)


EMD = {f['properties']['code']: f['geometry'] for f in json.load(open(os.path.join(MAP, 'emd', '11.json')))['features']}
SGG = {f['properties']['code']: f['geometry'] for f in geo['features'] if f['properties']['code'] in NAMES}


def region_photo(geom, t, photo, label, stroke=3.2, lpos='bottom'):
    """앱 RegionPhotoLayer 처럼 행정구역 모양으로 사진을 잘라 그린다."""
    vx, vy, k = t
    polys = geom['coordinates'] if geom['type'] == 'MultiPolygon' else [geom['coordinates']]
    rings = [[((x - vx) * k, (y - vy) * k) for x, y in (w(*p) for p in ring)] for poly in polys for ring in poly]
    xs = [p[0] for r in rings for p in r]; ys = [p[1] for r in rings for p in r]
    x0, y0, x1, y1 = min(xs), min(ys), max(xs), max(ys)
    rel = ''.join('M' + 'L'.join(f'{x - x0:.1f},{y - y0:.1f}' for x, y in r) + 'Z' for r in rings)
    ab = ''.join('M' + 'L'.join(f'{x:.1f},{y:.1f}' for x, y in r) + 'Z' for r in rings)
    html = (f'<div class="rphoto" style="left:{x0:.1f}px;top:{y0:.1f}px;width:{x1-x0:.1f}px;height:{y1-y0:.1f}px;'
            f'background:{photo};clip-path:path(evenodd, \'{rel}\')"></div>'
            f'<svg class="routline"><path d="{ab}" fill-rule="evenodd" stroke="rgba(0,0,0,.2)" stroke-width="{stroke*2:.1f}"/>'
            f'<path d="{ab}" fill-rule="evenodd" stroke="#fff" stroke-width="{stroke:.1f}"/></svg>')
    if label:
        if lpos == 'left':
            pos = f'left:{x0 - 8:.0f}px;top:{(y0 + y1) / 2 - 60:.0f}px;transform:translateX(-100%)'
        else:
            pos = f'left:{(x0+x1)/2:.0f}px;top:{y1 + 14:.0f}px'
        html += f'<div class="plabel-wrap" style="{pos}"><div class="plabel">{label}</div></div>'
    return html, (x0, y0, x1, y1)


def bokeh(seed, palette, smin=4, smax=16, n=26):
    """크리스마스 마켓 야경 느낌의 임시 사진 (실사진으로 교체용)."""
    r = random.Random(seed)
    layers = []
    for _ in range(n):
        c = r.choice(palette)
        x, y = r.randint(0, 100), r.randint(5, 80)
        s = r.randint(smin, smax)
        a = r.uniform(0.35, 0.95)
        layers.append(f'radial-gradient(circle at {x}% {y}%, rgba({c},{a:.2f}) 0, rgba({c},{a*0.4:.2f}) {s*0.5:.0f}%, rgba({c},0) {s}%)')
    layers.append('linear-gradient(180deg, #0B0D14 0%, #1B1510 60%, #0A0908 100%)')
    return ', '.join(layers)


WARM = ['255,196,110', '255,170,80', '255,224,170', '240,110,80', '255,140,90']
TREE = ['255,206,120', '120,200,140', '255,120,100', '255,230,180']
COOL = ['255,220,160', '170,210,255', '255,190,120', '230,240,255']
GOLD = ['255,215,140', '255,190,90', '255,240,200', '220,60,60']
RIVER = ['255,200,130', '255,160,100', '200,220,255', '255,235,200']

MARKETS = [
    dict(key='gwanghwamun', lpos='left', emd='11110530', seed=1, pal=WARM, name='광화문 마켓', ll=(126.9769, 37.5725), code='11110', photo=bokeh(1, WARM),
         title=('퇴근하고 광화문에서', '만나는 거 어때?'),
         rows=[('기간', '12.11(금) – 1.10(일)'), ('장소', '광화문광장 · 세종로공원'),
               ('시간', '17:30 – 22:00 <span class="sub">금·토 22:30까지</span>'), ('입장', '무료')],
         tip='같은 날 시작하는 청계천 빛초롱축제까지 걸어가기'),
    dict(key='shinsegae', emd='11140540', seed=5, pal=GOLD, name='신세계 홀리데이 마켓', ll=(126.9810, 37.5609), code='11140', photo=bokeh(5, GOLD),
         title=('명동 데이트라면', '신세계 홀리데이 마켓'), lpos='bottom',
         rows=[('기간', '11.24(화) – 12.31(목)'), ('장소', '신세계백화점 본점 <span class="sub">명동</span>'),
               ('시간', '10:30 – 20:00 <span class="sub">백화점 영업시간</span>'), ('입장', '별도 예약 안내 없음')],
         tip='해가 지면 본점 건물 외벽에 크리스마스 영상이 나와요 (매일 17–24시)'),
    dict(key='jamsil', emd='11710710', seed=7, pal=TREE, name='잠실 롯데타운 마켓', ll=(127.1025, 37.5126), code='11710', photo=bokeh(7, TREE),
         title=('잠실 마켓은', '예약부터 잡아두자'),
         rows=[('기간', '11.19(목) – 1.3(일)'), ('장소', '롯데월드타워 월드파크'),
               ('시간', '11:30 – 22:00 <span class="sub">변동 가능</span>'), ('입장', '무료 · 예약 입장권 <span class="sub">예약 후 현장 대기</span>')],
         tip='12.18 – 1.3 방문 입장권 예약은 12월 7일(월) 오픈'),
    dict(key='thehyundai', emd='11560540', seed=3, pal=COOL, name='더현대 크리스마스 빌리지', ll=(126.9284, 37.5259), code='11560', photo=bokeh(3, COOL),
         title=('추운 날엔', '실내 크리스마스 빌리지'),
         rows=[('기간', '~ 12.31(목)'), ('장소', '더현대 서울 5층 사운즈 포레스트'),
               ('시간', '10:30 – 19:30'), ('입장', '무료 · 사전예약 또는 현장 웨이팅')],
         tip='12월 18일(금)은 빌리지 운영을 쉬어요'),
    dict(key='hangang', emd='11215840', seed=11, pal=RIVER, name='로맨틱한강 마켓', ll=(127.0667, 37.5305), code='11215', photo=bokeh(11, RIVER),
         title=('크리스마스 당일엔', '한강 마켓으로'),
         rows=[('기간', '12.24(목) – 12.27(일)'), ('장소', '뚝섬 한강플플 · 청담대교 하부'),
               ('시간', '14:00 – 21:00 <span class="sub">날씨에 따라 변동</span>'), ('입장', '공식 안내 확인 필요')],
         tip='딱 4일만 열려요. 해 질 무렵 가면 한강 노을도 볼 수 있어요'),
]

L_ICON = brand.ICON
WORDMARK = brand.WORDMARK

ICON_MENU = '<svg viewBox="0 0 24 24" width="34" height="34"><path d="M4 7h16M4 12h16M4 17h16" stroke="#fff" stroke-width="2" stroke-linecap="round"/></svg>'
ICON_BELL = '<svg viewBox="0 0 24 24" width="32" height="32"><path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15L6 16zM10 20a2 2 0 0 0 4 0" fill="none" stroke="#fff" stroke-width="1.8" stroke-linejoin="round"/></svg>'
ICON_ARROW = '<svg viewBox="0 0 24 24" width="26" height="26"><path d="M20 4L4 11l7 2 2 7z" fill="#fff"/></svg>'
ICON_PIN = '<svg viewBox="0 0 24 24" width="24" height="24"><path d="M12 22s7-6.5 7-12a7 7 0 0 0-14 0c0 5.5 7 12 7 12z" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="10" r="2.5" fill="currentColor"/></svg>'
ICON_GRID = '<svg viewBox="0 0 24 24" width="24" height="24"><rect x="4" y="4" width="7" height="7" rx="1.5" fill="currentColor"/><rect x="13" y="4" width="7" height="7" rx="1.5" fill="currentColor"/><rect x="4" y="13" width="7" height="7" rx="1.5" fill="currentColor"/><rect x="13" y="13" width="7" height="7" rx="1.5" fill="currentColor"/></svg>'
ICON_PLUS = '<svg viewBox="0 0 24 24" width="34" height="34"><path d="M12 5v14M5 12h14" stroke="#fff" stroke-width="2" stroke-linecap="round"/></svg>'


def pin(px, py, photo, label=None, badge=None, size=1.0):
    pw, ph = 128 * size, 168 * size
    b = f'<div class="badge">{badge}</div>' if badge else ''
    lb = f'<div class="plabel">{label}</div>' if label else ''
    return (f'<div class="pin" style="left:{px - pw/2:.0f}px;top:{py - ph - 14*size:.0f}px;width:{pw:.0f}px;height:{ph:.0f}px">'
            f'<div class="pphoto" style="background:{photo}"></div>{b}<div class="ptail"></div></div>'
            f'<div class="pdot" style="left:{px-6:.0f}px;top:{py-6:.0f}px"></div>'
            + (f'<div class="plabel-wrap" style="left:{px:.0f}px;top:{py + 14:.0f}px">{lb}</div>' if label else ''))


def phone(inner, top, height, place='서울특별시', count=None, show_bottom=False):
    chip = f'<div class="chip">기록 {count}개</div>' if count else ''
    bottom = ''
    if show_bottom:
        bottom = (f'<div class="seg"><span class="on">{ICON_PIN}지도보기</span><span>{ICON_GRID}</span></div>'
                  f'<div class="fab">{ICON_PLUS}</div>')
    return (f'<div class="phone" style="top:{top}px;height:{height}px"><div class="screen">{inner}'
            f'<div class="topbar"><div class="cbtn">{ICON_MENU}</div><div class="place">{ICON_ARROW}{place}</div>'
            f'<div class="cbtn">{ICON_BELL}</div></div>{chip}{bottom}</div></div>')


SW = 860  # phone screen width


def snow(seed, n=40):
    r = random.Random(seed)
    return ''.join(f'<i style="left:{r.randint(0,1080)}px;top:{r.randint(0,1350)}px;width:{s}px;height:{s}px;opacity:{r.uniform(.15,.5):.2f}"></i>'
                   for s in (r.choice([2, 2, 3, 4]) for _ in range(n)))


slides = []
CW = 900  # 지도 카드 폭


def mapcard(inner, top, height, loc=None):
    chip = f'<div class="loc">{ICON_ARROW}{loc}</div>' if loc else ''
    return f'<div class="mapcard" style="top:{top}px;height:{height}px">{inner}{chip}</div>'


def seoul_map(sw, sh, vw, labels=True, center=(127.018, 37.551), top_clear=40, bottom_clear=0):
    cx, cy = w(*center)
    _, t = map_svg(cx, cy, vw, sw, sh, 21)
    regs, boxes = '', []
    for m in MARKETS:
        h, b = region_photo(SGG[m['code']], t, bokeh(m['seed'], m['pal'], 2, 7, 60), m['name'] if labels else None, lpos=m.get('lpos', 'bottom'))
        regs += h; boxes.append(b)
    inner, t = map_svg(cx, cy, vw, sw, sh, 21, hide=boxes, top_clear=top_clear, bottom_clear=bottom_clear)
    return inner + regs


# 1. 커버 (정보형: 앱 UI 없이 지도 카드)
slides.append(f'''
<section class="slide bleed">
  <div class="fullmap">{seoul_map(1080, 1350, 32, center=(127.03, 37.487), top_clear=60, bottom_clear=520)}</div>
  <div class="bshade"></div>
  <div class="btext"><div class="be">2026 겨울 데이트 지도</div>
    <h1><span>서울 크리스마스 마켓 5곳,</span><span class="g">기간·예약 한눈에 정리</span></h1></div>
</section>''')

# 2~6. 마켓
for i, m in enumerate(MARKETS, 1):
    sh = 540
    g = EMD[m['emd']]
    polys = g['coordinates'] if g['type'] == 'MultiPolygon' else [g['coordinates']]
    pts = [w(*p) for poly in polys for p in poly[0]]
    rx = (min(p[0] for p in pts) + max(p[0] for p in pts)) / 2
    ry = (min(p[1] for p in pts) + max(p[1] for p in pts)) / 2
    rw = max(p[0] for p in pts) - min(p[0] for p in pts)
    rh = max(p[1] for p in pts) - min(p[1] for p in pts)
    kk = min(500 / rw, 300 / rh)
    vwk = CW / kk
    _, t = map_svg(rx, ry + 22 / kk, vwk, CW, sh, 24)
    regs, box = region_photo(g, t, bokeh(m['seed'], m['pal'], 1, 4, 80), m['name'], stroke=3.6)
    inner, t = map_svg(rx, ry + 22 / kk, vwk, CW, sh, 24, hide=[box], top_clear=70)
    inner += regs
    rows = ''.join(f'<div class="row"><span class="k">{a}</span><span class="v">{b}</span></div>' for a, b in m['rows'])
    slides.append(f'''
<section class="slide info"><div class="snow">{snow(i+10, 24)}</div>
  <div class="eyebrow">{i:02d}  {m['name']}</div>
  <h1><span>{m['title'][0]}</span><span class="g">{m['title'][1]}</span></h1>
  <div class="card">{rows}<div class="tip"><b>TIP</b>{m['tip']}</div></div>
  {mapcard(inner, 750, sh, loc=NAMES[m['code']])}
</section>''')

# 7. 마지막 장: 여기서만 앱 홍보
slides.append(f'''
<section class="slide cta2"><div class="snow">{snow(40, 50)}</div>
  <div class="appicon">{L_ICON}</div>
  <h1 class="one"><span>둘만의 커플지도, <em class="g">로킷</em></span></h1>
  <p class="desc">함께 다녀온 곳이 지도 위에 쌓여요<br>크리스마스 마켓에서 올겨울 첫 기록을 남겨보세요</p>
  {phone(seoul_map(SW, 850, 33, labels=False, center=(127.03, 37.536), top_clear=150, bottom_clear=200), 520, 890)}
  <div class="dl">프로필 링크에서 다운로드 가능해요 · iOS</div>
</section>''')

CSS = open(os.path.join(HERE, 'style.css')).read()
html = f'''<!doctype html><html lang="ko"><head><meta charset="utf-8"><title>로킷 크리스마스 마켓 캐러셀</title>
{brand.css_link(HERE)}<style>{CSS}</style></head><body>{''.join(slides)}</body></html>'''
open(os.path.join(HERE, 'carousel.html'), 'w').write(html)
print('slides', len(slides), 'bytes', len(html))
