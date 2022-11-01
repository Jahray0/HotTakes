const express = require('express');
const router = express.Router();
const sauceCtrl = require('../controllers/sauces');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

//CREATION D'UNE SAUCE
router.post('', auth, multer, sauceCtrl.createSauce);
//GET UNE SAUCE
router.get('/:id', auth, sauceCtrl.getOneSauce);
//GET ALL SAUCES
router.get('', auth, sauceCtrl.getAllSauces);
//MODIFICATION
router.put('/:id', auth, multer, sauceCtrl.modifySauce);
//SUPRESSION
router.delete('/:id', auth, sauceCtrl.deleteSauce);
//LIKE/DISLIKE
router.post('/:id/like', auth, sauceCtrl.likeSauce);

module.exports = router;

