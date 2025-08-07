const mongoose = require("mongoose");
const settingGeneralSchema = new mongoose.Schema(
  {
    websiteName: String,
    logo: String,
    phone: String,
    email: String,
    address: String,
    copyright: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "SettingGeneral",
  settingGeneralSchema,
  "setting-general"
);
