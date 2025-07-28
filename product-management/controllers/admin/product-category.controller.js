const ProductCategory = require("../../models/product-category.model");
const filterStatusHelper = require("../../helpers/filterStatus");
const searchHelper = require("../../helpers/search");
const paginationHelper = require("../../helpers/pagination");
const systemConfig = require("../../config/system");
const { proppatch } = require("../../routers/admin/dashboard.router");

// [GET] /admin/products-category
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

    const totalItems = await ProductCategory.countDocuments(filter);
    const pagination = paginationHelper(req.query.page, totalItems, 10);
    //sort
    let sort = {};

    if (req.query.sortKey && req.query.sortValue) {
      sort[req.query.sortKey] = req.query.sortValue;
    } else {
      sort.position = "desc";
    }
    //end sort
    const record = await ProductCategory.find(filter)
      .sort(sort)
      .skip(pagination.skip)
      .limit(pagination.limit);

    res.render("admin/pages/products-category/index", {
      pageTitle: "Danh sách sản phẩm",
      record,
      query: req.query,
      filterStatus,
      pagination,
    });
  } catch (err) {
    console.error("Product List Error:", err);
    res.status(500).send("Lỗi server");
  }
};

// [PATCH] /admin/product-category/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
  const status = req.params.status;
  const id = req.params.id;
  const redirectUrl = req.body.redirect || "/admin/products-category";
  await ProductCategory.updateOne({ _id: id }, { status: status });

  req.flash("success", "Thay đổi trạng thái thành công");

  res.redirect(redirectUrl);
};

// [PATCH] /admin/products-category/change-multi
module.exports.changeMulti = async (req, res) => {
  try {
    const type = req.body.type;
    const redirectUrl = req.body.redirect || "/admin/products-category";

    const idList =
      typeof req.body.ids === "string"
        ? req.body.ids.split(/\s*,\s*/).filter(Boolean)
        : [];

    if (["active", "inactive"].includes(type) && idList.length > 0) {
      await ProductCategory.updateMany(
        { _id: { $in: idList } },
        { status: type }
      );
      req.flash("success", `Thay đổi trạng thái ${idList.length} thành công`);
    }
    if (type === "delete-all") {
      await ProductCategory.updateMany(
        { _id: { $in: idList } },
        { deleted: true, updatedAt: new Date() }
      );
    }

    if (type === "change-position") {
      const positionsRaw = req.body.positions;
      const positions =
        typeof positionsRaw === "string" ? JSON.parse(positionsRaw) : [];

      for (const item of positions) {
        await ProductCategory.updateOne(
          { _id: item.id },
          { position: item.position }
        );
      }
    }

    res.redirect(redirectUrl);
  } catch (error) {
    console.error("Lỗi changeMulti:", error);
    res.redirect("/admin/products-category"); // fallback nếu có lỗi
  }
};

// [GET] /admin/product-category/create
module.exports.create = async (req, res) => {
  try {
    res.render("admin/pages/products-category/create", {
      pageTitle: "Thêm mới danh mục sản phẩm",
    });
  } catch (err) {
    console.error("Product List Error:", err);
    res.status(500).send("Lỗi server");
  }
};
// [POST] /admin/products-category/create
module.exports.createPost = async (req, res) => {
  try {
    const { title, parent_id, description, status } = req.body;

    if (!title) {
      req.flash("error", "Thiếu tên danh mục");
      return res.redirect(
        `${systemConfig.prefixAdmin}/products-category/create`
      );
    }

    let position = 1;
    if (req.body.position === "") {
      const countProduct = await ProductCategory.countDocuments();
      position = countProduct + 1;
    } else {
      position = parseInt(req.body.position);
    }

    const thumbnailPath = req.file ? `uploads/${req.file.filename}` : "";

    const record = new ProductCategory({
      title,
      parent_id: parent_id || "",
      description: description || "",
      thumbnail: thumbnailPath,
      status: status || "active",
      position,
      deleted: false,
      deletedAt: null,
    });

    await record.save();
    req.flash("success", "Thêm danh mục sản phẩm thành công");
    res.redirect(`${systemConfig.prefixAdmin}/products-category`);
  } catch (err) {
    console.error("Product Category Create Error:", err);
    req.flash("error", "Thêm danh mục thất bại");
    res.redirect(`${systemConfig.prefixAdmin}/products-category/create`);
  }
};

// [GET] /admin/product-category/edit/:id
module.exports.edit = async (req, res) => {
  try {
    const find = {
      deleted: false,
      _id: req.params.id,
    };

    const record = await ProductCategory.findOne(find);

    res.render("admin/pages/products-category/edit", {
      pageTitle: "Chỉnh sửa danh mục sản phẩm",
      record: record,
    });
  } catch (err) {
    console.error("Product List Error:", err);
    res.status(500).send("Lỗi server");
  }
};

// [PATCH] /admin/products-category/edit/:id
module.exports.editPatch = async (req, res) => {
  try {
    const id = req.params.id;
    const { title, description, parent_id, status, position } = req.body || {};

    // Validation
    if (!title) {
      req.flash("error", "Thiếu tên danh mục sản phẩm");
      return res.redirect(
        `${systemConfig.prefixAdmin}/products-category/edit/${id}`
      );
    }

    // Chuẩn bị dữ liệu cập nhật
    const updateData = {
      title,
      description,
      parent_id,
      status,
      position: parseInt(position) || 1,
      updatedAt: new Date(),
    };

    // Xử lý upload ảnh mới nếu có
    if (req.file) {
      updateData.thumbnail = `uploads/${req.file.filename}`;
    }

    // Cập nhật sản phẩm
    await ProductCategory.updateOne({ _id: id }, updateData);

    req.flash("success", "Cập nhật danh mục sản phẩm thành công");
    res.redirect(`${systemConfig.prefixAdmin}/products-category`);
  } catch (err) {
    console.error("Product Edit Error:", err);
    req.flash("error", "Có lỗi xảy ra khi cập nhật sản phẩm");
    res.redirect(
      `${systemConfig.prefixAdmin}/products-category/edit/${req.params.id}`
    );
  }
};
// [GET] /admin/product-category/detail/:id
module.exports.detail = async (req, res) => {
  try {
    const find = {
      deleted: false,
      _id: req.params.id,
    };

    const record = await ProductCategory.findOne(find);

    res.render("admin/pages/products-category/detail", {
      pageTitle: record.title,
      record: record,
    });
  } catch (err) {
    console.error("Product List Error:", err);
    res.status(500).send("Lỗi server");
  }
};
