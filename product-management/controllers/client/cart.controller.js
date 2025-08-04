const Cart = require("../../models/cart.model");

const Product = require("../../models/product.model");

// [GET] /cart
module.exports.index = async (req, res) => {
  try {
    const cartId = req.cookies.cartId;
    const cart = await Cart.findById(cartId);

    if (!cart) {
      req.flash("error", "Không tìm thấy giỏ hàng");
      return res.redirect("/product");
    }

    // Lấy danh sách sản phẩm từ giỏ
    const populatedProducts = await Promise.all(
      cart.products.map(async (item) => {
        const product = await Product.findById(item.product_Id);
        if (!product) return null;

        const newPrice = Math.round(
          (product.price * (100 - product.discountPercentage)) / 100
        );

        return {
          _id: product._id,
          thumbnail: product.thumbnail,
          slug: product.slug,
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

    res.render("client/pages/cart/index", {
      pageTitle: "Giỏ hàng",
      products: validProducts,
      totalAmount,
    });
  } catch (err) {
    console.error("Lỗi khi hiển thị giỏ hàng:", err);
    req.flash("error", "Lỗi khi tải giỏ hàng");
    return res.redirect("/product");
  }
};

// [POST] /cart/add/:productId
module.exports.addToCart = async (req, res) => {
  try {
    const productId = req.params.productId;
    const quantity = parseInt(req.body.quantity) || 1;
    const cartId = req.cookies.cartId;

    // Kiểm tra giỏ hàng tồn tại
    const cart = await Cart.findOne({ _id: cartId });
    if (!cart) {
      req.flash("error", "Không tìm thấy giỏ hàng");
      return res.redirect("/product");
    }

    // Kiểm tra sản phẩm đã có trong giỏ hàng chưa
    const existsProductIndex = cart.products.findIndex(
      (item) => item.product_Id.toString() === productId
    );

    if (existsProductIndex !== -1) {
      // Nếu sản phẩm đã có trong giỏ hàng, cập nhật số lượng
      const newQuantity = cart.products[existsProductIndex].quantity + quantity;

      await Cart.updateOne(
        {
          _id: cartId,
          "products.product_Id": productId,
        },
        {
          $set: {
            "products.$.quantity": newQuantity,
          },
        }
      );
    } else {
      // Nếu sản phẩm chưa có trong giỏ hàng, thêm mới
      const newProduct = {
        product_Id: productId,
        quantity: quantity,
      };

      await Cart.updateOne(
        { _id: cartId },
        {
          $push: { products: newProduct },
        }
      );
    }

    req.flash("success", "Thêm sản phẩm thành công");
    return res.redirect("/product");
  } catch (error) {
    console.error("Lỗi khi thêm vào giỏ hàng:", error);
    req.flash("error", "Có lỗi xảy ra khi thêm vào giỏ hàng");
    return res.redirect("/product");
  }
};

// [GET] /cart/delete/:productId
module.exports.delete = async (req, res) => {
  try {
    const cartId = req.cookies.cartId;
    const productId = req.params.productId;

    await Cart.updateOne(
      { _id: cartId },
      { $pull: { products: { product_Id: productId } } }
    );

    req.flash("success", "Đã xóa sản phẩm khỏi giỏ hàng");
    return res.redirect("/cart");
  } catch (error) {
    console.error("Lỗi khi xóa sản phẩm khỏi giỏ hàng:", error);
    req.flash("error", "Có lỗi xảy ra khi xóa sản phẩm khỏi giỏ hàng");
    return res.redirect("/cart");
  }
};

// [GET] /cart/update/:productId/:quantity
module.exports.update = async (req, res) => {
  try {
    const cartId = req.cookies.cartId;
    const productId = req.params.productId;
    const quantity = req.params.quantity;

    await Cart.updateOne(
      {
        _id: cartId,
        "products.product_Id": productId,
      },
      {
        $set: {
          "products.$.quantity": quantity,
        },
      }
    );

    req.flash("success", "Đã cập nhật số lượng sản phẩm");
    return res.redirect("/cart");
  } catch (error) {
    console.error("Lỗi khi cập nhật số lượng sản phẩm:", error);
    req.flash("error", "Có lỗi xảy ra khi cập nhật số lượng sản phẩm");
    return res.redirect("/cart");
  }
};
