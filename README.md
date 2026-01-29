# Continue Bank 콜센터 & 카드사 시뮬레이션 (Microservices)

2026년 금융권 IT 프로젝트 프레임워크 구축을 위한 Reference Project입니다. 카드사(Issuer), 위탁 콜센터(TM Center), 그리고 연동된 제3자 서비스(Entrusting Client) 간의 개인정보 보호 및 컴플라이언스 워크플로우를 구현합니다.

## 🏗️ 시스템 구성 (Architecture)

### 1. Continue Bank (카드사 영역)
- **issuer-was** (Spring Boot, Port 8081): 카드 발급, 고객 정보 관리, V-PASS 본인인증 제공자 API.
    - H2 Database (In-Memory, Port 8081 Console)
- **issuer-web** (React/Vite, Port 5174): 카드사 내부 관리자 시스템 (Admin).

### 2. TM Center (콜센터 영역)
- **callcenter-web** (React/Vite, Port 5173): 상담원 전용 업무 포털 (Continue Bank 콜센터). (개인정보 미저장)

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
