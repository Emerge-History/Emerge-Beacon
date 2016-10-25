import { Router } from 'express'
import sign from './controllers/sign'
import author from './controllers/author'
import work from './controllers/work'
import sort from './controllers/sort'
import beacon from './controllers/beacon'
import wechat from './controllers/wechat'
import config from './config'
import jwt from 'express-jwt'
import fs from 'fs'
import uuid from 'uuid'

const router = Router()

router.get('/', (req, res) => {
  res.json({msg: 'hello'})
})

router.get('/login', sign.login)
router.get('/test', jwt({secret: config.secret}), sign.test)

router.get('/all/authors', author.all)
router.get('/authors', author.list)
router.get('/authors/:id', author.get)
router.post('/authors', author.create)
router.put('/authors/:id', author.update)
router.delete('/authors/:id', author.remove)
router.get('/getSelectAllAuthors', author.getSelectAllAuthors)


router.get('/all/works', work.all)
router.get('/works', work.list)
router.get('/works/:id', work.get)
router.post('/works', work.create)
router.put('/works/:id', work.update)
router.delete('/works/:id', work.remove)


router.post('/search', sort.search)

router.get('/config', async (req, res)=>{
  const dt = await wechat.getConfig('www.baidu.com')
  res.json(dt)
})

router.get('/groupAdd', beacon.groupAdd)
router.get('/groupDelete', beacon.groupDelete)
router.get('/groupUpdate', beacon.groupUpdate)
router.get('/groupList', beacon.groupList)
router.get('/groupDetail', beacon.groupDetail)
router.get('/groupAddDevice', beacon.groupAddDevice)
router.get('/groupDeleteDevice', beacon.groupDeleteDevice)



router.post('/upload', function (req, res) {
  const prefix = uuid.v1() + '.jpg'
  if (!req.files) {
    res.send('No files were uploaded.')
    return
  }
  const sampleFile = req.files.file
  sampleFile.mv(__dirname + '/public/upload/' + prefix, function (err) {
    if (err) {
      res.status(500).send(err)
    }else {
      res.json({
        success: true,
        msg: '图片上传成功！',
        data: {
          url: '/upload/' + prefix
        }
      })
    }
  })
})

export default router
