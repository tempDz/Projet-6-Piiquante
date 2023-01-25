/*La première ligne importe la bibliothèque bcrypt pour crypter les mots de passe.
La deuxième ligne importe le modèle d'utilisateur pour accéder à la base de données pour des opérations comme la création, la récupération, la mise à jour et la suppression d'utilisateurs.
La troisième ligne importe la bibliothèque jsonwebtoken pour créer et vérifier les jetons d'authentification pour les utilisateurs connectés.
Ces imports sont utilisés dans les fonctions de contrôleur d'utilisateur pour des tâches telles que la création d'utilisateurs, la vérification des informations d'identification et la génération de jetons d'authentification pour les utilisateurs connectés.*/

const bcrypt = require('bcrypt')
const User = require('../models/user')
const jwt = require('jsonwebtoken');




/*La fonction signup est utilisée pour enregistrer un nouvel utilisateur. Elle prend en entrée les données de la requête, qui comprennent l'email et le mot de passe de l'utilisateur. La fonction utilise la bibliothèque bcrypt pour crypter le mot de passe de l'utilisateur en utilisant un sel de 10. Elle crée ensuite un nouvel utilisateur avec les données envoyées dans la requête (email, mot de passe crypté). Enfin, elle enregistre l'utilisateur dans la base de données. Si l'enregistrement échoue, elle renvoie un message d'erreur. Sinon elle renvoie un message de succès.*/

exports.signup = (req, res, next) => {
    // Utilise bcrypt pour crypter le mot de passe de l'utilisateur en utilisant un chiffrement de 10.
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            // Crée un nouvel utilisateur avec les données envoyées dans la requête (email, mot de passe crypté)
            const user = new User({
                //L'email de l'objet est un string requis
                email: req.body.email,
                //Le password de l'objet est un string requis
                password: hash
            });
            // Enregistre l'utilisateur dans la base de données
            user.save()
                .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
                .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};


/*Ce code est une fonction d'authentification qui permet à un utilisateur de se connecter à l'application en fournissant son adresse email et son mot de passe. La fonction utilise les modules bcrypt et jsonwebtoken pour vérifier les informations d'identification de l'utilisateur et générer un token JWT pour l'authentification ultérieure.

La fonction commence par rechercher un utilisateur dans la base de données en utilisant l'adresse email fournie dans la requête. Si l'utilisateur n'est pas trouvé, une erreur 401 est renvoyée. Sinon, la fonction utilise bcrypt pour comparer le mot de passe fourni dans la requête avec celui stocké dans la base de données pour cet utilisateur. Si les mots de passe ne correspondent pas, une erreur 401 est renvoyée. Sinon, la fonction renvoie l'ID de l'utilisateur et un token JWT signé avec une clé secrète et valable pour 24 heures.

En cas d'erreur lors de la recherche de l'utilisateur ou de la comparaison des mots de passe, une erreur 500 est renvoyée.*/

exports.login = (req, res, next) => {
    // Recherche un utilisateur dans la base de données avec l'email spécifié dans la requête
    User.findOne({ email: req.body.email })
        .then(user => {
            // Si l'utilisateur n'est pas trouvé, renvoie une erreur 401
            if (!user) {
                return res.status(401).json({ error: 'Utilisateur non trouvé !' });
            }
            // Compare le mot de passe fourni dans la requête avec celui stocké dans la base de données pour cet utilisateur
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    // Si les mots de passe ne correspondent pas, renvoie une erreur 401
                    if (!valid) {
                        return res.status(401).json({ error: 'Mot de passe incorrect !' });
                    }
                    // Si les mots de passe correspondent, renvoie l'ID de l'utilisateur et un token JWT
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            { userId: user._id },
                            'RANDOM_TOKEN_SECRET', // La clé secrète pour signer le token
                            { expiresIn: '24h' } // Le token expirera après 24 heures
                        )
                    });
                })
                // En cas d'erreur lors de la comparaison des mots de passe, renvoie une erreur 500
                .catch(error => res.status(500).json({ error }));
        })
        // En cas d'erreur lors de la recherche de l'utilisateur, renvoie une erreur 500
        .catch(error => res.status(500).json({ error }));
};
