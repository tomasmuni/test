'use strict'

var express = require('express');
var PolicyController = require('../controllers/policyController');

var api = express.Router();
var md_auth = require('../middlewares/authenticated');



api.get('/policiesByName/:name', md_auth.ensureAuth , PolicyController.getPoliciesByName);



module.exports = api;