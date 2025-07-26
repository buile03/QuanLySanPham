// Import thư viện cần thiết
const express = require("express");
const path = require("path");
require("dotenv").config();
const methodOverride = require("method-override");
const bodyParser = require("body-parser");
const flash = require("express-flash");
const cookieParser = require("cookie-parser");
const session = require("express-session");

// Kết nối cơ sở dữ liệu MongoDB
const database = require("./config/database");
database.connect();

// Import cấu hình và router
const systemConfig = require("./config/system");
const routerClient = require("./routers/client/index.router");
const routerAdmin = require("./routers/admin/index.router");

// Khởi tạo ứng dụng Express
const app = express();
const port = process.env.PORT || 3000;

// Cấu hình view engine là Pug
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

// Thiết lập biến toàn cục (global) cho template
app.locals.prefixAdmin = systemConfig.prefixAdmin;

// Middleware xử lý dữ liệu POST
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware cho static files (truy cập được các file trong public/, bao gồm uploads/)
app.use(express.static(path.join(__dirname, "public")));

// Middleware hỗ trợ PUT và DELETE từ form
app.use(methodOverride("_method"));

// Middleware session + flash message
app.use(cookieParser("BUILE"));
app.use(
  session({
    secret: "BUILE",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 },
  })
);
app.use(flash());

// Cấu hình router cho client và admin
app.use("/", routerClient);
app.use(systemConfig.prefixAdmin, routerAdmin); // Sử dụng prefixAdmin từ config

// Khởi động server
if (require.main === module) {
  app.listen(port, () => {
    console.log(`✅ Server đang chạy tại http://localhost:${port}`);
  });
}

const serverless = require("serverless-http");
module.exports = serverless(app);
