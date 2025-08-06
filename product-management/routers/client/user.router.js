const express = require("express");
const router = express.Router();

const controller = require("../../controllers/client/user.controller");
const userValidate = require("../../validates/client/user.validate");
const userMiddleware = require("../../middleware/clients/auth.middleware");

//đăng ký
router.get("/register", controller.register);
router.post("/register", userValidate.registerPost, controller.registerPost);
//đăng nhập
router.get("/login", controller.login);
router.post("/login", userValidate.loginPost, controller.loginPost);
//đăng xuất
router.get("/logout", controller.logout);

//quên mật khẩu
router.get("/password/forgot", controller.forgotPassword);
router.post(
  "/password/forgot",
  userValidate.forgotpasswordPost,
  controller.forgotPasswordPost
);

//nhập otp
router.get("/password/otp", controller.otp);
router.post("/password/otp", controller.otpPost);

//reset password
router.get("/password/reset", controller.reset);
router.post("/password/reset", userValidate.resetPost, controller.resetPost);

//info
router.get("/info", userMiddleware.requireAuth, controller.info);

//edit
router.get("/edit/:id", userMiddleware.requireAuth, controller.edit);
router.post("/edit/:id", userMiddleware.requireAuth, controller.editPost);
module.exports = router;
