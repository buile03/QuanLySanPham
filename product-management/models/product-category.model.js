const mongoose = require("mongoose");
const slug = require("mongoose-slug-updater");
mongoose.plugin(slug);

const productCategorySchema = new mongoose.Schema({
  title: String,
  parent_id: String,
  description: String,
  thumbnail: String,
  status: String,
  position: Number,
  slug: { type: String, slug: "title", unique: true },
  createdBy: {
    account_id: String,
    createAt: { type: Date, default: Date.now },
  },
  updatedBy: {
    account_id: String,
    updateAt: {
      type: Date,
      default: Date,
    },
  },
  deleted: {
    type: Boolean,
    default: false,
  },
  deletedBy: {
    account_id: String,
    deletedAt: Date,
  },
});

module.exports = mongoose.model(
  "ProductCategory",
  productCategorySchema,
  "products-category"
);
