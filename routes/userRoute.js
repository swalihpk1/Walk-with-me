const express = require('express');
const userRoutes = express();

const authController = require('../controller/authController');
const userMessageController = require('../controller/userMessageController')
const authMiddleware = require('../middlewares/authMiddlewares');

userRoutes.get('/', authMiddleware.isLogout, authController.loadLogIn);
userRoutes.post('/', authMiddleware.isLogout, authController.handleLogIn)
userRoutes.get('/signup', authMiddleware.isLogout, authController.loadSignup)
userRoutes.post('/signup', authMiddleware.isLogout, authController.handleSingUp);
userRoutes.get('/home',authMiddleware.isLogin,authController.loadHome)
userRoutes.get('/check-point',userMessageController.reachCheckPoint)

module.exports = userRoutes;