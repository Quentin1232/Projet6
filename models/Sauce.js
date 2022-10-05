const mongoose = require("mongoose");

// Création d'un nouveau schéma
const sauceSchema = mongoose.Schema({
  //nom du champ: { type de champ, obligatoire?, unique? }
  name: { type: String, required: true },
  manufacturer: { type: String },
  description: { type: String, required: true },
  mainPepper: { type: String, required: true },
  imageUrl: { type: String, required: true },
  userId: { type: String, required: true, unique: true },
  heat: { type: Number, required: true },
  likes: { type: Number, required: false },
  dislikes: { type: Number, required: false },
  usersLiked: { type: Array, required: false },
  usersDisliked: { type: Array, required: false },
});

// Exporter le schéma et le rendre disponible pour Express
module.exports = mongoose.model("Sauce", sauceSchema);

/*
● userId : String — l'identifiant MongoDB unique de l'utilisateur qui a créé la sauce
● name : String — nom de la sauce
● manufacturer : String — fabricant de la sauce
● description : String — description de la sauce
● mainPepper : String — le principal ingrédient épicé de la sauce
● imageUrl : String — l'URL de l'image de la sauce téléchargée par l'utilisateur
● heat : Number — nombre entre 1 et 10 décrivant la sauce
● likes : Number — nombre d'utilisateurs qui aiment (= likent) la sauce
● dislikes : Number — nombre d'utilisateurs qui n'aiment pas (= dislike) la
sauce
● usersLiked : [ "String <userId>" ] — tableau des identifiants des utilisateurs
qui ont aimé (= liked) la sauce
● usersDisliked : [ "String <userId>" ] — tableau des identifiants des
utilisateurs qui n'ont pas aimé (= disliked) la sauce */
