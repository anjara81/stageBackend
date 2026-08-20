const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const prisma = require("../lib/prisma");

async function login(req, res) {
  const { email, motDePasse } = req.body;
  if (!email || !motDePasse) {
    return res.status(400).json({ error: "email et motDePasse sont obligatoires" });
  }

  const utilisateur = await prisma.utilisateur.findUnique({ where: { email } });
  if (!utilisateur || !utilisateur.actif) {
    return res.status(401).json({ error: "Identifiants incorrects" });
  }

  const motDePasseValide = await bcrypt.compare(motDePasse, utilisateur.motDePasse);
  if (!motDePasseValide) {
    return res.status(401).json({ error: "Identifiants incorrects" });
  }

  const token = jwt.sign(
    { id: utilisateur.id, role: utilisateur.role },
    process.env.JWT_SECRET,
    { expiresIn: "8h" }
  );

  res.json({
    token,
    utilisateur: { id: utilisateur.id, nom: utilisateur.nom, email: utilisateur.email, role: utilisateur.role },
  });
}

async function register(req, res) {
  const { nom, email, motDePasse, role } = req.body;
  if (!nom || !email || !motDePasse) {
    return res.status(400).json({ error: "nom, email et motDePasse sont obligatoires" });
  }

  const motDePasseHache = await bcrypt.hash(motDePasse, 10);

  const utilisateur = await prisma.utilisateur.create({
    data: { nom, email, motDePasse: motDePasseHache, role: role || "AGENT_SAISIE" },
  });

  res.status(201).json({ id: utilisateur.id, nom: utilisateur.nom, email: utilisateur.email });
}

module.exports = { login, register };