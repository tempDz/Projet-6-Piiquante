
//1
const jwt = require('jsonwebtoken');

// middleware pour vérifier la validité du token JWT envoyé dans la requête
module.exports = (req, res, next) => {
    try {
        // récupération du token JWT dans les en-têtes de la requête
        const token = req.headers.authorization.split(' ')[1];
        // vérification de la validité du token avec le secret 'RANDOM_TOKEN_SECRET'
        const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
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