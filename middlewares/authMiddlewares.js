const isLogin = (req, res,next) => {
    try {
        if (req.session.user_id) {
            return next();
        }
        return res.redirect('/')
    } catch (error) {
        console.log("error on isLogin middleware",error)
    }
}

const isLogout = (req, res,next) => {
    try {
        if (!req.session.user_id) {
            return next()
        }
        return res.redirect('/home')
    } catch (error) {
        console.log("error on isLogout middleware :", error)
        console.log(error.message)
    }
}

module.exports={
    isLogin,
    isLogout
}