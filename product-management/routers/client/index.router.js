const express = require("express");
const router = express.Router(); // QUAN TRỌNG: Dòng này bị thiếu
const productRouter = require("./product.router");
const homeRouter = require("./home.router");

router.use("/", homeRouter);
router.use("/product", productRouter);

module.exports = router;
