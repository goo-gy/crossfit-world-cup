# 2026 The Worst Workout

한국어·모바일 우선 크로스핏 동작 이상형 월드컵. 확정 후보 63개로 16강·32강을 진행합니다.

## 구현

- 시작, 대결, 결과, 전체 랭킹, 검색 가능한 동작 도감
- 새 게임마다 서버에서 무작위 대진 생성
- sessionStorage에 현재 게임만 저장하여 새로고침 복구
- 사용자 식별/로그인/추적 쿠키 없음
- 완료한 게임의 대진을 서버에서 재검증하고 D1에 결과 저장
- 같은 game_id의 중복 완료는 조건부 갱신으로 차단
- 우승률/대결 승률/완료 게임 수, 후보 버전별 집계
- `?pick=m001` 형식의 결과 공유 링크
- 직접 제작한 SVG 운동 일러스트 63개 및 메인 일러스트 (동작 설명용 교육 자료가 아닌 개념 이미지)

## 현재 검증 상태

`node --test tests/*.test.mjs`의 테스트 9개 통과. API 요청·응답의 JSON 타입 검증을 포함하며, 16/32강 각각 50회 완료, 잘못된 선택 거절, 세션 복구, 후보 목록 일치 및 이미지 파일 존재를 검증합니다. SVG 65개 XML 파싱과 실제 통계 SQL의 분모·미완료 제외·버전 격리·중복 완료 조건도 확인했습니다.

작업 환경에서 npm 및 Git 호스트의 DNS 연결 실패로 패키지 설치가 완료되지 않았습니다. **전체 빌드, 타입 검사, DB 마이그레이션 생성·적용, 브라우저 테스트, 배포는 미완료입니다.** Sites 프로젝트 ID는 `.openai/hosting.json`에 저장되어 있습니다. 새 프로젝트를 만들지 말고 해당 ID를 재사용해야 합니다. 생성된 비공개 Site는 아직 게시되지 않았습니다.

## Docker로 실행

프로젝트 루트(`crossfit-world-cup/`)에서 실행합니다. 호스트에는 Docker Engine/Desktop과 Compose만 필요하며 Node.js를 따로 설치할 필요는 없습니다.

```bash
docker compose up --build -d
docker compose logs -f web
```

브라우저에서 **http://localhost:3000**을 엽니다. 처음에는 이미지 다운로드·npm 설치·빌드에 시간이 걸립니다. 빌드 단계에서 후보/토너먼트 테스트, 타입 검사, DB 마이그레이션 생성까지 수행하며 실패하면 이미지 생성도 중단됩니다. 컨테이너 시작 시 아직 적용되지 않은 마이그레이션을 로컬 D1에 적용하고 Worker를 실행합니다. Cloudflare 계정이나 API 키는 필요하지 않습니다.

```bash
# 상태와 DB/API 준비 여부 확인
docker compose ps

# 종료 (게임 결과 유지)
docker compose down

# 코드 변경 후 재빌드·실행
docker compose up --build -d

# 포트가 겹칠 때
PORT=3001 docker compose up --build -d
```

포트는 기본적으로 호스트의 `127.0.0.1`에만 연결됩니다. 게임 결과와 마이그레이션 이력은 `workout-data` named volume에 보관되므로 일반 종료·재빌드 시 유지됩니다. `docker compose down -v`는 해당 데이터를 삭제합니다. Docker의 저장소는 로컬 D1이며 Sites의 게시 DB와 공유되지 않습니다. [Docker Compose 저장소 안내](https://docs.docker.com/compose/gettingstarted/), [Cloudflare 로컬 마이그레이션 안내](https://developers.cloudflare.com/d1/wrangler-commands/)

초기 SQL이 아직 소스에 없으므로 이미지 빌드에서 `db:generate --name=initial`로 같은 이름의 초기 마이그레이션을 생성합니다. 이후 스키마를 변경할 때는 기존 마이그레이션과 Drizzle 메타데이터를 먼저 소스에 반영하고, 새 마이그레이션을 추가해야 합니다. 실행 중 컨테이너의 생성 결과를 다음처럼 가져올 수 있습니다.

```bash
docker compose cp web:/app/site/drizzle ./site/
```

Docker 구성의 정적 검사와 Compose 설정 검증은 통과했습니다. 현재 에이전트 환경에서는 `/var/run/docker.sock` 접근이 거부되어 실제 이미지 빌드·컨테이너 실행·HTTP 응답 검증은 미완료입니다. Docker daemon에 접근 가능한 호스트에서 위 실행 명령으로 확인해야 합니다. Docker 빌드 환경에서 npm 레지스트리 연결이 가능해야 합니다.

## 실행 (Node.js 24 이상 권장)

네트워크가 가능한 환경에서 이 디렉터리를 기준으로 실행합니다.

```bash
npm run install:ci
npm run db:generate
npx tsc --noEmit
node --test tests/*.test.mjs
npm run build
```

`db:generate`가 생성한 `drizzle/`의 SQL·스냅샷·저널을 검토하고 소스에 포함해야 합니다. 현재 DB 스키마는 `db/schema.ts`에 정의되어 있으며, 초기 마이그레이션 생성 전입니다.

빌드 후 로컬 D1에 생성된 SQL을 적용합니다. 아래 파일명은 생성 결과에 맞춰 변경합니다.

```bash
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0000_generated.sql
npm run dev
```

콘솔에 표시되는 Local URL을 엽니다. 로컬 DB와 배포 DB는 별개입니다. 통계를 확인하려면 게임을 끝까지 완료해야 하며, 초기 랭킹에는 가짜 데이터를 넣지 않았습니다.

## 구조

- `app/page.tsx`: 화면 및 브라우저 게임 상태
- `app/globals.css`: 반응형 화면 스타일
- `app/api/games`: 게임 생성
- `app/api/complete`: 완료 결과 검증·저장
- `app/api/stats`: 완료 게임 통계
- `lib/tournament.ts`: 무작위 추출 및 대진 재생/검증
- `lib/movements.json`: 후보 데이터 (상위 docs의 63개와 일치)
- `db/schema.ts`: D1 스키마
- `scripts/create-art.py`: 외부 자산 없이 SVG를 생성하는 원본

표시용 폰트는 Google Fonts에서 불러오며, 연결되지 않으면 시스템 폰트로 표시됩니다. 운영 중 후보를 변경하면 `SET_VERSION`을 변경해 기존 통계와 분리하세요. 사용자 식별을 하지 않으므로 한 사람이 여러 게임을 완료할 수 있습니다.
