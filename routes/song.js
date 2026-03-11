'use strict'

const express = require('express');
const SongController = require('../controllers/song');
const multiparty = require('connect-multiparty');

const md_auth = require('../middlewares/authenticated');
const md_upload = multiparty({uploadDir: './uploads/songs'});


const api = express.Router();

api.get('/song', md_auth.ensureAuth, SongController.getSong);
api.post('/song', md_auth.ensureAuth, SongController.saveSong);

module.exports = api;