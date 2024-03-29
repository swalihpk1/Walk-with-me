const express = require("express");
const userRoute = express();

userRoute.set('view engine','ejs')
userRoute.set('views', './views/user')

const userRoutes = express();

userRoute.set('view engine', 'ejs')
userRoute.set('views', './views/user')

const authController = require('../controller/authController');
const alertController = require("../controller/alertsController");
const mapController = require('../controller/mapController');
const authMiddleware =  require('../middlewares/authMiddlewares');
const userMessageController  = require('../controller/userMessageController')

userRoutes.get('/login',authMiddleware.isLogout,authController.loadLogIn);
userRoutes.post('/login',authMiddleware.isLogout,authController.handleLogIn);
userRoutes.get('/',authMiddleware.isLogin,authController.home);
     

userRoutes.get('/loder',authMiddleware.isLogin,authController.loder);
userRoutes.get('/signup',authMiddleware.isLogout,authController.loadSignup);
userRoutes.post('/signup',authMiddleware.isLogout,authController.handleSingUp);
userRoutes.post('/verifyOtp',authController.verifyOtp);
userRoutes.get('/safetymap',authMiddleware.isLogin, mapController.safetyMap);
userRoutes.post('/sendAlertMessages',authMiddleware.isLogin, alertController.sendAlertMessages);
userRoutes.post('/sendwhatsAppMessages',authMiddleware.isLogin,alertController.sendMessages)
userRoutes.get('/otp',authMiddleware.isLogout,authController.loadOtpPage);
userRoutes.get('/check-point',authMiddleware.isLogin,userMessageController.reachCheckPoint);



module.exports = userRoutes;
