'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _models = require('../models');

var _models2 = _interopRequireDefault(_models);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const Work = _models2.default.Work;
const Author = _models2.default.Author;

const sort = {};

const trim = str => {
    if (typeof str !== 'string') return '';
    return str.replace(/(^\s*)|(\s*$)/g, '');
};

sort.search = (req, res) => {
    let query = [];
    let params = req.body.params;

    params = trim(params);
    console.log(params);
    if (params) {
        query = params.split(' ');
    } else {
        return res.json({ msg: '参数不能为空', success: false, data: {} });
    }
    Work.findAll({
        where: {
            $or: [{ name: { $like: query[0] } }, { introduce: { $like: query[0] } }]
        }
    }).then(works => {
        res.json({
            works
        });
    });
};

sort.color = (req, res) => {};

exports.default = sort;