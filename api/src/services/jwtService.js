'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');

var secret = 'clave_secreta_hacer_token';

exports.CreateToken = function(user){

    var payload = {
        sub: user._id,
        id: user.id,
        email: user.email,
        role: user.role,
        iat: moment().unix(),
        exp: moment().add(1,'days').unix
    };

    return jwt.encode(payload, secret);

};