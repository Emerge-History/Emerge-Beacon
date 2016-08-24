var express = require('express');
var util = require('./util');
var app = express();

// 缓存accessToken 7200更新一次
var ACCESSTOKEN = '';
util.getAccessToken(function(result) {
	var _result = JSON.parse(result);
	ACCESSTOKEN = _result.access_token;
});
setInterval(function(){
	util.getAccessToken(function(result) {
		var _result = JSON.parse(result);
		ACCESSTOKEN = _result.access_token;
	});
}, 7200);


app.get('/', function (req, res) {
	util.getTicket(ACCESSTOKEN, function(result) {
		var _result = JSON.parse(result);
		console.log(util.sign(_result.ticket, 'http://circuitpot.com'));
		res.json({})
	})
});

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Example app listening at http://%s:%s', host, port);
});