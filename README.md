# Call Center & Issuer Microservices Simulation

카드사(Issuer)와 콜센터(Call Center)의 수탁 업무 흐름을 모사한 마이크로서비스 프로젝트입니다.
물리적/논리적으로 분리된 두 조직의 시스템을 재현했습니다.

## 🏗️ Architecture
- **Issuer Domain (위탁사)**
  - `issuer-was` (Spring Boot 4, Port 8081): 핵심 금융 로직, DB(PostgreSQL) 보유.
  - `issuer-web` (React, Port 5174): 카드사 관제/모니터링 콘솔.
  - `issuer-db` (Postgres, Port 5433): 고객/카드/인증 원장 데이터.
- **Call Center Domain (수탁사)**
  - `callcenter-was` (Spring Boot 4, Port 8080): 상담원 업무 처리, 개인정보 미저장(Proxy).
  - `callcenter-web` (React, Port 5173): 상담원 전용 포털 (프리미엄 UI).

## 🚀 Getting Started (Docker Compose)
가장 간편한 실행 방법입니다.

1. **Build & Run**
   ```bash
   cd infra
   docker-compose up --build -d
   ```
   > ⚠️ `issuer-was`와 `callcenter-was`의 빌드가 필요하므로 최초 실행 시 시간이 소요될 수 있습니다.

2. **Access**
   - **Call Center Portal**: [http://localhost:5173](http://localhost:5173)
   - **Issuer Admin**: [http://localhost:5174](http://localhost:5174)

## 🧪 Search Scenario (Test Guide)
1. **상담원 로그인** (`callcenter-web`)
   - 접속 후 'Agent Sign In' 클릭 (자동 로그인).
2. **고객 검색**
   - ANI(발신번호) `01012345678` 입력 후 검색.
   - 마스킹된 정보 확인.
3. **본인 인증 (OTP)**
   - 이름/생년월일 확인(기본값 사용) 후 **Send OTP** 클릭.
   - OTP는 `issuer-was`의 로그에서만 확인 가능합니다.
     ```bash
     docker logs issuer-was
     # Look for: [OTP-SENT] CustomerRef: ..., OTP: 123456
     ```
   - 확인된 6자리 숫자를 입력하고 **Verify** 클릭.
4. **분실 신고**
   - **Report All Cards Lost** 버튼 클릭.
   - 경고창 확인 -> 확인.
   - 분실 처리 결과(Cards Stopped) 및 Loss Case ID 확인.
5. **결과 확인** (`issuer-web`)
   - **Audit Log** 탭: `CARD_LOSS` 이벤트 수신 확인.
   - **Customer Cards** 탭: Customer Ref `11111111-1111-1111-1111-111111111111` 검색 시 Status가 `LOST`로 변경된 것 확인.

## 🛠️ Configuration
환경변수를 통해 연결 정보를 제어합니다 (`infra/docker-compose.yml` 참조).
- `ISSUER_SERVICE_TOKEN`: 서비스 간 통신 보안 (기본: `local-dev-token`).
- `ISSUER_BASE_URL`: Callcenter WAS가 Issuer WAS를 호출하는 주소.

## ⚠️ Notes
- 개인정보(이름, 전화번호, 카드번호)는 API 응답 시 항상 마스킹 처리됩니다.
- Callcenter WAS는 어떤 DB도 사용하지 않으며 메모리 세션만 유지합니다.
