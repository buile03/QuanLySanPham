const systemConfig = require("../../config/system");

module.exports.loginPost = (req, res, next) => {
  // Validate email
  if (!req.body.email || req.body.email.trim() === "") {
    req.flash("error", "Vui lòng nhập email");
    return res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
  } else if (!/^\S+@\S+\.\S+$/.test(req.body.email)) {
    req.flash("error", "Email không hợp lệ");
    return res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
  }

  // Validate password
  if (!req.body.password || req.body.password.trim() === "") {
    req.flash("error", "Vui lòng nhập mật khẩu");
    return res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
  } else if (req.body.password.length < 6) {
    req.flash("error", "Mật khẩu phải có ít nhất 6 ký tự");
    return res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
  }

  next();
};
