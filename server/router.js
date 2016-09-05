'use strict';

const express = require('express');
const router = express.Router();
const h5 = require('./controllers/h5');




// demo1 页面
router.get('/h5/demo1', h5.demo1);




module.exports = router;