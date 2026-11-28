"""HTML → PNG/MP4 캡처 공통 함수. gstack browse(헤드리스 Chromium)와 ffmpeg가 필요하다.

browse는 서버를 처음 띄운 폴더와 /tmp 안의 파일만 열고 저장할 수 있다.
그래서 서버는 marketing/ 에서 띄우고(콘텐츠와 common/ 둘 다 열리게), 캡처는 /tmp에 찍은 뒤 옮긴다.
"""
import json, os, shutil, subprocess, sys, tempfile

MARKETING = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BROWSE = os.environ.get('BROWSE', os.path.expanduser('~/.claude/skills/gstack/browse/dist/browse'))
FPS, CHUNK = 30, 40  # chain 한 번에 너무 많이 보내면 타임아웃 난다


def chain(cmds, retry=True):
    r = subprocess.run([BROWSE, 'chain'], input=json.dumps(cmds), text=True, capture_output=True, cwd=MARKETING)
    if retry and 'Path must be within' in r.stdout:
        # 다른 폴더에서 이미 떠 있는 서버를 재사용한 경우 → 서버를 끄고 marketing/에서 다시 띄운다
        subprocess.run([BROWSE, 'stop'], capture_output=True, cwd=MARKETING)
        return chain(cmds, retry=False)
    if r.returncode != 0 or '] ERROR' in r.stdout:
        sys.exit(f'browse chain 실패:\n{r.stdout[-800:]}\n{r.stderr[-800:]}')
    return r.stdout


def _tmp(prefix):
    return tempfile.mkdtemp(prefix=prefix, dir=os.path.realpath('/tmp'))


def _open(page, w, h):
    return [['viewport', f'{w}x{h}'], ['goto', 'file://' + page], ['wait', '--load'],
            ['js', 'document.fonts.ready.then(() => window.DURATION || 1)']]


def elements(page, size, shots):
    """shots: [(CSS 선택자, 저장 경로), ...] 요소 단위 스크린샷 (캐러셀 슬라이드 등)."""
    tmp = _tmp('shots_')
    cmds = _open(page, *size)
    for i, (sel, _) in enumerate(shots):
        cmds.append(['screenshot', '--selector', sel, f'{tmp}/{i}.png'])
    chain(cmds)
    for i, (_, dst) in enumerate(shots):
        os.makedirs(os.path.dirname(dst), exist_ok=True)
        shutil.move(f'{tmp}/{i}.png', dst)
    shutil.rmtree(tmp)


def frames_at(page, times, out_dir, prefix, size=(1080, 1920)):
    """render(t) 를 가진 페이지에서 특정 시점만 PNG로 (미리보기)."""
    tmp = _tmp('preview_')
    cmds = _open(page, *size)
    for t in times:
        cmds += [['js', f'render({t})'], ['screenshot', '--viewport', f'{tmp}/{t}.png']]
    chain(cmds)
    os.makedirs(out_dir, exist_ok=True)
    for t in times:
        shutil.move(f'{tmp}/{t}.png', os.path.join(out_dir, f'{prefix}_{t}.png'))
    shutil.rmtree(tmp)


def video(page, out, size=(1080, 1920), cover=None):
    """render(t) 를 1/FPS 간격으로 찍어 MP4로 (무음 오디오 트랙 포함). cover=(초, 경로)면 그 프레임을 따로 저장."""
    js = [l for l in chain(_open(page, *size)).splitlines() if l.startswith('[js]')]
    dur = float(js[-1].split()[-1])  # 페이지의 window.DURATION
    nf = int(round(dur * FPS))
    tmp = _tmp('frames_')
    for st in range(0, nf, CHUNK):
        cmds = _open(page, *size)
        for n in range(st, min(st + CHUNK, nf)):
            cmds += [['js', f'render({n / FPS:.4f})'], ['screenshot', '--viewport', f'{tmp}/f{n:04d}.png']]
        chain(cmds)
        print(f'  {min(st + CHUNK, nf)}/{nf}', end='\r')
    os.makedirs(os.path.dirname(out), exist_ok=True)
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-framerate', str(FPS), '-i', f'{tmp}/f%04d.png',
                    '-f', 'lavfi', '-i', 'anullsrc=r=48000:cl=stereo', '-shortest',
                    '-c:v', 'libx264', '-preset', 'slow', '-crf', '17', '-pix_fmt', 'yuv420p', '-profile:v', 'high',
                    '-c:a', 'aac', '-b:a', '128k', '-movflags', '+faststart', out], check=True)
    if cover:
        shutil.copy(f'{tmp}/f{int(round(cover[0] * FPS)):04d}.png', cover[1])
    shutil.rmtree(tmp)
    print(f'\n{out} ({dur:.1f}s)')
