const express = require("express");
const router = express.Router();

const controller = require("../../controllers/client/user.controller");
const userValidate = require("../../validates/client/user.validate");

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
module.exports = router;
