'use strict'


var mongoose = require('mongoose');
var http = require('http');
var app = require('./app');
const server = http.Server(app);



var username = "tmunoz";
var password = "asd123";
//Conectarse al Database
//mongoose.Promise = global.Promise;

//Port
app.set('port', process.env.PORT || 8100);



var connectionString = 'mongodb://'  + username + ':' + password;
connectionString += "@ds219641.mlab.com:19641/heroku_ntvgb308";
mongoose.connect(connectionString)
    .then(() => {
        console.log(process.env.PORT);
      
    })
    .catch(err => console.log(err));

//Crear Servidor
server.listen(app.get('port'), () => {

    console.log("App listening on port " + app.get('port'));
})
