'use strict'

const express = require('express');
const UserController = require('../controllers/user');
const md_auth = require('../middlewares/authenticated');

const api = express.Router();

api.get('/probando-controlador', md_auth.ensureAuth, UserController.pruebas);
api.post('/register', UserController.saveUser);
api.post('/login', UserController.loginUser);

module.exports = api;