'use strict'

const fs = require('fs');
const path = require('path');
const mongoosePaginate = require('mongoose-paginate-v2');

const Artist = require('../models/artist');
const Album = require('../models/album');
const Song = require('../models/song');

async function getAlbum(req, res){
  try{
    const albumId = req.query.id;
    
    const album = await Album.findById(albumId).populate({path: 'artist'}).exec();
    
    if(!album){
      res.status(404).send({message: 'El album no existe'});
    }else{
      res.status(200).send({album});
    };

  }catch(err){
    console.log(err);
    res.status(500).send({message: 'Error del servidor'});
  }
};

async function saveAlbum(req, res){
  try{
    const album = new Album();

    const params = req.body;

    album.title = params.title;
    album.description = params.description;
    album.year = params.year;
    album.image = 'album-blank.png';
    album.artist = params.artist;

    const albumStored = await album.save();

    if(!albumStored){
      res.status(404).send({message: 'no se ha guardado el album'});
    }else{
      res.status(200).send({album: albumStored});
    };

  }catch(err){
    console.log(err);
    res.status(500).send({message: 'Error del servidor'});
  };
};

module.exports = {
  getAlbum,
  saveAlbum
  // getAlbums,
  // updateAlbum,
  // deleteAlbum,
  // uploadImage,
  // getImageFile
};