const prisma = require("../lib/prisma");
const bcrypt = require("bcrypt");

async function getAll(req, res) {
  const utilisateurs = await prisma.utilisateur.findMany({
    select: {
      id: true,
      nom: true,
      email: true,
      role: true,
      actif: true,
      createdAt: true,
      service: { select: { nom: true } },
    },
    orderBy: { nom: "asc" },
  });
  res.json(utilisateurs);
}

async function create(req, res) {
  const { nom, email, motDePasse, role, serviceId } = req.body;
  if (!nom || !email || !motDePasse)
    return res.status(400).json({ error: "nom, email et motDePasse sont obligatoires" });

  const hash = await bcrypt.hash(motDePasse, 10);
  const utilisateur = await prisma.utilisateur.create({
    data: { nom, email, motDePasse: hash, role: role || "AGENT_SAISIE", serviceId: serviceId ? Number(serviceId) : null },
  });
  res.status(201).json({ id: utilisateur.id, nom: utilisateur.nom, email: utilisateur.email, role: utilisateur.role });
}

async function update(req, res) {
  const { actif, role } = req.body;
  const utilisateur = await prisma.utilisateur.update({
    where: { id: Number(req.params.id) },
    data: { actif, role },
  });
  res.json(utilisateur);
}

module.exports = { getAll, create, update };