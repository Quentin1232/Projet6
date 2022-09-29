const Thing = require("../models/thing");
const fs = require("fs");

/*exports.createThing = (req, res, next) => {

  // Le corps de la requête contient un objetThing converti en chaîne.
  // Analyse avec JSON.parse() pour obtenir un objet utilisable.
  const thingObject = JSON.parse(req.body.thing);
  delete thingObject._id;

  // Suppression du champ _userId de la requête car nous ne devons pas lui faire confiance.
  delete thingObject._userId;

  // Remplacement en base de données par le _userId extrait du token.
    const thing = new Thing({
    ...thingObject,
    userId: req.auth.userId,

    // Résolution de l'URL complète de l'image, car req.file.filename ne contient que le segment filename. 
    // Utilisation req.protocol pour obtenir 'http'.
    // Ajout de '://', puis utilisation de req.get('host') pour résoudre l'hôte du serveur.
    // Ajout final '/images/' et le nom de fichier pour compléter notre URL.
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
  });

  thing
    .save()
    .then(() => {
      res.status(201).json({ message: "Objet enregistré !" });
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};*/

exports.createThing = (req, res) => {
  // récupère les information de la sauce dans une variable
  const things = JSON.parse(req.body.thing);
  if (!things) {
    return res
      .status(401)
      .json({ error: error, msgErr: "Erreur récupération des données" });
  }
  // crée un nouvel element sauce avec l'url de l'image associer
  const thing = new Thing({
    ...things,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
  });
  if (!thing) {
    return res
      .status(401)
      .json({ error: error, msgErr: "Erreur création objet" });
  }

  // sauvegarde le nouvel element
  sauce
    .save()
    .then((createdSauce) =>
      res.status(201).json({ message: "objet enregistrer", data: createdSauce })
    )
    .catch((error) => res.status(400).json({ error }));
};

exports.getOneThing = (req, res, next) => {
  Thing.findOne({
    _id: req.params.id,
  })
    .then((thing) => {
      res.status(200).json(thing);
    })
    .catch((error) => {
      res.status(404).json({
        error: error,
      });
    });
};

exports.modifyThing = (req, res, next) => {
  // Création d'un objet thingObject regardant si req.file existe. Si oui, on traite la nouvelle image ; sinon, on traite simplement l'objet entrant.
  const thingObject = req.file
    ? {
        ...JSON.parse(req.body.thing),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : { ...req.body };

  delete thingObject._userId;

  // Création d'une instance Thing à partir de thingObject, puis modification.
  Thing.findOne({ _id: req.params.id })
    .then((thing) => {
      if (thing.userId != req.auth.userId) {
        return res.status(401).json({ message: "Not authorized" });
      } else {
        Thing.updateOne(
          { _id: req.params.id },
          { ...thingObject, _id: req.params.id }
        )
          .then(() => res.status(200).json({ message: "Objet modifié!" }))
          .catch((error) => res.status(401).json({ error }));
      }
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

exports.deleteThing = (req, res, next) => {
  // Utilisation de l'ID reçu comme paramètre pour accéder au Thing correspondant.
  Thing.findOne({ _id: req.params.id })
    .then((thing) => {
      // Vérification si utilisateur faisant la requête de suppression = celui qui a créé le Thing.
      if (thing.userId != req.auth.userId) {
        res.status(401).json({ message: "Not authorized" });
      } else {
        // Séparation du nom de fichier de l'URL.
        const filename = thing.imageUrl.split("/images/")[1];

        // Utilisation fonction unlink pour supprimer ce fichier
        fs.unlink(`images/${filename}`, () => {
          // Implémentation logique d'origine en supprimant le Thing de la base de données.
          Thing.deleteOne({ _id: req.params.id })
            .then(() => {
              res.status(200).json({ message: "Objet supprimé !" });
            })
            .catch((error) => res.status(401).json({ error }));
        });
      }
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};

exports.getAllStuff = (req, res, next) => {
  Thing.find()
    .then((things) => {
      res.status(200).json(things);
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
};
