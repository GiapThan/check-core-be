const JWT = require("jsonwebtoken");
const examModel = require("../model/exam");
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
      let newSignIn = await signInExamModel.updateOne(
        {
          chuong: payload.chuong,
          lesson: payload.lesson,
          mssv: payload.mssv,
        },
        { listQuestion: payload.listQuestion }
      );
      console.log("newwww", newSignIn);
      if (newSignIn.modifiedCount !== 0) {
        //update thanh coong
        console.log("........updata thanh cong.........", newSignIn);
      } else {
        //tao moi
        let data = await signInExamModel.create(payload);
        if (data) {
          console.log("......tao moi thanh cong..........", data);
        }
      }
    } catch (error) {
      console.log(error);
      res.json({ errCode: -100 });
    }
  },

  all: async (req, res) => {
    let data = await signInExamModel.find({});
    res.send(data);
  },
  dell: async (req, res) => {
    let data = await signInExamModel.deleteMany({});
    res.send(data);
  },
};
