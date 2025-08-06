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

module.exports.loginPost = (req, res, next) => {
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

module.exports.forgotpasswordPost = (req, res, next) => {
  // Validate email
  if (!req.body.email || req.body.email.trim() === "") {
    req.flash("error", "Vui lòng nhập email");
    return res.redirect(`/user/password/forgot`);
  } else if (!/^\S+@\S+\.\S+$/.test(req.body.email)) {
    req.flash("error", "Email không hợp lệ");
    return res.redirect(`/user/password/forgot`);
  }

  next();
};

module.exports.resetPost = (req, res, next) => {
  const { password, confirmPassword } = req.body;
  const email = req.cookies.resetEmail;

  // Validate email từ cookie
  if (!email || email.trim() === "") {
    req.flash("error", "Không xác định được tài khoản cần đặt lại mật khẩu");
    return res.redirect("/user/password/forgot");
  }

  // Validate mật khẩu mới
  if (!password || password.trim() === "") {
    req.flash("error", "Vui lòng nhập mật khẩu mới");
    return res.redirect("/user/password/reset");
  }

  if (password.length < 6) {
    req.flash("error", "Mật khẩu phải có ít nhất 6 ký tự");
    return res.redirect("/user/password/reset");
  }

  // Validate xác nhận mật khẩu
  if (!confirmPassword || confirmPassword.trim() === "") {
    req.flash("error", "Vui lòng nhập xác nhận mật khẩu");
    return res.redirect("/user/password/reset");
  }

  if (password !== confirmPassword) {
    req.flash("error", "Mật khẩu xác nhận không khớp");
    return res.redirect("/user/password/reset");
  }

  next();
};
