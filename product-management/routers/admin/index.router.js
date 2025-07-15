const systemConfig = require("../../config/system");
const dashboadRouter = require("./dashboard.router");
const productRouter = require("./product.router");

module.exports = (app) => {
  const PATH_ADMIN = systemConfig.prefixAdmin;
  app.use(PATH_ADMIN + "/dashboard", dashboadRouter);
  app.use(PATH_ADMIN + "/products", productRouter);
};
