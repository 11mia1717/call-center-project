-- schema.sql
-- 이미 존재하면 삭제 후 재생성 (개발/테스트용)
DROP TABLE IF EXISTS audit_events;
DROP TABLE IF EXISTS auth_tx;
DROP TABLE IF EXISTS cards;
DROP TABLE IF EXISTS customers;

-- 1. Customers
CREATE TABLE customers (
    customer_ref uuid PRIMARY KEY,
    name varchar(50) NOT NULL,
    birth varchar(20) NOT NULL,
    phone varchar(20) NOT NULL
);

-- 2. Cards
CREATE TABLE cards (
    card_ref uuid PRIMARY KEY,
    customer_ref uuid NOT NULL,
    card_no varchar(20) NOT NULL,
    status varchar(20) NOT NULL, -- 'ACTIVE', 'LOST', 'STOPPED' 등
    CONSTRAINT fk_cards_customer FOREIGN KEY (customer_ref) REFERENCES customers(customer_ref)
);

-- 3. Auth Transactions (OTP)
CREATE TABLE auth_tx (
    auth_tx_id uuid PRIMARY KEY,
    customer_ref uuid NOT NULL,
    otp_hash varchar(255) NOT NULL,
    expire_at timestamp NOT NULL,
    fail_count int DEFAULT 0,
    locked boolean DEFAULT false,
    CONSTRAINT fk_auth_customer FOREIGN KEY (customer_ref) REFERENCES customers(customer_ref)
);

-- 4. Audit Events
CREATE TABLE audit_events (
    event_id uuid PRIMARY KEY,
    call_id varchar(50) NOT NULL, -- callcenter-was에서 생성한 ID
    operator_id varchar(50) NOT NULL,
    event_type varchar(50) NOT NULL, -- 'AUTH_SUCCESS', 'CARD_LOSS', etc.
    result_code varchar(20) NOT NULL, -- 'SUCCESS', 'FAIL'
    loss_case_id varchar(50), -- 분실신고 시 발급된 ID
    created_at timestamp DEFAULT CURRENT_TIMESTAMP
);
