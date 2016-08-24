var https = require('https');
var config = require('./config');
var jsSHA = require('jssha');

var getAccessToken = function(cb) {
  https.get('https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=' + config.AppID + '&secret=' + config.AppSecret, function(result) {
    var dt = "";
    result.on('data', function(d){
    	dt += d.toString('utf8');
    });
    result.on('end', function(){
    	cb(dt);
    });
  });
}

var getTicket = function(ACCESSTOKEN, cb){
  https.get('https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=' + ACCESSTOKEN + '&type=jsapi', function(result) {
    var dt = "";
    result.on('data', function(d){
    	dt += d.toString('utf8');
    });
    result.on('end', function(){
    	cb(dt);
    });
  });
}




var createNonceStr = function () {
  return Math.random().toString(36).substr(2, 15);
};

var createTimestamp = function () {
  return parseInt(new Date().getTime() / 1000) + '';
};

var raw = function (args) {
  var keys = Object.keys(args);
  keys = keys.sort()
  var newArgs = {};
  keys.forEach(function (key) {
    newArgs[key.toLowerCase()] = args[key];
  });

  var string = '';
  for (var k in newArgs) {
    string += '&' + k + '=' + newArgs[k];
  }
  string = string.substr(1);
  return string;
};

/**
* @synopsis 签名算法 
*
* @param jsapi_ticket 用于签名的 jsapi_ticket
* @param url 用于签名的 url ，注意必须动态获取，不能 hardcode
*
* @returns
*/
var sign = function (jsapi_ticket, url) {
  var ret = {
    jsapi_ticket: jsapi_ticket,
    nonceStr: createNonceStr(),
    timestamp: createTimestamp(),
    url: url
  };
  var string = raw(ret);
  //var shaObj = new jsSHA(string, 'TEXT');
  //ret.signature = shaObj.getHash('SHA-1', 'HEX');

  return 'ret';
};

exports.sign = sign;
exports.getAccessToken = getAccessToken;
exports.getTicket = getTicket;