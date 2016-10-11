"use strict";

var _config = require("../config");

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var fs = require("fs");
var path = require("path");
var Sequelize = require("sequelize");
const conf = _config2.default[_config2.default.env];
var sequelize = new Sequelize(conf.database, conf.username, conf.password, conf);
var db = {};

fs.readdirSync(__dirname).filter(function (file) {
  return file.indexOf(".") !== 0 && file !== "index.js";
}).forEach(function (file) {
  var model = sequelize.import(path.join(__dirname, file));
  db[model.name] = model;
});

Object.keys(db).forEach(function (modelName) {
  if ("associate" in db[modelName]) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;