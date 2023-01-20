const mongoose = require('mongoose');

//Création d'un schéma pour les objets "Thing"
const thingSchema = mongoose.Schema({
    //L'email de l'objet est un string requis
    email: { type: String, required: true },
    //Le password de l'objet est un string requis
    password: { type: String, required: true },
});

//Exportation du modèle "Thing" créé à partir du schéma thingSchema
module.exports = mongoose.model('Thing', thingSchema);