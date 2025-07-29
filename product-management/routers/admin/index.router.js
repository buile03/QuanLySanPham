const express = require("express");
const router = express.Router();
const systemConfig = require("../../config/system");
const dashboardRouter = require("./dashboard.router");
const productRouter = require("./product.router");
const productCategoryRouter = require("./product-category.router");
const roleRouter = require("./role.router");
const accountRouter = require("./account.router");
const authRouter = require("./auth.router");

router.use("/dashboard", dashboardRouter);
router.use("/products", productRouter);
router.use("/products-category", productCategoryRouter);
router.use("/roles", roleRouter);
router.use("/accounts", accountRouter);
router.use("/auth", authRouter);
module.exports = router;
