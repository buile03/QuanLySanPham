const Product = require("../../models/product.model");
const Account = require("../../models/account.model");
const filterStatusHelper = require("../../helpers/filterStatus");
const searchHelper = require("../../helpers/search");
const paginationHelper = require("../../helpers/pagination");
const systemConfig = require("../../config/system");

const { createTreeWithIndent } = require("../../helpers/categoryTreeHelper");
const ProductCategory = require("../../models/product-category.model");

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
    //sort
    let sort = {};

    if (req.query.sortKey && req.query.sortValue) {
      sort[req.query.sortKey] = req.query.sortValue;
    } else {
      sort.position = "desc";
    }
    //end sort
    const products = await Product.find(filter)
      .sort(sort)
      .skip(pagination.skip)
      .limit(pagination.limit);

    for (const product of products) {
      // Thêm thông tin người tạo
      if (product.createdBy?.account_id) {
        const creator = await Account.findById(product.createdBy.account_id);
        product.accountFullName = creator?.fullName || creator?.username;
      } else {
        product.accountFullName = null;
      }
      // Thêm thông tin người cập nhật
      if (product.updatedBy?.account_id) {
        const updater = await Account.findById(product.updatedBy.account_id);
        product.updatedFullName = updater?.fullName || updater?.username;
      } else {
        product.updatedFullName = null;
      }
    }

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

  req.flash("success", "Thay đổi trạng thái thành công");

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
      req.flash("success", `Thay đổi trạng thái ${idList.length} thành công`);
    }
    if (type === "delete-all") {
      await Product.updateMany(
        { _id: { $in: idList } },
        { deleted: true, updatedAt: new Date() }
      );
    }

    if (type === "change-position") {
      const positionsRaw = req.body.positions;
      const positions =
        typeof positionsRaw === "string" ? JSON.parse(positionsRaw) : [];

      for (const item of positions) {
        await Product.updateOne({ _id: item.id }, { position: item.position });
      }
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
        deletedBy: {
          account_id: res.locals.user.id,
          deletedAt: new Date(),
        },
      }
    );

    const redirectUrl = req.query.redirect || "/admin/products"; // fallback nếu không có
    res.redirect(redirectUrl);
  } catch (error) {
    console.error("Lỗi khi xóa sản phẩm:", error.message);
    res.redirect("/admin/products");
  }
};

// [GET] /admin/product/create
module.exports.create = async (req, res) => {
  try {
    const categories = await ProductCategory.find({ deleted: false });
    const treeCategories = createTreeWithIndent(categories);
    res.render("admin/pages/products/create", {
      pageTitle: "Thêm mới sản phẩm",
      categories: treeCategories,
    });
  } catch (err) {
    console.error("Product List Error:", err);
    res.status(500).send("Lỗi server");
  }
};

// [POST] /admin/products/create
module.exports.createPost = async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      createdBy,
      discountPercentage,
      stock,
      thumbnail,
      status,
      position,
    } = req.body || {};

    if (!title) {
      req.flash("error", "Thiếu tên sản phẩm");
      return res.redirect(`${systemConfig.prefixAdmin}/products/create`);
    }
    if (req.body.position == "") {
      const countProduct = await Product.countDocuments();
      req.body.position = countProduct + 1;
    } else {
      req.body.position = parseInt(req.body.position);
    }

    req.body.createdBy = {
      account_id: res.locals.user._id,
    };

    const thumbnailPath = req.file ? `uploads/${req.file.filename}` : "";

    const newProduct = new Product({
      title,
      product_category_id: req.body.product_category_id || null,
      description,
      createdBy: req.body.createdBy,
      price: parseInt(price),
      discountPercentage: parseFloat(discountPercentage) || 0,
      stock: parseInt(stock),
      thumbnail: thumbnailPath,
      status,
      position: req.body.position,
      deleted: false,
      deletedAt: null,
    });

    await newProduct.save();
    req.flash("success", "Thêm sản phẩm thành công");
    res.redirect(`${systemConfig.prefixAdmin}/products`);
  } catch (err) {
    console.error("Product List Error:", err);
    res.status(500).send("Lỗi server");
  }
};

// [GET] /admin/product/edit/:id
module.exports.edit = async (req, res) => {
  try {
    const find = {
      deleted: false,
      _id: req.params.id,
    };

    const product = await Product.findOne(find);
    const categories = await ProductCategory.find({ deleted: false });
    const treeCategories = createTreeWithIndent(categories);
    res.render("admin/pages/products/edit", {
      pageTitle: "Chỉnh sửa sản phẩm",
      product: product,
      categories: treeCategories,
    });
  } catch (err) {
    console.error("Product List Error:", err);
    res.status(500).send("Lỗi server");
  }
};

// [PATCH] /admin/products/edit/:id
module.exports.editPatch = async (req, res) => {
  try {
    const id = req.params.id;
    const {
      title,
      description,
      price,
      discountPercentage,
      stock,
      status,
      position,
    } = req.body || {};

    // Validation
    if (!title) {
      req.flash("error", "Thiếu tên sản phẩm");
      return res.redirect(`${systemConfig.prefixAdmin}/products/edit/${id}`);
    }
    const updatedBy = {
      account_id: res.locals.user._id,
      updateAt: new Date(),
    };
    // Chuẩn bị dữ liệu cập nhật
    const updateData = {
      title,
      product_category_id: req.body.product_category_id || null,
      description,
      price: parseInt(price) || 0,
      discountPercentage: parseFloat(discountPercentage) || 0,
      stock: parseInt(stock) || 0,
      status,
      position: parseInt(position) || 1,
      updatedBy: updatedBy,
    };

    // Xử lý upload ảnh mới nếu có
    if (req.file) {
      updateData.thumbnail = `uploads/${req.file.filename}`;
    }

    // Cập nhật sản phẩm
    await Product.updateOne({ _id: id }, updateData);

    req.flash("success", "Cập nhật sản phẩm thành công");
    res.redirect(`${systemConfig.prefixAdmin}/products`);
  } catch (err) {
    console.error("Product Edit Error:", err);
    req.flash("error", "Có lỗi xảy ra khi cập nhật sản phẩm");
    res.redirect(`${systemConfig.prefixAdmin}/products/edit/${req.params.id}`);
  }
};

// [GET] /admin/product/detail/:id
module.exports.detail = async (req, res) => {
  try {
    const find = {
      deleted: false,
      _id: req.params.id,
    };

    const product = await Product.findOne(find);

    res.render("admin/pages/products/detail", {
      pageTitle: product.title,
      product: product,
    });
  } catch (err) {
    console.error("Product List Error:", err);
    res.status(500).send("Lỗi server");
  }
};
