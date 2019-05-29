'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = Schema({
    email: String,
    password: String,
    role: Number,
});

module.exports = mongoose.model('User',UserSchema);