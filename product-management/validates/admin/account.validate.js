const systemConfig = require("../../config/system");

module.exports.createPost = (req, res, next) => {
  // Validate fullName
  if (!req.body.fullName || req.body.fullName.trim() === "") {
    req.flash("error", "Vui lòng nhập họ và tên");
    return res.redirect(`${systemConfig.prefixAdmin}/accounts/create`);
  }

  // Validate email
  if (!req.body.email || req.body.email.trim() === "") {
    req.flash("error", "Vui lòng nhập email");
    return res.redirect(`${systemConfig.prefixAdmin}/accounts/create`);
  } else if (!/^\S+@\S+\.\S+$/.test(req.body.email)) {
    req.flash("error", "Email không hợp lệ");
    return res.redirect(`${systemConfig.prefixAdmin}/accounts/create`);
  }

  // Validate password
  if (!req.body.password || req.body.password.trim() === "") {
    req.flash("error", "Vui lòng nhập mật khẩu");
    return res.redirect(`${systemConfig.prefixAdmin}/accounts/create`);
  } else if (req.body.password.length < 6) {
    req.flash("error", "Mật khẩu phải có ít nhất 6 ký tự");
    return res.redirect(`${systemConfig.prefixAdmin}/accounts/create`);
  }

  // Validate phone
  if (!req.body.phone || req.body.phone.trim() === "") {
    req.flash("error", "Vui lòng nhập số điện thoại");
    return res.redirect(`${systemConfig.prefixAdmin}/accounts/create`);
  } else if (!/^\d+$/.test(req.body.phone)) {
    req.flash("error", "Số điện thoại chỉ được chứa số");
    return res.redirect(`${systemConfig.prefixAdmin}/accounts/create`);
  }

  // Validate role_id
  if (!req.body.role_id || req.body.role_id.trim() === "") {
    req.flash("error", "Vui lòng chọn vai trò");
    return res.redirect(`${systemConfig.prefixAdmin}/accounts/create`);
  }

  next();
};

module.exports.editPatch = (req, res, next) => {
  // Validate fullName
  if (!req.body.fullName || req.body.fullName.trim() === "") {
    req.flash("error", "Vui lòng nhập họ và tên");
    return res.redirect(`${systemConfig.prefixAdmin}/accounts/create`);
  }

  // Validate email
  if (!req.body.email || req.body.email.trim() === "") {
    req.flash("error", "Vui lòng nhập email");
    return res.redirect(`${systemConfig.prefixAdmin}/accounts/create`);
  } else if (!/^\S+@\S+\.\S+$/.test(req.body.email)) {
    req.flash("error", "Email không hợp lệ");
    return res.redirect(`${systemConfig.prefixAdmin}/accounts/create`);
  }

  // Validate phone
  if (!req.body.phone || req.body.phone.trim() === "") {
    req.flash("error", "Vui lòng nhập số điện thoại");
    return res.redirect(`${systemConfig.prefixAdmin}/accounts/create`);
  } else if (!/^\d+$/.test(req.body.phone)) {
    req.flash("error", "Số điện thoại chỉ được chứa số");
    return res.redirect(`${systemConfig.prefixAdmin}/accounts/create`);
  }

  // Validate role_id
  if (!req.body.role_id || req.body.role_id.trim() === "") {
    req.flash("error", "Vui lòng chọn vai trò");
    return res.redirect(`${systemConfig.prefixAdmin}/accounts/create`);
  }

  next();
};
