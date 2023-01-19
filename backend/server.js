const http = require('http');
const app = require('./app');

//La fonction normalizePort permet de vérifier si la variable d'environnement PORT est valide 
const normalizePort = val => {
    //on parse la valeur PORT en entier 
    const port = parseInt(val, 10);

    //Si la valeur PORT n'est pas un nombre 
    if (isNaN(port)) {
        return val;
    }
    //Si la valeur PORT est supérieure ou égale à 0
    if (port >= 0) {
        return port;
    }
    //retourne false dans les autres cas 
    return false;
};

//on utilise la fonction normalizePort pour définir la variable port
const port = normalizePort(process.env.PORT || '3000');

//on utilise la méthode app.set() pour définir la propriété 'port' de l'application express à la variable port
app.set('port', port);

//fonction pour gérer les erreurs qui peuvent survenir lors de la création ou de l'écoute du serveur
const errorHandler = error => {
    //Si l'erreur n'est pas liée à l'écoute
    if (error.syscall !== 'listen') {
        throw error;
    }
    //on récupère l'adresse du serveur
    const address = server.address();
    //on définit une variable bind pour stocker le type d'adresse et son contenu
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
    //on utilise un switch pour gérer les différents types d'erreurs
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges.');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use.');
            process.exit(1);
            break;
        default:
            throw error;
    }
};

//on crée un serveur en utilisant la méthode http.createServer(app)
const server = http.createServer(app);

//on utilise les méthodes server.on() pour gérer les événements 'error' et 'listening'
server.on('error', errorHandler);
server.on('listening', () => {
    //on récupère l'adresse du serveur
    const address = server.address();
    //on définit une variable bind pour stocker le type d'adresse et son contenu
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
    //on affiche un message indiquant que le serveur écoute sur l'adresse/port spécifié
    console.log('Listening on ' + bind);
});

//on utilise la méthode server.listen() pour écouter le serveur sur le port spécifié
server.listen(port);
