const Account = require("../../models/account.model");
const Role = require("../../models/role.model");
const systemConfig = require("../../config/system");
const md5 = require("md5");
// [GET] /admin/accounts
module.exports.index = async (req, res) => {
  try {
    const find = {
      deleted: { $ne: true },
    };

    const records = await Account.find(find).select("-password -token");
    for (const record of records) {
      const role = await Role.findOne({ deleted: false, _id: record.role_id });
      record.role = role;
    }
    res.render("admin/pages/accounts/index", {
      pageTitle: "Danh sách tài khoản",
      records: records,
    });
  } catch (err) {
    console.error("Account List Error:", err);
    res.status(500).send("Lỗi server");
  }
};

// [GET] /admin/account/create
module.exports.create = async (req, res) => {
  try {
    let find = {
      deleted: false,
    };
    const roles = await Role.find(find);
    res.render("admin/pages/accounts/create", {
      pageTitle: "Thêm tài khoản mới",
      roles: roles,
    });
  } catch (err) {
    console.error("Role Create Error:", err);
    res.status(500).send("Lỗi server");
  }
};
// [POST] /admin/accounts/create
module.exports.createPost = async (req, res) => {
  try {
    const existingAccount = await Account.findOne({
      email: req.body.email,
      deleted: false,
    });

    if (existingAccount) {
      req.flash("error", "Email đã tồn tại");
      return res.redirect(`${systemConfig.prefixAdmin}/accounts/create`);
    }

    const newAccount = {
      fullName: req.body.fullName,
      email: req.body.email,
      password: md5(req.body.password),
      phone: req.body.phone,
      address: req.body.address,
      role_id: req.body.role_id,
      status: req.body.status,
    };

    if (req.file) {
      newAccount.avatar = `uploads/${req.file.filename}`;
    }

    const record = new Account(newAccount);
    await record.save();

    req.flash("success", "Thêm mới tài khoản thành công");
    res.redirect(`${systemConfig.prefixAdmin}/accounts`);
  } catch (err) {
    console.error("Account Create Post Error:", err);
    req.flash("error", "Có lỗi xảy ra khi thêm tài khoản");
    res.redirect(`${systemConfig.prefixAdmin}/accounts/create`);
  }
};

// [GET] /admin/roles/edit/:id
module.exports.edit = async (req, res) => {
  try {
    const find = {
      deleted: false,
      _id: req.params.id,
    };

    const record = await Account.findOne(find);
    const roles = await Role.find({ deleted: false });
    if (!record) {
      req.flash("error", "Không tìm thấy tài khoản");
      return res.redirect(`${systemConfig.prefixAdmin}/accounts`);
    }

    res.render("admin/pages/accounts/edit", {
      pageTitle: "Chỉnh sửa quyền",
      record: record,
      roles: roles,
    });
  } catch (err) {
    console.error("Role Edit Error:", err);
    res.status(500).send("Lỗi server");
  }
};
// [POST] /admin/accounts/edit/:id
module.exports.editPost = async (req, res) => {
  try {
    const id = req.params.id;

    const exitEmail = await Account.findOne({
      email: req.body.email,
      _id: { $ne: id },
      deleted: false,
    });
    if (exitEmail) {
      req.flash("error", "Email đã tồn tại");
      return res.redirect(`${systemConfig.prefixAdmin}/accounts/edit/${id}`);
    }

    const updateData = {
      fullName: req.body.fullName,
      email: req.body.email,
      phone: req.body.phone,
      address: req.body.address,
      role_id: req.body.role_id,
      status: req.body.status,
      updatedAt: new Date(),
    };

    if (req.body.password) {
      updateData.password = md5(req.body.password);
    }

    if (req.file) {
      updateData.avatar = `uploads/${req.file.filename}`;
    } else if (req.body.currentThumbnail) {
      updateData.avatar = req.body.currentThumbnail;
    }

    await Account.updateOne({ _id: id }, updateData);

    req.flash("success", "Cập nhật tài khoản thành công");
    res.redirect(`${systemConfig.prefixAdmin}/accounts`);
  } catch (err) {
    console.error("Account Edit Post Error:", err);
    req.flash("error", "Có lỗi xảy ra khi cập nhật tài khoản");
    res.redirect(`${systemConfig.prefixAdmin}/accounts/edit/${req.params.id}`);
  }
};

// [GET] /admin/roles/detail/:id
module.exports.detail = async (req, res) => {
  try {
    const find = {
      deleted: false,
      _id: req.params.id,
    };

    const record = await Account.findOne(find);

    if (!record) {
      req.flash("error", "Không tìm thấy tài khoản");
      return res.redirect(`${systemConfig.prefixAdmin}/accounts`);
    }

    res.render("admin/pages/accounts/detail", {
      pageTitle: record.title,
      record: record,
    });
  } catch (err) {
    console.error("Role Detail Error:", err);
    res.status(500).send("Lỗi server");
  }
};
