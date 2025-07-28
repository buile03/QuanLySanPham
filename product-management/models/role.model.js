const mongoose = require("mongoose");

const RoleSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    permissions: {
      type: [String],
      default: [],
    },
    deleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Role", RoleSchema, "roles");
