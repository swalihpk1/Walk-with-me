const isLogin = (req,res)=>{
    try{
        if(req.session.loggedIn){
           return res.next();
        }
        return res.redirect()
    }catch(error){
        console.log(error)
    }
}