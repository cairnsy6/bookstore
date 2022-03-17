const express = require("express");
const router = express.Router();

const Discount = require("../models/discount");

router.get("/", async (req, res) => {
  try {
    const discounts = await Discount.all;
    res.json({ discounts });
  } catch (err) {
    res.status(500).json({ err });
  }
});

router.post("/", async (req, res) => {
  try {
    const discounts = await Discount.create(
      req.body.discount_name,
      req.body.discount_type,
      req.body.discount_threshold,
      req.body.discount_percentage
    );
    console.log(discounts);
    res.json(discounts);
  } catch (err) {
    res.status(404).json({ err });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const discount = await Discount.findById(parseInt(req.params.id));
    await discount.destroy();
    res.status(204).json("Discount deleted");
  } catch (err) {
    res.status(500).json({ err });
  }
});

module.exports = router;
