'use strict';

const wechat = require('../proxy/wechat');

exports.demo1 = (req, res) => {
	// console.log(req.headers.host + req.url);
	wechat.getConfig('http://kjdkanekv8.proxy.qqbrowser.cc/h5/demo1', (data) => {
		res.render('h5/demo1', {
			layout: false,
			config: data
		});
	});
}