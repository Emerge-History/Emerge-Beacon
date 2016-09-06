'use strict';

const express = require('express');
const router = express.Router();
const h5 = require('./controllers/h5');
const admin = require('./controllers/admin');



router.get('/h5/demo1', h5.demo1);

router.get('/admin/login', admin.loginPage);

router.get('/admin/group/add', admin.groupAdd);
router.get('/admin/group/delete', admin.groupDelete);
router.get('/admin/group/update', admin.groupUpdate);
router.get('/admin/group/list', admin.groupList);
router.get('/admin/group/detail', admin.groupDetail);
router.get('/admin/group/adddevice', admin.groupAddDevice);
router.get('/admin/group/deletedevice', admin.groupDeleteDevice);





module.exports = router;