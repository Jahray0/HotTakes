//import package de sécurité  password validator permettant de valider un mot de passe 
const passwordValidator = require ("password-validator");


//création d'un modèle que doit respecter le mot de passe
const  passwordModel = new passwordValidator();

//ajout des propriétés à valider
passwordModel 
.is()
.min(8)                                          //Min 8 caractères
.is().max(40)                                    //Max 40 caractères
.has().uppercase(1)                              //Au moins 1 lettre majuscule
.has().lowercase()                               //doit contenir des lettres minuscules
.has().digits(2)                                 //Au moins 2 chiffres
.has().not().spaces()                            //Pas contenir d'espace 
.is().not().oneOf(['Passw0rd', 'Password123']);  //Ne pas utiliser les mot de passes trop facile a trouver


module.exports = passwordModel;