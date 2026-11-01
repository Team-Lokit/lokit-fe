import { defineConfig } from 'orval';

export default defineConfig({
  lokitApi: {
    input: 'https://develop-api.lokit.co.kr/api/docs',
    output: {
      target: './packages/api-client/src/generated.ts',
      schemas: './packages/api-client/src/model',
      mock: true,
      client: 'react-query',
      // mock(faker, msw)을 generated.msw.ts로 분리해 앱 번들에 섞이지 않게 한다.
      mode: 'split',
      override: {
        mutator: {
          path: './packages/api-client/src/customFetcher.ts',
          name: 'customFetcher',
        },
        query: {
          useSuspenseQuery: true,
        },
      },
    },
  },
});
