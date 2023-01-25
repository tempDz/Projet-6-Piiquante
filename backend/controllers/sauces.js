
/*Ces lignes de code importent le module "Sauce" depuis le chemin de fichier "../models/sauces" et importent le module "fs" (file system) de la bibliothèque de noeuds de base. Le module "Sauce" est utilisé pour accéder à la base de données de sauces, tandis que le module "fs" est utilisé pour accéder aux fonctionnalités de système de fichiers de Node.js, comme la lecture et l'écriture de fichiers*/

// Import de module 'Sauce' depuis le chemin de fichier '../models/sauces'
const Sauce = require("../models/sauces");
// Import de module 'fs' (file system) de la bibliothèque de noeuds de base 
const fs = require("fs");





/*Cette fonction permet de créer une nouvelle sauce en récupérant les propriétés 'like' de la sauce depuis la demande, en supprimant l'identifiant et l'identifiant de l'utilisateur de l'objet 'like', puis en créant une nouvelle instance de 'Sauce' avec les propriétés 'like', l'identifiant de l'utilisateur et l'URL de l'image. Enfin, la nouvelle sauce est enregistrée dans la base de données et un message de succès ou une erreur est renvoyée en fonction de l'enregistrement réussi ou non.*/

// Exporte la fonction 'createSauce' pour la création d'une nouvelle sauce
exports.createSauce = (req, res, next) => {
    // Récupère les propriétés 'like' de la sauce depuis la demande
    const like = JSON.parse(req.body.sauce);

    // Supprime l'identifiant et l'identifiant de l'utilisateur de l'objet 'like'
    delete like._id;
    delete like._userId;

    // Crée une nouvelle instance de 'Sauce' avec les propriétés 'like', l'identifiant de l'utilisateur et l'URL de l'image
    const sauce = new Sauce({
        ...like,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
    });

    // Enregistre la nouvelle sauce dans la base de données
    sauce
        .save()
        .then(() => {
            // Renvoie un message de succès
            res.status(201).json({ message: "Sauce enregistrée !" });
        })
        .catch((error) => {
            // Renvoie une erreur en cas d'échec
            res.status(400).json({ error });
        });
};


/*Cette fonction permet à un utilisateur de donner un like, un dislike ou de supprimer un like/dislike pour une sauce en utilisant l'identifiant de la sauce fourni dans les paramètres de la requête. Si le body de la requête contient 'like' égal à 0, la fonction va chercher la sauce correspondante dans la base de données et vérifier si l'utilisateur a déjà aimé ou disliké cette sauce. Si oui, le nombre de likes/dislikes sera décrémenté et l'utilisateur sera supprimé de la liste des utilisateurs qui ont aimé/disliké. Si le body de la requête contient 'like' égal à 1, le nombre de likes sera incrémenté et l'utilisateur sera ajouté à la liste des utilisateurs*/

// Exporte la fonction 'giveLikes' pour donner des likes/dislikes à une sauce
exports.giveLikes = (req, res, next) => {
    // Si le body de la requête contient 'like' égal à 0
    if (req.body.like === 0) {
        // Trouve une sauce par son identifiant dans la base de données
        Sauce.findOne({ _id: req.params.id })
            .then((sauce) => {
                // Si l'utilisateur a déjà aimé cette sauce
                if (sauce.usersLiked.find((user) => user === req.body.userId)) {
                    // Met à jour la sauce en incrémentant le nombre de likes de -1 et en enlevant l'utilisateur des utilisateurs qui ont aimé
                    Sauce.updateOne(
                        { _id: req.params.id },
                        {
                            $inc: { likes: -1 },
                            $pull: { usersLiked: req.body.userId },
                        }
                    )
                        .then(() => {
                            // Renvoie un message de succès
                            res
                                .status(201)
                                .json({ message: "Merci !" });
                        })
                        .catch((error) => {
                            // Renvoie une erreur en cas d'échec
                            res.status(400).json({ error });
                        });
                }
                // Si l'utilisateur a déjà disliké cette sauce
                if (sauce.usersDisliked.find((user) => user === req.body.userId)) {
                    // Met à jour la sauce en incrémentant le nombre de dislikes de -1 et en enlevant l'utilisateur des utilisateurs qui ont disliké
                    Sauce.updateOne(
                        { _id: req.params.id },
                        {
                            $inc: { dislikes: -1 },
                            $pull: { usersDisliked: req.body.userId },
                        }
                    )
                        .then(() => {
                            // Renvoie un message de succès
                            res
                                .status(201)
                                .json({
                                    message: "Pas merci !",
                                });
                        })
                        .catch((error) => {
                            // Renvoie une erreur en cas d'échec
                            res.status(400).json({ error });
                        });
                }
            })
            .catch((error) => {
                // Renvoie une erreur en cas d'échec
                res.status(400).json({ error });
            });
    }
    // Si le body de la requête contient 'like' égal à 1
    if (req.body.like === 1) {
        // Met à jour la sauce en incrémentant le nombre de likes de 1 et en ajoutant l'utilisateur aux utilisateurs qui ont aimé
        Sauce.updateOne(
            { _id: req.params.id },
            {
                $inc: { likes: 1 },
                $push: { usersLiked: req.body.userId },
            }
        )
            .then(() => {
                // Renvoie un message de succès
                res.status(201).json({ message: "moins 1 Like !" });
            })
            .catch((error) => {
                // Renvoie une erreur en cas d'échec
                res.status(400).json({ error });
            });
    }
    // Si le body de la requête contient 'like' égal à -1
    if (req.body.like === -1) {
        // Met à jour la sauce en incrémentant le nombre de dislikes de 1 et en ajoutant l'utilisateur aux utilisateurs qui ont disliké
        Sauce.updateOne(
            { _id: req.params.id },
            {
                $inc: { dislikes: 1 },
                $push: { usersDisliked: req.body.userId },
            }
        )
            .then(() => {
                // Renvoie un message de succès
                res.status(201).json({ message: "moins un Dislike ! " });
            })
            .catch((error) => {
                // Renvoie une erreur en cas d'échec
                res.status(400).json({ error });
            });
    }
};


/*Ce code exporte une fonction appelée "getOneSauce" qui permet de récupérer les détails d'une sauce spécifique en utilisant l'identifiant de la sauce fourni dans les paramètres de la requête. La fonction utilise la méthode "findOne" de la classe "Sauce" pour trouver une sauce correspondant à l'identifiant fourni dans la requête. Si la sauce est trouvée, elle est renvoyée en réponse avec un statut HTTP 200. Si une erreur se produit ou si la sauce n'est pas trouvée, une réponse avec un statut HTTP 404 et une erreur est renvoyée.*/

// Exporte la fonction 'getOneSauce' pour récupérer les détails d'une sauce spécifique
exports.getOneSauce = (req, res, next) => {
    // Trouve une sauce correspondant à l'identifiant fourni dans les paramètres de la requête
    Sauce.findOne({
        _id: req.params.id,
    })
        .then((sauce) => {
            // Renvoie la sauce trouvée avec un statut HTTP 200
            res.status(200).json(sauce);
        })
        .catch((error) => {
            // Renvoie une erreur avec un statut HTTP 404 si une erreur se produit ou si la sauce n'est pas trouvée
            res.status(404).json({
                error: error,
            });
        });
};


/*Cette fonction exportée "modifySauce" permet de modifier une sauce existante en utilisant l'identifiant de la sauce fourni dans les paramètres de la requête. Elle vérifie d'abord si l'utilisateur authentifié est le créateur de la sauce, si oui, elle va mettre à jour la sauce avec les nouvelles informations, sinon elle va renvoyer un message d'erreur "non autorisé". Si la modification a réussi, elle va renvoyer un message de succès, sinon elle va renvoyer une erreur. En cas d'erreur lors de la recherche de la sauce, elle va renvoyer une erreur.*/

// Exporte la fonction 'modifySauce' pour modifier une sauce existante
exports.modifySauce = (req, res, next) => {
    // Si une image est incluse dans la requête, ajoute l'URL de l'image à l'objet 'like'
    const like = req.file
        ? {
            ...JSON.parse(req.body.sauce),
            imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename
                }`,
        }
        : { ...req.body };
    // Supprime l'identifiant utilisateur de l'objet 'like'
    delete like._userId;
    // Trouve une sauce correspondant à l'identifiant fourni dans les paramètres de la requête
    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {
            // Vérifie si l'utilisateur authentifié est le créateur de la sauce
            if (sauce.userId != req.auth.userId) {
                // Renvoie un message d'erreur si l'utilisateur n'est pas autorisé à effectuer la modification
                res.status(403).json({ message: "Non autorisé" });
            } else {
                // Met à jour la sauce avec les nouvelles informations
                Sauce.updateOne(
                    { _id: req.params.id },
                    { ...like, _id: req.params.id }
                )
                    .then(() =>
                        // Renvoie un message de succès si la modification a réussi
                        res.status(200).json({ message: "Sauce modifiée !" })
                    )
                    .catch((error) =>
                        // Renvoie une erreur si la modification a échoué
                        res.status(401).json({ error })
                    );
            }
        })
        .catch((error) => {
            // Renvoie une erreur si une erreur se produit lors de la recherche de la sauce
            res.status(400).json({ error });
        });
};


/*Cette fonction permet de supprimer une sauce existante en utilisant l'identifiant de la sauce fourni dans les paramètres de la requête. Elle utilise la méthode findOne de la classe Sauce pour trouver la sauce correspondant à l'identifiant fourni dans les paramètres de la requête. Si la sauce est trouvée, elle utilise la méthode unlink de la classe fs pour supprimer le fichier image associé à la sauce. Ensuite, elle utilise la méthode deleteOne de la classe Sauce pour supprimer la sauce de la base de données. Si la suppression a réussi, elle renvoie un message de succès. Si la suppression a échoué ou si une erreur se produit lors de la recherche de la sauce, elle renvoie une erreur.*/

// Exporte la fonction 'deleteSauce' pour supprimer une sauce existante
exports.deleteSauce = (req, res, next) => {
    // Trouve une sauce correspondant à l'identifiant fourni dans les paramètres de la requête
    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {
            // Récupère le nom de fichier de l'image associée à la sauce
            const filename = sauce.imageUrl.split("/images/")[1];
            // Supprime le fichier image associé à la sauce
            fs.unlink(`images/${filename}`, () => {
                // Supprime la sauce de la base de données
                Sauce.deleteOne({ _id: req.params.id })
                    .then(() =>
                        // Renvoie un message de succès si la suppression a réussi
                        res.status(200).json({ message: "Sauce supprimée !" })
                    )
                    .catch((error) =>
                        // Renvoie une erreur si la suppression a échoué
                        res.status(400).json({ error })
                    );
            });
        })
        .catch((error) =>
            // Renvoie une erreur si une erreur se produit lors de la recherche de la sauce
            res.status(500).json({ error })
        );
};

/*Cette fonction permet de récupérer toutes les sauces enregistrées dans la base de données. Elle utilise la méthode find() de la classe Sauce pour trouver toutes les sauces enregistrées dans la base de données. Si la recherche a réussi, elle renvoie toutes les sauces trouvées avec un statut HTTP 200. Si une erreur se produit lors de la recherche, elle renvoie une erreur avec un statut HTTP 400.*/

// Exporte la fonction 'getAllSauce' pour récupérer toutes les sauces
exports.getAllSauce = (req, res, next) => {
    // Trouve toutes les sauces dans la base de données
    Sauce.find()
        .then((sauces) => {
            // Renvoie toutes les sauces trouvées avec un statut HTTP 200
            res.status(200).json(sauces);
        })
        .catch((error) => {
            // Renvoie une erreur avec un statut HTTP 400 si une erreur se produit
            res.status(400).json({
                error: error,
            });
        });
};
