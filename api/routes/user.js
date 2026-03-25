'use strict'

const express = require('express');
const UserController = require('../controllers/user');
const multiparty = require('connect-multiparty');

const md_auth = require('../middlewares/authenticated');
const md_upload = multiparty({uploadDir: './uploads/users'});

const api = express.Router();

api.get('/probando-controlador', md_auth.ensureAuth, UserController.pruebas);
api.post('/register', UserController.saveUser);
api.post('/login', UserController.loginUser);
api.put('/update-user/:id', md_auth.ensureAuth, UserController.updateUser);
api.post('/upload-image-user', [md_auth.ensureAuth, md_upload], UserController.uploadImage);
api.get('/get-image-user/:imagefile', UserController.getImageFile);


module.exports = api;