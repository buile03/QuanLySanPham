const mongoose = require("mongoose");
const generate = require("../helpers/generate");
const accountSchema = new mongoose.Schema(
  {
    fullName: String,
    email: String,
    password: String,
    phone: String,
    avatar: String,
    address: String,
    token: {
      type: String,
      default: generate.generateToken(),
    },
    role_id: {
      type: String,
      default: "",
    },
    status: String,
    deleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Account", accountSchema, "accounts");
