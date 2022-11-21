const JWT = require("jsonwebtoken");
const userModel = require("../model/user");

const accessKey = process.env.ACCESSKEY;
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
  all: async (req, res) => {
    let data = await userModel.find({});
    res.send(data);
  },
  dell: async (req, res) => {
    let data = await userModel.deleteMany({});
    res.send(data);
  },
};
