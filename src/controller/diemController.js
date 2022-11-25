const JWT = require("jsonwebtoken");
const userModel = require("../model/user");

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
    const payload = req.body;
    const token = req.headers.author;
    try {
      let result = await verify(token);
      if (!result || result.role !== "00") return res.json({ errCode: -1 });
      let { stars } = await userModel.findOne({ mssv: payload.mssv });
      let newStars = {};
      const today = new Date().toLocaleDateString();
      Object.keys(stars).map((key) => {
        if (key == today) {
          console.log("yes");
          newStars[key] = +stars[key] + 1;
        } else {
          console.log("no");
          newStars[today] = 1;
        }
      });
      let resultUpdate = await userModel.updateOne(
        { mssv: payload.mssv },
        { stars: newStars }
      );
      if (resultUpdate.modifiedCount !== 0) {
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
