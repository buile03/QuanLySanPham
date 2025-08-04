const Cart = require("../../models/cart.model");

module.exports.cartId = async (req, res, next) => {
  if (!req.cookies.cartId) {
    // Tạo mới giỏ hàng nếu không có cartId trong cookies
    const newCart = new Cart();
    await newCart.save();
    const expiresCookie = 365 * 24 * 60 * 60 * 1000; // 1 năm
    res.cookie("cartId", newCart._id, {
      expires: new Date(Date.now() + expiresCookie),
    });
  } else {
    const cart = await Cart.findOne({
      _id: req.cookies.cartId,
    });

    cart.quantityTotal = cart.products.reduce(
      (sum, item) => sum + item.quantity,
      0
    );
    res.locals.miniCart = cart;
  }
  next();
};
