const JWT = require('jsonwebtoken');
const userModel = require('../model/user');
const examModel = require('../model/exam');

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
    try {
      let data = await userModel.findOne({ mssv: payload.mssv });
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
          { stars: { pre: payload.diem } },
        );
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
      if (!result || result.role !== '00') return res.json({ errCode: -1 });

      let user = await userModel.findOne({ mssv: payload.mssv });

      const today = new Date().toLocaleDateString();
      if (today in user.stars) {
        user.stars[today] = +user.stars[today] + 1;
      } else {
        user.stars[today] = 1;
      }

      let resultUpdate = await userModel.updateOne(
        { mssv: payload.mssv },
        { stars: user.stars },
      );

      if (!payload.chuong) {
        if (resultUpdate) return res.json({ errCode: 0 });
        return res, json({ errCode: -1 });
      }

      let exam = await examModel.findOne({
        chuong: payload.chuong,
        lesson: payload.lesson,
      });
      let newHasPass = exam.questionHasPass;
      newHasPass[payload.cauhoi] = payload.mssv;
      result = await examModel.updateOne(
        { chuong: payload.chuong, lesson: payload.lesson },
        { questionHasPass: newHasPass },
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
};
