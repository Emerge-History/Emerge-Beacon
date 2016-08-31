'use strict';

const express = require('express');
const all = require('./all');
const router = express.Router();
const auth = require('./middlewares');
const config = require('./config');
const socketIo = require('socket.io');

// admin 页面
router.get('/admin', (req, res, next) => {
	res.render('admin/index', {
		layout: false,
		isLogin: !!req.session.admin + ''
	});
});

// postion 页面
router.get('/admin/position', (req, res, next) => {
	res.render('admin/position', {
		layout: false,
		isLogin: !!req.session.admin + '',
		url: req.headers.host
	});
});

// admin 登录
router.post('/admin', (req, res, next) => {
	if (req.body.username === config.adminName && req.body.password === config.adminPass) {
		req.session.admin = 'true';
		res.json({
			status: 1,
			msg: '登录成功'
		});
	} else {
		res.json({
			status: 0,
			msg: '登录失败'
		});
	}
});

// 添加分组
router.get('/admin/group/add', (req, res, next) => {
	let groupName = req.query.groupName;
	all.groupAdd(groupName).then(result => {
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
    });
});

// 删除分组
router.get('/admin/group/delete', (req, res, next) => {
	let groupId = parseInt(req.query.groupId);
	all.groupDelete(groupId).then(result => {
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
});

// 显示分组
router.get('/admin/group/list', (req, res, next) => {
	all.groupList(0, 1000).then(result => {
		let content = result.data.groups;
		res.json({
			content: content
		})
	});
});

// 编辑分组
router.get('/admin/group/update', (req, res, next) => {
	let groupId = parseInt(req.query.groupId);
	let groupNewName = req.query.groupNewName;
	all.groupUpdate(groupId, groupNewName).then(result => {
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
});

// 获取该组详情
router.get('/admin/group/detail', (req, res, next) => {
	let groupId = parseInt(req.query.groupId);
	let page = req.query.page || 1;
	let count = page * config.pageSize;
	all.groupDetail(groupId, count-config.pageSize, count).then(result => {
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
});

// 添加设备到分组
router.get('/admin/group/adddevice', (req, res, next) => {
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
	all.groupAddDevice(groupId, deviceIdentifiers).then(result => {
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
});

// 从分组删除设备
router.get('/admin/group/deletedevice', (req, res, next) => {
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
	all.groupDeleteDevice(groupId, deviceIdentifiers).then(result => {
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
});

// 测试 adminRequired
router.get('/test', auth.adminRequired, (req, res, next) => {
	res.render('admin/index');
});

// ************************************************************************************

router.get('/h5/demo1', (req, res, next) => {
	// console.log(req.headers.host);
	let data = all.getWeixinConfig('http://kjdkanekv8.proxy.qqbrowser.cc/h5/demo1');
	res.render('h5/demo1', {
		layout: false,
		config: data
	});
});

router.get('/map/index', (req, res, next) => {
	let data = all.getWeixinConfig('http://kjdkanekv8.proxy.qqbrowser.cc/map/index');
	res.render('map/index', {
		layout: false,
		config: data,
		url: req.headers.host
	});
});


// 添加 socketIo
router.prepareSocketIO = function (server) {
    var io = socketIo.listen(server);
    io.sockets.on('connection', function (socket) {
		console.log('in')
		socket.on('beacons', function (data) {
			console.log('beacons', data)
			io.emit('news', data);
		});
    });

};






module.exports = router;
