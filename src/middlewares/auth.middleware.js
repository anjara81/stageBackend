const jwt = require("jsonwebtoken");

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token manquant" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Token invalide" });
  }
}

function adminOnly(req, res, next) {
  if (req.user?.role !== "ADMIN") {
    return res.status(403).json({ error: "Accès réservé aux administrateurs" });
  }
  next();
}

module.exports = { authMiddleware, adminOnly };