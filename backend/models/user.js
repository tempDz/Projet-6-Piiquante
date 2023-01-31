//1
// Importation de mongoose pour utiliser les schémas Mongoose
const mongoose = require('mongoose');
// Importe la dépendance "validator" pour valider les entrées utilisateur
const validator = require('validator');

//2
/*Importation de la dépendance "mongoose-unique-validator" pour
valider les valeurs uniques dans les schémas Mongoose*/
const uniqueValidator = require('mongoose-unique-validator');

//3
//Création d'un schéma pour les objets "Thing"
const userSchema = mongoose.Schema({
    //L'email de l'objet est un string requis
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function (value) {
                return validator.isEmail(value);
            },
            message: 'Email non valide'
        }
    },
    //Le password de l'objet est un string requis
    password: { type: String, required: true },
});

//4
/*Utilisation du plugin uniqueValidator sur le schéma de
l'utilisateur pour valider les valeurs uniques*/
userSchema.plugin(uniqueValidator);

//5
//Exportation du modèle "user" dans la base de donnée à partir du schéma userSchema
module.exports = mongoose.model('User', userSchema);