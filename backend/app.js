const express = require('express');
const app = express();

app.use((req, res) => {
    res.json({ message: 'Votre requête a bien été reçue 2 fois!' });
});

module.exports = app;   