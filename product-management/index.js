// Import thư viện Express để tạo server
const express = require("express");

// Load biến môi trường từ file .env (ví dụ: PORT, DB_URL, ...)
require("dotenv").config();

// Import module để kết nối MongoDB (tùy bạn dùng mongoose hoặc native Mongo)
const database = require("./config/database");

// Import cấu hình hệ thống (ví dụ: prefix admin)
const systemConfig = require("./config/system");

// Import router phần giao diện người dùng (client)
const router = require("./routers/client/index.router");

// Import router phần quản trị admin
const routerAdmin = require("./routers/admin/index.router");

// Import middleware method-override để hỗ trợ PUT, PATCH, DELETE qua HTML form
const methodOverride = require("method-override");
const bodyParser = require("body-parser");

const flash = require("express-flash");
const cookieParser = require("cookie-parser");
const session = require("express-session");
// Gọi hàm kết nối đến MongoDB
database.connect();

// Khởi tạo ứng dụng Express
const app = express();

// Lấy cổng từ biến môi trường (.env) hoặc gán mặc định nếu cần
const port = process.env.PORT;

// Cấu hình thư mục chứa các file view (Pug)
app.set("views", "./views");

// Thiết lập engine template là Pug
app.set("view engine", "pug");

// Biến toàn cục trong app, dùng để truy cập prefix admin trong pug
app.locals.prefixAdmin = systemConfig.prefixAdmin;

// Cho phép truy cập file tĩnh trong thư mục "public" (CSS, JS, ảnh...)
app.use(express.static("public"));

// Middleware để parse dữ liệu từ form submit (application/x-www-form-urlencoded)
app.use(express.urlencoded({ extended: true }));

// Kích hoạt method-override để form có thể gửi PATCH, DELETE thông qua input hidden
// Sử dụng: <input type="hidden" name="_method" value="PATCH">
app.use(methodOverride("_method"));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded());
// Gắn router cho phía giao diện người dùng (client)
//Flash
app.use(cookieParser("BUILE"));
app.use(session({ cookie: { maxAge: 60000 } }));
app.use(flash());
router(app);

// Gắn router cho phía admin (dashboard)
routerAdmin(app);

// Khởi động server và lắng nghe tại cổng được cấu hình
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
