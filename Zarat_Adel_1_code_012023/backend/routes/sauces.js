const express = require('express');
// Importe les fonctions de contrôleur de sauces
const saucesCtrl = require('../controllers/sauces');
// Importe le middleware d'authentification
const auth = require('../middleware/auth');
// Importe le middleware de configuration de multer pour la gestion des fichiers
const multer = require('../middleware/multer-config');

// Initialise un nouveau routeur express
const router = express.Router();

// Définit les routes pour les différentes opérations sur les sauces
// Route pour créer une sauce, utilise les middlewares d'authentification et de gestion des fichiers
router.post("/", auth, multer, saucesCtrl.createSauce);
// Route pour donner des likes ou des dislikes sur une sauce, utilise les middlewares d'authentification et de gestion des fichiers
router.post("/:id/like", auth, multer, saucesCtrl.giveLikes);
// Route pour modifier une sauce, utilise les middlewares d'authentification et de gestion des fichiers
router.put("/:id", auth, multer, saucesCtrl.modifySauce);
// Route pour supprimer une sauce, utilise les middlewares d'authentification et de gestion des fichiers
router.delete("/:id", auth, multer, saucesCtrl.deleteSauce);
// Route pour récupérer une sauce spécifique, utilise le middleware d'authentification
router.get("/:id", auth, saucesCtrl.getOneSauce);
// Route pour récupérer toutes les sauces, utilise le middleware d'authentification
router.get("/", auth, saucesCtrl.getAllSauce);

// Exporte le routeur pour l'utiliser dans l'application
module.exports = router;