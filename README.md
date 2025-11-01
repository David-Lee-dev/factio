# Factio

모노레포 구조의 풀스택 애플리케이션

## 구조

```
factio/
├── client/          # Next.js 프론트엔드
├── server/          # NestJS 백엔드
├── package.json     # 워크스페이스 루트 설정
├── tsconfig.json    # 공통 TypeScript 설정
├── eslint.config.mjs # 공통 ESLint 설정
└── .prettierrc      # 공통 Prettier 설정
```

## 시작하기

### 1. 의존성 설치

```bash
pnpm install
```

### 2. 환경 변수 설정

```bash
cp .env.example .env
# .env 파일을 편집하여 필요한 환경 변수 설정
```

### 3. 개발 서버 실행

```bash
# 전체 애플리케이션 실행 (client + server)
pnpm dev

# 개별 실행
pnpm --filter client dev    # 클라이언트만
pnpm --filter server start:dev  # 서버만
```

### 4. 빌드

```bash
pnpm build
```

## 스크립트

- `pnpm dev`: 클라이언트와 서버를 동시에 실행
- `pnpm build`: 전체 프로젝트 빌드
- `pnpm lint`: 전체 프로젝트 린트 검사
- `pnpm format`: 전체 프로젝트 포맷팅

## 접속 URL

- **Client**: http://localhost:3000
- **Server API**: http://localhost:3001/api
