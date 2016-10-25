import models from '../models'

const Work = models.Work

const work = {}


work.all = (req, res, next) => {
  Work.findAndCountAll().then((result) => {
    const data = {
      msg: '获取所有作品成功！',
      success: true,
      works: result.rows
    }
    res.json(data)
  }).catch((err) => {
    next(err)
  }) 
}


work.list = (req, res, next) => {
  let countPerPage = 10, currentPage = req.query.page || 1;
  if(!(/^[0-9]*$/).test(currentPage)) {
    currentPage = 1
  }
  
  currentPage = Number(currentPage)

  Work.findAndCountAll({
    limit: countPerPage,                      
    offset: countPerPage * (currentPage - 1)
  }).then((result) => {
    const data = {
      msg: '获取所有作品成功！',
      success: true,
      works: result.rows,
      page: {
        total: result.count,
        current: currentPage
      }
    }
    res.json(data)
  }).catch((err) => {
    next(err)
  })
}

work.get = (req, res, next) => {
  const { id } = req.params
  Work.findOne({where:{id}}).then((work)=>{
      res.json({
          msg: '查询作品成功！',
          success: true,
          data: work
      })
  }).catch((err) => {
    next(err)
  })
}

work.create = (req, res, next) => {
  let {img, name, material, year, color, introduce, voice, AuthorId, size, uuid} = req.body
  Work.create({img, name, material, year, color, introduce, voice, AuthorId, size, uuid}).then((work) => {
    const data = {
      msg: '新建作品成功！',
      success: true,
      work
    }
    res.json(data)
  }).catch((err) => {
    next(err)
  })
}

work.update = (req, res) => {

  const { id } = req.params
  const { img, name, material, year, color, introduce, voice, AuthorId, size , uuid} = req.body
  Work.update({img, name, material, year, color, introduce, voice, AuthorId, size, uuid}, {where: {id}}).then(()=>{
    const data = {
      msg: '修改作品成功！',
      success: true
    }
    res.json(data)
  })
}

work.remove = (req, res, next) => {
  const { id } = req.params
  Work.destroy({where: {id}}).then(()=>{
      res.json({
      msg: '删除作品成功！',
      success: true
      })
  }).catch((err) => {
    next(err)
  })
}

export default work
