const Role = require("../../models/role.model");
const systemConfig = require("../../config/system");

// [GET] /admin/roles
module.exports.index = async (req, res) => {
  try {
    const find = {
      deleted: { $ne: true },
    };

    const roles = await Role.find(find).sort({ createdAt: -1 });
    res.render("admin/pages/roles/index", {
      pageTitle: "Danh sách quyền",
      roles: roles,
    });
  } catch (err) {
    console.error("Role List Error:", err);
    res.status(500).send("Lỗi server");
  }
};
// [GET] /admin/roles/create
module.exports.create = async (req, res) => {
  try {
    res.render("admin/pages/roles/create", {
      pageTitle: "Thêm quyền mới",
    });
  } catch (err) {
    console.error("Role Create Error:", err);
    res.status(500).send("Lỗi server");
  }
};

// [POST] /admin/roles/create
module.exports.createPost = async (req, res) => {
  try {
    const record = new Role(req.body);
    await record.save();

    req.flash("success", "Thêm mới quyền thành công");
    res.redirect(`${systemConfig.prefixAdmin}/roles`);
  } catch (err) {
    console.error("Role Create Post Error:", err);
    req.flash("error", "Có lỗi xảy ra khi thêm quyền");
    res.redirect(`${systemConfig.prefixAdmin}/roles/create`);
  }
};

// [GET] /admin/roles/edit/:id
module.exports.edit = async (req, res) => {
  try {
    const find = {
      deleted: false,
      _id: req.params.id,
    };

    const record = await Role.findOne(find);

    if (!record) {
      req.flash("error", "Không tìm thấy quyền");
      return res.redirect(`${systemConfig.prefixAdmin}/roles`);
    }

    res.render("admin/pages/roles/edit", {
      pageTitle: "Chỉnh sửa quyền",
      record: record,
    });
  } catch (err) {
    console.error("Role Edit Error:", err);
    res.status(500).send("Lỗi server");
  }
};

// [POST] /admin/roles/edit/:id
module.exports.editPost = async (req, res) => {
  try {
    const id = req.params.id;

    await Role.updateOne({ _id: id }, req.body);

    req.flash("success", "Cập nhật quyền thành công");
    res.redirect(`${systemConfig.prefixAdmin}/roles`);
  } catch (err) {
    console.error("Role Edit Post Error:", err);
    req.flash("error", "Có lỗi xảy ra khi cập nhật quyền");
    res.redirect(`${systemConfig.prefixAdmin}/roles/edit/${req.params.id}`);
  }
};

// [GET] /admin/roles/detail/:id
module.exports.detail = async (req, res) => {
  try {
    const find = {
      deleted: false,
      _id: req.params.id,
    };

    const record = await Role.findOne(find);

    if (!record) {
      req.flash("error", "Không tìm thấy quyền");
      return res.redirect(`${systemConfig.prefixAdmin}/roles`);
    }

    res.render("admin/pages/roles/detail", {
      pageTitle: record.title,
      record: record,
    });
  } catch (err) {
    console.error("Role Detail Error:", err);
    res.status(500).send("Lỗi server");
  }
};

// [GET] /admin/roles/permissions
module.exports.permissions = async (req, res) => {
  try {
    const find = {
      deleted: false,
    };

    const record = await Role.find(find);

    res.render("admin/pages/roles/permissions", {
      pageTitle: "Phân quyền",
      record: record,
    });
  } catch (err) {
    console.error("Role Detail Error:", err);
    res.status(500).send("Lỗi server");
  }
};

// [PATCH] /admin/roles/permissions
module.exports.permissionsPatch = async (req, res) => {
  try {
    const permissions = JSON.parse(req.body.permissionsData);
    for (const item of permissions) {
      await Role.updateOne({ _id: item.id }, { permissions: item.permissions });
    }
    req.flash("success", "Cập nhật phân quyền thành công");
    res.redirect(`${systemConfig.prefixAdmin}/roles/permissions`);
  } catch (err) {
    console.error("Role Permissions Patch Error:", err);
    req.flash("error", "Có lỗi xảy ra khi cập nhật quyền");
    res.redirect(`${systemConfig.prefixAdmin}/roles/permissions`);
  }
};
