"""로킷 브랜드 에셋. 콘텐츠 빌드 스크립트에서:

    sys.path.insert(0, <marketing 폴더>);  from common import brand
    brand.css_link(출력 HTML이 있는 폴더)  →  <link rel="stylesheet" href="../../common/brand/brand.css">
"""
import os

DIR = os.path.dirname(os.path.abspath(__file__))

ICON = open(os.path.join(DIR, 'icon.svg')).read().strip()      # 앱 아이콘 'L.' (class="licon")
WORDMARK = open(os.path.join(DIR, 'logo.svg')).read()          # 워드마크 '로킷'


def css_link(html_dir):
    href = os.path.relpath(os.path.join(DIR, 'brand.css'), html_dir)
    return f'<link rel="stylesheet" href="{href}">'
