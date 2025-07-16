const Product = require("../../models/product.model");
const filterStatusHelper = require("../../helpers/filterStatus");
const searchHelper = require("../../helpers/search");
const paginationHelper = require("../../helpers/pagination");
// [GET] /admin/products
module.exports.index = async (req, res) => {
  try {
    const filterStatus = filterStatusHelper(req.query);
    const searchCondition = searchHelper(req.query);

    let filter = { deleted: false };
    // Lọc trạng thái
    if (req.query.status) {
      filter.status = req.query.status;
    }
    // Tìm kiếm
    if (searchCondition.regex) {
      filter.title = searchCondition.regex;
    }

    const totalItems = await Product.countDocuments(filter);
    const pagination = paginationHelper(req.query.page, totalItems, 10);

    const products = await Product.find(filter)
      .skip(pagination.skip)
      .limit(pagination.limit);

    res.render("admin/pages/products/index", {
      pageTitle: "Danh sách sản phẩm",
      products,
      query: req.query,
      filterStatus,
      pagination,
    });
  } catch (err) {
    console.error("Product List Error:", err);
    res.status(500).send("Lỗi server");
  }
};

// [PATCH] /admin/products/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
  const status = req.params.status;
  const id = req.params.id;
  const redirectUrl = req.body.redirect || "/admin/products";
  await Product.updateOne({ _id: id }, { status: status });

  res.redirect(redirectUrl);
};

// [PATCH] /admin/products/change-multi
module.exports.changeMulti = async (req, res) => {
  try {
    const type = req.body.type;
    const redirectUrl = req.body.redirect || "/admin/products";

    const idList =
      typeof req.body.ids === "string"
        ? req.body.ids.split(/\s*,\s*/).filter(Boolean)
        : [];

    if (["active", "inactive"].includes(type) && idList.length > 0) {
      await Product.updateMany({ _id: { $in: idList } }, { status: type });
    }

    res.redirect(redirectUrl);
  } catch (error) {
    console.error("Lỗi changeMulti:", error);
    res.redirect("/admin/products"); // fallback nếu có lỗi
  }
};

//  xóa cứng
// [DELETE] /admin/products/delete/:id
// module.exports.deleteItem = async (req, res) => {
//   try {
//     const id = req.params.id;
//     await Product.deleteOne({ _id: id });

//     const redirectUrl = req.query.redirect || "/admin/products"; // fallback nếu không có
//     res.redirect(redirectUrl);
//   } catch (error) {
//     console.error("Lỗi khi xóa sản phẩm:", error.message);
//     res.redirect("/admin/products");
//   }
// };

// [DELETE] /admin/products/delete/:id
module.exports.deleteItem = async (req, res) => {
  try {
    const id = req.params.id;
    await Product.updateOne(
      { _id: id },
      {
        deleted: true,
        updatedAt: new Date(),
      }
    );

    const redirectUrl = req.query.redirect || "/admin/products"; // fallback nếu không có
    res.redirect(redirectUrl);
  } catch (error) {
    console.error("Lỗi khi xóa sản phẩm:", error.message);
    res.redirect("/admin/products");
  }
};
