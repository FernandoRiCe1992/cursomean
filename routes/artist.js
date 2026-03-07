'use strict'

const express = require('express');
const ArtistController = require('../controllers/artist');
const multiparty = require('connect-multiparty');

const md_auth = require('../middlewares/authenticated');
const md_upload = multiparty({uploadDir: './uploads/artists'});


const api = express.Router();

api.get('/artist', md_auth.ensureAuth, ArtistController.getArtist);
api.get('/artists', md_auth.ensureAuth, ArtistController.getArtists);
api.post('/artist', md_auth.ensureAuth, ArtistController.saveArtist);
api.put('/artist', md_auth.ensureAuth, ArtistController.updateArtist);
api.delete('/artist', md_auth.ensureAuth, ArtistController.deleteArtist);
api.post('/upload-image-artist', [md_auth.ensureAuth, md_upload], ArtistController.uploadImage);
api.get('/get-image-artist/:imagefile', ArtistController.getImageFile);

module.exports = api;