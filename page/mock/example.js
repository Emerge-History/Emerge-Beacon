'use strict';

module.exports = {

  'GET /api/login': function (req, res) {

    console.log(req.query)

    if (req.query.account === 'admin' && req.query.password === 'admin'){
      setTimeout(function () {
        res.json({
          success: true,
          token:'asdiwehjcuwoew1244bf8asf32bu9x3',
          msg: '登录成功'
        });
      }, 500);
    }
    if(!req.query || req.query.account !== 'admin' || req.query.password !== 'admin') {
      setTimeout(function () {
        res.json({
          success: false,
          msg: '登录失败'
        });
      }, 500);
    }


  },

};
