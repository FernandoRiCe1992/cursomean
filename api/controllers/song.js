'use strict'

const fs = require('fs');
const path = require('path');

const Song = require('../models/song');

async function getSong(req, res){
  try{
    const songId = req.params.id;

    const song = await Song.findById(songId);
    
    if(!song){
      res.status(404).send({message: 'No se encontró la canción'});
    }else{
      res.status(200).send({song: song});
    };

  }catch(err){
    res.status(500).send({message: err.message});
  };
};

async function getSongs(req, res){
  try{
    const albumId = req.params.id;
    const page = parseInt(req.query.page, 8) || 1;
    const itemsPerPage = parseInt(req.query.itemsPerPage, 8) || 3;

    const queryBy = (!albumId) ? {} : {album: albumId};
    const sortBy = (!albumId) ? {name: 1} : {number: 1};

    const options = {
      page: page,
      limit: itemsPerPage,
      sort: sortBy,
      lean: true,
      populate: ({path: 'album', populate:({path: 'artist', model: 'Artist'})})
    };
    
    const songs = await Song.paginate(queryBy, options);
    
    if(!songs.docs.length){
      return res.status(404).send({message: 'No hay canciones disponibles'});
    }else{
      return res.status(200).send({
        currentPage: songs.page,
        totalPages: songs.totalPages,
        docTotal: songs.totalDocs,
        songs: songs.docs

      })
    };

  }catch(err){
    res.status(500).send({message: err.message});
  };
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
    res.status(500).send({message: err.message});
  };
};

async function updateSong(req, res){
  try{
    const songId = req.params.id;
    const update = req.body;

    const songUpdate = await Song.findByIdAndUpdate(songId, update);

    if(!songUpdate){
      res.status(404).send({message: 'No se ha podido actualizar la canción'});
    }else{
      res.status(200).send({song: songUpdate});
    };

  }catch(err){
    res.status(500).send({message: err.message});
  };
};

async function deleteSong(req, res){
  try{
    const songId = req.params.id;

    const songDelete = await Song.findByIdAndDelete(songId);

    if(!songDelete){
      res.status(404).send({message: 'No se ha podido eliminar la canción'});
    }else{
      res.status(200).send({song: songDelete});
    };
  }catch(err){
    res.status(500).send({message: err.message});
  };
};

async function uploadFile(req, res){
  try{
    const songId = req.params.id;
    const file_name = 'No subido...';

    if(req.files){
      const file_path = req.files.file.path;
      const file_split = file_path.split('\\');
      const file_name = file_split[2];

      const ext_split = file_name.split('\.');
      const file_ext = ext_split[1];

      if (file_ext == 'mp3' || file_ext == 'ogg'){
        const SongUpdated = await Song.findByIdAndUpdate(songId, {file: file_name});

        if(!SongUpdated){
          res.status(404).send({message: 'No se actualizo la canción'});
        }else{
          res.status(200).send({song: SongUpdated});
        };
      }else{
        res.status(400).send({message: 'Extension de imagen invalida'});
      }
    }else{
      res.status(400).send({message: 'No has subido ningun fichero de audio...'});
    };

  }catch(err){
    res.status(500).send({message: err.message});
  };
};

async function getSongFile(req, res){
  try{
    const songFile = req.params.songFile;
    const songPath = './uploads/songs/'+songFile ;

    if(fs.existsSync(songPath)){
      res.sendFile(path.resolve(songPath));
    }else{
      res.status(404).send({message: 'No existe el fichero de audio'});
    };

  }catch(err){
    res.status(500).send({message: err.message});
  };
};

module.exports = {
  getSong,
  getSongs,
  saveSong,
  updateSong,
  deleteSong,
  uploadFile,
  getSongFile
};
