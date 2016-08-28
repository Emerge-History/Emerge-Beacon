'use strict';

const express = require('express');
const all = require('./all');
const router = express.Router();
const auth = require('./middlewares');
const config = require('./config');

router.get('/admin', (req, res, next) => {
	res.render('admin/index', {
		layout: false,
		isLogin: !!req.session.admin + ''
	});
});

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

router.get('/admin/group/list', (req, res, next) => {
	let page = req.query.page || 1;
	let count = page * config.pageSize;
	all.groupList(0, count).then(result => {
		let pages =  Math.ceil(result.data.total_count/10);
		let content = result.data.groups;
		res.json({
			pages: pages,
			content: content
		})
	});
});

router.get('/test', auth.adminRequired, (req, res, next) => {
	res.render('admin/index');
});

router.get('/', (req, res, next) => {
	res.send('a');
});

module.exports = router;
