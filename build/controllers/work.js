'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _models = require('../models');

var _models2 = _interopRequireDefault(_models);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const Work = _models2.default.Work;

const work = {};

work.list = (req, res, next) => {

  let countPerPage = 10,
      currentPage = req.query.page || 1;
  if (!/^[0-9]*$/.test(currentPage)) {
    currentPage = 1;
  }

  currentPage = Number(currentPage);

  Work.findAndCountAll({
    limit: countPerPage,
    offset: countPerPage * (currentPage - 1)
  }).then(result => {
    const data = {
      msg: '获取所有作品成功！',
      success: true,
      works: result.rows,
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

work.get = (req, res, next) => {
  const id = req.params.id;

  Work.findOne({ where: { id } }).then(work => {
    res.json({
      msg: '查询作品成功！',
      success: true,
      data: work
    });
  }).catch(err => {
    next(err);
  });
};

work.create = (req, res, next) => {
  var _req$body = req.body;
  let img = _req$body.img;
  let name = _req$body.name;
  let material = _req$body.material;
  let year = _req$body.year;
  let color = _req$body.color;
  let introduce = _req$body.introduce;
  let voice = _req$body.voice;
  let AuthorId = _req$body.AuthorId;
  let size = _req$body.size;

  Work.create({ img, name, material, year, color, introduce, voice, AuthorId, size }).then(work => {
    const data = {
      msg: '新建作品成功！',
      success: true,
      work
    };
    res.json(data);
  }).catch(err => {
    next(err);
  });
};

work.update = (req, res) => {
  const id = req.params.id;
  var _req$body2 = req.body;
  const img = _req$body2.img;
  const name = _req$body2.name;
  const material = _req$body2.material;
  const year = _req$body2.year;
  const color = _req$body2.color;
  const introduce = _req$body2.introduce;
  const voice = _req$body2.voice;
  const AuthorId = _req$body2.AuthorId;
  const size = _req$body2.size;

  Work.update({ img, name, material, year, color, introduce, voice, AuthorId, size }, { where: { id } }).then(() => {
    const data = {
      msg: '修改作品成功！',
      success: true
    };
    res.json(data);
  });
};

work.remove = (req, res, next) => {
  const id = req.params.id;

  Work.destroy({ where: { id } }).then(() => {
    res.json({
      msg: '删除作品成功！',
      success: true
    });
  }).catch(err => {
    next(err);
  });
};

exports.default = work;