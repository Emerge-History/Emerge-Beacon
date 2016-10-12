import express from 'express'
import bodyParser from 'body-parser'
import compress from 'compression'
import helmet from 'helmet'
import logger from 'morgan'
import routes from './routes'
import cors from 'cors'
import models from './models'
import config from './config'
import fileUpload from 'express-fileupload'
import path from 'path'

const app = express()

// use middlewares
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(compress())
app.use(helmet())
app.use(cors())
app.use(logger('dev'))
app.use(fileUpload())

// static
app.use('/upload', express.static(path.join(__dirname, 'public/upload')))
app.use('/admin', express.static(path.join(__dirname, 'public/admin')))


// beacon page
import wechat from './controllers/wechat'
app.get('/h5', async(req, res) => {
  const data = await wechat.getConfig('http://kjdkanekv8.proxy.qqbrowser.cc/h5/demo1')
  res.json({
    msg: data
  })
})

// routes 
app.use('/api', routes)

// error handlers
app.use((req, res, next) => {
  var err = new Error('Not Found')
  err.status = 404
  next(err)
})

app.use((err, req, res, next) => {
  res.status(err.status || 500)
  res.json({
    msg: err.message,
    err: err
  })
})

// create tables
models.sequelize.sync().then(() => {
  // server
  let server = app.listen(config.port, () => {
    console.log('server running on port:' + config.port)
  })
  server.on('error', (error) => {
    if (error.syscall !== 'listen') {
      throw error
    }
    switch (error.code) {
      case 'EACCES':
        console.error('requires elevated privileges')
        process.exit(1)
        break
      case 'EADDRINUSE':
        console.error('is already in use')
        process.exit(1)
        break
      default:
        console.log(error)
        throw error
    }
  })
})
