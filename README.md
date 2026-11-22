# 2026 The Worst Workout

크로스핏 동작 64개 중 가장 피하고 싶은 동작을 고르는 모바일 이상형 월드컵입니다. 무작위로 구성된 16강 또는 32강 대진을 진행하고, 최종 결과를 공유하거나 동작별 순위를 볼 수 있습니다.

## 로컬 실행

Docker와 Docker Compose가 설치된 환경에서 저장소 루트에서 실행합니다.

```bash
docker compose up --build -d
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 엽니다. 종료하려면 `docker compose down`을 실행합니다.

## HTTPS 배포

도메인의 DNS를 서버의 공인 IP로 연결하고 방화벽에서 TCP 80·443을 허용합니다. 서버의 저장소 루트에 있는 `.env`에 `SITE_DOMAIN=example.com`을 추가하고, `example.com`을 실제 도메인으로 바꿉니다.

```bash
docker compose -f compose.yaml -f compose.https.yaml up --build -d
```

Caddy가 인증서를 발급하면 `https://example.com`에 접속할 수 있습니다. 인증서는 자동 갱신됩니다. [HTTPS 배포 상세 절차](site/README.md#caddy로-https-배포)

테스트와 DB 설정은 [개발 문서](site/README.md)를 참고하세요.
