const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");

const stuffCtrl = require("../controllers/stuff");

router.get("/", auth, stuffCtrl.getAllStuff); // Récupérer tous les objets
router.post("/", auth, multer, stuffCtrl.createThing); // Créer un objet / L'ordre des middlewares est important. Si nous plaçons multer avant le middleware d'authentification, même les images des requêtes non authentifiées seront enregistrées dans le serveur.
router.get("/:id", auth, stuffCtrl.getOneThing); // Récupérer un objet
router.put("/:id", auth, multer, stuffCtrl.modifyThing); // Modifier un objet
router.delete("/:id", auth, stuffCtrl.deleteThing); // Supprimer un objet

module.exports = router;
