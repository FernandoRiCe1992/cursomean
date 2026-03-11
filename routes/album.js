'use strict'

const express = require('express');
const AlbumController = require('../controllers/album');
const multiparty = require('connect-multiparty');

const md_auth = require('../middlewares/authenticated');
const md_upload = multiparty({uploadDir: './uploads/albums'});


const api = express.Router();

api.get('/album', md_auth.ensureAuth, AlbumController.getAlbum);
api.get('/albums', md_auth.ensureAuth, AlbumController.getAlbums);
api.post('/album', md_auth.ensureAuth, AlbumController.saveAlbum);
api.put('/album', md_auth.ensureAuth, AlbumController.updateAlbum);
api.delete('/album', md_auth.ensureAuth, AlbumController.deleteAlbum);
api.post('/upload-image-album', [md_auth.ensureAuth, md_upload], AlbumController.uploadImage);
api.get('/get-image-album/:imagefile', AlbumController.getImageFile);

module.exports = api;
