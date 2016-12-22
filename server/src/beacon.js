const rp = require('request-promise');
const wechat = require('./wechat');
const beacon = {}
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
beacon.groupAdd = (req, res) => {
    let { groupName } = req.body;
    if (!groupName) {
        return res.json({
            msg: '分组名字不能为空',
            success: false
        })
    }
    let url = 'https://api.weixin.qq.com/shakearound/device/group/add';
    let data = {
        group_name: groupName
    }
    groupPost(url, data).then(result => {
        res.json(result);
    });
}

// 删除分组
beacon.groupDelete = (req, res) => {
    let { groupId } = req.body;
    if (!groupId) {
        return res.json({
            msg: 'id不能为空',
            success: false
        })
    }
	groupId = parseInt(groupId);

    let url = 'https://api.weixin.qq.com/shakearound/device/group/delete';
    let data = {
        group_id: groupId
    }
    groupPost(url, data).then(result => {
        res.json(result);
    });
}

// 根据分组id 编辑分组名
beacon.groupUpdate = (req, res) => {
    let { groupId, groupNewName } = req.body;
    if (!groupId) {
        return res.json({
            msg: 'id不能为空',
            success: false
        })
    }
    if(!groupNewName) {
        groupNewName = '未命名';
    }
	groupId = parseInt(groupId);

    let url = 'https://api.weixin.qq.com/shakearound/device/group/update';
    let data = {
        group_id: groupId,
        group_name: groupNewName
    }
    groupPost(url, data).then(result => {
        res.json(result);
    })
}

// 分组列表
beacon.groupList = (req, res) => {
    let url = 'https://api.weixin.qq.com/shakearound/device/group/getlist';
    let data = {
        begin: 0,
        count: 1000
    }
    groupPost(url, data).then(result => {
        res.json(result);
    });
}

// 设备列表
beacon.groupDetail = (req, res) => {
    let { groupId } = req.body;
    if (!groupId) {
        return res.json({
            msg: 'id不能为空',
            success: false
        })
    }
	groupId = parseInt(groupId);


    let url = 'https://api.weixin.qq.com/shakearound/device/group/getdetail';
    let data = {
        group_id: groupId,
        begin: 0,
        count: 1000
    }
    groupPost(url, data).then(result => {
        res.json(result);
    })
}

// 添加设备到分组
beacon.groupAddDevice = (req, res) => {
    let { groupId, deviceId } = req.body;
    if (!groupId) {
        return res.json({
            msg: 'id不能为空',
            success: false
        })
    }
	groupId = parseInt(groupId);
    try {
        deviceId = parseInt(deviceId);
    } catch(e) {
        deviceId = 0;
    }
    let deviceIdentifiers = []
    deviceIdentifiers.push({device_id: deviceId})

    let url = 'https://api.weixin.qq.com/shakearound/device/group/adddevice';
    let data = {
        group_id: groupId,
        device_identifiers: deviceIdentifiers
    }
    groupPost(url, data).then(result => {
        res.json(result);
		});
}

// 从分组中移除设备
beacon.groupDeleteDevice = (req, res) => {
    let { groupId, deviceIdentifiers } = req.body;
    if (!groupId) {
        return res.json({
            msg: 'id不能为空',
            success: false
        })
    }
	groupId = parseInt(groupId);

    let url = 'https://api.weixin.qq.com/shakearound/device/group/deletedevice';
    let data = {
        group_id: groupId,
        device_identifiers: deviceIdentifiers
    }
    groupPost(url, data).then(result => {
        res.json(result);
		});
}


export default beacon