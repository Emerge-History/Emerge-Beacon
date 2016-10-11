import jwt from 'jsonwebtoken'
import config from '../config'

const sign = {}


sign.login = (req, res) => {
  let {account, password} = req.query
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

sign.test = (req, res) => {
  console.log(req.user)
  res.json({
    msg: 'need login'
  })
}

export default sign 