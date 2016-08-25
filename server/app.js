var express = require('express');
var util = require('./util');
var app = express();

app.use(express.static('../test'));

util.refreshTokenAndTicket();

app.get('/api', function (req, res) {
	res.json(util.getJsApiData());
});

var server = app.listen(80, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Example app listening at http://%s:%s', host, port);
});