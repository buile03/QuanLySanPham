const express = require("express");
const router = express.Router();
const multer = require("multer");
const controller = require("../../controllers/admin/setting.controller");
const storageMulter = require("../../helpers/storageMulter");
const upload = multer({ storage: storageMulter() });
//general
router.get("/general", controller.general);
router.patch("/general", upload.single("logo"), controller.generalPatch);

module.exports = router;
