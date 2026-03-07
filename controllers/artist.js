'use strict'

const fs = require('fs');
const path = require('path');

const Artist = require('../models/artist');
const Album = require('../models/album');
const Song = require('../models/song');

async function getArtist(req, res){
  try{
    res.status(200).send({message: 'Método getArtist del controlador artist.js'});
  }catch(err){
    console.log(err);
    res.status(500).send({message: 'Error del servidor'});
  }
};

module.exports = {
  getArtist
};