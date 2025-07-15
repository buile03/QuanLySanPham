const Product = require("../../models/product.model");
// [GET] /admin/products
module.exports.index = async (req, res) => {
  let filterStatus = [
    {
      name: "Tất cả",
      status: "",
      class: "active",
    },
    {
      name: "Hiển thị",
      status: "active",
      class: "",
    },
    {
      name: "Ẩn",
      status: "inactive",
      class: "",
    },
  ];

  let find = {
    deleted: false,
  };

  // Lọc theo trạng thái
  if (req.query.status) {
    find.status = req.query.status;
  }

  // //Tìm kiếm
  if (req.query.keyword) find.title = new RegExp(req.query.keyword, "i");

  const products = await Product.find(find);

  res.render("admin/pages/products/index", {
    pageTitle: "Danh sách sản phẩm",
    products: products,
    query: req.query, // truyền lại để view biết đang chọn gì
    filterStatus: filterStatus,
  });
};

// const Product = require("../../models/product.model");

// module.exports.index = async (req, res) => {
//   const query = req.query;
//   const keyword = query.keyword || "";
//   const status = query.status || "";
//   const sortBy = query.sort || ""; // ví dụ mở rộng
//   const page = parseInt(query.page) || 1;
//   const limit = 10;
//   const skip = (page - 1) * limit;

//   Lọc trạng thái
//   let filter = { deleted: false };
//   if (status) {
//     filter.status = status;
//   }

//   Tìm kiếm
//   if (keyword) {
//     filter.title = new RegExp(keyword, "i");
//   }

//   Sắp xếp
//   let sort = {};
//   if (sortBy === "price-asc") sort.price = 1;
//   if (sortBy === "price-desc") sort.price = -1;

//   const totalProducts = await Product.countDocuments(filter);
//   const totalPages = Math.ceil(totalProducts / limit);

//   const products = await Product.find(filter)
//     .sort(sort)
//     .skip(skip)
//     .limit(limit);

//   Đặt lại trạng thái active cho từng filter button
//   const filterStatus = [
//     { name: "Tất cả", status: "", class: status === "" ? "active" : "" },
//     {
//       name: "Hiển thị",
//       status: "active",
//       class: status === "active" ? "active" : "",
//     },
//     {
//       name: "Ẩn",
//       status: "inactive",
//       class: status === "inactive" ? "active" : "",
//     },
//   ];

//   res.render("admin/pages/products/index", {
//     pageTitle: "Danh sách sản phẩm",
//     products,
//     query,
//     filterStatus,
//     totalPages,
//     currentPage: page,
//   });
// };
