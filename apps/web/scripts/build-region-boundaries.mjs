#!/usr/bin/env node
/**
 * 지도뷰 행정구역 경계 GeoJSON 생성 (→ public/geo/)
 *
 * 원본: vuski/admdongkor 행정동 경계 (https://github.com/vuski/admdongkor)
 * 기준일: ver20261001 - 백엔드 region 원천 데이터와 동일
 *
 * 코드 (백엔드 /map/me v2 clusterId 와 동일)
 *   - sd_{2자리}  → sido.json
 *   - sgg_{5자리} → sgg.json (일반구만 시로 병합. 41111 → 41110 / 자치구·군은 그대로. 11215)
 *   - emd_{8자리} → emd/{시도}.json (adm_cd2 앞 8자리. 통계청 코드 adm_cd 는 쓰면 안 됨)
 *
 * 갱신: 백엔드가 region 을 교체하면 같은 기준일로 다시 실행하고, 출력된 시·도/읍·면·동 수를
 * 백엔드 검증 결과와 비교한 뒤 기본 VERSION 과 이 주석의 기준일을 고친다.
 *   node scripts/build-region-boundaries.mjs ver20261001
 */
import { execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync, writeFileSync, existsSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { gzipSync } from 'node:zlib';

const VERSION = process.argv[2] ?? 'ver20261001';
const SOURCE_URL = `https://raw.githubusercontent.com/vuski/admdongkor/master/${VERSION}/HangJeongDong_${VERSION}.geojson`;
const MAPSHAPER = 'mapshaper@0.6.113';

/** 단위별 단순화 비율 (남길 꼭짓점 비율). 값이 작을수록 파일이 가볍고 경계가 거칠어진다. */
const SIMPLIFY = {
  sido: '1.5%',
  sgg: '4%',
  emd: '12%',
};
/** 좌표 소수점 정밀도 (0.00001° ≈ 1m) */
const PRECISION = '0.00001';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, '..', 'public', 'geo');
const WORK_DIR = join(tmpdir(), `lokit-region-boundaries-${VERSION}`);
const RAW_PATH = join(WORK_DIR, 'raw.geojson');
const PREPARED_PATH = join(WORK_DIR, 'prepared.geojson');

const run = (mapshaperArgs) => {
  execFileSync('npx', ['--yes', MAPSHAPER, ...mapshaperArgs], { stdio: 'inherit' });
};

const download = async () => {
  if (existsSync(RAW_PATH)) {
    console.log(`[geo] 캐시된 원본 사용: ${RAW_PATH}`);
    return;
  }
  console.log(`[geo] 원본 다운로드: ${SOURCE_URL}`);
  const res = await fetch(SOURCE_URL);
  if (!res.ok) throw new Error(`다운로드 실패: ${res.status} ${res.statusText}`);
  writeFileSync(RAW_PATH, Buffer.from(await res.arrayBuffer()));
};

/**
 * 일반구(시 아래의 구. 예: 수원시장안구 41111) 여부.
 * 코드 끝자리만으로는 판별할 수 없다. 자치구(광진구 11215, 미추홀구 28177)나
 * 군(증평군 43745, 태안군 44825)도 끝자리가 0 이 아니기 때문에 시군구명으로 판별한다.
 */
const isGeneralGu = (sggName) => /시.+구$/.test(sggName);

/** 원본 속성(adm_cd2, sgg, sggnm, sido)으로 백엔드 clusterId 코드를 만든다. */
const prepare = () => {
  const raw = JSON.parse(readFileSync(RAW_PATH, 'utf8'));
  const features = raw.features.map((feature) => {
    const { adm_cd2: admCd2, sgg, sggnm, sido } = feature.properties;
    const sggCode = String(sgg);
    return {
      type: 'Feature',
      geometry: feature.geometry,
      properties: {
        sd: String(sido),
        // 일반구는 상위 시(끝자리 0)로 병합. 41111 → 41110
        sgg: isGeneralGu(String(sggnm)) ? `${sggCode.slice(0, 4)}0` : sggCode,
        emd: String(admCd2).slice(0, 8),
      },
    };
  });
  writeFileSync(PREPARED_PATH, JSON.stringify({ type: 'FeatureCollection', features }));
};

const buildLevel = ({ field, simplify, output }) => {
  run([
    '-i',
    PREPARED_PATH,
    '-dissolve',
    field,
    '-rename-fields',
    `code=${field}`,
    '-simplify',
    simplify,
    'keep-shapes',
    '-filter-fields',
    'code',
    '-o',
    output,
    'format=geojson',
    `precision=${PRECISION}`,
    'force',
  ]);
};

/** emd 는 시도별 파일로 나눠서 필요한 시도만 내려받게 한다. */
const buildEmd = () => {
  const merged = join(WORK_DIR, 'emd.json');
  run([
    '-i',
    PREPARED_PATH,
    '-simplify',
    SIMPLIFY.emd,
    'keep-shapes',
    '-each',
    'code=emd',
    '-filter-fields',
    'code',
    '-o',
    merged,
    'format=geojson',
    `precision=${PRECISION}`,
    'force',
  ]);

  const { features } = JSON.parse(readFileSync(merged, 'utf8'));
  const bySido = new Map();
  for (const feature of features) {
    const sd = feature.properties.code.slice(0, 2);
    if (!bySido.has(sd)) bySido.set(sd, []);
    bySido.get(sd).push(feature);
  }

  const emdDir = join(OUT_DIR, 'emd');
  rmSync(emdDir, { recursive: true, force: true });
  mkdirSync(emdDir, { recursive: true });
  for (const [sd, list] of bySido) {
    writeFileSync(
      join(emdDir, `${sd}.json`),
      JSON.stringify({ type: 'FeatureCollection', features: list }),
    );
  }
  console.log(`[geo] emd: 시도 ${bySido.size}개 파일 생성`);
  return [...bySido.keys()].sort().map((sd) => `emd/${sd}.json`);
};

const toKB = (bytes) => `${Math.round(bytes / 1024)}KB`;

/** 생성된 파일의 구역 수와 크기(원본/gzip)를 출력한다. */
const printSummary = (emdFiles) => {
  const rows = ['sido.json', 'sgg.json', ...emdFiles].map((relativePath) => {
    const buffer = readFileSync(join(OUT_DIR, relativePath));
    const { features } = JSON.parse(buffer.toString('utf8'));
    return {
      file: relativePath,
      count: features.length,
      size: toKB(buffer.length),
      gzip: toKB(gzipSync(buffer).length),
    };
  });
  console.table(rows);

  const emdTotal = rows
    .filter((row) => row.file.startsWith('emd/'))
    .reduce((sum, row) => sum + row.count, 0);
  console.log(
    `[geo] 구역 수: 시·도 ${rows[0].count} / 시·군·구 ${rows[1].count} / 읍·면·동 ${emdTotal}`,
  );
};

const main = async () => {
  mkdirSync(WORK_DIR, { recursive: true });
  mkdirSync(OUT_DIR, { recursive: true });

  await download();
  prepare();

  buildLevel({
    field: 'sd',
    simplify: SIMPLIFY.sido,
    output: join(OUT_DIR, 'sido.json'),
  });
  buildLevel({ field: 'sgg', simplify: SIMPLIFY.sgg, output: join(OUT_DIR, 'sgg.json') });
  const emdFiles = buildEmd();

  printSummary(emdFiles);
  console.log(`[geo] 완료 → ${OUT_DIR}`);
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
