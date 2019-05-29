'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ClientSchema = Schema({
    id: String,
    name: String,
    email: String,
    role: String,
});

module.exports = mongoose.model('Client',ClientSchema);