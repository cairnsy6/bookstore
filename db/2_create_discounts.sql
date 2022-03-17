
DROP TABLE IF EXISTS discounts;

CREATE TABLE discounts (
    id serial PRIMARY KEY,
    discount_name varchar(250) NOT NULL,
    discount_type varchar(50) NOT NULL,
    discount_threshold int NOT NULL,
    discount_percentage float NOT NULL
);

