'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _compression = require('compression');

var _compression2 = _interopRequireDefault(_compression);

var _helmet = require('helmet');

var _helmet2 = _interopRequireDefault(_helmet);

var _morgan = require('morgan');

var _morgan2 = _interopRequireDefault(_morgan);

var _routes = require('./routes');

var _routes2 = _interopRequireDefault(_routes);

var _cors = require('cors');

var _cors2 = _interopRequireDefault(_cors);

var _models = require('./models');

var _models2 = _interopRequireDefault(_models);

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

var _expressFileupload = require('express-fileupload');

var _expressFileupload2 = _interopRequireDefault(_expressFileupload);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const app = (0, _express2.default)();

// use middlewares
app.use(_bodyParser2.default.json());
app.use(_bodyParser2.default.urlencoded({ extended: false }));
app.use((0, _compression2.default)());
app.use((0, _helmet2.default)());
app.use((0, _cors2.default)());
app.use((0, _morgan2.default)('dev'));
app.use((0, _expressFileupload2.default)());
app.use('/upload', _express2.default.static(_path2.default.join(__dirname, 'public/upload')));

app.use('/admin', _express2.default.static(_path2.default.join(__dirname, 'public/admin')));

// routes 
app.use('/api', _routes2.default);

// error handlers
app.use((req, res, next) => {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    msg: err.message,
    err: err
  });
});

// create tables
_models2.default.sequelize.sync().then(() => {
  // server
  let server = app.listen(_config2.default.port, () => {
    console.log('server running on port:' + _config2.default.port);
  });
  server.on('error', error => {
    if (error.syscall !== 'listen') {
      throw error;
    }
    switch (error.code) {
      case 'EACCES':
        console.error('requires elevated privileges');
        process.exit(1);
        break;
      case 'EADDRINUSE':
        console.error('is already in use');
        process.exit(1);
        break;
      default:
        console.log(error);
        throw error;
    }
  });
});