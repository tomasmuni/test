'use strict'

var express = require('express');
var UserController = require('../controllers/userController');

var api = express.Router();
var md_auth = require('../middlewares/authenticated');



api.get('/home',UserController.home);
api.get('/pruebas', md_auth.ensureAuth ,UserController.pruebas);
api.post('/register',UserController.saveUser);
api.post('/login',UserController.loginUser);
api.get('/user/:id/:byId?', md_auth.ensureAuth ,UserController.getUser);
api.get('/userByPolicy/:id', md_auth.ensureAuth , UserController.getUserByPolicy);

module.exports = api;