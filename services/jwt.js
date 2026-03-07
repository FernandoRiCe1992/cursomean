'use strict'

const jwt = require('jwt-simple');
const dayjs = require('dayjs');
const secret= 'clave_secreta_curso';

exports.createToken = function(user){
  const payload = {
    sub: user._id,
    name: user.name,
    surname: user.surname,
    email: user.email,
    role: user.role,
    image: user.image,
    iat: dayjs().unix(),
    exp: dayjs().add(30, 'days').unix()
  };

  return jwt.encode(payload, secret);
};