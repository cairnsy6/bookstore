const db = require("../db_config/init");

class Book {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.cost = data.cost;
    this.year_published = data.year_published;
  }

  static get all() {
    return new Promise(async (resolve, reject) => {
      try {
        const booksData = await db.query(`SELECT * FROM books;`);
        const books = booksData.rows.map((b) => new Book(b));
        resolve(books);
      } catch (err) {
        reject("Error retrieving book");
      }
    });
  }

  static findById(id) {
    return new Promise(async (resolve, reject) => {
      try {
        let bookData = await db.query(`SELECT * FROM books WHERE id = $1;`, [
          id,
        ]);
        let book = new Book(bookData.rows[0]);
        resolve(book);
      } catch (err) {
        reject("Book not found");
      }
    });
  }

  static create(name, cost, year_published) {
    return new Promise(async (resolve, reject) => {
      try {
        let bookData = await db.query(
          `INSERT INTO books (name, cost, year_published) VALUES ($1, $2, $3) RETURNING *;`,
          [name, cost, year_published]
        );
        let newBook = new Book(bookData.rows[0]);
        resolve(newBook);
      } catch (err) {
        reject("Error creating book");
      }
    });
  }

  destroy() {
    return new Promise(async (resolve, reject) => {
      try {
        await db.query(`DELETE FROM books WHERE id = $1;`, [this.id]);
        resolve("Book was deleted");
      } catch (err) {
        reject("Book could not be deleted");
      }
    });
  }
}

module.exports = Book;
