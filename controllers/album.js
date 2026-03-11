'use strict'

const fs = require('fs');
const path = require('path');
const mongoosePaginate = require('mongoose-paginate-v2');

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

async function getAlbums(req, res){
  try{
    const page = parseInt(req.query.page, 8) || 1;
    const itemsPerPage = 3;

    const options = {
      page: page,
      limit: itemsPerPage,
      sort: { name: 1 },
      lean: true
    };
    
    const albums = await Album.paginate({}, options);
    
    if(!albums.docs.length){
      return res.status(404).send({message: 'No hay albums disponibles'});
    }else{
      return res.status(200).send({
        currentPage: albums.page,
        totalPages: albums.totalPages,
        docTotal: albums.totalDocs,
        albums: albums.docs

      })
    };

  }catch(err){
    console.log(err);
    res.status(500).send({message: 'Error del servidor'});
  };
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

async function updateAlbum(req, res){
  try{
    const albumId = req.query.id;
    const update = req.body;

    const albumUpdated = await Album.findByIdAndUpdate(albumId, update);

    if(!albumUpdated){
      res.status(404).send({message: "No se ha actualizado el album"});
    }else{
      res.status(200).send({album: albumUpdated});
    };

  }catch(err){
    console.log(err);
    res.status(500).send({message: 'Error del servidor'});
  };
};

async function deleteAlbum(req, res){
  try{
    const albumId = req.query.id;
    
    const albumDeleted = await Album.findByIdAndDelete(albumId);

    if(!albumDeleted){
      res.status(404).send({message: 'No se ha eliminado el album'});
    }else{
      const songDeleted = await Song.find({album: albumDeleted._id}).deleteMany();

      if(!songDeleted){
        res.status(404).send({message: 'No se ha eliminado las canciones'});
      }else{
        res.status(200).send({album: albumDeleted});
      };
    };

  }catch(err){
    console.log(err);
    res.status(500).send({message: 'Error del servidor'});
  };
};

async function uploadImage(req, res){
  try{
    const albumId = req.query.id;
    const file_name = 'No subido...';

    if(req.files){
      const file_path = req.files.image.path;
      const file_split = file_path.split('\\');
      const file_name = file_split[2];

      const ext_split = file_name.split('\.');
      const file_ext = ext_split[1];

      if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif'){
        const albumUpdated = await Album.findByIdAndUpdate(albumId, {image: file_name});

        if(!albumUpdated){
          res.status(404).send({message: 'No se actualizo el album'});
        }else{
          res.status(200).send({album: albumUpdated});
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
  const imagePath = './uploads/albums/'+imageFile ;

  if(fs.existsSync(imagePath)){
    res.sendFile(path.resolve(imagePath));
  }else{
    res.status(404).send({message: 'No existe la imagen'});
  };

};

module.exports = {
  getAlbum,
  saveAlbum,
  getAlbums,
  updateAlbum,
  deleteAlbum,
  uploadImage,
  getImageFile
};