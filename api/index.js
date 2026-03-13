'use strict'

const mongoose = require('mongoose');
const app = require('./app');
const port = process.env.PORT || 3977;

mongoose.connect('mongodb://localhost:27017/curso_mean2').then(function(res){
    console.log('La conexión a la base de datos esta funcionando');

    app.listen(port, function(){
        console.log('Servidor del API Rest de musica escuchando en http://localhost:' + port);
    });
}, 
function(err){
    console.error(err);
});
