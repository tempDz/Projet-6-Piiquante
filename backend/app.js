const express = require('express');
// importation de la librairie mongoose pour connecter à la base de données MongoDB
const mongoose = require('mongoose');
// importation des routes définies dans le fichier './routes/user'
const userRoute = require("./routes/user")
// importation des routes définies dans le fichier './routes/sauces'
const userSauce = require("./routes/sauces")
// importation de la librairie 'path' pour manipuler les chemins de fichiers
const path = require("path");


// Connexion à la base de données MongoDB à l'aide de Mongoose
mongoose.connect('mongodb+srv://Adel:W8HpmjE3Ny8h2bkB@openclassrooms.pummzx7.mongodb.net/?retryWrites=true&w=majority',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

// Création d'une instance Express
const app = express();

// Utilisation de express.json() pour traiter les données envoyées en format JSON
app.use(express.json());

// Configuration des en-têtes de réponse pour permettre l'accès à l'API depuis n'importe quelle origine
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

// Utilisation des routes définies dans les fichiers './routes/user' et './routes/sauces'
app.use('/api/auth', userRoute)
app.use("/api/sauces", userSauce);

// Utilisation de express.static() pour servir les images depuis le répertoire 'images'
app.use("/images", express.static(path.join(__dirname, "images")));

// Exportation de l'application pour l'utiliser dans d'autres fichiers
module.exports = app;