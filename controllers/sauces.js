const Sauce = require("../models/Sauce");
const fs = require("fs");

exports.createSauce = (req, res) => {
  // récupère les information de la sauce dans une variable
  const sauces = JSON.parse(req.body.sauce);
  if (!sauces) {
    return res
      .status(401)
      .json({ error: error, msgErr: "Erreur récupération des données" });
  }
  // crée un nouvel element sauce avec l'url de l'image associer
  const sauce = new Sauce({
    ...sauces,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
  });
  if (!sauce) {
    return res
      .status(401)
      .json({ error: error, msgErr: "Erreur création objet" });
  }

  // sauvegarde le nouvel element
  sauce
    .save()
    .then((createdSauce) =>
      res.status(201).json({ message: "objet enregistré", data: createdSauce })
    )
    .catch((error) =>
      res.status(400).json({ error: error, msgErr: "Pourquoi ça marche pas ?" })
    );
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
  // Création d'un objet sauceObject regardant si req.file existe.
  // Si oui, on traite la nouvelle image ; sinon, on traite simplement l'objet entrant.
  const sauceObject = req.file
    ? {
        ...JSON.parse(req.body.sauce),

        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : { ...req.body };
  if (!sauceObject) {
    alert("problème sauce object");
  }
  delete sauceObject._userId;

  // Création d'une instance Sauce à partir de sauceObject, puis modification.
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      if (sauce.userId === req.auth.userId) {
        if (!req.file) {
          Sauce.updateOne(
            { _id: req.params.id },
            { ...sauceObject, _id: req.params.id }
          )
            .then(() => res.status(200).json({ message: "Objet modifié !" }))
            .catch((error) => res.status(400).json({ error }));
        } else {
          const filename = sauce.imageUrl.split("/images/")[1];
          fs.unlink(`images/${filename}`, () => {
            Sauce.updateOne(
              { _id: req.params.id },
              { ...sauceObject, _id: req.params.id }
            )
              .then(() => res.status(200).json({ message: "Objet modifié !" }))
              .catch((error) => res.status(400).json({ error }));
          });
        }
      } else {
        res.status(401).json({ message: "Unauthorized request !" });
      }
    })
    .catch((error) => res.status(500).json({ error }));
};

exports.deleteSauce = (req, res, next) => {
  // Utilisation de l'ID reçu comme paramètre pour accéder au Sauce correspondant.
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      // Vérification si utilisateur faisant la requête de suppression = celui qui a créé le Sauce.
      if (sauce.userId != req.auth.userId) {
        return res.status(401).json({ error: error, msgErr: "Not authorized" });
      }
      // Séparation du nom de fichier de l'URL.
      const filename = sauce.imageUrl.split("/images/")[1];

      // Utilisation fonction unlink pour supprimer ce fichier
      fs.unlink(`images/${filename}`, () => {
        // Implémentation logique d'origine en supprimant la Sauce de la base de données.
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => {
            res.status(200).json({ message: "Objet supprimé !" });
          })
          .catch((error) => res.status(401).json({ error }));
      });
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};

exports.getAllSauces = (req, res, next) => {
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

exports.likeDislikeSauce = async (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      console.log(sauce);
      if(sauce){
          //If the user like the sauce
        if(req.body.like == 1){
          if ((sauce.usersLiked.includes(req.body.userId)) || (sauce.usersDisliked.includes(req.body.userId))) {
            res.status(401).json({ message: 'Sauce already liked or disliked !' })
        } else {
            Sauce.updateOne(
                { _id: req.params.id },
                {
                    $push: { usersLiked: req.body.userId },
                    $inc: { likes: +1 }
                }
            )
                .then(() => res.status(200).json({ message: 'Sauce liked !' }))
                .catch(error => res.status(400).json({ error }));
        }
        }else if(req.body.like == -1){
          if ((sauce.usersDisliked.includes(req.body.userId)) || (sauce.usersLiked.includes(req.body.userId))) {
            res.status(401).json({ message: 'Sauce already disliked or liked!' })
          } else {
              Sauce.updateOne(
                  { _id: req.params.id },
                  {
                      $push: { usersDisliked: req.body.userId },
                      $inc: { dislikes: +1 }
                  }
              )
                  .then(() => res.status(200).json({ message: 'Sauce disliked !' }))
                  .catch(error => res.status(400).json({ error }));
          }
        }else if(req.body.like == 0){
          if (sauce.usersLiked.includes(req.body.userId)) {
            Sauce.updateOne(
                { _id: req.params.id },
                {
                    $pull: { usersLiked: req.body.userId },
                    $inc: { likes: 0 }
                }
            )
                .then(() => res.status(200).json({ message: 'You dont like this sauce anymore !' }))
                .catch(error => res.status(400).json({ error }));
          }else if (sauce.usersDisliked.includes(req.body.userId)) {
              Sauce.updateOne(
                  { _id: req.params.id },
                  {
                      $pull: { usersDisliked: req.body.userId },
                      $inc: { dislikes: 0 }
                  }
              )
                  .then(() => res.status(200).json({ message: 'You dont like this sauce anymore !' }))
                  .catch(error => res.status(400).json({ error }));
          }else {
              res.status(500).json({ message: 'eereureee' })
          }

        }else{
          res.status(401).json({message: 'unauthorized request!'})
        }
      }else{
        return res.status(404).json({message: 'No sauce found with that ID!'})
      }

      console.log(req.body);
    })
    .catch((error) => {
      console.log(error)
      console.log(req.params.id)
      res.status(500).json({ error: error, msgErr: "Erreur ailleurs" });
    });
};