const express = require('express');
const userCtrl = require('../controllers/user');
const auth = require('../middleware/auth');

const router = express.Router();


router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);


router.post('/', auth, (req, res, next) => {
    delete req.body._id;
    const newUser = new userCtrl({
        ...req.body

    });
    newUser.save()
        .then(() => res.status(201).json({ message: 'Objet enregistré !' }))
        .catch(error => res.status(400).json({ error }));
});

module.exports = router;