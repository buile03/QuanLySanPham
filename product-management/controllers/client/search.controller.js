const Product = require("../../models/product.model");

module.exports.index = async (req, res) => {
  const keyword = req.query.keyword || "";
  const keywordRegex = new RegExp(keyword, "i");

  // Tìm kiếm sản phẩm
  const products = await Product.find({
    title: keywordRegex,
    deleted: false,
    status: "active",
  }).sort({ position: "desc" });

  res.render("client/pages/search/index", {
    pageTitle: `Kết quả tìm kiếm: ${keyword}`,
    keyword: keyword,
    products: products,
  });
};
