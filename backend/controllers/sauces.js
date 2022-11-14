const Sauce = require('../models/sauce');
const fs = require('fs');
//comprendre et expliquer validator
const validator = require('validator');

//Création d'une sauce
exports.createSauce = (req, res, next) => {
    let checkedSave = true;
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    let arrayValues = Object.values(sauceObject);
    for(value in arrayValues) {
        //evite les injections
        if(validator.contains(arrayValues[value].toString(), '$') || validator.contains(arrayValues[value].toString(), '=')) {
            console.log('La saisie suivante est invalide: ' + arrayValues[value]);
            checkedSave = false;
        };
    };

    if(checkedSave) {
        //Création d'une instance de sauce initialisé avec 0 like et 0 diskike
        const sauce = new Sauce({
            ...sauceObject,
            likes: 0,
            dislikes: 0,
            usersLiked: [],
            usersDisliked: [],
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        });
        //Enregistre l'objet dans la base de donnée
        sauce.save()
            //201 => ressource créé
            .then(() => res.status(201).json({ message: 'Votre sauce a bien été enregistré'}))
            .catch(error => res.status(400).json({ error }));
    };
};

//Récuperation d'une sauce avec son id
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({_id: req.params.id})
        .then(sauces => res.status(200).json(sauces))
         //Objet non trouvé
        .catch(error => res.status(404).json({ error }));
};

//Récuperation de la liste de sauces
exports.getAllSauces = (req, res, next) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error }));
};

//Modification d'une sauce
exports.modifySauce = (req, res, next) => {
    let checkedSave = true;
    //On supprime l'ancienne image si une nouvelle est choisie
    if(req.file) {
        Sauce.findOne({ _id: req.params.id })
            .then(sauce => {
                const filename = sauce.imageUrl.split('/images/')[1];
                //Suppression
                fs.unlink(`images/${filename}`, (err) => {
                    if(err) throw err;
                });
            })
            .catch(error => res.status(400).json({ error }));
    }

    //Update de l'image
    const sauceObject = req.file ?
        {
            ...JSON.parse(req.body.sauce),
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        } : {...req.body};

    //Evite les injection
    let arrayValues = Object.values(sauceObject);
    for(value in arrayValues) {
        if(validator.contains(arrayValues[value].toString(), '$') || validator.contains(arrayValues[value].toString(), '=')) {
            console.log('La saisie suivante est invalide: ' + arrayValues[value]);
            checkedSave = false;
        };
    };

    //Enregistrement des modifications si les entrées sont valides
    if(checkedSave) {
        //... on récupere la sauce qui est dans le corps de la requete
        //et l'id correspond a celui des parametres
        Sauce.updateOne({ _id: req.params.id}, { ...sauceObject, _id: req.params.id})
            .then(() => res.status(200).json({ message: 'Sauce modifiée'}))
            .catch(error => res.status(400).json({ error }));
    } else {
        res.status(401).json({ error: 'Présence de caractères non autorisés'});
    };
};

//Suppression d'une sauce
exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            const filename = sauce.imageUrl.split('/images/')[1];
            //Suppression
            fs.unlink(`images/${filename}`, () => {
                Sauce.deleteOne({ _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'Sauce supprimée'}))
                    .catch(error => res.status(400).json({ error }));
            });
        })
        .catch(error => res.status(500).json({ error }));
};

//Gestion des "Likes/Dislikes"
exports.likeSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            //Sauce sans Like de l'utilisateur
            if(sauce.usersDisliked.indexOf(req.body.userId) == -1 && sauce.usersLiked.indexOf(req.body.userId) == -1) {
                if(req.body.like == 1) { //Si Like de l'utilisateur
                    sauce.usersLiked.push(req.body.userId);
                    sauce.likes += req.body.like;
                } else if(req.body.like == -1) { //Si Dislike de l'utilisateur
                    sauce.usersDisliked.push(req.body.userId);
                    sauce.dislikes -= req.body.like;
                };
            };
            //Annuler un Like
            if(sauce.usersLiked.indexOf(req.body.userId) != -1 && req.body.like == 0) {
                const likesUserIndex = sauce.usersLiked.findIndex(user => user === req.body.userId);
                sauce.usersLiked.splice(likesUserIndex, 1);
                sauce.likes -= 1;
            };
            //Annuler un Dislike
            if(sauce.usersDisliked.indexOf(req.body.userId) != -1 && req.body.like == 0) {
                const likesUserIndex = sauce.usersDisliked.findIndex(user => user === req.body.userId);
                sauce.usersDisliked.splice(likesUserIndex, 1);
                sauce.dislikes -= 1;
            }
            sauce.save();
            res.status(201).json({ message: 'Like / Dislike mis à jour' });
        })
        .catch(error => res.status(500).json({ error }));
};