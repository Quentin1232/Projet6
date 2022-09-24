const multer = require("multer");

const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
};

//Création d'une constante contenant la logique indiquant à multer où enregistrer les fichiers
const storage = multer.diskStorage({

  // La fonction destination indique le dossier dans lequelle multer va enregistrer les fichiers
  destination: (req, file, callback) => {
    callback(null, "images");
  },

  // la fonction filename indique à multer :
  filename: (req, file, callback) => {

    //  d'utiliser le nom d'origine, de remplacer les espaces par des underscores
    const name = file.originalname.split(" ").join("_");

    // Elle utilise ensuite la constante dictionnaire de type MIME pour résoudre l'extension de fichier appropriée.
    const extension = MIME_TYPES[file.mimetype];

    //  Elle ajoute un timestamp Date.now() comme nom de fichier. 
    callback(null, name + Date.now() + "." + extension);
  },
});

//Exportation de l'élément multer configuré avec la constante storage. Il gèrera uniquement les téléchargements d'image.
module.exports = multer({ storage: storage }).single("image");