# Continue Card 콜센터 & 카드사 시뮬레이션 (Microservices)

이 프로젝트는 카드사(Issuer)와 콜센터(Call Center) 간의 위수탁 업무 흐름을 모사한 마이크로서비스 프로젝트입니다. 보안을 위해 물리적/논리적으로 분리된 두 조직의 시스템 환경을 재현했습니다. 

각 서비스는 **완독립적인(Standalone)** 구조로 설계되어 있어, 개발 환경에서 개별적으로 구동하고 관리하기 최적화되어 있습니다.

## 🏗️ 시스템 구성 (Architecture)

### 1. Continue Card (카드사 영역)
- **issuer-was** (Spring Boot, Port 8081): 핵심 금융 로직 및 고객/카드 원장 관리.
- **issuer-web** (React/Vite, Port 5174): 위탁사 전용 모니터링/관제 시스템.
- **issuer-db** (PostgreSQL, Port 5433): 금융 데이터 저장소.

### 2. 콜센터 포털 (수탁사 영역)
- **callcenter-was** (Spring Boot, Port 8082): 상담원 업무 보조 및 카드사 대행 Proxy. (개인정보 미저장)
- **callcenter-web** (React/Vite, Port 5173): 상담원 전용 업무 포털 (Continue Card 콜센터).

---

## 🚀 시작하기 (Execution Guide)

### 1단계: 데이터베이스 및 기본 인프라 실행 (Docker)
가상 인프라 환경(DB)을 먼저 실행해야 합니다.
```powershell
# c:\dev\call-center 폴더에서
docker compose -f infra/docker-compose-db.yml up -d
```

### 2단계: 백엔드 서버 실행 (Spring Boot)
두 개의 WAS를 각각 실행합니다. (새 터미널 권장)
```powershell
# Issuer WAS 실행
cd issuer-was
./gradlew bootRun

# Callcenter WAS 실행
cd callcenter-was
./gradlew bootRun
```

### 3단계: 프론트엔드 실행 (React)
두 개의 웹 서비스를 각각 실행합니다. (새 터미널 권장)
```powershell
# Issuer Admin 실행 (Port 5174)
cd issuer-web
npm install
npm run dev

# Callcenter Portal 실행 (Port 5173)
cd callcenter-web
npm install
npm run dev
```

---

## 🧪 시나리오 테스트 가이드

1. **상담원 로그인**: [http://localhost:5173](http://localhost:5173) (Continue Card 콜센터) 접속 후 로그인.
2. **고객 조회**: ANI(발신번호) `01012345678` 입력 후 검색.
3. **본인 인증**: 성명(`홍길동`), 생년월일(`800101`) 입력 후 인증번호 발송. (로그 확인 필요)
   - **OTP 로그 확인**: `issuer-was` 콘솔창에서 `[OTP-SENT] ... OTP: 123456` 로그 확인.
4. **선택적 카드 정지**: 인증 성공 후 나타나는 카드 목록에서 정지할 카드를 선택(체크)하고 **[선택한 n개 카드 정지]** 클릭.
5. **관리자 확인**: [http://localhost:5174](http://localhost:5174) (위탁사 관리자) 접속.
   - **Audit Events**: `CARD_LOSS` 로그 발생 확인.
   - **Customer Cards**: 해당 고객 ID(`11111111-1111-1111-1111-111111111111`) 검색 시 카드 상태가 `LOST`로 변경된 것 확인.

---

## ⚠️ 주의사항
- **보안**: 모든 API 응답 시 이름, 전화번호, 카드번호는 마스킹 처리됩니다.
- **무상태(Stateless)**: 콜센터 WAS는 고객 정보를 저장하지 않으며, 모든 요청은 카드사 WAS를 통해 대행 처리됩니다.
