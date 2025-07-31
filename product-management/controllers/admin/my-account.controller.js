const Account = require("../../models/account.model");
const systemConfig = require("../../config/system");
const md5 = require("md5");

// [GET] /admin/my-account
module.exports.index = (req, res) => {
  res.render("admin/pages/my-account/index", {
    pageTitle: "Trang thông tin cá nhân",
  });
};

// [GET] /admin/my-account/edit/:id
module.exports.edit = async (req, res) => {
  try {
    res.render("admin/pages/my-account/edit", {
      pageTitle: "Chỉnh sửa thông tin cá nhân",
    });
  } catch (err) {
    console.error("Role Edit Error:", err);
    res.status(500).send("Lỗi server");
  }
};
// [POST] /admin/my-account/edit/:id
module.exports.editPost = async (req, res) => {
  try {
    const id = req.params.id;
    const { fullName, email, phone } = req.body;

    // Check trùng email
    const existEmail = await Account.findOne({
      email: email,
      _id: { $ne: id },
      deleted: false,
    });

    if (existEmail) {
      req.flash("error", "Email đã tồn tại");
      return res.redirect(`${systemConfig.prefixAdmin}/my-account/edit/${id}`);
    }

    const updateData = {
      fullName,
      email,
      phone,
      updatedAt: new Date(),
    };

    // Nếu có file upload
    if (req.file) {
      updateData.avatar = `uploads/${req.file.filename}`;
    } else if (req.body.currentThumbnail) {
      updateData.avatar = req.body.currentThumbnail;
    }

    await Account.updateOne({ _id: id }, updateData);

    req.flash("success", "Cập nhật tài khoản thành công");
    res.redirect(`${systemConfig.prefixAdmin}/my-account`);
  } catch (err) {
    console.error("My Account Edit Error:", err);
    req.flash("error", "Có lỗi xảy ra khi cập nhật");
    res.redirect(
      `${systemConfig.prefixAdmin}/my-account/edit/${res.locals.user._id}`
    );
  }
};

// [GET] /admin/my-account/change-password
module.exports.changePasswordForm = (req, res) => {
  res.render("admin/pages/my-account/change-password", {
    pageTitle: "Đổi mật khẩu",
  });
};

// [POST] /admin/my-account/change-password
module.exports.changePasswordPost = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;
    const user = await Account.findById(res.locals.user._id);

    if (!user) {
      req.flash("error", "Không tìm thấy tài khoản");
      return res.redirect(
        `${systemConfig.prefixAdmin}/my-account/change-password`
      );
    }

    if (user.password !== md5(currentPassword)) {
      req.flash("error", "Mật khẩu hiện tại không đúng");
      return res.redirect(
        `${systemConfig.prefixAdmin}/my-account/change-password`
      );
    }

    if (newPassword !== confirmPassword) {
      req.flash("error", "Mật khẩu xác nhận không khớp");
      return res.redirect(
        `${systemConfig.prefixAdmin}/my-account/change-password`
      );
    }

    // Cập nhật mật khẩu mới
    await Account.updateOne({ _id: user._id }, { password: md5(newPassword) });

    req.flash("success", "Đổi mật khẩu thành công");
    res.redirect(`${systemConfig.prefixAdmin}/my-account`);
  } catch (err) {
    console.error("Change Password Error:", err);
    req.flash("error", "Lỗi khi đổi mật khẩu");
    res.redirect(`${systemConfig.prefixAdmin}/my-account/change-password`);
  }
};
