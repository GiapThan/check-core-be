const JWT = require('jsonwebtoken');
const userModel = require('../model/user');

const accessKey = process.env.ACCESSKEY;
const refreshKey = process.env.REFRESHKEY;
const verify = async (token, type = 'access') => {
  let key = accessKey;
  if (type === 'refresh') {
    key = refreshKey;
  }
  try {
    let data = await JWT.verify(token, key);
    return data;
  } catch (error) {
    return false;
  }
};

module.exports = {
  /* 
  refreshToken: async (req, res, next) => {
    const token = req.cookies['refreshToken'];
    if (!token) return res.json({ errCode: -1 });
    try {
      let result = await verify(token, 'refresh');
      // {name, mssv, role}
      if (result) {
        let data = JWT.sign(
          {
            name: result.name,
            mssv: result.mssv,
            role: result.role,
          },
          accessKey,
          { expiresIn: '1d' },
        );
        return res.json({
          errCode: 0,
          data: {
            accessToken: data,
            name: result.name,
            mssv: result.mssv,
            role: result.role,
          },
        });
      }
    } catch (error) {
      res.json({ errCode: -100 });
    }
  }, */

  login: async (req, res) => {
    const payload = req.body;
    let data;
    let refreshToken;
    try {
      const preUser = await userModel.findOne({ mssv: payload.mssv });
      if (preUser) {
        //  có điểm nhưng chưa có pass
        if (preUser.password === '') {
          const newUser = await userModel.updateOne(
            { mssv: preUser.mssv },
            { password: payload.password },
          );
          let accessToken = JWT.sign(
            { name: preUser.name, mssv: preUser.mssv, role: preUser.role },
            accessKey,
            { expiresIn: '1d' },
          );
          refreshToken = JWT.sign(
            {
              name: preUser.name,
              mssv: preUser.mssv,
              role: preUser.role,
            },
            refreshKey,
            { expiresIn: '14d' },
          );
          data = {
            errCode: 0,
            msg: 'ok',
            data: {
              name: newUser.name,
              mssv: newUser.mssv,
              stars: newUser.stars,
              accessToken: accessToken,
              role: newUser.role,
            },
          };
        }
        // có điểm và có pass
        else if (preUser.password === payload.password) {
          let token = JWT.sign(
            { name: preUser.name, mssv: preUser.mssv, role: preUser.role },
            accessKey,
            { expiresIn: '1d' },
          );
          refreshToken = JWT.sign(
            { name: preUser.name, mssv: preUser.mssv, role: preUser.role },
            refreshKey,
            { expiresIn: '14d' },
          );
          data = {
            errCode: 0,
            msg: 'ok',
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
          data = { errCode: -1, msg: 'fail' };
        }
      } else {
        //chưa có thong tin
        const newUser = await userModel.create(payload);
        let accessToken = JWT.sign(
          { name: newUser.name, mssv: newUser.mssv, role: newUser.role },
          accessKey,
          { expiresIn: '1d' },
        );
        refreshToken = JWT.sign(
          { name: newUser.name, mssv: newUser.mssv, role: newUser.role },
          refreshKey,
          { expiresIn: '14d' },
        );
        data = {
          errCode: 0,
          msg: 'ok',
          data: {
            name: newUser.name,
            mssv: newUser.mssv,
            stars: newUser.stars,
            accessToken: accessToken,
            role: newUser.role,
          },
        };
      }
      return res
        .cookie('refreshToken', refreshToken, {
          sameSite: 'strict',
          expires: new Date(new Date().getTime() + 14 * 24 * 60 * 60 * 1000),
          httpOnly: true,
        })
        .json(data);
    } catch (error) {
      console.log(error);
      res.json({ errCode: -100 });
    }
  },

  insertName: async (req, res) => {
    let { name, mssv } = req.body;
    try {
      let user = await userModel.findOneAndUpdate({ mssv }, { name: name });
      let accessToken = JWT.sign(
        { name: name, mssv: user.mssv, role: user.role },
        accessKey,
        {
          expiresIn: '1d',
        },
      );
      let refreshToken = JWT.sign(
        { name: name, mssv: user.mssv, role: user.role },
        refreshKey,
        {
          expiresIn: '14d',
        },
      );
      res
        .cookie('refreshToken', refreshToken, {
          sameSite: 'strict',
          expires: new Date(new Date().getTime() + 14 * 24 * 60 * 60 * 1000),
          httpOnly: true,
        })
        .json({
          errCode: 0,
          msg: 'ok',
          data: {
            name: user.name,
            accessToken: accessToken,
            role: user.role,
          },
        });
    } catch (error) {
      res.json({ errCode: -100 });
    }
  },

  getUserInfor: async (req, res) => {
    const params = req.params;
    try {
      let data = await verify(req.headers.author);
      if (!data) return res.json({ errCode: -1 });

      let user = await userModel
        .findOne({ mssv: params.mssv })
        .select('-_id mssv name stars');
      if (user) {
        return res.json({ errCode: 0, data: user });
      }

      return res.json({ errCode: -1 });
    } catch (error) {
      res.json({ error: -100 });
    }
  },

  getAllUserInfor: async (req, res) => {
    try {
      let data = await verify(req.headers.author);
      if (data.role !== '00') return res.json({ errCode: -1 });

      let listUser = await userModel.find().select('-_id mssv name stars');

      if (listUser) {
        listUser.map((element, index) => {
          //element = {mssv: '', name: '', stars: { pre: 0, '11/11': 3 }}
          let stars = element.stars; // object

          let totalStar = Object.keys(stars).reduce(
            (accumulator, currentValue) => +accumulator + +stars[currentValue],
            0,
          );

          listUser[index].stars = totalStar;
          listUser.sort((a, b) => a.mssv - b.mssv);
        });
        return res.json({ errCode: 0, data: listUser });
      }

      return res.json({ errCode: -1 });
    } catch (error) {
      res.json({ error: -100 });
    }
  },

  logout: async (req, res) => {
    console.log(req.headers.author);
    try {
      let data = await verify(req.headers.author);
      if (!data) return res.json({ errCode: -1 });
      return res.clearCookie('refreshToken').json({ errCode: 0 });
    } catch (error) {
      res.json({ errCode: -100 });
    }
  },
};
