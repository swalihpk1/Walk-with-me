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
userRoute.get('/safetymap', mapController.safetyMap);
userRoutes.post('/sendAlertMessages', alertController.sendAlertMessages);
userRoutes.get('/otp',authController.loadOtpPage);
userRoutes.get('/check-point',userMessageController.reachCheckPoint);



module.exports = userRoutes;
