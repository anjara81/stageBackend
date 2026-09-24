const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  // Alaina ny districts sy programmes rehetra
  const districts = await prisma.district.findMany();
  const programmes = await prisma.programme.findMany();

  console.log(`Districts: ${districts.length}, Programmes: ${programmes.length}`);

  // Mamorona indicateurs test ho an'ny programme tsirairay
  for (const programme of programmes) {
    // Jerena raha misy indicateur sahady
    const existing = await prisma.indicateur.findFirst({
      where: { programmeId: programme.id }
    });

    if (!existing) {
      // Mamorona indicateurs saisi 2 ho an'ny programme tsirairay
      const ind1 = await prisma.indicateur.create({
        data: {
          nom: `Nombre de cas - ${programme.nom}`,
          type: "SAISI",
          programmeId: programme.id,
        }
      });

      const ind2 = await prisma.indicateur.create({
        data: {
          nom: `Objectif 2026 - ${programme.nom}`,
          type: "SAISI",
          programmeId: programme.id,
        }
      });

      console.log(`✔ Indicateurs créés pour ${programme.nom}`);

      // Mameno valeurs ho an'ny district tsirairay, mois 1-9
      for (const district of districts) {
        for (let mois = 1; mois <= 9; mois++) {
          await prisma.valeurMensuelle.upsert({
            where: {
              indicateurId_districtId_annee_mois: {
                indicateurId: ind1.id,
                districtId: district.id,
                annee: 2026,
                mois: mois,
              }
            },
            update: {},
            create: {
              indicateurId: ind1.id,
              districtId: district.id,
              annee: 2026,
              mois: mois,
              valeur: Math.floor(Math.random() * 500) + 50,
            }
          });

          await prisma.valeurMensuelle.upsert({
            where: {
              indicateurId_districtId_annee_mois: {
                indicateurId: ind2.id,
                districtId: district.id,
                annee: 2026,
                mois: mois,
              }
            },
            update: {},
            create: {
              indicateurId: ind2.id,
              districtId: district.id,
              annee: 2026,
              mois: mois,
              valeur: Math.floor(Math.random() * 1000) + 100,
            }
          });
        }
        console.log(`  ✔ Valeurs insérées pour ${district.nom}`);
      }
    }
  }

  console.log("\n✅ Données de test insérées !");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());