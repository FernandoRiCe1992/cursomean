'use strict'

const express = require('express');
const SongController = require('../controllers/song');
const multiparty = require('connect-multiparty');

const md_auth = require('../middlewares/authenticated');
const md_upload = multiparty({uploadDir: './uploads/songs'});


const api = express.Router();

api.get('/song', md_auth.ensureAuth, SongController.getSong);
api.get('/songs', md_auth.ensureAuth, SongController.getSongs);
api.post('/song', md_auth.ensureAuth, SongController.saveSong);
api.put('/song', md_auth.ensureAuth, SongController.updateSong);
api.delete('/song', md_auth.ensureAuth, SongController.deleteSong);
api.post('/upload-file-song/:id', [md_auth.ensureAuth, md_upload], SongController.uploadFile);
api.get('/get-song-file/:songFile', SongController.getSongFile);

module.exports = api;