const express = require("express");
const userRoute = express();

userRoute.set('view engine','ejs')
userRoute.set('views', './views/user')

const userRoutes = express();


const authController = require('../controller/authController');
const alertController = require("../controller/alertsController");
const mapController = require('../controller/mapController');


userRoutes.get('/login',authController.loadLogIn);
userRoutes.post('/login',authController.handleLogIn);
userRoutes.get('/',authController.home);
userRoutes.get('/signup',authController.loadSignup);
userRoutes.post('/signup',authController.handleSingUp);
userRoutes.get('/safetymap', mapController.safetyMap);
userRoutes.post('/sendAlertMessages', alertController.sendAlertMessages);

module.exports = userRoutes;
