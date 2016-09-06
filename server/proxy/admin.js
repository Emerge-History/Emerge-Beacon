'use strict';

const rp = require('request-promise');
const config = require('../config');
const wechat = require('./wechat');
const admin = {};

// 简单封装一下post方法
let groupPost = async (url, data) => {
    let access_token = await wechat.getAccessToken();
    let options = {
        method: 'POST',
        uri: url,
        qs: {
            access_token: access_token
        },
        body: data,
        json: true
    };
    return rp(options);
}

// 新增分组
admin.groupAdd = (groupName) => {
    let url = 'https://api.weixin.qq.com/shakearound/device/group/add';
    let data = {
        group_name: groupName
    }
    return groupPost(url, data);
}

// 根据分组id 删除分组
admin.groupDelete = (groupId) => {
    let url = 'https://api.weixin.qq.com/shakearound/device/group/delete';
    let data = {
        group_id: groupId
    }
    return groupPost(url, data);
}

// 根据分组id 编辑分组名
admin.groupUpdate = (groupId, groupNewName) => {
    let url = 'https://api.weixin.qq.com/shakearound/device/group/update';
    let data = {
        group_id: groupId,
        group_name: groupNewName
    }
    return groupPost(url, data);
}

// 查询分组列表 可以分页
admin.groupList = (begin, count) => {
    let url = 'https://api.weixin.qq.com/shakearound/device/group/getlist';
    let data = {
        begin: begin,
        count: count
    }
    return groupPost(url, data);
}

// 查询分组详情 可以分页
admin.groupDetail = (groupId, begin, count) => {
    let url = 'https://api.weixin.qq.com/shakearound/device/group/getdetail';
    let data = {
        group_id: groupId,
        begin: begin,
        count: count
    }
    return groupPost(url, data);
}

// 添加设备到分组
admin.groupAddDevice = (groupId, deviceIdentifiers) => {
    let url = 'https://api.weixin.qq.com/shakearound/device/group/adddevice';
    let data = {
        group_id: groupId,
        device_identifiers: deviceIdentifiers
    }
    return groupPost(url, data);
}

// 从分组中移除设备
admin.groupDeleteDevice = (groupId, deviceIdentifiers) => {
    let url = 'https://api.weixin.qq.com/shakearound/device/group/deletedevice';
    let data = {
        group_id: groupId,
        device_identifiers: deviceIdentifiers
    }
    return groupPost(url, data);
}


module.exports = admin;
