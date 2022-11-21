const userRouter = require("./userRouter");
const examRouter = require("./examRouter");
const diemRouter = require("./diemRouter");

const route = (app) => {
  app.use("/api/user", userRouter);
  app.use("/api/diem", diemRouter);
  app.use("/api/exam", examRouter);
};

module.exports = route;
