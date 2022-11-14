const express = require('express');
const router = express.Router();
const sauceCtrl = require('../controllers/sauces');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

//Création d'une sauce
router.post('', auth, multer, sauceCtrl.createSauce);
//Get un sauce
router.get('/:id', auth, sauceCtrl.getOneSauce);
//Get AllSauces
router.get('', auth, sauceCtrl.getAllSauces);
//Modification d'une sauce
router.put('/:id', auth, multer, sauceCtrl.modifySauce);
//Suppression d'une sauce
router.delete('/:id', auth, sauceCtrl.deleteSauce);
//Like/Dislike
router.post('/:id/like', auth, sauceCtrl.likeSauce);

module.exports = router;

