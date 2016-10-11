import models from '../models'

const Author = models.Author
const Work = models.Work
const author = {}




author.getSelectAllAuthors = (req, res, next) => {
  Author.findAll({
    'attributes': ['id', 'name']
  }).then((result)=>{
    res.json({result})
  })
}












author.list = (req, res, next) => {

  
  let countPerPage = 10, currentPage = req.query.page || 1;
  if(!(/^[0-9]*$/).test(currentPage)) {
    currentPage = 1
  }
  
  currentPage = Number(currentPage)

  Author.findAndCountAll({
    limit: countPerPage,                      
    offset: countPerPage * (currentPage - 1)
  }).then((result) => {
    const data = {
      msg: '获取所有作者成功！',
      success: true,
      authors: result.rows,
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

author.get = (req, res, next) => {
  const { id } = req.params
  Author.findOne({where:{id}}).then((author)=>{
      res.json({
          msg: '查询作者成功！',
          success: true,
          data: author
      })
  }).catch((err) => {
    next(err)
  })
}

author.create = (req, res, next) => {
  let {avator, name, nickname, sex, age, introduce} = req.body
  Author.create({avator, name, nickname, sex, age, introduce}).then((author) => {
    const data = {
      msg: '新建作者成功！',
      success: true,
      author
    }
    res.json(data)
  }).catch((err) => {
    next(err)
  })
}

author.update = (req, res) => {
  const { id } = req.params
  const { avator, name, nickname, sex, age, introduce } = req.body
  Author.update({avator, name, nickname, sex, age, introduce}, {where: {id}}).then(()=>{
    const data = {
      msg: '修改作者成功！',
      success: true
    }
    res.json(data)
  })
}

author.remove = async (req, res, next) => {
  const { id } = req.params
  await Work.destroy({where: {AuthorId: id}}).then(()=>{
    
  }).catch((err) => {
    next(err)
  })

  Author.destroy({where: {id}}).then(()=>{
      res.json({
      msg: '删除作者成功！',
      success: true
      })
  }).catch((err) => {
    next(err)
  })
}

export default author
