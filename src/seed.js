const prisma = require("./lib/prisma");
const bcrypt = require("bcrypt");

async function main() {
  console.log("Insertion des données de base...");

  // Districts
  const districts = [
    "Ambohidratrimo",
    "Andramasina",
    "Anjozorobe",
    "Ankazobe",
    "Antananarivo Atsimondrano",
    "Antananarivo Avaradrano",
    "Antananarivo Renivohitra",
    "Manjakandriana",
  ];

  for (const nom of districts) {
    await prisma.district.upsert({
      where: { nom },
      update: {},
      create: { nom },
    });
  }
  console.log("✔ Districts insérés");

  // Programmes
  const programmes = [
    "PEV",
    "Paludisme",
    "Nutrition",
    "SR PF",
    "Tuberculose",
    "IST VIH",
    "SOABD",
    "DSS",
    "Santé Com",
    "MNT",
    "GIS FANOME",
  ];

  for (const nom of programmes) {
    await prisma.programme.upsert({
      where: { nom },
      update: {},
      create: { nom },
    });
  }
  console.log("✔ Programmes insérés");

  // Services
  const services = [
    { nom: "SAF", description: "Service Administratif et Financier" },
    { nom: "SMS", description: "Service de la Médecine Scolaire" },
    { nom: "Suivi et Evaluation", description: "Service Suivi et Evaluation" },
    { nom: "SMGSSE", description: "Service de la Gestion Sanitaire" },
    { nom: "SEMI", description: "Service des Maladies Infectieuses" },
    { nom: "PRMP", description: "Personne Responsable des Marchés Publics" },
    { nom: "Monographie", description: "Service Monographie" },
  ];

  for (const s of services) {
    await prisma.service.upsert({
      where: { nom: s.nom },
      update: {},
      create: s,
    });
  }
  console.log("✔ Services insérés");

  // Utilisateur admin par défaut
  const hash = await bcrypt.hash("admin2026", 10);
  await prisma.utilisateur.upsert({
    where: { email: "admin@drsp-analamanga.mg" },
    update: {},
    create: {
      nom: "Administrateur DRSP",
      email: "admin@drsp-analamanga.mg",
      motDePasse: hash,
      role: "ADMIN",
    },
  });
  console.log("✔ Utilisateur admin créé");
  console.log("   Email    : admin@drsp-analamanga.mg");
  console.log("   Mot de passe : admin2026");

  console.log("\n✅ Données de base insérées avec succès !");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });