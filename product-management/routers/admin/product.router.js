const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/product.controller");
const multer = require("multer");
const path = require("path");
const storageMulter = require("../../helpers/storageMulter");
const upload = multer({ storage: storageMulter() });

// Routes
router.get("/", controller.index);

router.post("/change-status/:status/:id", controller.changeStatus);
router.patch("/change-status/:status/:id", controller.changeStatus);

router.post("/change-multi", controller.changeMulti);
router.patch("/change-multi", controller.changeMulti);

router.post("/delete/:id", controller.deleteItem);
router.delete("/delete/:id", controller.deleteItem);

router.get("/create", controller.create);
router.post("/create", upload.single("thumbnail"), controller.createPost);

module.exports = router;
