import { Router } from 'express';
import config from './config';
import auth from './auth';
import jwt from 'express-jwt';
import wechat from './wechat';
import beacon from './beacon';

const router = Router();

/**
 * 登录
 * #Post /api/login
 */
router.post('/login', auth.login);

/**
 * 配置
 * #Post /api/config
 */
router.post('/config', wechat.getConfig);

// router.get('/test', jwt({secret: config.secret}), sign.test)

router.post('/groupAdd', beacon.groupAdd);
router.get('/groupList', beacon.groupList);
router.post('/groupDelete', beacon.groupDelete);
router.post('/groupUpdate', beacon.groupUpdate);
router.post('/groupDetail', beacon.groupDetail);
router.post('/groupAddDevice', beacon.groupAddDevice);
router.post('/groupDeleteDevice', beacon.groupDeleteDevice);

export default router;