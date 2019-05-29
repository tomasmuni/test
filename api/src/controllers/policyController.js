'use strict'

var Client = require('../models/client');
var Policie = require('../models/policie');




function getPoliciesByName(req,res){

    var userName = new RegExp('^'+ req.params.name.trim() + '$', "i");
    var role = req.user.role;

    if( role == 1 ){
        Client.findOne({name : userName}, (err,client) =>{
            if(err) return res.status(500).send({ message: 'Error en la petición'});

            if(!client) return res.status(404).send({message: 'El usuario no existe'});
            client.password = undefined;
            findPoliciesUser(client.id).then((policiesRes) => {
                return res.status(200).send({
                    client,
                    policies: policiesRes
                });
            });
                
            

        });
    } else{
        res.status(200).send({
            message: 'No tiene permiso para realizar esta petición'
            })
    }
}

 async function findPoliciesUser( user_id) {

    var policies = await Policie.find({'clientId': user_id},(err,policiesRes) => {
        if(err) return handleError(err);
        return policiesRes;
    }); 

    return policies
}

module.exports = {
    getPoliciesByName
};