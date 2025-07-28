const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const storageMulter = require("../../helpers/storageMulter");
const upload = multer({ storage: storageMulter() });

const controller = require("../../controllers/admin/product-category.controller");
const validate = require("../../validates/admin/product-category.validate");
// Routes
router.get("/", controller.index);

//thay đổi
router.post("/change-status/:status/:id", controller.changeStatus);
router.patch("/change-status/:status/:id", controller.changeStatus);

// Thay đổi nhiều sản phẩm
router.post("/change-multi", controller.changeMulti);
router.patch("/change-multi", controller.changeMulti);

//create
router.get("/create", controller.create);
router.post(
  "/create",
  upload.single("thumbnail"),
  validate.createPost,
  controller.createPost
);

//edit
router.get("/edit/:id", controller.edit);
router.patch(
  "/edit/:id",
  upload.single("thumbnail"),
  validate.createPost,
  controller.editPatch
);

//detail
router.get("/detail/:id", controller.detail);

module.exports = router;
