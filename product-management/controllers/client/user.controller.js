const User = require("../../models/user.model");
const bcrypt = require("bcrypt");
//[GET] user/register
module.exports.register = (req, res) => {
  res.render("client/pages/users/register", {
    pageTitle: "Trang chủ",
  });
};

// [POST] /user/register
module.exports.registerPost = async (req, res) => {
  try {
    // Kiểm tra email đã tồn tại
    const existsEmail = await User.findOne({ email: req.body.email });
    if (existsEmail) {
      req.flash("error", "Email đã tồn tại");
      return res.redirect("/user/register");
    }

    // Mã hóa mật khẩu
    const salt = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(req.body.password, salt);

    // Tạo người dùng mới
    const user = new User(req.body);
    await user.save();

    // Đặt cookie token (ghi đúng tên)
    res.cookie("tokenUser", user.token);

    // Thông báo thành công và redirect
    req.flash("success", "Đăng ký tài khoản thành công");
    res.redirect("/");
  } catch (error) {
    console.error("Đăng ký thất bại:", error);
    req.flash("error", "Có lỗi xảy ra, vui lòng thử lại sau.");
    res.redirect("/user/register");
  }
};
