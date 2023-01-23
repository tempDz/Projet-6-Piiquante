const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user');

router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);


router.post('/', (req, res, next) => {
    delete req.body._id;
    const newUser = new userCtrl({
        ...req.body

    });
    newUser.save()
        .then(() => res.status(201).json({ message: 'Objet enregistré !' }))
        .catch(error => res.status(400).json({ error }));
});

module.exports = router;