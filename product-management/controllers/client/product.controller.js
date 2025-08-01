const Product = require("../../models/product.model");
const ProductCategory = require("../../models/product-category.model");

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

// [GET] /product/category/:slug
module.exports.category = async (req, res) => {
  try {
    const categorySlug = req.params.slug;

    // Tìm danh mục theo slug
    const category = await ProductCategory.findOne({
      slug: categorySlug,
      status: "active",
      deleted: false,
    });

    if (!category) {
      return res.status(404).send("Không tìm thấy danh mục");
    }

    // Lấy tất cả danh mục con (nếu có)
    const childCategories = await ProductCategory.find({
      parent_id: category._id.toString(),
      status: "active",
      deleted: false,
    });

    // Tạo mảng ID để tìm sản phẩm (bao gồm cả danh mục hiện tại và danh mục con)
    const categoryIds = [category._id.toString()];
    childCategories.forEach((child) => {
      categoryIds.push(child._id.toString());
    });

    // Tìm sản phẩm thuộc danh mục này
    const productsRaw = await Product.find({
      product_category_id: { $in: categoryIds },
      status: "active",
      deleted: false,
    }).sort({ position: "desc" });

    const products = productsRaw.map((item) => ({
      ...item.toObject(),
      newPrice: Math.round(
        (item.price * (100 - item.discountPercentage)) / 100
      ),
    }));

    res.render("client/pages/products/index", {
      pageTitle: `Sản phẩm - ${category.title}`,
      products,
      category: category,
    });
  } catch (err) {
    console.error("Category Products Error:", err);
    res.status(500).send("Lỗi server");
  }
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
