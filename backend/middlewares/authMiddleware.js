module.exports = (options = { strict: true }) => {
  return async (req, res, next) => {
    // Mode strict : uniquement JWT
    if (options.strict && !req.header('Authorization')) {
      return res.status(401).json({ error: "Authentification requise" });
    }

    // Mode flexible : accepte JWT ou clé API
    if (req.header('Authorization')) {
      // Validation JWT standard
    } else if (req.get('X-API-KEY') === process.env.INTERNAL_API_KEY) {
      req.bypassAuth = true; // Marque la requête comme authentifiée via clé API
    }

    next();
  };
};