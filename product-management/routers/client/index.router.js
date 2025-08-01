const express = require("express");
const router = express.Router();
const productRouter = require("./product.router");
const homeRouter = require("./home.router");
const clientCategoriesMiddleware = require("../../middleware/client-categories.middleware");

// Áp dụng middleware lấy danh mục cho tất cả routes client
router.use(clientCategoriesMiddleware);

router.use("/", homeRouter);
router.use("/product", productRouter);

module.exports = router;
