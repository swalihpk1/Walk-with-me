const express = require('express');
const userRoutes = express();

const authController = require('../controller/authController');

userRoutes.get('/',authController.loadLogIn);
userRoutes.post('/',authController.handleLogIn)
userRoutes.get('/signup',authController.loadSignup)
userRoutes.post('/signup',authController.handleSingUp);

module.exports = userRoutes;