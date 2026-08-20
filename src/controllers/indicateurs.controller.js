const prisma = require("../lib/prisma");

async function getAll(req, res) {
  const { programmeId } = req.query;
  const indicateurs = await prisma.indicateur.findMany({
    where: {
      actif: true,
      ...(programmeId ? { programmeId: Number(programmeId) } : {}),
    },
    include: { numerateur: true, denominateur: true, programme: true },
    orderBy: { nom: "asc" },
  });
  res.json(indicateurs);
}

async function getOne(req, res) {
  const { id } = req.params;
  const indicateur = await prisma.indicateur.findUnique({
    where: { id: Number(id) },
    include: { numerateur: true, denominateur: true },
  });
  if (!indicateur) return res.status(404).json({ error: "Indicateur introuvable" });
  res.json(indicateur);
}

async function create(req, res) {
  const { nom, type, unite, programmeId, numerateurId, denominateurId } = req.body;

  if (!nom || !programmeId) {
    return res.status(400).json({ error: "nom et programmeId sont obligatoires" });
  }
  if (type === "CALCULE" && (!numerateurId || !denominateurId)) {
    return res.status(400).json({
      error: "Un indicateur calculé doit avoir un numerateurId et un denominateurId",
    });
  }

  const indicateur = await prisma.indicateur.create({
    data: {
      nom,
      type: type || "SAISI",
      unite,
      programmeId: Number(programmeId),
      numerateurId: numerateurId ? Number(numerateurId) : null,
      denominateurId: denominateurId ? Number(denominateurId) : null,
    },
  });
  res.status(201).json(indicateur);
}

async function update(req, res) {
  const { id } = req.params;
  const { nom, unite } = req.body;
  const indicateur = await prisma.indicateur.update({
    where: { id: Number(id) },
    data: { nom, unite },
  });
  res.json(indicateur);
}

async function remove(req, res) {
  const { id } = req.params;
  await prisma.indicateur.update({ where: { id: Number(id) }, data: { actif: false } });
  res.status(204).send();
}

module.exports = { getAll, getOne, create, update, remove };