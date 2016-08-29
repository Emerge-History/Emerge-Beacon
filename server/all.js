'use strict';

const sha1 = require('sha1');
const rp = require('request-promise');
const util = require('./util');
const config = require('./config');

let all = {};
let ACCESSTOKEN, TICKET;

// 获取 accessToken
all.getAccessToken = () => {
    let options = {
        uri: 'https://api.weixin.qq.com/cgi-bin/token',
        qs: {
            grant_type: 'client_credential',
            appid: config.appId,
            secret: config.appSecret
        },
        json: true
    };
    return rp(options);
}

// 获取 ticket
all.getTicket = () => {
    let options = {
        uri: 'https://api.weixin.qq.com/cgi-bin/ticket/getticket',
        qs: {
            access_token: ACCESSTOKEN,
            type: 'jsapi'
        },
        json: true
    };
    return rp(options);
}

// 缓存 accessToken ticket
all.cacheSecret = function () {
    this.getAccessToken()
        .then(result => {
            ACCESSTOKEN = result.access_token;
            return this.getTicket();
        })
        .then(result => {
            TICKET = result.ticket;
        })
}

// 更新 accessToken ticket
all.refreshSecret = function () {
    let _this = this;
    let loop = () => {
        _this.cacheSecret();
        setTimeout(loop, 7000 * 1000);
    }
    loop();
}

// 接收一个 url 并返回 weixin config
all.getWeixinConfig = (url) => {
    let noncestr = Math.random().toString(36).substr(2, 15);
    let timestamp = parseInt(new Date().getTime() / 1000) + '';
    let data = {
        jsapi_ticket: TICKET,
        noncestr: noncestr,
        timestamp: timestamp,
        url: url
    };
    let sortData = "jsapi_ticket=" + TICKET + "&noncestr=" + noncestr + "&timestamp=" + timestamp + "&url=" + url;
    data.signature = sha1(sortData);
    return data;
}

// 新增分组
all.groupAdd = (groupName) => {
    let url = 'https://api.weixin.qq.com/shakearound/device/group/add';
    let data = {
        group_name: groupName
    }
    return util.groupPost(url, data, ACCESSTOKEN);
}

// 根据分组id 删除分组
all.groupDelete = (groupId) => {
    let url = 'https://api.weixin.qq.com/shakearound/device/group/delete';
    let data = {
        group_id: groupId
    }
    return util.groupPost(url, data, ACCESSTOKEN);
}

// 根据分组id 编辑分组名
all.groupUpdate = (groupId, groupNewName) => {
    let url = 'https://api.weixin.qq.com/shakearound/device/group/update';
    let data = {
        group_id: groupId,
        group_name: groupNewName
    }
    return util.groupPost(url, data, ACCESSTOKEN);
}

// 查询分组列表 可以分页
all.groupList = (begin, count) => {
    let url = 'https://api.weixin.qq.com/shakearound/device/group/getlist';
    let data = {
        begin: begin,
        count: count
    }
    return util.groupPost(url, data, ACCESSTOKEN);
}

// 查询分组详情 可以分页
all.groupDetail = (groupId, begin, count) => {
    let url = 'https://api.weixin.qq.com/shakearound/device/group/getdetail';
    let data = {
        group_id: groupId,
        begin: begin,
        count: count
    }
    return util.groupPost(url, data, ACCESSTOKEN);
}

// 添加设备到分组
all.groupAddDevice = (groupId, deviceIdentifiers) => {
    let url = 'https://api.weixin.qq.com/shakearound/device/group/adddevice';
    let data = {
        group_id: groupId,
        device_identifiers: deviceIdentifiers
    }
    return util.groupPost(url, data, ACCESSTOKEN);
}

// 从分组中移除设备
all.groupDeleteDevice = (groupId, deviceIdentifiers) => {
    let url = 'https://api.weixin.qq.com/shakearound/device/group/deletedevice';
    let data = {
        group_id: groupId,
        device_identifiers: deviceIdentifiers
    }
    return util.groupPost(url, data, ACCESSTOKEN);
}

// 调用
all.refreshSecret();

module.exports = all;