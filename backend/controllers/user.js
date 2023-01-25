//1
const bcrypt = require('bcrypt')
const User = require('../models/user')
const jwt = require('jsonwebtoken');

//2
exports.signup = (req, res, next) => {
    // Utilise bcrypt pour crypter le mot de passe de l'utilisateur en utilisant un sel de 10.
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


//3
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
