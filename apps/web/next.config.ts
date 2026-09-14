import type { NextConfig } from 'next';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'https://develop-api.lokit.co.kr';

// SVGO의 removeViewBox 기본 최적화가 width/height=viewBox인 SVG의 viewBox를 제거해버려서,
// 컴포넌트에 다른 width/height를 넘겨도 내부 path가 원본 크기로 고정되는 문제가 있었다.
// 그래서 viewBox는 항상 보존하도록 명시적으로 오버라이드한다.
const svgrLoaderOptions = {
  svgoConfig: {
    plugins: [
      { name: 'preset-default', params: { overrides: { removeViewBox: false } } },
    ],
  },
};

const nextConfig: NextConfig = {
  turbopack: {
    rules: {
      '*.svg': {
        loaders: [{ loader: '@svgr/webpack', options: svgrLoaderOptions }],
        as: '*.js',
      },
    },
  },
  webpack(config) {
    // Next.js 내장 이미지 로더에서 SVG를 제외하고, SVGR로 처리
    // 서버/클라이언트 컴포넌트 모두에서 SVG를 React 컴포넌트로 import 가능
    const excludeSvgFromImageRules = (rules: unknown[]) => {
      for (const rule of rules) {
        const r = rule as Record<string, unknown>;
        if (!r) continue;
        if (r.oneOf) excludeSvgFromImageRules(r.oneOf as unknown[]);
        const test = r.test;
        if (test instanceof RegExp) {
          if (test.test('.svg') && test.test('.png')) {
            r.test = new RegExp(test.source.replace(/\|svg|svg\|/, ''), test.flags);
          }
        }
      }
    };
    excludeSvgFromImageRules(config.module.rules);

    config.module.rules.push({
      test: /\.svg$/i,
      issuer: { not: /\.css$/i },
      type: 'javascript/auto',
      use: [{ loader: '@svgr/webpack', options: svgrLoaderOptions }],
    });

    return config;
  },
  allowedDevOrigins: ['local.lokit.co.kr'],
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${API_BASE_URL}/:path*`,
      },
    ];
  },
};

export default nextConfig;
