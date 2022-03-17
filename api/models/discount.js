const db = require("../db_config/init");

class Discount {
  constructor(data) {
    this.id = data.id;
    this.discount_name = data.discount_name;
    this.discount_type = data.discount_type;
    this.discount_threshold = data.discount_threshold;
    this.discount_percentage = data.discount_percentage;
  }

  static get all() {
    return new Promise(async (resolve, reject) => {
      try {
        const discountsData = await db.query(`SELECT * FROM discounts;`);
        const discounts = discountsData.rows.map((d) => new Discount(d));
        resolve(discounts);
      } catch (err) {
        reject("Error retrieving discount");
      }
    });
  }

  static findById(id) {
    return new Promise(async (resolve, reject) => {
      try {
        let discountData = await db.query(
          `SELECT * FROM discounts WHERE id = $1;`,
          [id]
        );
        let discount = new Discount(discountData.rows[0]);
        resolve(discount);
      } catch (err) {
        reject("Discount not found");
      }
    });
  }

  static create(
    discount_name,
    discount_type,
    discount_threshold,
    discount_percentage
  ) {
    return new Promise(async (resolve, reject) => {
      try {
        let discountData = await db.query(
          `INSERT INTO discounts (discount_name, discount_type,
            discount_threshold, discount_percentage) VALUES ($1, $2, $3, $4) RETURNING *;`,
          [
            discount_name,
            discount_type,
            discount_threshold,
            discount_percentage,
          ]
        );
        let newDiscount = new Discount(discountData.rows[0]);
        resolve(newDiscount);
      } catch (err) {
        reject("Error creating discount");
      }
    });
  }

  destroy() {
    return new Promise(async (resolve, reject) => {
      try {
        await db.query(`DELETE FROM discounts WHERE id = $1;`, [this.id]);
        resolve("Discount was deleted");
      } catch (err) {
        reject("Discount could not be deleted");
      }
    });
  }
}

module.exports = Discount;
