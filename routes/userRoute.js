const express = require("express");
const userRoutes = express();

const alertController = require("../controller/alertsController");

userRoutes.post('/sendAlertMessages', alertController.sendAlertMessages);

module.exports = userRoutes;
