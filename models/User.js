const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

// Création d'un nouveau schéma
const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

// Assure une adresse mail unique.
userSchema.plugin(uniqueValidator);

// Exporter le schéma et le rendre disponible pour Express
module.exports = mongoose.model("User", userSchema);
