const express = require("express");
const router = express.Router();
const systemConfig = require("../../config/system");
const dashboardRouter = require("./dashboard.router");
const productRouter = require("./product.router");
const productCategoryRouter = require("./product-category.router");

router.use("/dashboard", dashboardRouter);
router.use("/products", productRouter);
router.use("/products-category", productCategoryRouter);
module.exports = router;
