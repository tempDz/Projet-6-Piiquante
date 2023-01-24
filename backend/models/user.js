// Importation de mongoose pour utiliser les schémas Mongoose
const mongoose = require('mongoose');
/*Importation de la dépendance "mongoose-unique-validator" pour
valider les valeurs uniques dans les schémas Mongoose*/
const uniqueValidator = require('mongoose-unique-validator');

//Création d'un schéma pour les objets "Thing"
const userSchema = mongoose.Schema({
    //L'email de l'objet est un string requis
    email: { type: String, required: true, unique: true },
    //Le password de l'objet est un string requis
    password: { type: String, required: true },
});
/*Utilisation du plugin uniqueValidator sur le schéma de
l'utilisateur pour valider les valeurs uniques*/
userSchema.plugin(uniqueValidator);

//Exportation du modèle "user" dans la base de donnée à partir du schéma userSchema
module.exports = mongoose.model('User', userSchema);