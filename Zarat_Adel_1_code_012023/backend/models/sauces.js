//1
// Importation de mongoose pour utiliser les schémas Mongoose
const mongoose = require('mongoose');


//3
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


//5
// création d'un modèle Mongoose à partir du schéma 'sauceSchema'
module.exports = mongoose.model('Sauces', sauceSchema);