'use strict'

var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan'); 
var app = express();

//Cargar rutas
var user_routes = require('./src/routes/userRoutes');
var policy_routes = require('./src/routes/policyRoutes');

//middlewares
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//cors
app.use(morgan('dev')); 
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
    next();
  });
//rutas
app.use('/api',user_routes);
app.use('/api/policy',policy_routes);

//export
module.exports = app;