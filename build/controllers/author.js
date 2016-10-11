'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _models = require('../models');

var _models2 = _interopRequireDefault(_models);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const Author = _models2.default.Author;
const Work = _models2.default.Work;
const author = {};

author.getSelectAllAuthors = (req, res, next) => {
  Author.findAll({
    'attributes': ['id', 'name']
  }).then(result => {
    res.json({ result });
  });
};

author.list = (req, res, next) => {

  let countPerPage = 10,
      currentPage = req.query.page || 1;
  if (!/^[0-9]*$/.test(currentPage)) {
    currentPage = 1;
  }

  currentPage = Number(currentPage);

  Author.findAndCountAll({
    limit: countPerPage,
    offset: countPerPage * (currentPage - 1)
  }).then(result => {
    const data = {
      msg: '获取所有作者成功！',
      success: true,
      authors: result.rows,
      page: {
        total: result.count,
        current: currentPage
      }
    };
    res.json(data);
  }).catch(err => {
    next(err);
  });
};

author.get = (req, res, next) => {
  const id = req.params.id;

  Author.findOne({ where: { id } }).then(author => {
    res.json({
      msg: '查询作者成功！',
      success: true,
      data: author
    });
  }).catch(err => {
    next(err);
  });
};

author.create = (req, res, next) => {
  var _req$body = req.body;
  let avator = _req$body.avator;
  let name = _req$body.name;
  let nickname = _req$body.nickname;
  let sex = _req$body.sex;
  let age = _req$body.age;
  let introduce = _req$body.introduce;

  Author.create({ avator, name, nickname, sex, age, introduce }).then(author => {
    const data = {
      msg: '新建作者成功！',
      success: true,
      author
    };
    res.json(data);
  }).catch(err => {
    next(err);
  });
};

author.update = (req, res) => {
  const id = req.params.id;
  var _req$body2 = req.body;
  const avator = _req$body2.avator;
  const name = _req$body2.name;
  const nickname = _req$body2.nickname;
  const sex = _req$body2.sex;
  const age = _req$body2.age;
  const introduce = _req$body2.introduce;

  Author.update({ avator, name, nickname, sex, age, introduce }, { where: { id } }).then(() => {
    const data = {
      msg: '修改作者成功！',
      success: true
    };
    res.json(data);
  });
};

author.remove = (() => {
  var _ref = _asyncToGenerator(function* (req, res, next) {
    const id = req.params.id;

    yield Work.destroy({ where: { AuthorId: id } }).then(function () {}).catch(function (err) {
      next(err);
    });

    Author.destroy({ where: { id } }).then(function () {
      res.json({
        msg: '删除作者成功！',
        success: true
      });
    }).catch(function (err) {
      next(err);
    });
  });

  return function (_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
})();

exports.default = author;