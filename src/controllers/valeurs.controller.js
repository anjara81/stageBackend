const prisma = require("../lib/prisma");

async function getAll(req, res) {
  const { districtId, annee, mois, programmeId } = req.query;

  if (!districtId || !annee || !mois) {
    return res.status(400).json({ error: "districtId, annee et mois sont obligatoires" });
  }

  const indicateurs = await prisma.indicateur.findMany({
    where: {
      actif: true,
      ...(programmeId ? { programmeId: Number(programmeId) } : {}),
    },
    include: { numerateur: true, denominateur: true },
  });

  const valeursSaisies = await prisma.valeurMensuelle.findMany({
    where: {
      districtId: Number(districtId),
      annee: Number(annee),
      mois: Number(mois),
    },
  });

  const valeurParIndicateurId = new Map(valeursSaisies.map((v) => [v.indicateurId, v.valeur]));

  const resultats = indicateurs.map((ind) => {
    if (ind.type === "SAISI") {
      return {
        indicateurId: ind.id,
        nom: ind.nom,
        type: ind.type,
        valeur: valeurParIndicateurId.get(ind.id) ?? null,
      };
    }

    const num = valeurParIndicateurId.get(ind.numerateurId);
    const den = valeurParIndicateurId.get(ind.denominateurId);
    const valeur = num !== undefined && den ? num / den : null;

    return { indicateurId: ind.id, nom: ind.nom, type: ind.type, valeur };
  });

  res.json(resultats);
}

async function upsert(req, res) {
  const {
    indicateurId,
    districtId,
    annee,
    mois,
    valeur,
    utilisateurId,
  } = req.body;

  if (
    !indicateurId ||
    !districtId ||
    !annee ||
    !mois ||
    valeur === undefined ||
    !utilisateurId
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

  if (indicateur.type === "CALCULE") {
    return res.status(400).json({
      error: "Un indicateur calculé ne peut pas être saisi manuellement",
    });
  }

  const utilisateur = await prisma.utilisateur.findUnique({
    where: {
      id: Number(utilisateurId),
    },
  });

  if (!utilisateur) {
    return res.status(404).json({
      error: "Utilisateur introuvable",
    });
  }

  const ancienneValeur = await prisma.valeurMensuelle.findUnique({
    where: {
      indicateurId_districtId_annee_mois: {
        indicateurId: Number(indicateurId),
        districtId: Number(districtId),
        annee: Number(annee),
        mois: Number(mois),
      },
    },
  });

  const valeurMensuelle = await prisma.valeurMensuelle.upsert({
    where: {
      indicateurId_districtId_annee_mois: {
        indicateurId: Number(indicateurId),
        districtId: Number(districtId),
        annee: Number(annee),
        mois: Number(mois),
      },
    },

    update: {
      valeur: Number(valeur),
    },

    create: {
      indicateurId: Number(indicateurId),
      districtId: Number(districtId),
      annee: Number(annee),
      mois: Number(mois),
      valeur: Number(valeur),
    },
  });

  await prisma.historiqueSaisie.create({
    data: {
      ancienneValeur: ancienneValeur?.valeur ?? null,
      nouvelleValeur: Number(valeur),
      valeurMensuelleId: valeurMensuelle.id,
      utilisateurId: Number(utilisateurId),
    },
  });

  res.status(201).json(valeurMensuelle);
}

async function getStats(req, res) {
  const { annee, mois } = req.query;

  if (!annee || !mois) {
    return res.status(400).json({
      error: "annee et mois sont obligatoires",
    });
  }

  const anneeNumber = Number(annee);
  const moisNumber = Number(mois);

  const [districts, programmes, valeurs] = await Promise.all([
    prisma.district.findMany({
      where: { actif: true },
      orderBy: { nom: "asc" },
    }),

    prisma.programme.findMany({
      where: { actif: true },
      include: {
        indicateurs: {
          where: { actif: true },
        },
      },
      orderBy: { nom: "asc" },
    }),

    prisma.valeurMensuelle.findMany({
      where: {
        annee: anneeNumber,
        mois: moisNumber,
      },
      include: {
        indicateur: {
          include: {
            programme: true,
          },
        },
      },
    }),
  ]);

  const parDistrict = districts.map((district) => {
    const valeursSaisies = valeurs.filter(
      (v) => v.districtId === district.id
    ).length;

    return {
      nom: district.nom,
      valeursSaisies,
    };
  });

  const parProgramme = programmes.map((programme) => {
    const valeursSaisies = valeurs.filter(
      (v) => v.indicateur.programmeId === programme.id
    ).length;

    return {
      nom: programme.nom,
      indicateurs: programme.indicateurs.length,
      valeursSaisies,
    };
  });

  res.json({
    parDistrict,
    parProgramme,
  });
}

module.exports = { getAll, upsert, getStats };