'use strict';

const admin = require('../proxy/admin');

exports.loginPage = (req, res) => {
	res.render('admin-login', {
		title: 'dsffsd'
	});
}












// 添加分组
exports.groupAdd = (req, res) => {
    let groupName = req.query.groupName;
    admin.groupAdd(groupName).then(result => {
        if (result.errcode === 0) {
            result.status = 1;
            result.msg = '添加成功';
            res.json(result);
        } else {
            res.json({
                status: 0,
                msg: '添加失败，请稍后再试'
            });
        }
    });
}

// 删除分组
exports.groupDelete = (req, res) => {
	let groupId = parseInt(req.query.groupId);
	admin.groupDelete(groupId).then(result => {
		if(result.errcode === 0) {
			result.status = 1;
			result.msg = '删除成功';
			res.json(result);
		} else {
			res.json({
				status: 0,
				msg: '删除失败，请稍后再试'
			});
		}
    });
}

// 编辑分组
exports.groupUpdate = (req, res) => {
	let groupId = parseInt(req.query.groupId);
	let groupNewName = req.query.groupNewName;
	admin.groupUpdate(groupId, groupNewName).then(result => {
		if(result.errcode === 0) {
			result.status = 1;
			result.msg = '修改成功';
			res.json(result);
		} else {
			res.json({
				status: 0,
				msg: '修改失败，请稍后再试'
			});
		}
	});
}

// 分组列表
exports.groupList = (req, res) => {
	admin.groupList(0, 1000).then(result => {
		let content = result.data.groups;
		res.json({
			content: content
		})
	});
}

// 获取该组详情
exports.groupDetail = (req, res) => {
	let groupId = parseInt(req.query.groupId);
	let page = req.query.page || 1;
	let count = page * config.pageSize;
	admin.groupDetail(groupId, count-config.pageSize, count).then(result => {
		let pages =  Math.ceil(result.data.total_count/10);
		let devices = result.data.devices;
		if(result.errcode === 0) {
			result.status = 1;
			result.msg = '查询成功';
			result.pages = pages;
			result.devices = devices;
			res.json(result);
		} else {
			res.json({
				status: 0,
				msg: '查询失败，请稍后再试',
				pages: 0
			});
		}
	});
}

// 添加设备到分组
exports.groupAddDevice = (req, res) => {
	let groupId = parseInt(req.query.groupId);
	let deviceStr = req.query.deviceStr;
	let deviceArr = deviceStr.split(',');
	let deviceIdentifiers = [];
	for(let i=0; i<deviceArr.length; i++) {
		let temp = {
			device_id: deviceArr[i]
		}
		deviceIdentifiers.push(temp);
	}
	admin.groupAddDevice(groupId, deviceIdentifiers).then(result => {
		if(result.errcode === 0) {
			result.status = 1;
			result.msg = '添加成功';
			res.json(result);
		} else {
			res.json({
				status: 0,
				msg: '添加失败，请稍后再试'
			});
		}
	})
}

// 从分组删除设备
exports.groupDeleteDevice = (req, res) => {
	let groupId = parseInt(req.query.groupId);
	let deviceStr = req.query.deviceStr;
	let deviceArr = deviceStr.split(',');
	let deviceIdentifiers = [];
	for(let i=0; i<deviceArr.length; i++) {
		let temp = {
			device_id: deviceArr[i]
		}
		deviceIdentifiers.push(temp);
	}
	admin.groupDeleteDevice(groupId, deviceIdentifiers).then(result => {
		if(result.errcode === 0) {
			result.status = 1;
			result.msg = '添加成功';
			res.json(result);
		} else {
			res.json({
				status: 0,
				msg: '添加失败，请稍后再试'
			});
		}
	})
}