CREATE TABLE IF NOT EXISTS customers (
    customer_ref VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255),
    birth VARCHAR(6),
    phone VARCHAR(20)
);

CREATE TABLE IF NOT EXISTS cards (
    card_ref VARCHAR(36) PRIMARY KEY,
    customer_ref VARCHAR(36) NOT NULL,
    card_no VARCHAR(20),
    status VARCHAR(20),
    loss_type VARCHAR(20),
    loss_case_id VARCHAR(36)
);

CREATE TABLE IF NOT EXISTS auth_tx (
    auth_tx_id VARCHAR(36) PRIMARY KEY,
    customer_ref VARCHAR(36),
    otp VARCHAR(6),
    status VARCHAR(20),
    fail_count INTEGER,
    expire_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS audit_events (
    event_id VARCHAR(36) PRIMARY KEY,
    call_id VARCHAR(36),
    operator_id VARCHAR(50),
    event_type VARCHAR(50),
    result_code VARCHAR(50),
    loss_case_id VARCHAR(36),
    created_at TIMESTAMP
);
