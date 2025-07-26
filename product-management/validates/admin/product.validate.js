const systemConfig = require("../../config/system");

module.exports.createPost = (req, res, next) => {
  if (!req.body.title || req.body.title.trim() === "") {
    req.flash("error", "Thiếu tên sản phẩm");
    return res.redirect(`${systemConfig.prefixAdmin}/products/create`);
  }

  if (req.body.price && isNaN(parseFloat(req.body.price))) {
    req.flash("error", "Giá sản phẩm không hợp lệ");
    return res.redirect(`${systemConfig.prefixAdmin}/products/create`);
  }

  if (
    req.body.discountPercentage &&
    isNaN(parseFloat(req.body.discountPercentage))
  ) {
    req.flash("error", "Phần trăm giảm giá không hợp lệ");
    return res.redirect(`${systemConfig.prefixAdmin}/products/create`);
  }

  if (req.body.stock && isNaN(parseInt(req.body.stock))) {
    req.flash("error", "Số lượng kho không hợp lệ");
    return res.redirect(`${systemConfig.prefixAdmin}/products/create`);
  }

  next();
};
