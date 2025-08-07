const Product = require("../../models/product.model");
const ProductCategory = require("../../models/product-category.model");
const Account = require("../../models/account.model");
const User = require("../../models/user.model");
const Role = require("../../models/role.model");
const Order = require("../../models/order.model");

// [GET] /admin/dashboard
module.exports.dashboard = async (req, res) => {
  const statics = {
    product: {
      total: 0,
      active: 0,
      inactive: 0,
    },
    category: {
      total: 0,
      active: 0,
      inactive: 0,
    },
    account: {
      total: 0,
      admin: 0,
      user: 0,
    },
    user: {
      total: 0,
      active: 0,
      inactive: 0,
    },
    order: {
      total: 0,
    },
    role: {
      total: 0,
    },
  };

  // Thống kê sản phẩm
  statics.product.total = await Product.countDocuments({ deleted: false });
  statics.product.active = await Product.countDocuments({
    deleted: false,
    status: "active",
  });
  statics.product.inactive = await Product.countDocuments({
    deleted: false,
    status: "inactive",
  });

  // Thống kê danh mục sản phẩm
  statics.category.total = await ProductCategory.countDocuments({
    deleted: false,
  });
  statics.category.active = await ProductCategory.countDocuments({
    deleted: false,
    status: "active",
  });
  statics.category.inactive = await ProductCategory.countDocuments({
    deleted: false,
    status: "inactive",
  });

  // Thống kê tài khoản
  statics.account.total = await Account.countDocuments({ deleted: false });
  statics.account.admin = await Account.countDocuments({
    deleted: false,
    role_id: { $ne: "" },
  });
  statics.account.user = await Account.countDocuments({
    deleted: false,
    role_id: "",
  });

  // Thống kê người dùng
  statics.user.total = await User.countDocuments({ deleted: false });
  statics.user.active = await User.countDocuments({
    deleted: false,
    status: "active",
  });
  statics.user.inactive = await User.countDocuments({
    deleted: false,
    status: "inactive",
  });

  // Thống kê đơn hàng
  statics.order.total = await Order.countDocuments({ deleted: false });

  // Thống kê vai trò
  statics.role.total = await Role.countDocuments({ deleted: false });

  res.render("admin/pages/dashboard/index", {
    pageTitle: "Trang tổng quan",
    statics: statics,
  });
};
