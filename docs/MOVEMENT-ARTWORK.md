# 동작 이미지 제작 기준

2026-11-20에 확인한 `m022-v6.png` 스내치 샘플을 전체 동작의 스타일 기준으로 사용한다.

- 동작마다 인물 한 명, 대표 자세 하나를 그린 정사각형 이미지다.
- 자연스러운 신체 비율, 간결한 얼굴, 명확한 외곽선과 제한된 명암을 사용한다.
- 차콜 배경, 회색 상의, 에메랄드 반바지와 장비 포인트 색상을 통일한다.
- 손·발과 장비 전체를 프레임 안에 넣고 관절 정렬과 장비의 실제 접촉 위치를 우선한다.
- 사진 같은 세부 묘사, 캐리커처, 단계별 패널과 글자는 사용하지 않는다.

## 파일과 재현 자료

저장소에는 앱용 WebP 64개, 승인된 스타일 참고 PNG, 최종 프롬프트, 검증 결과와 이 문서를 포함한다. PNG 원본 전체, 실행별 생성 기록, 교정 전 초안과 검토용 모음은 `output/imagegen/`의 로컬 산출물로 보관하며 커밋하지 않는다. 원본 전체와 검토 페이지는 `C:\share\crossfit-movements-v6`에도 복사했다.

- 원본 생성: imagegen 내장 도구. 각 동작을 별도 프롬프트로 생성하며, 확인된 스내치 샘플을 스타일 참고 이미지로 전달한다.
- 전체 동작별 프롬프트, 대표 자세, 참고 자료: [`approved-movement-prompts.json`](../output/imagegen/approved-movement-prompts.json).
- 스타일 기준 샘플의 원래 프롬프트: [`m022-app-style.prompt.txt`](../output/imagegen/m022-app-style.prompt.txt).
- 동작별 생성 기록: `output/imagegen/mNNN-v6.generation.json`.
- 생성 원본: `output/imagegen/approved-originals/mNNN-v6.png`. 스타일 참고용 스내치 PNG는 `site/public/movements/m022-v6.png`에도 유지한다.
- 앱 표시 파일: `site/public/movements/mNNN-v6.webp`. 원본의 내용을 바꾸지 않고 WebP로 인코딩한다.
- 검토용 모음: `output/imagegen/review-approved-*.jpg`.

## 대표 자세 선택

클린과 파워 클린은 받는 스쿼트 깊이를 구분한다. 행 동작은 바닥에 닿지 않는 시작 자세를 사용해 출발 위치가 보이도록 한다. 바벨 프론트 랙과 백 랙, 덤벨의 어깨 위치와 오버헤드 위치, 바와 링에서의 지지 자세를 구별한다. 월워크는 가슴이 벽을 향하는 자세를 사용한다.

푸시 프레스는 두 발이 바닥에 닿은 얕은 딥 자세를, 스러스터는 무릎·엉덩이·팔꿈치를 편 오버헤드 마무리 자세를 사용한다. 검토 중 교정한 네 동작은 별도 `mNNN-v6-correction.json`에 최종 프롬프트를 기록하고, 선택하지 않은 초안은 `output/imagegen/discarded-v6/`에 보관한다.

복합 동작은 해당 동작 중 한 순간만 나타낸다. 한 장의 정지 이미지는 반복의 전체 순서나 줄넘기 회전 횟수를 설명하지 않으므로, 앱의 기존 동작명을 함께 표시한다. 동작 ID와 명칭 및 후보 목록은 이미지 교체로 바꾸지 않는다.

## 확인 자료

동작별 주소는 전체 프롬프트 파일의 `source`에 기록했다.

- [CrossFit 공식 동작 라이브러리](https://www.crossfit.com/crossfit-movements)
- [스내치](https://www.crossfit.com/essentials/the-snatch)
- [파워 클린](https://www.crossfit.com/essentials/the-power-clean)
- [행 파워 클린](https://www.crossfit.com/essentials/the-hang-power-clean)
- [GHD 싯업](https://www.crossfit.com/essentials/the-ghd-sit-up)
- [월워크](https://www.crossfit.com/essentials/the-wall-walk)
- [Concept2 SkiErg 기술 안내](https://www.concept2.com/training/skierg-technique)
- [Rogue 데빌 프레스 시범](https://www.roguefitness.com/theindex/movement-library/movement-demo-devil-press)
