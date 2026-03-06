'use strict'

let mongoose = require('mongoose');
const app = require('./app');
const port = process.env.PORT || 3977;

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/curso_mean2').then((res) => {  
    console.log("La base de datos esta funcionando correctamente");
    app.listen(port, function(){
      console.log("Servidor del API Rest de música escuchando en http://localhost:"+port);
    });
})
.catch((err) =>{
  return res.status(500).json({
    status: "error",
    mensaje: "No se ha podido conectar a la base de datos",
    err
  });
});

