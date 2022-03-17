const express = require("express");
const router = express.Router();

const Book = require("../models/book");

router.get("/", async (req, res) => {
  try {
    const books = await Book.all;
    res.json({ books });
  } catch (err) {
    res.status(500).json({ err });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const book = await Book.findById(parseInt(req.params.id));
    res.json(book);
  } catch (err) {
    res.status(404).json({ err });
  }
});

router.post("/", async (req, res) => {
  try {
    const book = await Book.create(
      req.body.name,
      req.body.cost,
      req.body.year_published
    );
    res.json(book);
  } catch (err) {
    res.status(404).json({ err });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const book = await Book.findById(parseInt(req.params.id));
    await book.destroy();
    res.status(204).json("Book deleted");
  } catch (err) {
    res.status(500).json({ err });
  }
});

module.exports = router;
