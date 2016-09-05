'use strict';

const sha1 = require('sha1');
const rp = require('request-promise');
const config = require('../config');
const wechat = {};

let ACCESSTOKEN, TICKET;
let timestampForToken, timestampForTicket;

// 获取 accessToken
wechat.getAccessToken = () => new Promise((resolve) => {
    const options = {
        uri: 'https://api.weixin.qq.com/cgi-bin/token',
        qs: {
            grant_type: 'client_credential',
            appid: config.appId,
            secret: config.appSecret
        },
        json: true
    };
    const now = new Date().getTime();
    if (!ACCESSTOKEN || !timestampForToken || timestampForToken + 7000*1000 < now) { 
        rp(options).then(result => {
            timestampForToken = new Date().getTime();
            ACCESSTOKEN = result.access_token;
            resolve(ACCESSTOKEN);
        })
    } else {
        resolve(ACCESSTOKEN);
    }
});

// 获取 ticket
wechat.getTicket = () => new Promise((resolve) => {
    const options = {
        uri: 'https://api.weixin.qq.com/cgi-bin/ticket/getticket',
        qs: {
            access_token: ACCESSTOKEN,
            type: 'jsapi'
        },
        json: true
    };
    const now = new Date().getTime();
    if (!TICKET || !timestampForTicket || timestampForTicket + 7000*1000 < now) {
        rp(options).then(result => {
            timestampForTicket = new Date().getTime();
            TICKET = result.ticket;
            resolve(TICKET);
        })
    } else {
        resolve(TICKET);
    }
});

// 接收一个 url 并返回 wechat config
wechat.getConfig = async (url) => {
    await wechat.getAccessToken();
    const jsapiTicket = await wechat.getTicket();
    const noncestr = Math.random().toString(36).substr(2, 15);
    const timestamp = String(parseInt(new Date().getTime() / 1000, 10));
    let data = {
        jsapi_ticket: jsapiTicket,
        noncestr: noncestr,
        timestamp: timestamp,
        url: url
    };
    const sortData = "jsapi_ticket=" + jsapiTicket + "&noncestr=" + noncestr + "&timestamp=" + timestamp + "&url=" + url;
    data.signature = sha1(sortData);
    return data;
}

module.exports = wechat;