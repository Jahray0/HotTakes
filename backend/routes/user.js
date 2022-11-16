const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/user');
const controleEmail = require('../middleware/controleEmail');
const passwordValidator = require("../middleware/password");


//Création d'un utilisateur
router.post('/signup', passwordValidator,controleEmail, userCtrl.signup);
//Connexion utilisateur existant
router.post('/login', userCtrl.login);

module.exports = router;