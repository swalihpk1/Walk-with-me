const express = require('express');
const mapRouter = express(); 
const mapController = require('../controller/mapController.js');

mapRouter.set('view engine','ejs');
mapRouter.set('views','./views/map');

mapRouter.get('/maps',mapController.loadMap)

module.exports=mapRouter;

