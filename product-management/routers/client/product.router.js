const express = require("express");
const router = express.Router();
const controller = require("../../controllers/client/product.controller");

router.get("/", controller.index);

//category
router.get("/category/:slug", controller.category);

//detail
router.get("/detail/:slug", controller.detail);

module.exports = router;
