const JWT = require("jsonwebtoken");
const userModel = require("../model/user");
const examModel = require("../model/exam");

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
  insert: async (req, res) => {
    let payload = req.body;
    console.log(payload);
    try {
      let data = await userModel.findOne({ mssv: payload.mssv });
      console.log(data);
      if (!data) {
        let newUser = await userModel.create({
          mssv: payload.mssv,
          stars: { pre: payload.diem },
        });
        if (newUser) {
          return res.json({ errCode: 0 });
        }
      } else {
        let a = await userModel.updateOne(
          { mssv: payload.mssv },
          { stars: { pre: payload.diem } }
        );
        console.log(a);
        if (a.modifiedCount !== 0) {
          return res.json({ errCode: 0 });
        } else {
          return res.json({ errCode: -1 });
        }
      }
    } catch (error) {
      res.json({ errCode: -100 });
    }
  },

  incDiem: async (req, res) => {
    const payload = req.body; // {mssv: '123', cauhoi: '1a'}
    const token = req.headers.author;
    try {
      let result = await verify(token);
      if (!result || result.role !== "00") return res.json({ errCode: -1 });
      let user = await userModel.findOne({ mssv: payload.mssv });

      let newStars = {};
      const today = new Date().toLocaleDateString();
      console.log("today", today);
      console.log("stars", user.stars);
      Object.keys(user.stars).map((key) => {
        if (key == today) {
          console.log("=");
          console.log("temp", newStars[key]);
          console.log("temp", +user.stars[key]);
          newStars[key] = +user.stars[key] + 1;
          console.log("temp after", newStars[key]);
        } else {
          console.log("!=");
          newStars = { ...user.stars };
          newStars[today] = newStars[today] || 1;
        }
        console.log(newStars);
      });
      console.log("sau cung", newStars);
      let resultUpdate = await userModel.updateOne(
        { mssv: payload.mssv },
        { stars: newStars }
      );

      let exam = await examModel.findOne({
        chuong: payload.chuong,
        lesson: payload.lesson,
      });
      let newHasPass = exam.questionHasPass;
      newHasPass[payload.cauhoi] = payload.mssv;
      result = await examModel.updateOne(
        { chuong: payload.chuong, lesson: payload.lesson },
        { questionHasPass: newHasPass }
      );

      if (resultUpdate.modifiedCount !== 0 && result.modifiedCount !== 0) {
        return res.json({ errCode: 0 });
      }
      return res.json({ errCode: -1 });
    } catch (error) {
      console.log(error);
      return res.json({ errCode: -100 });
    }
  },

  all: async (req, res) => {
    let data = await userModel.find({});
    res.send(data);
  },
  dell: async (req, res) => {
    let data = await userModel.deleteMany({});
    res.send(data);
  },
};
