const prisma = require("../lib/prisma");

async function getAll(req, res) {
  const programmes = await prisma.programme.findMany({
    where: { actif: true },
    include: { indicateurs: { where: { actif: true } } },
    orderBy: { nom: "asc" },
  });
  res.json(programmes);
}

async function getOne(req, res) {
  const programme = await prisma.programme.findUnique({
    where: { id: Number(req.params.id) },
    include: { indicateurs: true },
  });
  if (!programme) return res.status(404).json({ error: "Programme introuvable" });
  res.json(programme);
}

async function create(req, res) {
  const { nom } = req.body;
  if (!nom) return res.status(400).json({ error: "Le nom est obligatoire" });
  const programme = await prisma.programme.create({ data: { nom } });
  res.status(201).json(programme);
}

async function update(req, res) {
  const { nom } = req.body;
  const programme = await prisma.programme.update({
    where: { id: Number(req.params.id) },
    data: { nom },
  });
  res.json(programme);
}

async function remove(req, res) {
  await prisma.programme.update({
    where: { id: Number(req.params.id) },
    data: { actif: false },
  });
  res.status(204).send();
}

module.exports = { getAll, getOne, create, update, remove };