// Import thư viện Express để tạo server
const express = require("express");

// Load biến môi trường từ file .env (PORT, DB_URL, ...)
require("dotenv").config();

// Import module kết nối cơ sở dữ liệu MongoDB
const database = require("./config/database");

const systemConfig = require("./config/system");

// Import router của phần giao diện người dùng (client)
const router = require("./routers/client/index.router");

// Import router của phần admin (dashboard, quản trị)
const routerAdmin = require("./routers/admin/index.router");

// Gọi hàm connect để kết nối MongoDB (có thể dùng mongoose hoặc thư viện khác)
database.connect();

// Khởi tạo app Express
const app = express();

// Lấy port từ file .env (hoặc bạn có thể dùng `const port = process.env.PORT || 3000`)
const port = process.env.PORT;

// Cấu hình thư mục chứa view template
app.set("views", "./views");

// Cấu hình engine render view là pug (thay cho EJS, handlebars...)
app.set("view engine", "pug");

// App Local Variables
app.locals.prefixAdmin = systemConfig.prefixAdmin;

// Cho phép Express phục vụ file tĩnh như ảnh, CSS, JS từ thư mục "public"
app.use(express.static("public"));

// Gắn router cho giao diện client
router(app);

// Gắn router cho giao diện admin
routerAdmin(app);

// Khởi động server, lắng nghe cổng `port`
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
