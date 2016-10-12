import path from 'path'

export default {
  secret: 'shhhhhhared-secret',
  port: 3000,
  appId: 'wxd3248bc1a7edaab3',
  appSecret: 'ff6cfdc3841ae70a967065859e1bdb98',
  env: 'development',
  development: {
    dialect: 'sqlite',
    storage: path.join(__dirname, 'db')
  },
  test: {
    username: 'root',
    password: 'root',
    database: 'beacon_test'
  },
  production: {
    sqlite: 'db.production.sqlite',
    dialect: 'sqlite'
  }
}
