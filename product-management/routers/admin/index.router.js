const express = require("express");
const router = express.Router();
const authMiddleware = require("../../middleware/auth.middleware");

const systemConfig = require("../../config/system");
const dashboardRouter = require("./dashboard.router");
const productRouter = require("./product.router");
const productCategoryRouter = require("./product-category.router");
const roleRouter = require("./role.router");
const accountRouter = require("./account.router");
const authRouter = require("./auth.router");
const myAccountRouter = require("./my-account.router");

router.use("/dashboard", authMiddleware.requireAuth, dashboardRouter);
router.use("/products", authMiddleware.requireAuth, productRouter);
router.use(
  "/products-category",
  authMiddleware.requireAuth,
  productCategoryRouter
);
router.use("/roles", authMiddleware.requireAuth, roleRouter);
router.use("/accounts", authMiddleware.requireAuth, accountRouter);
router.use("/auth", authRouter);
router.use("/my-account", authMiddleware.requireAuth, myAccountRouter);
module.exports = router;
