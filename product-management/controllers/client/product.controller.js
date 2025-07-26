const Product = require("../../models/product.model");

//index
module.exports.index = async (req, res) => {
  const productsRaw = await Product.find({
    status: "active",
    deleted: false,
  }).sort({ position: "desc" });

  const products = productsRaw.map((item) => ({
    ...item.toObject(), // chuyển từ mongoose object sang plain JS object
    newPrice: Math.round((item.price * (100 - item.discountPercentage)) / 100),
  }));

  res.render("client/pages/products/index", {
    pageTitle: "Danh sách sản phẩm",
    products,
  });
};

// [GET] /admin/product/detail/:slug
module.exports.detail = async (req, res) => {
  try {
    const find = {
      deleted: false,
      slug: req.params.slug,
      status: "active",
    };

    const productRaw = await Product.findOne(find);

    if (!productRaw) {
      return res.status(404).send("Không tìm thấy sản phẩm");
    }

    const product = {
      ...productRaw.toObject(),
      newPrice: Math.round(
        (productRaw.price * (100 - productRaw.discountPercentage)) / 100
      ),
    };

    res.render("client/pages/products/detail", {
      pageTitle: product.title,
      product: product,
    });
  } catch (err) {
    console.error("Product List Error:", err);
    res.status(500).send("Lỗi server");
  }
};
