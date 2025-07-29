const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/role.controller");

router.get("/", controller.index);

//create

router.get("/create", controller.create);
router.post("/create", controller.createPost);

//edit
router.get("/edit/:id", controller.edit);
router.post("/edit/:id", controller.editPost);

//detail
router.get("/detail/:id", controller.detail);

//permissions
router.get("/permissions", controller.permissions);
router.patch("/permissions", controller.permissionsPatch);

module.exports = router;
