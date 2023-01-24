// Importation de mongoose pour utiliser les schémas Mongoose
const mongoose = require('mongoose');
/*Importation de la dépendance "mongoose-unique-validator" pour
valider les valeurs uniques dans les schémas Mongoose*/
const uniqueValidator = require('mongoose-unique-validator');


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

sauceSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Sauces', sauceSchema);