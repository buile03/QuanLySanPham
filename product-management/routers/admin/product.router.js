const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/product.controller");

router.get("/", controller.index);

router.post("/change-status/:status/:id", controller.changeStatus);
router.patch("/change-status/:status/:id", controller.changeStatus);
// thay đổi trạng thái nhiều sản phẩm
router.post("/change-multi", controller.changeMulti);
router.patch("/change-multi", controller.changeMulti);

module.exports = router;
