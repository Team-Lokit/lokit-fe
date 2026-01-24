# Claude Code 가이드

## 프로젝트 구조

- **모노레포**: pnpm workspaces + Turborepo
- **apps/web**: 웹 애플리케이션
- **apps/mobile**: 모바일 애플리케이션
- **packages/**: 공유 패키지

## 명령어

```bash
pnpm dev          # 개발 서버 실행
pnpm build        # 빌드
pnpm lint         # 린트 검사
pnpm test         # 테스트
pnpm format:fix   # 포맷팅
pnpm storybook    # 스토리북 실행
```

## 코드 스타일

- Prettier, ESLint 설정 준수
- 컴포넌트: PascalCase
- 함수/변수: camelCase
