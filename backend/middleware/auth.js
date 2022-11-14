const jwt = require('jsonwebtoken');
 
module.exports = (req, res, next) => {
   try {
    //Récupération du token (apres l'espace)
       const token = req.headers.authorization.split(' ')[1];
       //Utilisation de jwb pour décoder le token
       const decodedToken = jwt.verify(token, process.env.RST);
       //On récupere userID
       const userId = decodedToken.userId;
       req.auth = {
           userId: userId
       };
	next();
   } catch(error) {
       res.status(401).json({ error });
   }
};