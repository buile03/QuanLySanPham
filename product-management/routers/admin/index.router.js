const systemConfig = require("../../config/system");
const dashboadRouter = require("./dashboard.router");

module.exports = (app) => {
  const PATH_ADMIN = systemConfig.prefixAdmin;
  app.use(PATH_ADMIN + "/dashboard", dashboadRouter);
};
