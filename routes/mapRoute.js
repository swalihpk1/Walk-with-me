const express = require('express');
const mapRouter = express(); 
const mapController = require('../controller/mapController.js');

mapRouter.use(express.static('rithas-public'))

mapRouter.set('view engine','ejs');
mapRouter.set('views','./views/map');

mapRouter.get('/maps',mapController.loadMap)

module.exports=mapRouter;

