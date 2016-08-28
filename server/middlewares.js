exports.adminRequired = function (req, res, next) {
    console.log(req.session.admin)
    if(!req.session.admin){
        return res.json({
            status: 0,
            msg: '需要管理员登录'
        })
    }
    next();
};