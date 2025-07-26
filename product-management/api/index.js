const express = require("express");
const path = require("path");
require("dotenv").config();

const methodOverride = require("method-override");
const bodyParser = require("body-parser");
const flash = require("express-flash");
const cookieParser = require("cookie-parser");
const session = require("express-session");

const database = require("../config/database");
database.connect();

const systemConfig = require("../config/system");
const routerClient = require("../routers/client/index.router");
const routerAdmin = require("../routers/admin/index.router");

const app = express();

// KHÔNG dùng app.listen()

// Cấu hình view engine là Pug (không dùng được trong serverless, trừ khi bạn build thành HTML sẵn hoặc dùng SSR/Next.js)
app.set("views", path.join(__dirname, "../views"));
app.set("view engine", "pug");

app.locals.prefixAdmin = systemConfig.prefixAdmin;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../public")));

app.use(methodOverride("_method"));

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

app.use("/", routerClient);
app.use(systemConfig.prefixAdmin, routerAdmin);

// Export dưới dạng middleware handler để Vercel xử lý
module.exports = app;
