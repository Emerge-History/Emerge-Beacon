const wechat = require('../proxy/wechat');

exports.demo1 = async (req, res) => {
	// console.log(req.headers.host + req.url);
	const data = await wechat.getConfig('http://kjdkanekv8.proxy.qqbrowser.cc/h5/demo1');
	res.render('h5/demo1', {
		layout: false,
		config: data
	});
}