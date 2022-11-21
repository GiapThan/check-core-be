const mongoose = require("mongoose");
const mongooseDelete = require("mongoose-delete");
const Schema = mongoose.Schema;

const signinExam = new Schema(
  {
    chuong: { type: String },
    lesson: { type: String },
    mssv: { type: String },
    listQuestion: { type: Array, default: [] },
  },
  { timestamps: true }
);

signinExam.plugin(mongooseDelete, {
  deleteAt: true,
  overrideMethods: "all",
});

module.exports = UploadModel = mongoose.model("signinExam", signinExam);
