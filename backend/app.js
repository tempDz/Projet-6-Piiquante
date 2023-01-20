const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Thing = require('./models/Things');

mongoose.connect('mongodb+srv://Adel:W8HpmjE3Ny8h2bkB@openclassrooms.pummzx7.mongodb.net/?retryWrites=true&w=majority',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use(express.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

// Ce code utilise les méthodes Express pour gérer les requêtes HTTP POST et GET pour l'URL '/api/auth/signup'

app.post('/api/auth/signup', (req, res, next) => {
    // Supprime le champ _id de la requête
    delete req.body._id;
    // Crée une nouvelle instance de Thing avec les données de la requête
    const thing = new Thing({
        ...req.body
    });
    // Enregistre l'objet dans la base de données MongoDB
    thing.save()
        // Si l'enregistrement réussit, renvoie un statut 201 et un message de succès
        .then(() => res.status(201).json({ message: 'Objet enregistré !' }))
        // Si l'enregistrement échoue, renvoie un statut 400 et l'erreur rencontrée
        .catch(error => res.status(400).json({ error }));
});

app.use('/api/auth/signup', (req, res, next) => {
    // Récupère tous les objets de la base de données
    Thing.find()
        // Si la récupération réussit, renvoie un statut 200 et la liste des objets
        .then(things => res.status(200).json(things))
        // Si la récupération échoue, renvoie un statut 400 et l'erreur rencontrée
        .catch(error => res.status(400).json({ error }));

});

module.exports = app;