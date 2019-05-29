'use strict'

var bcrypt = require('bcrypt-nodejs')
var jwtService = require('../services/jwtService');

var User = require('../models/user');
var Client = require('../models/client');
var Policie = require('../models/policie');
//rutas
function home(req,res){
    res.status(200).send({
        message: 'Accion de pruebas en el server Node'
        })
}

function pruebas(req,res){
    console.log(req.body);
    res.status(200).send({
        message: 'Accion de pruebas en el server Node'
        })
}

function saveUser (req,res){
    var params = req.body;
    var user = new User();
    var client = new Client();


    if(params.email && params.password){
            user.email = params.email;
            params.password

            //Valida usuarios duplicados
            Client.findOne({email: user.email},(err ,client)=>{
                    if(err) return res.status(500).send({message:'Error en la peticion de usuarios'});
                    if(!client){
                        return res.status(200).send({message: 'Debes ser cliente para poder registrarte'});
                    }

                    User.findOne({email: client.email}).exec(function (err, userRes){
                        if(err) return res.status(500).send({message:'Error en la peticion de usuarios'});
                        
                        if(userRes){
                            return res.status(200).send({message: 'Usted ya se encuentra registrado'});
                        }

                            //Encripta la contraseña
                            bcrypt.hash(params.password,null,null,(err,hash)=>{
                                user.password = hash 
                                user.role = client.role.toLowerCase() == 'admin' ? 1: 0,
                                //Guarda el usuario
        
                                user.save((err,userStored) => {
                                    if(err) return res.status(500).send({message: 'Error Al guardiar el usuario' })
        
                                    if(userStored){
                                        res.status(200).send({user: userStored});
                                    }else{
                                        res.status(404).send({message: 'No se ha registrado el usuario'})
                                    }
                                });
                          
                            });
                    });     
            });
           
        } else{
            res.status(200).send({
                message: 'Envia todos los campos necesarios!'
            });
        }
}

function loginUser (req,res){
    var params = req.body;

    var email = params.email;
    var password = params.password;

    User.findOne({email: email},(err ,user)=>{
        if(err) return res.status(500).send({message:'Error en la peticion de usuarios'});

        if(user){
            bcrypt.compare(password, user.password,(err,check) =>{
                if(check){

                    if(params.gettoken == true){
                        return res.status(200).send({
                            token: jwtService.CreateToken(user)
                        })
                    }else {
                        user.password = undefined;
                        return res.status(200).send({user});
                    }
                    //devolver datos de usuario
                    
                }else{
                    return res.status(404).send({message: 'El usuario o la contraseña incorrectas'})
                }
            });
        }else{
            return res.status(404).send({message: 'Usuario inexistente'})
        }
    })

}

function getUser(req,res){
    var userId = req.params.id.toLowerCase();
    var role = req.user.role;

    if( role == 1 || role == 0){
        
        if(req.params.byId == true){
        Client.findOne({id:userId }, (err,client) =>{
            if(err) return res.status(500).send({ message: 'Error en la petición'});

            if(!client) return res.status(404).send({message: 'No existe ningun cliente asociado a ese ID'});
                 return res.status(200).send(client);
            });
        }
        else {
            var userName = new RegExp('^'+ req.params.id.trim() + '$', "i");
            Client.findOne({name: userName }, (err,client) =>{
                if(err) return res.status(500).send({ message: 'Error en la petición'});
    
                if(!client) return res.status(404).send({message: 'No existe ningun cliente asociado a ese NOMBRE'});
                     return res.status(200).send(
                         { 
                             client
                         });
                });
    
        }
    } else{
        res.status(200).send({
            message: 'No tiene permiso para realizar esta petición'
            })
    }
}

function getUserByName(req,res){
    var userName = new RegExp('^'+ req.params.name + '$', "i");
    var role = req.user.role;

    if( role == 1 || role == 0){
        Client.findOne({name: userName }, (err,client) =>{
            if(err) return res.status(500).send({ message: 'Error en la petición'});

            if(!client) return res.status(404).send({message: 'No existe ningun usuario asociado a ese NOMBRE'});
                 return res.status(200).send(
                     { 
                         client
                     });
            });

    } else{
        res.status(200).send({
            message: 'No tiene permiso para realizar esta petición'
            })
    }
}

function getUserByPolicy(req,res){

    var policyId =req.params.id;
    var role = req.user.role;

    if( role == 1 ){
        Policie.findOne({id : policyId}, (err,policy) =>{
            if(err) return res.status(500).send({ message: 'Error en la petición'});

            if(!policy) return res.status(404).send({message: 'La poliza no existe'});
            findUserByPolicy(policy.clientId).then((userRes) => {
                return res.status(200).send({
                    policy,
                    user: userRes
                });
            });

        });
    } else{
        res.status(200).send({
            message: 'No tiene permiso para realizar esta petición'
            })
    }
}

 async function findUserByPolicy( user_id) {
    var user = await  Client.findOne({id: user_id},(err,userRes) => {
        if(err) return handleError(err);
        return userRes;
    }); 

    return user;
}



module.exports = {
    home,
    pruebas,
    saveUser,
    loginUser,
    getUser,
    getUserByPolicy
};