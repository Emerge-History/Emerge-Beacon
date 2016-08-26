'use strict';

const fs = require('fs');
const sha1 = require('sha1');
const util = require('./util');
const config = require('./config');

let all = {};
let ACCESSTOKEN;
let TICKET;

function expand(func) {
  return function(res) {
    res = Array.isArray(res) ? res : [res];
    return func.apply(null, res);
  };
}


/**
 * 获取accessToken
 * @return {[type]} [json对象]
 */
all.getAccessToken = function () {
  let queryParams = {
    'grant_type': 'client_credential',
    'appid': config.appId,
    'secret': config.appSecret
  };  
  let url = 'https://api.weixin.qq.com/cgi-bin/token?';

  util.get(url, queryParams).then(expand((err, data) => {
    if(data) {
      return JSON.parse(data);
    } else {
      // err TODO
    }
  }));
}

/**
 * 获取ticket
 * @return {[type]} [json对象]
 */
all.getTicket = function (accessToken) {
  let queryParams = {
    'access_token': accessToken,
    'type': 'jsapi'
  };
  let url = 'https://api.weixin.qq.com/cgi-bin/ticket/getticket?';

  util.get(url, queryParams, function(err, data){
    if(data) {
      return JSON.parse(data);
    } else {
      // err TODO
    }
  });
}

/**
 * 保存accessToken ticket
 * @return {[type]} [null]
 */
all.saveSecret = function () {
  let accessToken;
  let ticket;
  
  let file = JSON.stringify({
    accessToken: accessToken,
    ticket: ticket
  });
  fs.writeFile('./file.json', file, function (err) {
    // err TODO
  });
}

/**
 * 更新accessToken ticket
 * @return {[type]} [null]
 */
all.refreshSecret = function () { 
  this.saveSecret();
  setInterval(this.saveSecret, 7000*1000);
}

/**
 * 读取accessToken ticket
 * @return {[type]} [json对象]
 */
all.readSecret = function () {
  let file;
  try {
    file = fs.readFileSync('./file.json', 'utf-8');
  } catch (err) {
    if (err.code !== 'ENOENT') throw e;
    this.refreshSecret();
  }
  return JSON.parse(file.toString());
}

/**
 * 返回weixin校验码
 * @param  {[type]} url [可以带参数但不能带#]
 * @return {[type]}     [description]
 */
all.getWeixinConfig = function (url) {
  let file = this.readSecret();
  let ticket = file.ticket;
  let noncestr = Math.random().toString(36).substr(2, 15);
  let timestamp = parseInt(new Date().getTime() / 1000) + '';

  let data = {
    'jsapi_ticket': ticket,
    'noncestr': noncestr,
    'timestamp': timestamp,
    'url': url
  };
  let sortData = "jsapi_ticket=" + ticket + "&noncestr=" + noncestr + "&timestamp=" + timestamp + "&url=" + url;
  data.signature = sha1(sortData);
  return data;
}

all.groupAdd = function () {

}

all.groupUpdate = function () {

}

all.groupDelete = function () {

}

all.groupList = function () {

}

all.groupDetail = function () {

}

all.groupAddDevice = function () {

}

all.groupDeleteDevice = function () {

}


module.exports = all;





