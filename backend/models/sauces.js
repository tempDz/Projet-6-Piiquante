// Importation de mongoose pour utiliser les schémas Mongoose
const mongoose = require('mongoose');
/*Importation de la dépendance "mongoose-unique-validator" pour
valider les valeurs uniques dans les schémas Mongoose*/
const uniqueValidator = require('mongoose-unique-validator');

// définition du schéma de données pour les sauces
const sauceSchema = mongoose.Schema({
    userId: { type: String, required: true },
    name: { type: String, required: true },
    manufacturer: { type: String, required: true },
    description: { type: String, required: true },
    mainPepper: { type: String, required: true },
    imageUrl: { type: String, required: true },
    heat: { type: Number, required: true, min: 1, max: 10 },
    likes: { type: Number, required: false, default: 0 },
    dislikes: { type: Number, required: false, default: 0 },
    usersLiked: { type: [String], required: false, default: [] },
    usersDisliked: { type: [String], required: false, default: [] },
});

// activation du plugin mongoose-unique-validator pour valider les valeurs uniques
sauceSchema.plugin(uniqueValidator);

// création d'un modèle Mongoose à partir du schéma 'sauceSchema'
module.exports = mongoose.model('Sauces', sauceSchema);

/*Ce code utilise Mongoose pour définir un schéma de données pour les sauces. Il définit les champs de données pour un document "sauce", tels que l'ID de l'utilisateur, le nom, le fabricant, la description, le poivre principal, l'URL de l'image, la chaleur, les likes, les dislikes et les utilisateurs qui ont aimé ou pas aimé. Il utilise également le plugin mongoose-unique-validator pour valider les valeurs uniques pour certains champs. Enfin, il crée un modèle Mongoose à partir de ce schéma pour pouvoir utiliser ce modèle pour créer, lire, mettre à jour et supprimer des documents "sauce" dans la base de données.*/