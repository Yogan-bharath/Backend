const express = require('express');
const authenticationRouter = express.Router();
const path = require('path')

const  handleLogin = require('../controllers/authenticationController')

authenticationRouter.post('/',handleLogin)

module.exports = authenticationRouter