const express = require("express");
const multer = require("multer");
const router = express.Router();
const controller = require("../../controllers/admin/my-account.controller");
const storageMulter = require("../../helpers/storageMulter");
const upload = multer({ storage: storageMulter() });
router.get("/", controller.index);

//edit
router.get("/edit/:id", controller.edit);
router.post("/edit/:id", upload.single("avatar"), controller.editPost);

//change password
router.get("/change-password", controller.changePasswordForm);
router.post("/change-password", controller.changePasswordPost);
module.exports = router;
