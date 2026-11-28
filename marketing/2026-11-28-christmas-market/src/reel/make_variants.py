"""reel.html(기본 세로 영상)을 플랫폼별 버전으로 바꾼다.

    python3 reel_build.py      # reel.html 생성 (마켓 정보·지도 데이터)
    python3 make_variants.py   # shorts.html, reels.html 생성

공통: 0초부터 제목 노출 + 인트로 줌, 마켓당 3.2초, 끝→처음 루프, 엔딩 카드 위로.
Shorts: 앱스토어 검색 CTA(Shorts는 외부 링크가 안 눌림), 댓글 유도 아웃트로.
Reels: 프로필 링크 CTA, 3:4 그리드 크롭 안으로 텍스트 내림, 공유 유도 아웃트로.
"""
import os

HERE = os.path.dirname(os.path.abspath(__file__))

HOOK = '딱 4일 여는 곳도 있어요'


def sub(s, a, b):
    assert s.count(a) == 1, f'패턴을 찾을 수 없음: {a[:60]}'
    return s.replace(a, b)


def common(s):
    # 엔딩 카드를 위로 올리고, 마지막 카메라는 지도를 조금 작게 위쪽에 둔다
    s = sub(s, 'padding-top: 930px;', 'padding-top: 800px;')
    s = sub(s, 'cy: (allY0 + allY1) / 2 + (H / 2 - 470) / (W / FULL.vw), vw: FULL.vw }',
            'cy: (allY0 + allY1) / 2 + (H / 2 - 420) / (W / (FULL.vw * 1.2)), vw: FULL.vw * 1.2 }')
    # 후킹 문구 (한 줄 유지)
    s = sub(s, '<span class="g">기간·예약 한눈에 정리</span>', f'<span class="g">{HOOK}</span>')
    s = sub(s, '.intro h1 span { display: block;', '.intro h1 span { display: block; white-space: nowrap;')
    # 마켓당 3.2초 + 끝에서 첫 화면으로 돌아가는 루프 구간
    s = sub(s, 'const T0 = 2.4, STEP = 2.6, TOUT = T0 + STEP * R.length, TEND = TOUT + 2.4;\nconst DURATION = TEND + 2.4;',
            'const T0 = 2.4, STEP = 3.2, TOUT = T0 + STEP * R.length, TEND = TOUT + 2.4;\n'
            'const TL0 = TEND + 2.4, TL1 = TL0 + 0.6;\nconst DURATION = TL1 + 0.1;\n'
            'const START = { cx: FULL.cx, cy: FULL.cy, vw: FULL.vw * 1.06 };')
    # 인트로 동안 천천히 줌인 (정지화면처럼 보이지 않게)
    s = sub(s, '  if (t < T0) return FULL;',
            '  if (t < T0) { const p = 1 - Math.pow(1 - prog(t, 0, T0), 2); '
            'return { cx: FULL.cx, cy: FULL.cy, vw: lerp(START.vw, FULL.vw, p) }; }')
    s = sub(s, '  return { cx: lerp(mid.cx, END.cx, q), cy: lerp(mid.cy, END.cy, q), vw: mid.vw };',
            '  const e = { cx: lerp(mid.cx, END.cx, q), cy: lerp(mid.cy, END.cy, q), vw: lerp(mid.vw, END.vw, q) };\n'
            '  const z = ease(prog(t, TL0, TL1));\n'
            '  return { cx: lerp(e.cx, START.cx, z), cy: lerp(e.cy, START.cy, z), vw: lerp(e.vw, START.vw, z) };')
    s = sub(s, '  const c = camAt(t), vh = c.vw * H / W;',
            '  const c = camAt(t), vh = c.vw * H / W;\n  const z = ease(prog(t, TL0, TL1));')
    # 0초부터 지역 윤곽 표시, 루프 구간에서 사진 끄고 윤곽 복귀
    s = sub(s, "    document.getElementById('r' + i).setAttribute('opacity', f * dim);\n"
               "    document.getElementById('o' + i).setAttribute('opacity', ease(prog(t, 0.3, 0.9)) * (1 - f));",
            "    document.getElementById('r' + i).setAttribute('opacity', f * dim * (1 - z));\n"
            "    document.getElementById('o' + i).setAttribute('opacity', t < T0 ? 1 : Math.max(1 - f, z));")
    # 0초부터 제목 노출, 루프 구간에서 다시 등장
    s = sub(s, "  const ip = t < 1 ? ease(prog(t, 0.15, 0.7)) : 1 - ease(prog(t, 1.85, 2.25));\n"
               "  intro.style.opacity = ip; intro.style.transform = `translateY(${(1 - ease(prog(t, 0.15, 0.7))) * 30}px)`;",
            "  const ip = t >= TL0 ? z : 1 - ease(prog(t, 1.85, 2.25));\n"
            "  intro.style.opacity = ip; intro.style.transform = t >= TL0 ? `translateY(${(1 - z) * 30}px)` : 'none';")
    s = sub(s, '  end.style.opacity = ep;', '  end.style.opacity = ep * (1 - z);')
    return s


def shorts(s):
    s = sub(s, '프로필 링크에서 다운로드 가능해요 · iOS', '앱스토어에서 ‘로킷’ 검색 · iOS')
    s = sub(s, '<h2>올겨울 데이트 코스,<span class="g">저장해두고 꺼내보세요</span></h2>',
            '<h2>올겨울 어디부터 갈 거예요?<span class="g">댓글로 알려주세요</span></h2>')
    return s


def reels(s):
    # 프로필 그리드(3:4)는 위아래 240px씩 잘린다 → 상단 텍스트를 270px로
    for cls in ('.head { position: absolute; left: 84px; right: 84px; top: ', '.intro { position: absolute; top: ',
                '.outro { position: absolute; top: '):
        s = sub(s, cls + '190px', cls + '270px')
    s = sub(s, 'rgba(15,16,20,.95) 0%, rgba(15,16,20,.6) 14%, rgba(15,16,20,0) 24%',
            'rgba(15,16,20,.95) 0%, rgba(15,16,20,.6) 18%, rgba(15,16,20,0) 29%')
    s = sub(s, '<h2>올겨울 데이트 코스,<span class="g">저장해두고 꺼내보세요</span></h2>',
            '<h2>같이 갈 사람한테<span class="g">‘여기 가자’ 보내보세요</span></h2>')
    return s


if __name__ == '__main__':
    base = common(open(os.path.join(HERE, 'reel.html')).read())
    for name, fn in (('shorts', shorts), ('reels', reels)):
        out = fn(base).replace('<title>로킷 릴스</title>', f'<title>로킷 {name}</title>')
        open(os.path.join(HERE, f'{name}.html'), 'w').write(out)
        print(f'{name}.html written')
