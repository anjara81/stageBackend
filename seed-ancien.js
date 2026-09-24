const prisma = require("./src/lib/prisma");
const bcrypt = require("bcrypt");

async function main() {
  console.log("Insertion des donn├®es de base...");

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
  console.log("Ô£ö Districts ins├®r├®s");

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
    "Sant├® Com",
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
  console.log("Ô£ö Programmes ins├®r├®s");

  // Services
  const services = [
    { nom: "SAF", description: "Service Administratif et Financier" },
    { nom: "SMS", description: "Service de la M├®decine Scolaire" },
    { nom: "Suivi et Evaluation", description: "Service Suivi et Evaluation" },
    { nom: "SMGSSE", description: "Service de la Gestion Sanitaire" },
    { nom: "SEMI", description: "Service des Maladies Infectieuses" },
    { nom: "PRMP", description: "Personne Responsable des March├®s Publics" },
    { nom: "Monographie", description: "Service Monographie" },
  ];

  for (const s of services) {
    await prisma.service.upsert({
      where: { nom: s.nom },
      update: {},
      create: s,
    });
  }
  console.log("Ô£ö Services ins├®r├®s");

  // Utilisateur admin par d├®faut
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
  console.log("Ô£ö Utilisateur admin cr├®├®");
  console.log("   Email    : admin@drsp-analamanga.mg");
  console.log("   Mot de passe : admin2026");

  console.log("\nÔ£à Donn├®es de base ins├®r├®es avec succ├¿s !");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
