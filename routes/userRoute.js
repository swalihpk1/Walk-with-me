const express = require("express");
const userRoutes = express();


const authController = require('../controller/authController');
const userMessageController = require('../controller/userMessageController')
const authMiddleware = require('../middlewares/authMiddlewares');
const alertController = require("../controller/alertsController");
userRoutes.post('/sendAlertMessages', alertController.sendAlertMessages);

userRoutes.get('/', authMiddleware.isLogout, authController.loadLogIn);
userRoutes.post('/', authMiddleware.isLogout, authController.handleLogIn)
userRoutes.get('/signup', authMiddleware.isLogout, authController.loadSignup)
userRoutes.post('/signup', authMiddleware.isLogout, authController.handleSignUp);
userRoutes.get('/otp',authMiddleware.isLogin,authController.loadOtpPage)
userRoutes.patch('/verifyOtp',authController.verifyOtp)
userRoutes.get('/home',authMiddleware.isLogin,authController.loadHome)
userRoutes.get('/check-point',userMessageController.reachCheckPoint)

module.exports = userRoutes;
