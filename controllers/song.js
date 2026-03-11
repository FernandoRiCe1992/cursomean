'use strict'

const fs = require('fs');
const path = require('path');
const mongoosePaginate = require('mongoose-paginate-v2');

const Song = require('../models/song');

async function getSong(req, res){
  try{
    res.status(200).send({message: 'Esta es una respuesta desde el controlador de canciones'});
  }catch(err){
    console.log(err);
    res.status(500).send({message: 'Error del servidor'});
  };
};

async function getSongs(req, res){
  const albumId = req.query.id;

  
};

async function saveSong(req, res){
  try{
    const song = new Song();
    
    const params = req.body;

    song.number = params.number;
    song.name = params.name;
    song.duration = params.duration;
    song.file = 'null';
    song.album = params.album

    const songStored = await song.save();

    if(!songStored){
      res.status(404).send({message: 'No se pudo guardar la canción'});
    }else{
      res.status(200).send({song: songStored});
    };

  }catch(err){
    console.log(err);
    res.status(500).send({message: 'Error del servidor'});
  };
};




module.exports = {
  getSong,
  saveSong
};
