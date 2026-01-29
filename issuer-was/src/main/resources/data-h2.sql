-- data-h2.sql
INSERT INTO customers (customer_ref, name, birth, phone)
VALUES ('11111111-1111-1111-1111-111111111111', '홍길동', '800101', '01012345678');
INSERT INTO customers (customer_ref, name, birth, phone)
VALUES ('22222222-2222-2222-2222-222222222222', '이영희', '900505', '01098765432');
INSERT INTO customers (customer_ref, name, birth, phone)
VALUES ('33333333-3333-3333-3333-333333333333', '김철수', '851225', '01055554444');

INSERT INTO cards (card_ref, customer_ref, card_no, status)
VALUES (random_uuid(), '11111111-1111-1111-1111-111111111111', '1234-5678-1234-5678', 'ACTIVE');
INSERT INTO cards (card_ref, customer_ref, card_no, status)
VALUES (random_uuid(), '11111111-1111-1111-1111-111111111111', '1111-2222-3333-4444', 'ACTIVE');
INSERT INTO cards (card_ref, customer_ref, card_no, status)
VALUES (random_uuid(), '22222222-2222-2222-2222-222222222222', '9876-5432-9876-5432', 'ACTIVE');
INSERT INTO cards (card_ref, customer_ref, card_no, status)
VALUES (random_uuid(), '33333333-3333-3333-3333-333333333333', '5555-6666-7777-8888', 'ACTIVE');
