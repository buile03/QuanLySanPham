const express = require("express");
const router = express.Router(); // QUAN TRỌNG: Dòng này bị thiếu
const systemConfig = require("../../config/system");
const dashboardRouter = require("./dashboard.router");
const productRouter = require("./product.router");

router.use("/dashboard", dashboardRouter);
router.use("/products", productRouter);

module.exports = router;
