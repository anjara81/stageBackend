const prisma = require("../lib/prisma");

async function getAll(req, res) {
  const services = await prisma.service.findMany({ orderBy: { nom: "asc" } });
  res.json(services);
}

async function create(req, res) {
  const { nom, description, responsable } = req.body;
  if (!nom) return res.status(400).json({ error: "Le nom est obligatoire" });
  const service = await prisma.service.create({ data: { nom, description, responsable } });
  res.status(201).json(service);
}

module.exports = { getAll, create };