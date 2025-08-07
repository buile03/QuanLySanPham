const settingGeneral = require("../../models/setting.model");
const systemConfig = require("../../config/system");

// [GET] /admin/settings/general
module.exports.general = async (req, res) => {
  const setting = await settingGeneral.findOne({});
  res.render("admin/pages/settings/general", {
    pageTitle: "Trang cài đặt chung",
    setting: setting,
  });
};

// [PATCH] /admin/settings/general
module.exports.generalPatch = async (req, res) => {
  try {
    const existing = await settingGeneral.findOne({});
    const data = {
      websiteName: req.body.websiteName,
      phone: req.body.phone,
      email: req.body.email,
      address: req.body.address,
      copyright: req.body.copyright,
    };

    // Nếu có upload file logo mới
    if (req.file) {
      data.logo = req.file.filename;
    }

    if (existing) {
      await settingGeneral.updateOne({}, data);
    } else {
      await settingGeneral.create(data);
    }

    req.flash("success", "Cập nhật thành công!");
    res.redirect(`${systemConfig.prefixAdmin}/settings/general`);
  } catch (err) {
    console.error(err);
    req.flash("error", "Cập nhật thất bại!");
    res.redirect(`${systemConfig.prefixAdmin}/settings/general`);
  }
};
