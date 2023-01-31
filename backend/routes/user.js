const express = require('express');
// Importe les fonctions de contrôleur d'utilisateur
const userCtrl = require('../controllers/user');
// Importe le middleware d'authentification
const auth = require('../middleware/auth');

// Initialise un nouveau routeur express
const router = express.Router();

// Définit les routes pour les différentes opérations sur les utilisateurs
// Route pour créer un compte utilisateur
router.post('/signup', userCtrl.signup);
// Route pour se connecter
router.post('/login', userCtrl.login);

// Route pour créer un utilisateur, utilise le middleware d'authentification
router.post('/', auth, (req, res, next) => {
    // Supprime l'ID de l'utilisateur qui est envoyé avec la requête
    delete req.body._id;
    // Crée un nouvel utilisateur avec les données envoyées dans la requête
    const newUser = new userCtrl({
        ...req.body
    });
    // Sauvegarde l'utilisateur en base de données
    newUser.save()
        .then(() => res.status(201).json({ message: 'Objet enregistré !' }))
        .catch(error => res.status(400).json({ error }));
});

// Exporte le routeur pour l'utiliser dans l'application
module.exports = router;