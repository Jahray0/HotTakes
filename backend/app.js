const express = require('express');

const app = express();

app.use((req, res, next) => {
    console.log('Requete reçu !');
    next();
});

app.use((req, res, next) => {
    res.status(201);
    next();
});//change le status

app.use((req, res, next) => {
    res.json({ message:'Votre requete a bien été reçu ! ' });
    next();
});//envoi la réponse

app.use((req, res) => {
    console.log('Réponse envoyée avec succes');
});

module.exports = app;