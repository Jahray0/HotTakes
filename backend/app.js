const express = require("express");
const helmet = require("helmet");
const mongoose = require("mongoose");
const path = require("path");

require("dotenv").config();

const sauceRoutes = require("./routes/sauces");
const userRoutes = require("./routes/user");
const { Server } = require("http");

//Logique pour se connecter a mongo DB
mongoose
  .connect(
    "mongodb+srv://" +
      process.env.DB_LOGIN +
      ":" + process.env.DB_PWD + "@cluster0.k3odr5k.mongodb.net/?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

const app = express();
app.use(helmet());

//intercept les requet JSON ayant application.json comme content-type
//et met a disposition le body sur l'objet req
app.use(express.json());

//CORS
app.use((req, res, next) => {
  //Origine acces : tout le monde
  res.setHeader("Access-Control-Allow-Origin", "*");

  //Authorisation de certains header
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );

  res.setHeader('Cross-Origin-Resource-Policy', 'same-site');

  //Authorisation requete GET, POST, PUT, DELETE, PATCH, OPTIONS
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

//Routes a utiliser pour les requetes
//Permet d'attribuer un middleware a une route spécifique
app.use("/images", express.static(path.join(__dirname, "images")));
app.use("/api/sauces", sauceRoutes);
app.use("/api/auth", userRoutes);
//

module.exports = app;
