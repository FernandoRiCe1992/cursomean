'use strict'

const fs = require('fs');
const path = require('path');
const mongoosePaginate = require('mongoose-paginate-v2');

const Artist = require('../models/artist');
const Album = require('../models/album');
const Song = require('../models/song');

async function getArtist(req, res){
  try{
    const artistId = req.query.id;
    
    const artist = await Artist.findById(artistId);
    
    if(!artist){
      res.status(404).send({message: 'El artista no existe'});
    }else{
      res.status(200).send({artist})
    };

    res.status(200).send({message: 'Método getArtist del controlador artist.js'});

  }catch(err){
    console.log(err);
    res.status(500).send({message: 'Error del servidor'});
  }
};

async function getArtists(req, res){
  try{
    const page = parseInt(req.query.page, 8) || 1;
    const itemsPerPage = 3;

    const options = {
      page: page,
      limit: itemsPerPage,
      sort: { name: 1 },
      lean: true
    };

    const artists = await Artist.paginate({}, options);

    if(!artists.docs.length){
      return res.status(404).send({message: 'No hay artistas disponibles'});
    }else{
      return res.status(200).send({
        currentPage: artists.page,
        totalPages: artists.totalPages,
        docTotal: artists.totalDocs,
        artists: artists.docs

      })
    };

  }catch(err){
    console.log(err);
    res.status(500).send({message: 'Error del servidor'});
  };
};

async function saveArtist(req, res) {
  
  try{
    const artist = new Artist();
    const params = req.body;

    artist.name = params.name;
    artist.description = params.description;
    artist.image = 'artist-blank.png';

    const artistStored = await artist.save();

    if(!artistStored){
      res.status(404).send({message: 'El artista no se ha guardado'});
    }else{
      res.status(200).send({artist: artistStored});
    };
  }catch(err){
    console.log(err);
    res.status(500).send({message: 'Error del servidor'});
  };

};


async function updateArtist(req, res){
  try{
    const artistId = req.query.id;
    const update = req.body;

    const artistUpdated = await Artist.findByIdAndUpdate(artistId, update);

    if(!artistUpdated){
      res.status(404).send({message: 'El artista no se ha actualizado'});
    }else{
      res.status(200).send({artist: artistUpdated});
    };

  }catch{
    console.log(err);
    res.status(500).send({message: 'Error del servidor'});
  };
};

async function deleteArtist(req, res){
  try{
    const artistId = req.query.id;

    const artistDeleted = await Artist.findByIdAndDelete(artistId);

    if(!artistDeleted){
      res.status(404).send({message: 'El artista no se ha encontrado'});
    }else{
      const albumDeleted = await Album.find({artist: artistDeleted._id}).deleteMany();

      if(!albumDeleted){
        res.status(404).send({message: 'El album no se ha encontrado'});
      }else{

        const songDeleted = await Song.find({album: albumDeleted._id}).deleteMany();

        if(!songDeleted){
          res.status(404).send({message: 'La canción no se ha eliminado'});
        }else{
          res.status(200).send({artist: artistDeleted});
        };
      };
    };

  }catch(err){
    console.log(err);
    res.status(500).send({message: 'Error del servidor'});
  }
};

async function uploadImage(req, res){
  try{
    const artistId = req.query.id;
    const file_name = 'No subido...';

    if(req.files){
      const file_path = req.files.image.path;
      const file_split = file_path.split('\\');
      const file_name = file_split[2];

      const ext_split = file_name.split('\.');
      const file_ext = ext_split[1];

      if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif'){
        const artistUpdated = await Artist.findByIdAndUpdate(artistId, {image: file_name});

        if(!artistUpdated){
          res.status(404).send({message: 'No se actualizo el artista'});
        }else{
          res.status(200).send({artist: artistUpdated});
        };
      }else{
        res.status(400).send({message: 'Extension de imagen invalida'});
      }
    }else{
      res.status(400).send({message: 'No has subido ninguna imagen...'});
    }

  }catch(err){
    console.log(err);
    res.status(500).send({message: 'Error del servidor'});
  };
};

async function getImageFile(req, res){
  const imageFile = req.params.imagefile;
  const imagePath = './uploads/artists/'+imageFile ;

  if(fs.existsSync(imagePath)){
    res.sendFile(path.resolve(imagePath));
  }else{
    res.status(404).send({message: 'No existe la imagen'});
  };

};

module.exports = {
  getArtist,
  saveArtist,
  getArtists,
  updateArtist,
  deleteArtist,
  uploadImage,
  getImageFile
};