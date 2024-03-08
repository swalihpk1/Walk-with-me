const express = require("express");
const userRoute = express();
const userController = require('../controller/userController/userController');

userRoute.set('views','./views/user')

userRoute.get('/', userController.home)
userRoute.get('/signin', userController.signin)
userRoute.get('/login', userController.login)
userRoute.get('/safetymap', userController.safetymap)


module.exports = userRoute;