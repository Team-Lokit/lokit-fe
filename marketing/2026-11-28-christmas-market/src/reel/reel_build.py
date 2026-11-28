"""로킷 크리스마스 마켓 릴스 (1080x1920) HTML 생성기.

캐러셀 build.py 의 지도 데이터(구 경계, 한강선)를 그대로 쓴다.
render(t) 로 t초 시점 화면을 그리고, 프레임 캡처 후 ffmpeg 으로 묶는다.
photos/<key>.jpg 를 실사진으로 바꾸면 그대로 반영된다.
"""
import importlib.util, json, os

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
spec = importlib.util.spec_from_file_location('carousel_build', os.path.join(ROOT, 'build.py'))
cb = importlib.util.module_from_spec(spec)
spec.loader.exec_module(cb)

w, SGG = cb.w, cb.SGG

# 서쪽 → 동쪽 순서로 카메라 이동
ORDER = ['thehyundai', 'gwanghwamun', 'shinsegae', 'hangang', 'jamsil']
INFO = {
    'thehyundai': ('더현대 크리스마스 빌리지', '11.10 – 12.31', '더현대 서울 5층 · 무료', '10:30 – 19:30 · 12.18은 쉬어요'),
    'gwanghwamun': ('광화문 마켓', '12.11 – 1.10', '광화문광장 · 무료', '17:30 – 22:00 · 금·토 22:30까지'),
    'shinsegae': ('신세계 홀리데이 마켓', '11.24 – 12.31', '신세계백화점 본점 · 명동', '해 지면 외벽에 크리스마스 영상이 나와요'),
    'hangang': ('로맨틱한강 마켓', '12.24 – 12.27', '뚝섬한강공원 · 딱 4일', '14:00 – 21:00 · 날씨에 따라 변동'),
    'jamsil': ('잠실 롯데타운 마켓', '11.19 – 1.3', '롯데월드타워 · 무료 (예약 권장)', '12.18 이후 방문 예약 12.7(월) 오픈'),
}
by_key = {m['key']: m for m in cb.MARKETS}

regions = []
for k in ORDER:
    m = by_key[k]
    g = SGG[m['code']]
    polys = g['coordinates'] if g['type'] == 'MultiPolygon' else [g['coordinates']]
    rings = [[w(*p) for p in ring] for poly in polys for ring in poly]
    xs = [p[0] for r in rings for p in r]; ys = [p[1] for r in rings for p in r]
    d = ''.join('M' + 'L'.join(f'{x:.3f},{y:.3f}' for x, y in r) + 'Z' for r in rings)
    regions.append(dict(key=k, d=d, bbox=[min(xs), min(ys), max(xs), max(ys)],
                        name=INFO[k][0], date=INFO[k][1], sub=INFO[k][2], extra=INFO[k][3]))

svg_regions = ''
for i, r in enumerate(regions):
    x0, y0, x1, y1 = r['bbox']
    svg_regions += (
        f'<path id="o{i}" d="{r["d"]}" fill="rgba(110,234,228,.08)" stroke="#6EEAE4" stroke-width="3" stroke-dasharray="10 9" '
        f'vector-effect="non-scaling-stroke" stroke-linejoin="round"/>'
        f'<clipPath id="c{i}"><path d="{r["d"]}" clip-rule="evenodd"/></clipPath>'
        f'<g id="r{i}" opacity="0"><image href="photos/{r["key"]}.jpg" x="{x0}" y="{y0}" width="{x1-x0}" height="{y1-y0}" '
        f'preserveAspectRatio="xMidYMid slice" clip-path="url(#c{i})"/>'
        f'<path d="{r["d"]}" fill="none" stroke="rgba(0,0,0,.25)" stroke-width="7" vector-effect="non-scaling-stroke" stroke-linejoin="round"/>'
        f'<path d="{r["d"]}" fill="none" stroke="#fff" stroke-width="3.5" vector-effect="non-scaling-stroke" stroke-linejoin="round"/></g>'
    )

html = f'''<!doctype html><html lang="ko"><head><meta charset="utf-8"><title>로킷 릴스</title>
{cb.brand.css_link(HERE)}
<style>
* {{ margin: 0; padding: 0; box-sizing: border-box; }}
html, body {{ width: 1080px; height: 1920px; overflow: hidden; background: #0F1014; }}
body {{ font-family: Pretendard, sans-serif; color: #fff; letter-spacing: -0.02em; -webkit-font-smoothing: antialiased; }}
#map {{ position: absolute; inset: 0; width: 1080px; height: 1920px; }}
.shade {{ position: absolute; inset: 0; pointer-events: none;
  background: linear-gradient(180deg, rgba(15,16,20,.95) 0%, rgba(15,16,20,.6) 14%, rgba(15,16,20,0) 24%, rgba(15,16,20,0) 54%, rgba(15,16,20,.92) 64%, #0F1014 100%); }}
.head {{ position: absolute; left: 84px; right: 84px; top: 190px; }}
.head .n {{ font-size: 38px; font-weight: 700; color: #6EEAE4; }}
.head .t {{ margin-top: 10px; font-size: 80px; font-weight: 700; line-height: 1.2; color: #F2F2F3; }}
.foot {{ position: absolute; left: 84px; right: 140px; top: 1150px; }}
.foot .d {{ font-size: 128px; font-weight: 700; letter-spacing: -0.03em; color: #fff; line-height: 1.05; }}
.foot .s {{ margin-top: 22px; font-size: 50px; font-weight: 600; color: #D3D3D3; }}
.foot .x {{ margin-top: 16px; font-size: 40px; font-weight: 500; color: #8D8C8F; }}
.intro {{ position: absolute; top: 190px; left: 84px; right: 84px; }}
.eyebrow {{ font-size: 38px; font-weight: 700; color: #6EEAE4; }}
.intro h1 {{ margin-top: 16px; font-size: 92px; font-weight: 700; line-height: 1.25; }}
.intro h1 span {{ display: block; color: #F2F2F3; }}
.intro h1 .g {{ color: #A3A3A8; }}
.card {{ position: absolute; left: 80px; right: 80px; top: 1190px; padding: 38px 46px; border-radius: 40px;
  background: rgba(24,25,30,.86); box-shadow: 0 0 0 1px rgba(226,230,255,.10), 0 30px 80px rgba(0,0,0,.5); }}
.card .n {{ font-size: 30px; font-weight: 600; color: #6EEAE4; }}
.card .d {{ margin-top: 14px; font-size: 68px; font-weight: 700; color: #F2F2F3; }}
.card .s {{ margin-top: 10px; font-size: 34px; font-weight: 500; color: #B2B2B4; }}
.outro {{ position: absolute; top: 190px; left: 84px; right: 84px; }}
.outro h2 {{ font-size: 84px; font-weight: 700; line-height: 1.25; }}
.outro h2 .g {{ color: #A3A3A8; display: block; }}
.end {{ position: absolute; inset: 0; background: linear-gradient(180deg, rgba(15,16,20,.55) 0%, rgba(15,16,20,0) 12%, rgba(15,16,20,0) 40%, rgba(15,16,20,.9) 50%, #0F1014 62%);
  display: flex; flex-direction: column; align-items: center; justify-content: flex-start; padding-top: 930px; }}
.end .icon {{ width: 132px; height: 132px; border-radius: 32px; background: #1E1F27; display: grid; place-items: center;
  box-shadow: 0 0 0 2px #2B2C33 inset, 0 30px 100px rgba(110,234,228,.16); }}
.end .icon svg {{ width: 84px; height: 84px; }}
.end h2 {{ margin-top: 44px; font-size: 88px; font-weight: 700; }}
.end h2 em {{ font-style: normal; color: #A3A3A8; }}
.end p {{ margin-top: 20px; font-size: 36px; color: #B2B2B4; font-weight: 500; line-height: 1.6; text-align: center; }}
.end .dl {{ margin-top: 48px; padding: 30px 56px; border-radius: 70px; background: linear-gradient(180deg, #D5FFFD 0%, #6EEAE4 100%);
  color: #0F1014; font-size: 38px; font-weight: 700; }}
</style></head><body>
<svg id="map" viewBox="0 0 10 10" preserveAspectRatio="xMidYMid slice">
  <rect x="-200" y="-200" width="400" height="400" fill="#3E5A6E"/>
  <g fill="#2C2D31" stroke="#45464C" stroke-width="1.4" vector-effect="non-scaling-stroke" stroke-linejoin="round">
    {''.join(f'<path d="{p}" vector-effect="non-scaling-stroke"/>' for p in cb.paths)}
  </g>
  <path d="{cb.han_d}" fill="none" stroke="#3E5A6E" stroke-width="0.95" stroke-linecap="round" stroke-linejoin="round"/>
  {svg_regions}
</svg>
<div class="shade"></div>
<div class="intro" id="intro"><div class="eyebrow">2026 겨울 데이트 지도</div>
  <h1><span>서울 크리스마스 마켓 5곳</span><span class="g">기간·예약 한눈에 정리</span></h1></div>
<div class="head" id="head"><div class="n" id="cn"></div><div class="t" id="ct"></div></div>
<div class="foot" id="foot"><div class="d" id="cd"></div><div class="s" id="cs"></div><div class="x" id="cx"></div></div>
<div class="outro" id="outro"><h2>올겨울 데이트 코스,<span class="g">저장해두고 꺼내보세요</span></h2></div>
<div class="end" id="end"><div class="icon">{cb.L_ICON}</div>
  <h2>둘만의 커플지도, <em>로킷</em></h2>
  <p>함께 다녀온 곳이 지도 위에 쌓여요<br>크리스마스 마켓에서 올겨울 첫 기록을 남겨보세요</p>
  <div class="dl">프로필 링크에서 다운로드 가능해요 · iOS</div></div>
<script>
const R = {json.dumps(regions)};
const W = 1080, H = 1920;
const clamp = (x, a=0, b=1) => Math.max(a, Math.min(b, x));
const ease = x => x < .5 ? 4*x*x*x : 1 - Math.pow(-2*x + 2, 3) / 2;
const prog = (t, a, b) => clamp((t - a) / (b - a));
const lerp = (a, b, p) => a + (b - a) * p;

// 전체 보기 카메라
const allX0 = Math.min(...R.map(r => r.bbox[0])), allX1 = Math.max(...R.map(r => r.bbox[2]));
const allY0 = Math.min(...R.map(r => r.bbox[1])), allY1 = Math.max(...R.map(r => r.bbox[3]));
const FULL = {{ cx: (allX0 + allX1) / 2, cy: (allY0 + allY1) / 2 - 1.5, vw: (allX1 - allX0) * 1.12 }};
function camFor(r) {{
  const [x0, y0, x1, y1] = r.bbox, rw = x1 - x0, rh = y1 - y0;
  const vw = Math.max(rw / 0.74, rh * W / 600, 9.5);
  const k = W / vw;
  return {{ cx: (x0 + x1) / 2, cy: (y0 + y1) / 2 + (H / 2 - 770) / k, vw }};
}}
const CAMS = R.map(camFor);
const T0 = 2.4, STEP = 2.6, TOUT = T0 + STEP * R.length, TEND = TOUT + 2.4;
const DURATION = TEND + 2.4;

function camAt(t) {{
  if (t < T0) return FULL;
  if (t < TOUT) {{
    const i = Math.min(R.length - 1, Math.floor((t - T0) / STEP));
    const s = T0 + STEP * i, from = i === 0 ? FULL : CAMS[i - 1], to = CAMS[i];
    const p = ease(prog(t, s, s + 0.75));
    return {{ cx: lerp(from.cx, to.cx, p), cy: lerp(from.cy, to.cy, p), vw: lerp(from.vw, to.vw, p) }};
  }}
  const p = ease(prog(t, TOUT, TOUT + 0.9)), from = CAMS[R.length - 1];
  const mid = {{ cx: lerp(from.cx, FULL.cx, p), cy: lerp(from.cy, FULL.cy, p), vw: lerp(from.vw, FULL.vw, p) }};
  const q = ease(prog(t, TEND - 0.3, TEND + 0.5));
  const END = {{ cx: FULL.cx, cy: (allY0 + allY1) / 2 + (H / 2 - 470) / (W / FULL.vw), vw: FULL.vw }};
  return {{ cx: lerp(mid.cx, END.cx, q), cy: lerp(mid.cy, END.cy, q), vw: mid.vw }};
}}

function render(t) {{
  const c = camAt(t), vh = c.vw * H / W;
  document.getElementById('map').setAttribute('viewBox', `${{c.cx - c.vw/2}} ${{c.cy - vh/2}} ${{c.vw}} ${{vh}}`);
  R.forEach((r, i) => {{
    const s = T0 + STEP * i;
    const f = ease(prog(t, s + 0.45, s + 0.9));
    // 지나간 마켓은 흐리게, 마지막 전체 보기에서 다시 선명하게
    const cur = Math.min(R.length - 1, Math.floor((t - T0) / STEP));
    const past = t >= T0 && t < TOUT && i < cur ? ease(prog(t, T0 + STEP * cur, T0 + STEP * cur + 0.5)) : 0;
    const back = ease(prog(t, TOUT, TOUT + 0.6));
    const dim = t >= TOUT ? (i < R.length - 1 ? 0.35 + 0.65 * back : 1) : 1 - 0.65 * past;
    document.getElementById('r' + i).setAttribute('opacity', f * dim);
    document.getElementById('o' + i).setAttribute('opacity', ease(prog(t, 0.3, 0.9)) * (1 - f));
  }});
  const intro = document.getElementById('intro');
  const ip = t < 1 ? ease(prog(t, 0.15, 0.7)) : 1 - ease(prog(t, 1.85, 2.25));
  intro.style.opacity = ip; intro.style.transform = `translateY(${{(1 - ease(prog(t, 0.15, 0.7))) * 30}}px)`;

  const head = document.getElementById('head'), foot = document.getElementById('foot');
  if (t >= T0 && t < TOUT) {{
    const i = Math.min(R.length - 1, Math.floor((t - T0) / STEP)), s = T0 + STEP * i;
    const hin = ease(prog(t, s + 0.35, s + 0.7)), fin = ease(prog(t, s + 0.6, s + 0.95));
    const pout = ease(prog(t, s + STEP - 0.25, s + STEP));
    const r = R[i];
    document.getElementById('cn').textContent = `${{i + 1}} / ${{R.length}}`;
    document.getElementById('ct').textContent = r.name;
    document.getElementById('cd').textContent = r.date;
    document.getElementById('cs').textContent = r.sub;
    document.getElementById('cx').textContent = r.extra;
    head.style.opacity = hin * (1 - pout); head.style.transform = `translateY(${{(1 - hin) * -24}}px)`;
    foot.style.opacity = fin * (1 - pout); foot.style.transform = `translateY(${{(1 - fin) * 40}}px)`;
  }} else {{ head.style.opacity = 0; foot.style.opacity = 0; }}

  const outro = document.getElementById('outro');
  const op = ease(prog(t, TOUT + 0.6, TOUT + 1.1)) * (1 - ease(prog(t, TEND - 0.3, TEND)));
  outro.style.opacity = op; outro.style.transform = `translateY(${{(1 - op) * 30}}px)`;

  const end = document.getElementById('end');
  const ep = ease(prog(t, TEND - 0.2, TEND + 0.3));
  end.style.opacity = ep;
  // 아이콘은 고정, 문구가 차례로 올라오며 시선을 끈다
  const kids = end.children;
  [[1, 0.15], [2, 0.45], [3, 0.7]].forEach(([k, d]) => {{
    const q = ease(prog(t, TEND + d, TEND + d + 0.5));
    kids[k].style.opacity = q; kids[k].style.transform = `translateY(${{(1 - q) * 36}}px)`;
  }});
  return 'ok';
}}
window.DURATION = DURATION;
render(0);
</script></body></html>'''
open(os.path.join(HERE, 'reel.html'), 'w').write(html)
print('reel.html written')
