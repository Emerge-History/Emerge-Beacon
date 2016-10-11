import path from 'path'

export default {
  secret: 'shhhhhhared-secret',
  port: 3000,
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
