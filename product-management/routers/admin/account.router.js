const express = require("express");
const router = express.Router();
const multer = require("multer");
const storageMulter = require("../../helpers/storageMulter");
const upload = multer({ storage: storageMulter() });
const controller = require("../../controllers/admin/account.controller");

router.get("/", controller.index);
const validate = require("../../validates/admin/account.validate");
//create

router.get("/create", controller.create);
router.post(
  "/create",
  upload.single("avatar"),
  validate.createPost,
  controller.createPost
);

//edit
router.get("/edit/:id", controller.edit);
router.post(
  "/edit/:id",
  upload.single("avatar"),
  validate.editPatch,
  controller.editPost
);

//detail
router.get("/detail/:id", controller.detail);

module.exports = router;
