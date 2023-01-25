const multer = require('multer');

// définition des types MIME autorisés pour les images
const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
};

// configuration de multer pour stocker les images sur le serveur
const storage = multer.diskStorage({
    // spécification du répertoire de destination pour les images
    destination: (req, file, callback) => {
        callback(null, 'images');
    },
    // spécification du nom de fichier pour les images
    filename: (req, file, callback) => {
        // remplacement des espaces par des underscores dans le nom original
        const name = file.originalname.split(' ').join('_');
        // récupération de l'extension à partir du type MIME de l'image
        const extension = MIME_TYPES[file.mimetype];
        // génération du nom de fichier final en concatenant l'heure actuelle
        callback(null, name + Date.now() + '.' + extension);
    }
});

// exportation de l'instance de multer configurée pour gérer un seul fichier 'image'
module.exports = multer({ storage: storage }).single('image');

/*Ce code utilise la librairie multer pour gérer l'upload d'images sur le serveur. Il définit les types MIME autorisés pour les images, configure multer pour stocker les images dans un répertoire "images" et spécifie le nom de fichier pour les images avec un nom d'origine, un timestamp actuel et une extension définie en fonction de leur type MIME . Il exporte une instance de multer configurée pour gérer un seul fichier image.*/