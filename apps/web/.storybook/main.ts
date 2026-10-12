// .storybook/main.ts
import type { StorybookConfig } from '@storybook/nextjs';

const config: StorybookConfig = {
  env: (config) => ({
    ...config,
    NEXT_PUBLIC_MAPBOX_TOKEN: process.env.NEXT_PUBLIC_MAPBOX_TOKEN ?? '',
  }),
  stories: ['../src/**/*.stories.@(ts|tsx|mdx)'],
  framework: {
    name: '@storybook/nextjs',
    options: {},
  },
  addons: ['@storybook/addon-docs'],
  staticDirs: ['../public', '../src/assets'],

  webpackFinal: async (config) => {
    if (!config.module?.rules) return config;

    // 기존 Next.js SVG 처리 rule에서 svg 제외
    config.module.rules = config.module.rules.map((rule) => {
      if (
        typeof rule === 'object' &&
        rule.test instanceof RegExp &&
        rule.test.test('.svg')
      ) {
        return {
          ...rule,
          exclude: /\.svg$/,
        };
      }
      return rule;
    });

    // SVGR로 SVG를 React 컴포넌트로 처리
    // SVGO의 removeViewBox 기본 최적화가 width/height=viewBox인 SVG의 viewBox를 제거해버려서,
    // 컴포넌트에 다른 width/height를 넘겨도 내부 path가 원본 크기로 고정되는 문제가 있다.
    // next.config.ts와 동일하게 viewBox를 항상 보존하도록 오버라이드한다.
    config.module.rules.push({
      test: /\.svg$/,
      use: [
        {
          loader: '@svgr/webpack',
          options: {
            svgoConfig: {
              plugins: [
                { name: 'preset-default', params: { overrides: { removeViewBox: false } } },
              ],
            },
          },
        },
      ],
    });

    return config;
  },
};

export default config;
