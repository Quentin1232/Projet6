const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = (req, res, next) => {
  try {

    // Récupération du token. La fonction split sert à tout récupérer après l'espace dans le header
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "Erreur de Token" });
    }

    // Décoder le token
    const decodedToken = jwt.verify(token, process.env.token);
    if (!decodedToken) {
      return res
        .status(401)
        .json({ error: error, msgErr: "Erreur de décodage du token" });
    }

    // Récupérer l'ID unique dans le token
    const userId = decodedToken.userId;
    if (!userId) {
      return res
        .status(401)
        .json({ error: error, msgErr: "Erreur ID utilisateur du token" });
    }
    console.log(userId);

    // Ajout du token dans la requête
    req.auth = {
      userId: userId,
    };
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ error: error, msgErr: "Erreur authentification id utilisateur" });
  }
};
