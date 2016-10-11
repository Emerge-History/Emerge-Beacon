'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _config = require('../config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const sign = {};

sign.login = (req, res) => {
  var _req$query = req.query;
  let account = _req$query.account;
  let password = _req$query.password;

  if (account === 'admin' && password === 'admin') {
    const token = _jsonwebtoken2.default.sign({
      admin: true
    }, _config2.default.secret, {
      expiresIn: '30 days'
    });
    res.json({
      msg: '登录成功！',
      success: true,
      token: token
    });
  } else {
    res.json({
      msg: '登录失败！',
      success: false
    });
  }
};

sign.test = (req, res) => {
  console.log(req.user);
  res.json({
    msg: 'need login'
  });
};

exports.default = sign;