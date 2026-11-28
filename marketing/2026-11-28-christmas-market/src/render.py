"""크리스마스 마켓 콘텐츠 렌더링. 결과물은 ../output/ 에 저장된다.

    python3 render.py carousel                # slide1~7.png
    python3 render.py reels                   # reel.mp4 + reel_cover.png
    python3 render.py shorts                  # shorts.mp4
    python3 render.py shorts --at 0 4.5 20    # 특정 시점만 output/frames/에 PNG로 (미리보기)
"""
import argparse, os, subprocess, sys

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(os.path.dirname(HERE), 'output')
sys.path.insert(0, os.path.join(HERE, '..', '..'))  # marketing/
from common import render


def run(script):
    subprocess.run([sys.executable, os.path.join(HERE, script)], check=True)


if __name__ == '__main__':
    ap = argparse.ArgumentParser()
    ap.add_argument('target', choices=['carousel', 'shorts', 'reels'])
    ap.add_argument('--at', nargs='+', type=float, help='이 시점들만 PNG로 저장')
    a = ap.parse_args()

    if a.target == 'carousel':
        run('build.py')
        render.elements(os.path.join(HERE, 'carousel.html'), (1080, 1350),
                        [(f'section.slide:nth-of-type({i})', os.path.join(OUT, f'slide{i}.png')) for i in range(1, 8)])
        print(f'{OUT}/slide1~7.png')
        sys.exit()

    run('reel/reel_build.py')
    run('reel/make_variants.py')
    page = os.path.join(HERE, 'reel', f'{a.target}.html')
    if a.at:
        render.frames_at(page, a.at, os.path.join(OUT, 'frames'), a.target)
        print(f'{OUT}/frames')
    elif a.target == 'shorts':
        render.video(page, os.path.join(OUT, 'shorts.mp4'))
    else:  # 커버는 2초 지점: 제목이 다 보이는 장면
        render.video(page, os.path.join(OUT, 'reel.mp4'), cover=(2.0, os.path.join(OUT, 'reel_cover.png')))
