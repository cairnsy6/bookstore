DROP TABLE IF EXISTS books;

CREATE TABLE books (
    id serial PRIMARY KEY,
    name varchar(255) NOT NULL,
    cost float NOT NULL,
    year_published int NOT NULL
);


