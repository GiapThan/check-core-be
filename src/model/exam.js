const mongoose = require("mongoose");
const mongooseDelete = require("mongoose-delete");
const Schema = mongoose.Schema;

const Exam = new Schema(
  {
    chuong: { type: String },
    lesson: { type: String, default: "" },
    listQuestion: { type: Array, default: [] },
  },
  { timestamps: true }
);

Exam.plugin(mongooseDelete, {
  deleteAt: true,
  overrideMethods: "all",
});

module.exports = UploadModel = mongoose.model("Exam", Exam);
