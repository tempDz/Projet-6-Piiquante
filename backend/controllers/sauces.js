
const Sauce = require("../models/sauces");
const fs = require("fs");

exports.createSauce = (req, res, next) => {
    const like = JSON.parse(req.body.sauce);
    delete like._id;
    delete like._userId;
    const sauce = new Sauce({
        ...like,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename
            }`,
    });
    sauce
        .save()
        .then(() => {
            res.status(201).json({ message: "Sauce enregistrée !" });
        })
        .catch((error) => {
            res.status(400).json({ error });
        });
};

exports.giveLikes = (req, res, next) => {
    if (req.body.like === 0) {
        Sauce.findOne({ _id: req.params.id })
            .then((sauce) => {
                if (sauce.usersLiked.find((user) => user === req.body.userId)) {
                    Sauce.updateOne(
                        { _id: req.params.id },
                        {
                            $inc: { likes: -1 },
                            $pull: { usersLiked: req.body.userId },
                        }
                    )
                        .then(() => {
                            res
                                .status(201)
                                .json({ message: "Merci !" });
                        })
                        .catch((error) => {
                            res.status(400).json({ error });
                        });
                }
                if (sauce.usersDisliked.find((user) => user === req.body.userId)) {
                    Sauce.updateOne(
                        { _id: req.params.id },
                        {
                            $inc: { dislikes: -1 },
                            $pull: { usersDisliked: req.body.userId },
                        }
                    )
                        .then(() => {
                            res
                                .status(201)
                                .json({
                                    message: "Pas merci !",
                                });
                        })
                        .catch((error) => {
                            res.status(400).json({ error });
                        });
                }
            })
            .catch((error) => {
                res.status(400).json({ error });
            });
    }
    if (req.body.like === 1) {
        Sauce.updateOne(
            { _id: req.params.id },
            {
                $inc: { likes: 1 },
                $push: { usersLiked: req.body.userId },
            }
        )
            .then(() => {
                res.status(201).json({ message: "moins 1 Like !" });
            })
            .catch((error) => {
                res.status(400).json({ error });
            });
    }
    if (req.body.like === -1) {
        Sauce.updateOne(
            { _id: req.params.id },
            {
                $inc: { dislikes: 1 },
                $push: { usersDisliked: req.body.userId },
            }
        )
            .then(() => {
                res.status(201).json({ message: "moins un Dislike ! " });
            })
            .catch((error) => {
                res.status(400).json({ error });
            });
    }
};

exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({
        _id: req.params.id,
    })
        .then((sauce) => {
            res.status(200).json(sauce);
        })
        .catch((error) => {
            res.status(404).json({
                error: error,
            });
        });
};

exports.modifySauce = (req, res, next) => {
    const like = req.file
        ? {
            ...JSON.parse(req.body.sauce),
            imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename
                }`,
        }
        : { ...req.body };

    delete like._userId;
    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {
            if (sauce.userId != req.auth.userId) {
                res.status(403).json({ message: "Non-autorisé" });
            } else {
                Sauce.updateOne(
                    { _id: req.params.id },
                    { ...like, _id: req.params.id }
                )
                    .then(() =>
                        res.status(200).json({ message: "Sauce modifiée avec succès !" })
                    )
                    .catch((error) => res.status(401).json({ error }));
            }
        })
        .catch((error) => {
            res.status(400).json({ error });
        });
};

exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {
            const filename = sauce.imageUrl.split("/images/")[1];
            fs.unlink(`images/${filename}`, () => {
                Sauce.deleteOne({ _id: req.params.id })
                    .then(() =>
                        res.status(200).json({ message: "Sauce supprimée avec succès !" })
                    )
                    .catch((error) => res.status(400).json({ error }));
            });
        })
        .catch((error) => res.status(500).json({ error }));
};

exports.getAllSauce = (req, res, next) => {
    Sauce.find()
        .then((sauces) => {
            res.status(200).json(sauces);
        })
        .catch((error) => {
            res.status(400).json({
                error: error,
            });
        });
};