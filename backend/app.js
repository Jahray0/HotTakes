const express = require('express');
const mongoose = require('mongoose');

const app = express();

mongoose.connect('mongodb+srv://user2:Piquante123@cluster0.k3odr5k.mongodb.net/?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

  

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