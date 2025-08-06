const User = require("../../models/user.model");
const Cart = require("../../models/cart.model");
const bcrypt = require("bcrypt");

const ForgotPassword = require("../../models/forgotpassword.model");
const generate = require("../../helpers/generate");
const sendmailHelper = require("../../helpers/sendMail");

//[GET] user/register
module.exports.register = (req, res) => {
  res.render("client/pages/users/register", {
    pageTitle: "Đăng ký",
  });
};

// [POST] /user/register
module.exports.registerPost = async (req, res) => {
  try {
    // Kiểm tra email đã tồn tại
    const existsEmail = await User.findOne({ email: req.body.email });
    if (existsEmail) {
      req.flash("error", "Email đã tồn tại");
      return res.redirect("/user/register");
    }

    // Mã hóa mật khẩu
    const salt = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(req.body.password, salt);

    // Tạo người dùng mới
    const user = new User(req.body);
    await user.save();

    // Đặt cookie token (ghi đúng tên)
    res.cookie("tokenUser", user.token);

    // Thông báo thành công và redirect
    req.flash("success", "Đăng ký tài khoản thành công");
    res.redirect("/");
  } catch (error) {
    console.error("Đăng ký thất bại:", error);
    req.flash("error", "Có lỗi xảy ra, vui lòng thử lại sau.");
    res.redirect("/user/register");
  }
};

//[GET] user/login
module.exports.login = (req, res) => {
  res.render("client/pages/users/login", {
    pageTitle: "Đăng nhập",
  });
};
// [POST] /user/login
module.exports.loginPost = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email, deleted: false });

    if (!user) {
      req.flash("error", "Email không tồn tại");
      return res.redirect("/user/login");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      req.flash("error", "Sai mật khẩu");
      return res.redirect("/user/login");
    }

    if (user.status === "inactive") {
      req.flash("error", "Tài khoản đã bị khóa");
      return res.redirect("/user/login");
    }

    // Gán token đăng nhập
    res.cookie("tokenUser", user.token);

    const cookieCartId = req.cookies.cartId;

    if (cookieCartId) {
      // Trường hợp đã có giỏ hàng tạm → gán vào user
      await Cart.updateOne({ _id: cookieCartId }, { user_Id: user._id });
    } else {
      // Không có cartId (người dùng đã từng login hoặc xóa cookie)
      // Kiểm tra xem người dùng đã có giỏ hay chưa
      let userCart = await Cart.findOne({ user_Id: user._id });
      if (!userCart) {
        // Nếu chưa có → tạo mới giỏ
        userCart = new Cart({ user_Id: user._id, products: [] });
        await userCart.save();
      }

      res.cookie("cartId", userCart._id.toString());
    }

    req.flash("success", "Đăng nhập thành công");
    res.redirect("/");
  } catch (error) {
    console.error("Đăng nhập thất bại:", error);
    req.flash("error", "Có lỗi xảy ra, vui lòng thử lại sau.");
    res.redirect("/user/login");
  }
};

//[GET] user/logout
module.exports.logout = (req, res) => {
  res.clearCookie("tokenUser");
  req.flash("success", "Đăng xuất tài khoản thành công");
  res.redirect("/");
};

//[GET] user/password/forgotpassword
module.exports.forgotPassword = (req, res) => {
  res.render("client/pages/users/forgotpassword", {
    pageTitle: "Quên mật khẩu",
  });
};

// [POST] /user/password/forgot
module.exports.forgotPasswordPost = async (req, res) => {
  try {
    const email = req.body.email;

    const user = await User.findOne({ email, deleted: false });
    if (!user) {
      req.flash("error", "Email không tồn tại trong hệ thống");
      return res.redirect("/user/password/forgot");
    }

    const otp = generate.generateNumber();
    const expiresAt = new Date(Date.now() + 60 * 1000);

    const forgotRecord = new ForgotPassword({
      email,
      otp,
      expiresAt,
    });

    await forgotRecord.save();
    const subject = "Yêu cầu đặt lại mật khẩu";
    const html = `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            background-color: #f5f5f5;
                            padding: 20px;
                        }
                        .container {
                            max-width: 600px;
                            margin: 0 auto;
                            background: white;
                            padding: 20px;
                            border-radius: 8px;
                            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                        }
                        .otp-code {
                            font-size: 24px;
                            font-weight: bold;
                            color: #d32f2f;
                            margin: 15px 0;
                            letter-spacing: 3px;
                        }
                        .note {
                            color: #777;
                            font-size: 14px;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <h2>Đặt lại mật khẩu</h2>
                        <p>Xin chào,</p>
                        <p>Dưới đây là mã OTP để đặt lại mật khẩu của bạn:</p>
                        
                        <div class="otp-code">${otp}</div>
                        
                        <p class="note">Mã có hiệu lực trong 5 phút. Vui lòng không chia sẻ mã này với ai.</p>
                        <p>Trân trọng,<br>Đội ngũ hỗ trợ</p>
                    </div>
                </body>
                </html>
                `;

    sendmailHelper.sendMail(email, subject, html);
    res.redirect(`/user/password/otp?email=${forgotRecord.email}`);
  } catch (error) {
    console.error("Lỗi quên mật khẩu:", error);
    req.flash("error", "Có lỗi xảy ra, vui lòng thử lại sau.");
    res.redirect("/user/password/forgot");
  }
};

//[GET] user/password/otp
module.exports.otp = (req, res) => {
  const email = req.query.email;
  res.render("client/pages/users/otp", {
    pageTitle: "Nhập OTP",
    email: email,
  });
};

// [POST] /user/password/otp
module.exports.otpPost = async (req, res) => {
  try {
    const email = req.body.email;
    const otp = req.body.otp;

    const result = await ForgotPassword.findOne({
      email,
      otp: otp,
    });

    if (!result) {
      req.flash("error", "OTP không chính xác");
      return res.redirect(`/user/password/otp?email=${email}`);
    }

    const user = await User.findOne({
      email: email,
    });

    res.cookie("resetEmail", email, { maxAge: 5 * 60 * 1000 });

    res.redirect("/user/password/reset");
  } catch (error) {
    console.error("Lỗi quên mật khẩu:", error);
    req.flash("error", "Có lỗi xảy ra, vui lòng thử lại sau.");
    res.redirect("/user/password/otp");
  }
};

//[GET] user/password/reset
module.exports.reset = (req, res) => {
  res.render("client/pages/users/reset", {
    pageTitle: "Nhập mật khẩu",
  });
};

// [POST] /user/password/reset
module.exports.resetPost = async (req, res) => {
  try {
    const password = req.body.password;
    const email = req.cookies.resetEmail;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await User.updateOne({ email }, { password: hashedPassword });
    res.clearCookie("resetEmail");
    req.flash("success", "Đổi mật khẩu thành công. Vui lòng đăng nhập lại.");
    res.redirect("/user/login");
  } catch (error) {
    console.error("Lỗi reset mật khẩu:", error);
    req.flash("error", "Có lỗi xảy ra, vui lòng thử lại sau.");
    res.redirect("/user/password/reset");
  }
};

//[GET] user/password/reset
module.exports.info = (req, res) => {
  res.render("client/pages/users/info", {
    pageTitle: "Thông tin cá nhân",
  });
};

module.exports.edit = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      req.flash("error", "Không tìm thấy người dùng");
      res.redirect("/login");
    }

    res.render("client/pages/users/edit", {
      pageTitle: "Chỉnh sửa thông tin cá nhân",
      user,
    });
  } catch (error) {
    console.error("Lỗi khi lấy thông tin người dùng:", error);
    res.status(500).send("Lỗi server.");
  }
};

module.exports.editPost = async (req, res) => {
  try {
    const { fullName, email, phone, address } = req.body;

    await User.findByIdAndUpdate(req.params.id, {
      fullName,
      email,
      phone,
      address,
    });

    res.redirect("/user/info");
  } catch (error) {
    console.error("Lỗi khi cập nhật người dùng:", error);
    res.status(500).send("Lỗi server.");
  }
};
