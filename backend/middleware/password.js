const passwordModel = require("../models/password");

module.exports = (req, res, next) => {
  //Si aucun mot de passe n'est renseigné
  if (req.body.password == null) {
    res.status(400).json({ error: `Veuillez entrer un nom d'utilisateur et un mot de passe.` });
    //sinon si le mot de passe ne remplis pas les critères
  } else if (!passwordModel.validate(req.body.password)) {
    res.status(400).json({ error: `Veuillez entrer un mot de passe avec au moins 8 caracteres, une majuscule, une mminuscule et au moins 2 chiffres .` });
  }
  //Sinon le mot de passe est ok 
  else {
    next();
  }
};
