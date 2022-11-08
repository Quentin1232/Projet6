const express = require("express");
const mongoose = require("mongoose");
const saucesRoutes = require("./routes/sauces");
const userRoutes = require("./routes/user");
const path = require("path");

// Initialisation de mongoose
mongoose
  .connect(
    'mongodb+srv://Quentin:Spectre.1@cluster0.d3f0t4j.mongodb.net/?retryWrites=true&w=majority',
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

const app = express();

app.use((req, res, next) => {

  // Autorisation d'accès depuis n'importe quelle origine
  res.setHeader("Access-Control-Allow-Origin", "*");
  
  // Ajouter les headers mentionnés aux requêtes envoyées vers notre API
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );

  // Envoyer des requêtes avec les méthodes mentionnées
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

app.use(express.json());

app.use("/api/sauces", saucesRoutes);
app.use("/api/auth", userRoutes);
app.use("/images", express.static(path.join(__dirname, "images")));

module.exports = app;
