const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");

const stuffCtrl = require("../controllers/stuff");

// Récupérer tous les objets
router.get("/", auth, stuffCtrl.getAllStuff);

// Créer un objet
router.post("/", auth, multer, stuffCtrl.createThing);

// Récupérer un objet
router.get("/:id", auth, stuffCtrl.getOneThing);

// Modifier un objet
router.put("/:id", auth, multer, stuffCtrl.modifyThing);

// Supprimer un objet
router.delete("/:id", auth, stuffCtrl.deleteThing);

module.exports = router;

// L'ordre des middlewares est important. Si multer avant l'authentification, alors les images non authentifiées seront enregistrées.