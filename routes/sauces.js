const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");

const sauceCtrl = require("../controllers/sauces");

// Récupérer tous les objets
router.get("/", auth, sauceCtrl.getAllSauces);

// Créer un objet
router.post("/", auth, multer, sauceCtrl.createSauce);

// Récupérer un objet
router.get("/:id", auth, sauceCtrl.getOneSauce);

// Modifier un objet
router.put("/:id", auth, multer, sauceCtrl.modifySauce);

// Supprimer un objet
router.delete("/:id", auth, sauceCtrl.deleteSauce);

// Ajouter un like/dislike
router.post("/:id/like", auth, sauceCtrl.likeDislikeSauce);

module.exports = router;

// L'ordre des middlewares est important. Si multer avant l'authentification, alors les images non authentifiées seront enregistrées.