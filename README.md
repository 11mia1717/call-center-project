# Continue Bank 콜센터 및 카드 시스템 시뮬레이션
> "데이터 중심의 상담, 암호화 기반의 고객 보호"

2026년 금융권 IT 프로젝트 프레임워크 구축을 위한 참조 프로젝트입니다. 카드 발행사(Issuer), 위탁 콜센터(TM Center), 그리고 연동된 인증 서비스 간의 개인정보 보호 및 컴플라이언스 워크플로우를 구현합니다.

---

## 🏗️ 시스템 구성

### 1. Continue Card (카드 발행사 영역)
- **issuer-was** (Spring Boot, 포트 8081): 카드 발급, 고객 정보 관리, 카드 원장 관리 시스템 (Core Banking Simulation)
    - 데이터베이스: H2 Database (In-Memory, 포트 8081 어드민 제공)
- **issuer-web** (React/Vite, 포트 5174): 카드 발행사 내부 관리용 어드민 시스템

### 2. DAVADA TM Center (위탁 콜센터 영역)
- **callcenter-was** (Spring Boot, 포트 8082): 상담 업무 로직, SSAP 본인인증 연동 연동 기능을 제공합니다.
    - 데이터베이스: MySQL (포트 3308)
- **callcenter-web** (React/Vite, 포트 5173): 상담원 전용 업무 포털 (개인정보 미저장/무상태 방식)

---

## 🚀 시작하기

### 간편 실행 (배치 파일)
프로젝트 루트(`call-center-project`)에서 다음 스크립트를 실행하여 모든 서비스를 한 번에 제어할 수 있습니다.
*   **서비스 시작**: `start_all_services.bat` 실행
*   **서비스 중지**: `stop_all_services.bat` 실행

### 수동 실행 (상세 단계)

#### 1단계: 인프라 실행 (Docker)
가상 인프라 환경(MySQL 등)을 먼저 실행합니다.
```powershell
cd call-center-project
docker compose -f infra/docker-compose-db.yml up -d
```

#### 2단계: 백엔드 서버 실행 (Spring Boot)
각 서버를 별도의 터미널에서 실행합니다.
```powershell
# 발행사 WAS 기동 (포트 8081)
cd issuer-was && ./gradlew bootRun

# 콜센터 WAS 기동 (포트 8082)
cd callcenter-was && ./gradlew bootRun
```

#### 3단계: 프론트엔드 웹 실행 (React)
각 웹 서비스를 기동합니다.
```powershell
# 발행사 관리자 웹 (포트 5174)
cd issuer-web && npm install && npm run dev

# 콜센터 업무 웹 (포트 5173)
cd callcenter-web && npm install && npm run dev
```

---

## 🧪 시나리오 테스트 가이드

1. **상담원 접속**: [http://localhost:5173](http://localhost:5173) (콜센터 포털) 접속 후 상담원 계정으로 로그인.
2. **고객 조회**: 발신번호(ANI) `01012345678` 등으로 고객을 실시간 검색.
3. **본인인증 수행**: 성명(`홍길동`), 생년월일 등을 입력하여 고객 휴대폰으로 OTP 전송.
    - **테스트용 OTP**: `callcenter-was` 터미널 로그에서 발생된 OTP 확인 가능.
4. **카드 분실 정지**: 인증 성공 후 노출되는 카드 목록에서 정지할 카드를 선택하고 **[선택한 카드 정지]** 실행.
5. **관리 시스템 확인**: [http://localhost:5174](http://localhost:5174) (발행사 어드민) 접속.
    - **감사 로그(Audit)**: `CARD_LOSS` 정지 행위 기록 확인.
    - **카드 상태**: 해당 고객의 카드 상태가 `LOST`로 변경된 것 확인.

---

## 🛡️ 보안 고려사항 및 정책
- **마스킹 정책**: 모든 API 응답에서 이름, 전화번호, 카드번호 등은 최소 수집 원칙에 따라 마스킹 처리됩니다.
- **무상태성(Stateless)**: 콜센터 WAS는 고객 정보를 영구 저장하지 않으며, 모든 요청은 발행사 API를 통해 실시간으로 처리됩니다.
- **SSAP 고도화**: 실제 환경에서는 SSAP(포트 8086)와 S2S 통신을 수행하며, 로컬 환경에서는 통합 시뮬레이션 모드로 동작합니다.

