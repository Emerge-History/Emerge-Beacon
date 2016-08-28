'use strict';

const express = require('express');
const all = require('./all');
const router = express.Router();
const auth = require('./middlewares');
const config = require('./config');

















router.get('/admin', (req, res, next) => {
	console.log('req.session', req.session);
	res.render('admin/index', {
		layout: false
	});
});

router.post('/admin', (req, res, next) => {
	console.log('req.session', req.session);
	if(req.body.username === config.adminName && req.body.password === config.adminPass){
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

router.get('/test', auth.adminRequired, (req, res, next) => {
	res.render('admin/index');
});






router.get('/', (req, res, next) => {
	res.send('a');
});

module.exports = router;
