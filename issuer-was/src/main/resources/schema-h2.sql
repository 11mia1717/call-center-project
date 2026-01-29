-- schema-h2.sql
DROP TABLE IF EXISTS audit_events CASCADE;
DROP TABLE IF EXISTS auth_tx CASCADE;
DROP TABLE IF EXISTS cards CASCADE;
DROP TABLE IF EXISTS customers CASCADE;

CREATE TABLE customers (
    customer_ref uuid PRIMARY KEY,
    name varchar(50) NOT NULL,
    birth varchar(20) NOT NULL,
    phone varchar(20) NOT NULL
);

CREATE TABLE cards (
    card_ref uuid PRIMARY KEY,
    customer_ref uuid NOT NULL,
    card_no varchar(20) NOT NULL,
    status varchar(20) NOT NULL,
    CONSTRAINT fk_cards_customer FOREIGN KEY (customer_ref) REFERENCES customers(customer_ref)
);

CREATE TABLE auth_tx (
    auth_tx_id uuid PRIMARY KEY,
    customer_ref uuid NOT NULL,
    otp_hash varchar(255) NOT NULL,
    expire_at timestamp NOT NULL,
    fail_count int DEFAULT 0,
    locked boolean DEFAULT false,
    CONSTRAINT fk_auth_customer FOREIGN KEY (customer_ref) REFERENCES customers(customer_ref)
);

CREATE TABLE audit_events (
    event_id uuid PRIMARY KEY,
    call_id varchar(50) NOT NULL,
    operator_id varchar(50) NOT NULL,
    event_type varchar(50) NOT NULL,
    result_code varchar(20) NOT NULL,
    loss_case_id varchar(50),
    created_at timestamp DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE marketing_requests (
    request_id uuid PRIMARY KEY,
    username varchar(50) NOT NULL,
    product_name varchar(50) NOT NULL,
    consent_type varchar(50) NOT NULL,
    retention_until date NOT NULL,
    created_at timestamp DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tm_targets (
    target_id uuid PRIMARY KEY,
    external_ref uuid NOT NULL,
    customer_name varchar(50) NOT NULL,
    phone varchar(20) NOT NULL,
    product_name varchar(50) NOT NULL,
    retention_until date NOT NULL,
    destroyed_yn char(1) DEFAULT 'N',
    destroyed_at timestamp,
    created_at timestamp DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE access_logs (
    log_id uuid PRIMARY KEY,
    agent_id varchar(50) NOT NULL,
    target_id uuid,
    access_type varchar(20) NOT NULL,
    accessed_at timestamp DEFAULT CURRENT_TIMESTAMP,
    ip_address varchar(50),
    purpose varchar(100)
);
