const Sauce = require("../models/Sauce");
const fs = require("fs");

/*exports.createSauce = (req, res, next) => {

  // Le corps de la requête contient un objetSauce converti en chaîne.
  // Analyse avec JSON.parse() pour obtenir un objet utilisable.
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;

  // Suppression du champ _userId de la requête car nous ne devons pas lui faire confiance.
  delete sauceObject._userId;

  // Remplacement en base de données par le _userId extrait du token.
    const sauce = new Sauce({
    ...sauceObject,
    userId: req.auth.userId,

    // Résolution de l'URL complète de l'image, car req.file.filename ne contient que le segment filename. 
    // Utilisation req.protocol pour obtenir 'http'.
    // Ajout de '://', puis utilisation de req.get('host') pour résoudre l'hôte du serveur.
    // Ajout final '/images/' et le nom de fichier pour compléter notre URL.
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
  });

  sauce
    .save()
    .then(() => {
      res.status(201).json({ message: "Objet enregistré !" });
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};*/

exports.createSauce = (req, res) => {
  // Initialisation des likes
  let dislikes = 0;
  let likes = 0;
  let usersDisliked = [];
  let usersLiked = [];

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

exports.likeDislikeSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(() => {
      //Si l'utilisateur a déjà un like (=0)
      if (req.body.like == 0) {
        // l'utilisateur avait liké ?
        if (usersLiked.include(userId)) {
          likes = likes - 1;
          usersLiked.splice(userId);
        }
        // L'utilisateur avait disliké ?
        if (usersDisliked.include(userId)) {
          dislikes = dislikes - 1;
          usersDisliked.splice(userId);
        }
        else {
          return res
            .status(401)
            .json({ error: error, msgErr: "Erreur de likes" });
        }
      }

      //si like
      if (req.body.like == 1) {
        likes = likes + 1;
        usersLiked.push(req.body.userId);
      }
      // si dislike
      if (req.body.like == -1) {
        dislikes = dislikes + 1;
        usersLiked.push(req.body.userId);
      } else {
        return res
          .status(401)
          .json({ error: error, msgErr: "Erreur valeur de like" });
      }
      console.log(req.body);
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};
