const Discount = require("../../../models/discount");
const pg = require("pg");
jest.mock("pg");

const db = require("../../../db_config/init");

describe("Discount", () => {
  beforeEach(() => jest.clearAllMocks());

  afterAll(() => jest.resetAllMocks());

  describe("all", () => {
    test("it resolves with discounts on successful db query", async () => {
      jest.spyOn(db, "query").mockResolvedValueOnce({ rows: [{}, {}, {}] });
      const all = await Discount.all;
      expect(all).toHaveLength(3);
    });
  });

  describe("create", () => {
    test("it resolves with discount on successful db query", async () => {
      let discountData = {
        id: 1,
        discount_name: "Over 10",
        discount_type: "Over",
        discount_threshold: 10,
        discount_percentage: 5,
      };
      jest.spyOn(db, "query").mockResolvedValueOnce({ rows: [discountData] });
      const result = await Discount.create("New Discount");
      expect(result).toBeInstanceOf(Discount);
    });
  });
});
