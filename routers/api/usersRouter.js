const express = require('express');
const handleUsersapi = express.Router();
const {getAllEmployees,createUser,getUserbyId,updateUserbyId,deleteUserbyId} = require('../../controllers/usersController');
const ROLES_LIST = require('../../config/roles_list')
const verifyRoles = require('../../middleware/verifyRoles')


handleUsersapi.route('/')
    .get(getAllEmployees)
    .post(verifyRoles(ROLES_LIST.Admin,ROLES_LIST.Editer),createUser)
    .put(verifyRoles(ROLES_LIST.Admin,ROLES_LIST.Editer),updateUserbyId)
    .delete(verifyRoles(ROLES_LIST.Admin),deleteUserbyId)
handleUsersapi.route('/:id')
    .get(getUserbyId)
    
module.exports = handleUsersapi

