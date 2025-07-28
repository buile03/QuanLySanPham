const systemConfig = require("../../config/system");

module.exports.createPost = (req, res, next) => {
  if (!req.body.title || req.body.title.trim() === "") {
    req.flash("error", "Thiếu tên sản phẩm");
    return res.redirect(`${systemConfig.prefixAdmin}/products/create`);
  }
  next();
};
