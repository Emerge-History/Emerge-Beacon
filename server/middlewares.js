exports.adminRequired = function (req, res, next) {
    if(!req.session.admin){
        return res.json({
            status: 0,
            msg: '需要管理员登录'
        })
    }
    next();
};