const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/User");
require("dotenv").config();

exports.signup = (req, res, next) => {
  // Fonction de hachage
  bcrypt

    // Saler (crypter) 10 fois
    .hash(req.body.password, 10)

    // création d'un utilisateur et enregistrement dans la base de données
    .then((hash) => {
      const user = new User({
        email: req.body.email,
        password: hash,
      });
      user
        .save()
        .then(() => res.status(201).json({ message: "Utilisateur créé !" }))
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};

// Utilisation du modèle Mongoose pour vérifier que l'e-mail est déjà dans la base de donnée
exports.login = (req, res, next) => {
  User.findOne({ email: req.body.email })
    .then((user) => {
      // Si adresse inconnue, erreur401
      if (!user) {
        return res.status(401).json({ error: "Utilisateur non trouvé !" });
      }

      // Comparaison du mot de passe entré avec le hash enregistré
      bcrypt
        .compare(req.body.password, user.password)
        .then((valid) => {
          //S'ils ne correspondent pas, erreur401 Unauthorized.
          if (!valid) {
            // Même message que lorsque utilisateur inconnu pour ne pas laisser quelqu’un vérifier si une autre personne est inscrite
            return res.status(401).json({ error: "Mot de passe incorrect !" });
          }

          // Si les informations d'identification sont valides, renvoie une réponse 200 contenant l'ID utilisateur et un token.
          res.status(200).json({
            userId: user._id,

            // La fonction sign de jsonwebtoken chiffre un nouveau token avec l'ID de l'utilisateur en tant que payload (les données encodées).
            token: jwt.sign({ userId: user._id }, process.env.token, {
              expiresIn: "24h",
            }),
          });
        })
        .catch((error) => res.status(500).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};
