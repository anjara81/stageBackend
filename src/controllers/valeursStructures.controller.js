const prisma = require("../lib/prisma");

async function getAll(req, res) {
  try {
    const { structureId, annee, mois, programmeId } = req.query;

    if (!structureId || !annee || !mois || !programmeId) {
      return res.status(400).json({
        error: "structureId, annee, mois et programmeId sont obligatoires",
      });
    }

    const indicateurs = await prisma.indicateur.findMany({
      where: {
        actif: true,
        programmeId: Number(programmeId),
      },
      orderBy: {
        id: "asc",
      },
    });

    const valeurs = await prisma.valeurStructure.findMany({
      where: {
        structureId: Number(structureId),
        annee: Number(annee),
        mois: Number(mois),
      },
    });

    const valeurMap = new Map(
      valeurs.map((v) => [v.indicateurId, v.valeur])
    );

    const resultats = indicateurs.map((indicateur) => ({
      indicateurId: indicateur.id,
      nom: indicateur.nom,
      type: indicateur.type,
      unite: indicateur.unite,
      valeur: valeurMap.get(indicateur.id) ?? null,
    }));

    res.json(resultats);
  } catch (error) {
    console.error("Erreur getAll valeurs structures :", error);

    res.status(500).json({
      error: "Erreur serveur",
    });
  }
}

async function upsert(req, res) {
  try {
    const {
      indicateurId,
      structureId,
      annee,
      mois,
      valeur,
    } = req.body;

    if (
      !indicateurId ||
      !structureId ||
      !annee ||
      !mois ||
      valeur === undefined
    ) {
      return res.status(400).json({
        error: "Tous les champs sont obligatoires",
      });
    }

    if (Number(valeur) < 0) {
      return res.status(400).json({
        error: "La valeur ne peut pas être négative",
      });
    }

    const indicateur = await prisma.indicateur.findUnique({
      where: {
        id: Number(indicateurId),
      },
    });

    if (!indicateur) {
      return res.status(404).json({
        error: "Indicateur introuvable",
      });
    }

    const structure = await prisma.structure.findUnique({
      where: {
        id: Number(structureId),
      },
    });

    if (!structure) {
      return res.status(404).json({
        error: "Structure introuvable",
      });
    }

    const valeurStructure = await prisma.valeurStructure.upsert({
      where: {
        indicateurId_structureId_annee_mois: {
          indicateurId: Number(indicateurId),
          structureId: Number(structureId),
          annee: Number(annee),
          mois: Number(mois),
        },
      },
      update: {
        valeur: Number(valeur),
      },
      create: {
        indicateurId: Number(indicateurId),
        structureId: Number(structureId),
        annee: Number(annee),
        mois: Number(mois),
        valeur: Number(valeur),
      },
    });

    res.status(201).json(valeurStructure);
  } catch (error) {
    console.error("Erreur upsert valeur structure :", error);

    res.status(500).json({
      error: "Erreur serveur",
    });
  }
}

module.exports = {
  getAll,
  upsert,
};