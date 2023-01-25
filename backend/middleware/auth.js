/*Ce code importe la librairie jsonwebtoken qui permet de générer, signer et vérifier des tokens JWT (Json Web Token). Les tokens JWT sont utilisés pour authentifier les utilisateurs et transmettre des informations de manière sécurisée entre différentes parties d'une application, généralement entre le client et le serveur.*/

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
//

/*Ce code est un middleware qui vérifie la validité d'un token JWT envoyé dans les en-têtes d'une requête HTTP. Il utilise la librairie jsonwebtoken pour décoder le token et vérifier qu'il a été signé avec le secret 'RANDOM_TOKEN_SECRET'. Si le token est valide, l'identifiant de l'utilisateur contenu dans le token est ajouté à l'objet req.auth et la fonction suivante dans la chaîne de middleware est appelée. Sinon, une erreur est renvoyée avec un statut 401.*/