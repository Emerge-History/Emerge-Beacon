'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  secret: 'shhhhhhared-secret',
  port: 3000,
  env: 'development',
  development: {
    dialect: 'sqlite',
    storage: _path2.default.join(__dirname, 'db')
  },
  test: {
    username: 'root',
    password: 'root',
    database: 'beacon_test'
  },
  production: {
    sqlite: 'db.production.sqlite',
    dialect: 'sqlite'
  }
};