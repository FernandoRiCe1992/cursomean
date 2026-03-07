'use strict'

const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('../services/jwt');

async function pruebas(req, res){
    try{
        res.status(200).send({message: 'probando una acción del controlador de usuario del API rest con Node y mongo'});
    }catch(err){
        console.log(err);
        res.status(500).send({message: 'Error del servidor'});
    };
};

async function saveUser (req, res){
  try{
    const user = new User();
    const params = req.body;
      
    console.log(params);

    user.name = params.name;
    user.surname = params.surname;
    user.email = params.email;
    user.role = 'ROLE_USER';
    //user.role = 'ROLE_ADMIN';
    user.image = 'null';

    if(params.password){
      // encriptar contraseña
      const password = bcrypt.hashSync(params.password);
            
      if(!password){
        res.status(400).send({message: 'No se pudo encriptar la contraseña'});
      }else{
        user.password = password;
        if(user.name != null && user.surname != null && user.email != null){
          // guardar el usuario
          const userStored = await user.save();

          if(!userStored){
            res.status(404).send({message: 'No se ha registrado del usuario'});
          }else{
            res.status(200).send({user: userStored});
          };
        }else{
          res.status(400).send({message: 'Rellena todos los campos'});
        };
      };

    }else{
      res.status(400).send({message: 'introduce la contraseña'});
    }

  }catch(err){
    console.log(err);
    res.status(500).send({message: 'Error del servidor'});
  };
};


async function loginUser(req, res){
  try{
    const params = req.body;
    
    const email = params.email;
    const password = params.password;

    const user = await User.findOne({email: email});

    if(!user){
      res.status(404).send({message: 'EL usuario no existe'});
    }else{
      const check = await bcrypt.compare(password, user.password);

      if(check){
        //devolver datos del usuario loggeados
        if(params.gethash){
          // devolver un token de jwt
          res.status(200).send({
            token: jwt.createToken(user)
          });
        }else{
          res.status(200).send({user: user});
        };
      }else{
        res.status(404).send({message: 'EL usuario no a podido loguearse'});
      };
    };

  }catch(err){
    console.log(err);
    res.status(500).send({message: 'Error del servidor'});
  };
};

module.exports = {
  pruebas,
  saveUser,
  loginUser
};