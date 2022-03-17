const express = require("express");
const cors = require("cors");

const server = express();
server.use(cors());
server.use(express.json());

const bookRoutes = require("./controllers/books");
const discountRoutes = require("./controllers/discounts");

server.use("/discounts", discountRoutes);
server.use("/books", bookRoutes);

const port = process.env.PORT || 3000;

// Root route
server.get("/", (req, res) => res.send("Hello, world!"));

module.exports = server;
