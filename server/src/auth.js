import jwt from 'jsonwebtoken';
import config from './config';

const auth = {};

auth.login = (req, res) => {
  const {account, password} = req.body;
  if (account === 'admin' && password === 'admin') {
    const token = jwt.sign({
      admin: true
    }, config.secret, {
      expiresIn: '30 days'
    })
    res.json({
      msg: '登录成功！',
      success: true,
      token: token
    })
  } else {
    res.json({
      msg: '登录失败！',
      success: false
    })
  }
}

export default auth;