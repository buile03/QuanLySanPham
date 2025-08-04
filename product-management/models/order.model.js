const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    //user_id: String
    cart_id: String,
    userInfo: {
      fullName: String,
      phone: Number,
      address: String,
    },
    products: [
      {
        product_id: String,
        price: Number,
        discountPercentage: Number,
        quantity: Number,
      },
    ],
    deleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", OrderSchema, "orders");
