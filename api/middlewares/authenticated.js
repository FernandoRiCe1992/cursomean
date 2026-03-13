'use strict'

const jwt = require('jwt-simple');
const dayjs = require('dayjs');
const secret= 'clave_secreta_curso';

exports.ensureAuth = function(req, res, next){
  if(!req.headers.authorization){
    return res.status(403).send({message: 'La petición no tiene la cabecera de autenticación'});
  };

  const token = req.headers.authorization.replaceAll(/['"]+/g,'');

  try{
    const payload = jwt.decode(token, secret);

    if(payload <= dayjs().unix()){
      res.status(401).send({message: 'Token expirado'});  
    }else{
      req.user = payload;
      next();
    };
  }catch(err){
    console.log(err);
    res.status(404).send({message: 'Token no válido'});
  }
};