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

/*Ce fichier est le point d'entrée pour les routes de l'API d'utilisateurs. Il importe les fonctions de contrôleur d'utilisateur, le middleware d'authentification. Il utilise ces imports pour définir les routes pour les différentes opérations sur les utilisateurs (créer un compte, se connecter, créer un utilisateur).
Il initialise un nouveau routeur express avec la ligne const router = express.Router();, puis définit les routes pour les différentes opérations sur les utilisateurs en utilisant les méthodes post de ce routeur.
La route pour créer un utilisateur utilise également le middleware d'authentification pour s'assurer que seuls les utilisateurs authentifiés peuvent accéder aux données.
Enfin, le dernier ligne module.exports = router; permet d'exporter le routeur pour qu'il puisse être utilisé dans l'application.*/