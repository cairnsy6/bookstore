const Book = require("../../../models/book");
const pg = require("pg");
jest.mock("pg");

const db = require("../../../db_config/init");

describe("Book", () => {
  beforeEach(() => jest.clearAllMocks());

  afterAll(() => jest.resetAllMocks());

  describe("all", () => {
    test("it resolves with habits on successful db query", async () => {
      jest.spyOn(db, "query").mockResolvedValueOnce({ rows: [{}, {}, {}] });
      const all = await Book.all;
      expect(all).toHaveLength(3);
    });
  });

  describe("findById", () => {
    test("it resolves with book on successful db query", async () => {
      let bookData = { id: 1, name: "Book1", cost: 10, year_published: 2000 };
      jest.spyOn(db, "query").mockResolvedValueOnce({ rows: [bookData] });
      const result = await Book.findByID(1);
      expect(result).toBeInstanceOf(Book);
    });
  });
});
