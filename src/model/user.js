const mongoose = require("mongoose");
const mongooseDelete = require("mongoose-delete");
const Schema = mongoose.Schema;

const User = new Schema(
  {
    mssv: { type: String },
    name: { type: String, default: "" },
    password: { type: String, default: "" },
    stars: { type: Object, default: {} },
    role: { type: String, default: "01" }, //01: bth, 00:admin
  },
  { timestamps: true }
);

User.plugin(mongooseDelete, {
  deleteAt: true,
  overrideMethods: "all",
});

module.exports = UploadModel = mongoose.model("User", User);
