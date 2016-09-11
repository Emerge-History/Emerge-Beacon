'use strict';

const express = require('express');
const router = express.Router();
const h5 = require('./controllers/h5');
const admin = require('./controllers/admin');
const middlewares = require('./middlewares');


router.get('/h5/demo1', h5.demo1);

// admin
router.get('/admin/login', admin.loginPage);
router.post('/admin/login', admin.login);
router.get('/admin', middlewares.adminRequiredRedict, admin.indexPage);
router.get('/admin/group/add', middlewares.adminRequiredJson, admin.groupAdd);
router.get('/admin/group/delete', middlewares.adminRequiredJson, admin.groupDelete);
router.get('/admin/group/update', middlewares.adminRequiredJson, admin.groupUpdate);
router.get('/admin/group/list', middlewares.adminRequiredJson, admin.groupList);
router.get('/admin/group/detail', middlewares.adminRequiredJson, admin.groupDetail);
router.get('/admin/group/adddevice', middlewares.adminRequiredJson, admin.groupAddDevice);
router.get('/admin/group/deletedevice', middlewares.adminRequiredJson, admin.groupDeleteDevice);





module.exports = router;