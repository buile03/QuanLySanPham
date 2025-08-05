const mongoose = require("mongoose");
const generate = require("../helpers/generate");
const userSchema = new mongoose.Schema(
  {
    fullName: String,
    email: String,
    password: String,
    phone: String,
    avatar: String,
    address: String,
    token: {
      type: String,
      default: () => generate.generateToken(),
    },

    status: {
      type: String,
      default: "active",
    },
    deleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema, "users");
