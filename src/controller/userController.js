const JWT = require("jsonwebtoken");
const userModel = require("../model/user");

const accessKey = process.env.ACCESSKEY;
module.exports = {
  login: async (req, res) => {
    const payload = req.body;
    let data;
    try {
      const preUser = await userModel.findOne({ mssv: payload.mssv });
      if (preUser) {
        //  có điểm nhưng chưa có pass
        if (preUser.password === "") {
          const newUser = await userModel.updateOne(
            { mssv: preUser.mssv },
            { password: payload.password }
          );
          let token = JWT.sign(
            { name: preUser.name, mssv: preUser.mssv, role: preUser.role },
            accessKey,
            { expiresIn: "1d" }
          );
          data = {
            errCode: 0,
            msg: "ok",
            data: {
              name: newUser.name,
              mssv: newUser.mssv,
              stars: newUser.stars,
              accessToken: token,
              role: newUser.role,
            },
          };
        }
        // có điểm và có pass
        else if (preUser.password === payload.password) {
          let token = JWT.sign(
            { name: preUser.name, mssv: preUser.mssv, role: preUser.role },
            accessKey,
            { expiresIn: "1d" }
          );
          data = {
            errCode: 0,
            msg: "ok",
            data: {
              name: preUser.name,
              mssv: preUser.mssv,
              stars: preUser.stars,
              accessToken: token,
              role: preUser.role,
            },
          };
        } else {
          //        sai pass
          data = { errCode: -1, msg: "fail" };
        }
      } else {
        //chưa có điểm
        const newUser = await userModel.create(payload);
        let token = JWT.sign(
          { name: newUser.name, mssv: newUser.mssv, role: newUser.role },
          accessKey,
          { expiresIn: "1d" }
        );
        data = {
          errCode: 0,
          msg: "ok",
          data: {
            name: newUser.name,
            mssv: newUser.mssv,
            stars: newUser.stars,
            accessToken: token,
            role: newUser.role,
          },
        };
      }
      return res.json(data);
    } catch (error) {
      console.log(error);
      res.json({ errCode: -100 });
    }
  },

  insertName: async (req, res) => {
    let { name, mssv } = req.body;
    try {
      let user = await userModel.findOneAndUpdate({ mssv }, { name: name });
      let token = JWT.sign(
        { name: name, mssv: user.mssv, role: user.role },
        accessKey,
        {
          expiresIn: "1d",
        }
      );
      res.json({
        errCode: 0,
        msg: "ok",
        data: {
          name: user.name,
          accessToken: token,
          role: user.role,
        },
      });
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
