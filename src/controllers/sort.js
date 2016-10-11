import models from '../models'
const Work = models.Work
const Author = models.Author

const sort = {}

const trim = (str) => {
  if (typeof str !== 'string') return ''
  return str.replace(/(^\s*)|(\s*$)/g, '')
}

sort.search = (req, res) => {
  let query = []
  let { params } = req.body
  params = trim(params)
  console.log(params)
  if (params) {
    query = params.split(' ')
  } else {
      return res.json({msg:'参数不能为空', success: false, data:{}})
  }
  Work.findAll({
      where: {
          $or: [
                {name: {$like: query[0]}},
                {introduce: {$like:  query[0]}}
              ]
      }
  }).then(works=>{
      res.json({
          works
      })
  })
}

sort.color = (req, res) => {
}

export default sort
