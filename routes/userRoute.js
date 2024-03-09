const express = require("express");
const userRoute = express();
const userRoutes = express();

userRoute.set('view engine', 'ejs')
userRoute.set('views', './views/user')

const authController = require('../controller/authController');
const userMessageController = require('../controller/userMessageController')
const authMiddleware = require('../middlewares/authMiddlewares');
const alertController = require("../controller/alertsController");
const mapController = require('../controller/mapController');

userRoutes.get('/login',authMiddleware.isLogout,authController.loadLogIn);
userRoutes.post('/login',authMiddleware.isLogout,authController.handleLogIn);
userRoutes.get('/',authMiddleware.isLogin,authController.home);
userRoutes.get('/signup',authMiddleware.isLogout,authController.loadSignup);
userRoutes.post('/signup',authMiddleware.isLogout,authController.handleSignUp);
userRoutes.get('/safetymap', mapController.safetyMap);
userRoutes.patch('/verifyOtp',authController.verifyOtp);

userRoutes.get('/otp',authController.loadOtpPage);
userRoutes.post('/sendAlertMessages', alertController.sendAlertMessages);
userRoutes.get('/check-point',userMessageController.reachCheckPoint);



module.exports = userRoutes;