const express = require("express");
const router = express.Router();
const homeRouter = require("./home.router");
const productRouter = require("./product.router");
const searchRouter = require("./search.router");
const cartRouter = require("./cart.router");
const checkoutRouter = require("./checkout.router");
const clientCategoriesMiddleware = require("../../middleware/admin/client-categories.middleware");
const cartMiddleware = require("../../middleware/clients/cart.middleware");

// Áp dụng middleware lấy danh mục cho tất cả routes client
router.use(clientCategoriesMiddleware);
router.use(cartMiddleware.cartId);

router.use("/", homeRouter);
router.use("/product", productRouter);
router.use("/search", searchRouter);
router.use("/cart", cartRouter);
router.use("/checkout", checkoutRouter);

module.exports = router;
