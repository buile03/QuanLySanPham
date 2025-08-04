const express = require("express");
const router = express.Router();
const controller = require("../../controllers/client/cart.controller");

router.get("/", controller.index);
// Lấy giỏ hàng
router.post("/add/:productId", controller.addToCart);
//xóa
router.get("/delete/:productId", controller.delete);
module.exports = router;
