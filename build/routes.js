'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _sign = require('./controllers/sign');

var _sign2 = _interopRequireDefault(_sign);

var _author = require('./controllers/author');

var _author2 = _interopRequireDefault(_author);

var _work = require('./controllers/work');

var _work2 = _interopRequireDefault(_work);

var _sort = require('./controllers/sort');

var _sort2 = _interopRequireDefault(_sort);

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

var _expressJwt = require('express-jwt');

var _expressJwt2 = _interopRequireDefault(_expressJwt);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _uuid = require('uuid');

var _uuid2 = _interopRequireDefault(_uuid);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const router = (0, _express.Router)();

router.get('/', (req, res) => {
  res.json({ msg: 'hello' });
});

router.get('/login', _sign2.default.login);
router.get('/test', (0, _expressJwt2.default)({ secret: _config2.default.secret }), _sign2.default.test);

router.get('/authors', _author2.default.list);
router.get('/authors/:id', _author2.default.get);
router.post('/authors', _author2.default.create);
router.put('/authors/:id', _author2.default.update);
router.delete('/authors/:id', _author2.default.remove);
router.get('/getSelectAllAuthors', _author2.default.getSelectAllAuthors);

router.get('/works', _work2.default.list);
router.get('/works/:id', _work2.default.get);
router.post('/works', _work2.default.create);
router.put('/works/:id', _work2.default.update);
router.delete('/works/:id', _work2.default.remove);

router.post('/search', _sort2.default.search);
router.get('/color', _sort2.default.color);

router.post('/upload', function (req, res) {
  const prefix = _uuid2.default.v1() + '.jpg';
  if (!req.files) {
    res.send('No files were uploaded.');
    return;
  }
  const sampleFile = req.files.file;
  sampleFile.mv(__dirname + '/public/upload/' + prefix, function (err) {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json({
        success: true,
        msg: '图片上传成功！',
        data: {
          url: 'http://localhost:3000/upload/' + prefix
        }
      });
    }
  });
});

exports.default = router;