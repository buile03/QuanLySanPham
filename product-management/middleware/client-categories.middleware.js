const ProductCategory = require("../models/product-category.model");
const { createCategoryTree } = require("../helpers/categoryTreeHelper");

module.exports = async (req, res, next) => {
  try {
    // Lấy tất cả danh mục sản phẩm có trạng thái active và chưa bị xóa
    const categories = await ProductCategory.find({
      status: "active",
      deleted: false,
    }).sort({ position: -1 });

    // Tạo cây danh mục phân cấp cho dropdown
    const categoryTree = createCategoryTree(categories);

    // Truyền danh mục vào res.locals để có thể sử dụng trong tất cả views
    res.locals.categories = categoryTree;

    next();
  } catch (error) {
    console.error("Error loading categories:", error);
    res.locals.categories = [];
    next();
  }
};
