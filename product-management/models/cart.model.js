const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema(
  {
    user_Id: String,
    products: [
      {
        product_Id: String,
        quantity: Number,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Cart", CartSchema, "carts");
