const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/user');

//Création d'un utilisateur
router.post('/signup', userCtrl.signup);
//Connexion utilisateur existant
router.post('/login', userCtrl.login);

module.exports = router;