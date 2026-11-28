import os

ROOT = os.path.dirname(os.path.abspath(__file__))  # marketing/common
# 행정구역 경계: 앱과 같은 데이터를 그대로 쓴다 (vuski/admdongkor ver20261001)
# sgg.json(시·군·구), sido.json(시·도), emd/{시도코드}.json(읍·면·동, 서울=11)
MAP = os.path.join(ROOT, '..', '..', 'apps', 'web', 'public', 'geo')
