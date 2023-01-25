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


/*Ce fichier est le point d'entrée pour les routes de l'API de sauces. Il importe les fonctions de contrôleur de sauces, le middleware d'authentification et le middleware de configuration de multer pour la gestion des fichiers. Il utilise ces imports pour définir les routes pour les différentes opérations sur les sauces (créer, donner des likes/dislikes, modifier, supprimer, récupérer une ou toutes les sauces).

Il initialise un nouveau routeur express avec la ligne const router = express.Router();, puis définit les routes pour les différentes opérations sur les sauces en utilisant les méthodes post, put, delete, get de ce routeur. Chacune de ces routes utilise le middleware d'authentification pour s'assurer que seuls les utilisateurs authentifiés peuvent accéder aux données. Les routes pour créer, donner des likes/dislikes et modifier une sauce utilisent également le middleware de configuration de multer pour gérer les fichiers envoyés avec la requête.

Enfin, le dernier ligne module.exports = router; permet d'exporter le routeur pour qu'il puisse être utilisé dans l'application.*/