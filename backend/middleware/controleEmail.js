const validator = require('validator');

module.exports = (req, res,next) => {
    const{email} = req.body;

    if(validator.isEmail(email)){
        //email valide
        console.log("email valide !")
        next()
    }else{
        //email non valide
        return res.status(400).json({ message: `l'email ${email} n'est pas valide` })
    }
}