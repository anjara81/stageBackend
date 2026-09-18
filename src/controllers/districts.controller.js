const prisma = require("../lib/prisma");

async function getAll(req, res) {
  const districts = await prisma.district.findMany({
    where: { actif: true },
    orderBy: { nom: "asc" },
  });
  res.json(districts);
}

async function getOne(req, res) {
  const district = await prisma.district.findUnique({
    where: { id: Number(req.params.id) },
  });
  if (!district) return res.status(404).json({ error: "District introuvable" });
  res.json(district);
}

async function create(req, res) {
  const { nom } = req.body;
  if (!nom) return res.status(400).json({ error: "Le nom est obligatoire" });
  const district = await prisma.district.create({ data: { nom } });
  res.status(201).json(district);
}

async function update(req, res) {
  const { nom } = req.body;
  const district = await prisma.district.update({
    where: { id: Number(req.params.id) },
    data: { nom },
  });
  res.json(district);
}

async function remove(req, res) {
  await prisma.district.update({
    where: { id: Number(req.params.id) },
    data: { actif: false },
  });
  res.status(204).send();
}

module.exports = { getAll, getOne, create, update, remove };