-- Customers
INSERT INTO customers (customer_ref, name, birth, phone) VALUES 
('cust-1', '홍길동', '800101', '01012345678'),
('cust-2', '김철수', '900505', '01098765432')
ON CONFLICT (customer_ref) DO NOTHING;

-- Cards
INSERT INTO cards (card_ref, customer_ref, card_no, status) VALUES
('card-1', 'cust-1', '1234-1111-2222-5678', 'ACTIVE'),
('card-2', 'cust-1', '1234-3333-4444-5678', 'ACTIVE'),
('card-3', 'cust-2', '1234-5555-6666-5678', 'ACTIVE')
ON CONFLICT (card_ref) DO NOTHING;
