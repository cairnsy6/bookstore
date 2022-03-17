TRUNCATE books, discounts RESTART IDENTITY;

INSERT INTO books (id, name, cost, year_published) 
VALUES
(1, 'Book 1', 10, 2000),
(2, 'Book 2', 5, 2010);

INSERT INTO discounts (id, discount_name, discount_type, discount_threshold, discount_percentage) 
VALUES
(
    1,
    "Over 50", 
    "Over", 
    50,
    5
    
),
(
    2,
    "Over 30", 
    "Over", 
    30,
    10
);

