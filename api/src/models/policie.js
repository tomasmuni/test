'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var policySchema = Schema({
    id: String,
    amountInsured: Number,
    inceptionDate: String,
    installmentPayment: Boolean,
    clientId: String
});

module.exports = mongoose.model('Policie',policySchema);