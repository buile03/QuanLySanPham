const mongoose = require("mongoose");

const forgotPasswordSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    otp: {
      type: String,
      required: true,
    },
    token: {
      type: String,
    },
    expiresAt: {
      type: Date,
      required: true,
      expires: 0,
    },
    used: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "ForgotPassword",
  forgotPasswordSchema,
  "forgotpasswords"
);
