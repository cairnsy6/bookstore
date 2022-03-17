const app = require("../../server");
describe("books endpoints", () => {
  let api = app.listen(5000, () =>
    console.log("Test server running on port 5000")
  );
  beforeEach(async () => {
    await resetTestDB();
  });

  beforeAll(async () => {
    api;
  });

  afterAll((done) => {
    console.log("Gracefully stopping test server");
    api.close(done);
  });

  it("should return a list of all books in the database", async () => {
    const res = await request(api).get("/books");
    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toEqual(2);
  });

  // not sure if this is right - habits/id ? or habits/1
  it("should return a specific book", async () => {
    const res = await request(api).get("/books/:id");
    expect(res.statusCode).toEqual(200);
    expect(res.body.books.length).toEqual(1);
  });

});
