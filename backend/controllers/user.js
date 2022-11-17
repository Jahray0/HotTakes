const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
require("dotenv").config();

//Middleware singup (Création utilisateur)
exports.signup = (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then(hash => {
      const user = new User({
        email: req.body.email,
        password: hash
      });
      console.log(user)
      user.save()
      
        .then(() => res.status(201).json({ message: 'L\'utilisateur a bien été créé !' }))
        .catch(error => res.status(400).json({ error: 'Un probleme est survenu. Merci de rentrer un email et un mot de passe valide.' }));
    })
    .catch(error => res.status(500).json({ error: 'Veuillez saisir un email et/ou un mot de passe.' }));
};

//Middleware login (connexion utilisateur existant)
exports.login = (req, res, next) => {
  User.findOne({ email: req.body.email })
      .then(user => {
          if (!user) {
              return res.status(401).json({ message: 'Login ou mot de passe incorrecte'});
          }
          //Comparaison avec bcrypt
          bcrypt.compare(req.body.password, user.password)
              .then(valid => {
                  if (!valid) {
                      return res.status(401).json({ message: 'Login ou mot de passe incorrecte' });
                  }
                  res.status(200).json({
                      userId: user._id,
                      token: jwt.sign(
                        { userId: user._id},
                        process.env.RST,
                        { expiresIn:'24h'}
                      )
                  });
              })
              .catch(error => res.status(500).json({ error: `Une erreur d'authentification est survenu merci d'essayer a nouveau sinon contacter le support` }));
      })
      //L'utilisateur n'existe pas
      .catch(error => res.status(500).json({ error: `Une erreur d'authentification est survenu merci d'essayer a nouveau sinon contacter le support` }));
};
