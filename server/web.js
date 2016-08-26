'use strict';

let express = require('express');
let all = require('./all');

let router = express.Router();


/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });


router.get('/', function(req, res, next) {
	console.log(all.getAccessToken());
	res.send('x');
});


module.exports = router;
