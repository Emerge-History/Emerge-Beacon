'use strict';
let qs = require('qs');
let config = require('./config');
let request = require('request');
let fs = require('fs');
let util = {};
let sha1 = require('sha1');

util.getAccessToken = function () {
    let queryParams = {
        'grant_type': 'client_credential',
        'appid': config.appId,
        'secret': config.appSecret
    };

    let wxGetAccessTokenUrl = 'https://api.weixin.qq.com/cgi-bin/token?' + qs.stringify(queryParams);
    let options = {
        method: 'GET',
        url: wxGetAccessTokenUrl
    };
    return new Promise((resolve, reject) => {
        request(options, function (err, res, body) {
            if (res) {
                resolve(JSON.parse(body));
            } else {
                reject(err);
            }
        });
    })
};

util.saveTokenAndTicket = function () {
    this.getAccessToken().then(res => {
        let token = res['access_token'];
        let queryParams = {
            'access_token': token,
            'type': 'jsapi'
        };

        let wxGetTicketUrl = 'https://api.weixin.qq.com/cgi-bin/ticket/getticket?' + qs.stringify(queryParams);
        let options = {
            method: 'GET',
            url: wxGetTicketUrl
        };

        request(options, function (err, res, body) {
            if (res) {
                let ticket = JSON.parse(body).ticket;
                let file = JSON.stringify({
                    accessToken: token,
                    ticket: ticket
                });
                fs.writeFile('./file.json', file, function (err) {
                    // TODO 打印日志
                    // console.log(err);
                });
            } else {
                console.log(err);
            }
        });
    })
};

util.refreshTokenAndTicket = function () {
    this.saveTokenAndTicket();
    setInterval(function () {
        util.saveTokenAndTicket();
    }, 7000*1000);
};


util.getSign = function(jsApiTicket) {
  let data = {
    'jsapi_ticket': jsApiTicket,
    'noncestr': Math.random().toString(36).substr(2, 15),
    'timestamp': parseInt(new Date().getTime() / 1000) + '',
    'url': config.url
  };
  let sortData = "jsapi_ticket=" + data.jsapi_ticket + "&noncestr=" + data.noncestr + "&timestamp=" + data.timestamp + "&url=" + data.url;
  data.signature = sha1(sortData);
  return data;
}

util.getJsApiData = function () {
    let file = JSON.parse(fs.readFileSync('./file.json').toString());
    return this.getSign(file.ticket);
}


module.exports = util;