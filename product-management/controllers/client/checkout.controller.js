const Cart = require("../../models/cart.model");
const Product = require("../../models/product.model");
const Order = require("../../models/order.model");

// [GET] /checkout
module.exports.index = async (req, res) => {
  try {
    const cartId = req.cookies.cartId;
    const cart = await Cart.findById(cartId);

    if (!cart || cart.products.length === 0) {
      req.flash("error", "Giỏ hàng trống, không thể thanh toán");
      return res.redirect("/cart");
    }

    // Lấy danh sách sản phẩm từ giỏ
    const populatedProducts = await Promise.all(
      cart.products.map(async (item) => {
        const product = await Product.findOne({
          _id: item.product_Id,
          deleted: false,
        });
        if (!product) return null;

        const newPrice = Math.round(
          (product.price * (100 - product.discountPercentage)) / 100
        );

        return {
          _id: product._id,
          thumbnail: product.thumbnail,
          title: product.title,
          price: product.price,
          discountPercentage: product.discountPercentage,
          newPrice,
          quantity: item.quantity,
          total: item.quantity * newPrice,
        };
      })
    );

    const validProducts = populatedProducts.filter((p) => p !== null);
    const totalAmount = validProducts.reduce((sum, p) => sum + p.total, 0);

    res.render("client/pages/checkout/index", {
      pageTitle: "Thanh toán",
      products: validProducts,
      totalAmount,
    });
  } catch (err) {
    console.error("Lỗi khi hiển thị trang thanh toán:", err);
    req.flash("error", "Lỗi khi tải trang thanh toán");
    return res.redirect("/cart");
  }
};

// [POST] /checkout/order
module.exports.order = async (req, res) => {
  try {
    const cartId = req.cookies.cartId;
    const { fullName, phone, address } = req.body;

    // Kiểm tra giỏ hàng
    const cart = await Cart.findById(cartId);

    if (!cart || cart.products.length === 0) {
      req.flash("error", "Giỏ hàng trống, không thể đặt hàng");
      return res.redirect("/cart");
    }

    // Lấy thông tin sản phẩm
    const populatedProducts = await Promise.all(
      cart.products.map(async (item) => {
        const product = await Product.findOne({
          _id: item.product_Id,
          deleted: false,
        });
        if (!product) return null;

        return {
          product_id: product._id,
          price: product.price,
          discountPercentage: product.discountPercentage,
          quantity: item.quantity,
        };
      })
    );

    const validProducts = populatedProducts.filter((p) => p !== null);
    if (validProducts.length === 0) {
      req.flash("error", "Không có sản phẩm hợp lệ trong giỏ hàng");
      return res.redirect("/cart");
    }

    // Tính tổng tiền
    const totalAmount = validProducts.reduce((sum, item) => {
      const newPrice = Math.round(
        (item.price * (100 - item.discountPercentage)) / 100
      );
      return sum + newPrice * item.quantity;
    }, 0);

    // Tạo đơn hàng
    const newOrder = new Order({
      cart_id: cartId,
      userInfo: {
        fullName,
        phone,
        address,
      },
      products: validProducts,
      totalAmount,
    });

    await newOrder.save();
    await Cart.updateOne({ _id: cartId }, { $set: { products: [] } });
    req.flash("success", "Đặt hàng thành công! Cảm ơn bạn đã mua sắm");
    return res.redirect("/checkout/order-success");
  } catch (error) {
    console.error("Lỗi khi đặt hàng:", error);
    req.flash("error", "Có lỗi xảy ra khi đặt hàng");
    return res.redirect("/checkout");
  }
};

// [GET] /checkout/order-success
module.exports.orderSuccess = async (req, res) => {
  res.render("client/pages/checkout/success", {
    pageTitle: "Đặt hàng thành công",
  });
};
