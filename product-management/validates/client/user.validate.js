const systemConfig = require("../../config/system");

module.exports.registerPost = (req, res, next) => {
  // Validate fullName
  if (!req.body.fullName || req.body.fullName.trim() === "") {
    req.flash("error", "Vui lòng nhập họ và tên");
    return res.redirect(`/user/register`);
  }

  // Validate email
  if (!req.body.email || req.body.email.trim() === "") {
    req.flash("error", "Vui lòng nhập email");
    return res.redirect(`/user/register`);
  } else if (!/^\S+@\S+\.\S+$/.test(req.body.email)) {
    req.flash("error", "Email không hợp lệ");
    return res.redirect(`/user/register`);
  }

  // Validate password
  if (!req.body.password || req.body.password.trim() === "") {
    req.flash("error", "Vui lòng nhập mật khẩu");
    return res.redirect(`/user/register`);
  } else if (req.body.password.length < 6) {
    req.flash("error", "Mật khẩu phải có ít nhất 6 ký tự");
    return res.redirect(`/user/register`);
  }

  next();
};
