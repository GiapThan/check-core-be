const JWT = require("jsonwebtoken");
const examModel = require("../model/exam");
const userModel = require("../model/user");
const signInExamModel = require("../model/signinExam");

const accessKey = process.env.ACCESSKEY;

const verify = async (token) => {
  try {
    let data = await JWT.verify(token, accessKey);
    return data;
  } catch (error) {
    return false;
  }
};

module.exports = {
  createBaiTap: async (req, res) => {
    const payload = req.body;
    try {
      let data = await verify(req.headers.author);
      if (data && data.role === "00") {
        let pre = await examModel.findOne({
          chuong: payload.chuong,
          lesson: payload.lesson,
        });
        if (pre) {
          return res.json({ errCode: -2 });
        }

        let data = await examModel.create(payload);
        if (data) {
          res.json({ errCode: 0, msg: "ok" });
        } else {
          res.json({ errCode: -1 });
        }
      }
    } catch (error) {
      res.json({ errCode: -100 });
    }
  },

  getBaiTap: async (req, res) => {
    const params = req.params;
    const token = req.headers.author;
    try {
      let data = await verify(token);
      if (!data) return res.json({ errCode: -2, msg: "" });
      let exam = await examModel.findOne({
        chuong: params.chuong,
        lesson: params.lesson,
      });
      let signIn = await signInExamModel.findOne({
        chuong: params.chuong,
        lesson: params.lesson,
        mssv: data.mssv,
      });
      if (exam) {
        return res.json({
          errCode: 0,
          data: {
            chuong: exam.chuong,
            lesson: exam.lesson,
            listQuestion: exam.listQuestion,
            listHasSignIn: signIn ? signIn.listQuestion : [],
          },
        });
      } else {
        res.json({ errCode: -1 });
      }
    } catch (error) {
      console.log(error);
      res.json({ errCode: -100 });
    }
  },

  signInBaiTap: async (req, res) => {
    let payload = req.body;
    try {
      let exam = await examModel.findOne({
        lesson: payload.lesson,
        chuong: payload.chuong,
      });
      if (!exam || exam.open === false) {
        return res.json({ errCode: -1 });
      }
      let newSignIn = await signInExamModel.updateOne(
        {
          chuong: payload.chuong,
          lesson: payload.lesson,
          mssv: payload.mssv,
        },
        { listQuestion: payload.listQuestion }
      );
      if (newSignIn.modifiedCount !== 0) {
        //update thanh coong
        return res.json({ errCode: 0 });
      } else {
        //tao moi
        let data = await signInExamModel.create(payload);
        if (data) {
          return res.json({ errCode: 0 });
        }
      }
    } catch (error) {
      console.log(error);
      res.json({ errCode: -100 });
    }
  },

  changeOpen: async (req, res) => {
    let token = req.headers.author;
    let payload = req.body;
    try {
      let data = await verify(token);
      console.log(payload, data);
      if (data.role !== "00") return res.json({ errCode: -1 });
      let result = await examModel.updateOne(
        { lesson: payload.lesson, chuong: payload.chuong },
        { open: payload.open }
      );
      if (result.modifiedCount !== 0) {
        //thanh cong
        return res.json({ errCode: 0 });
      } else {
        return res.json({ errCode: -2 });
      }
    } catch (error) {
      return res.json({ errCode: -100 });
    }
  },

  getBaiTapManage: async (req, res) => {
    const params = req.params;
    const token = req.headers.author;
    try {
      //verify
      let data = await verify(token);
      if (!data) return res.json({ errCode: -2, msg: "" });
      ///
      let exam = await examModel.findOne({
        chuong: params.chuong,
        lesson: params.lesson,
      });
      if (exam) {
        return res.json({
          errCode: 0,
          data: {
            open: exam.open,
          },
        });
      } else {
        res.json({ errCode: -1 });
      }
    } catch (error) {
      console.log(error);
      res.json({ errCode: -100 });
    }
  },

  getListHasSignIn: async (req, res) => {
    const params = req.params;

    let allSignIn = await signInExamModel
      .find({
        chuong: params.chuong,
        lesson: params.lesson,
      })
      .select("mssv listQuestion updatedAt");
  },

  all: async (req, res) => {
    let data = await signInExamModel.find({
      chuong: "1",
      lesson: "1",
    });
    console.log(data);
    res.send(data);
  },
  dell: async (req, res) => {
    let data = await examModel.deleteMany({});
    res.send(data);
  },
};
