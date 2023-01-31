
//1
const jwt = require('jsonwebtoken');
require('dotenv').config();
//2
// middleware pour vérifier la validité du token JWT envoyé dans la requête
module.exports = (req, res, next) => {
    try {
        // récupération du token JWT dans les en-têtes de la requête
        const token = req.headers.authorization.split(' ')[1];
        // vérification de la validité du token avec la clé secrete
        const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
        // récupération de l'identifiant de l'utilisateur contenu dans le token
        const userId = decodedToken.userId;
        // ajout de l'identifiant de l'utilisateur à l'objet 'req.auth'
        req.auth = {
            userId: userId
        };
        // appel de la fonction suivante dans la chaîne de middleware
        next();
    } catch (error) {
        // en cas d'erreur, renvoi d'un statut 401 et d'un message d'erreur
        res.status(401).json({ error });
    }
};