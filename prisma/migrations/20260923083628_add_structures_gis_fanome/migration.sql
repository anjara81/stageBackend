-- CreateTable
CREATE TABLE "structures" (
    "id" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,
    "actif" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "structures_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "valeurs_structures" (
    "id" SERIAL NOT NULL,
    "annee" INTEGER NOT NULL,
    "mois" INTEGER NOT NULL,
    "valeur" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "indicateurId" INTEGER NOT NULL,
    "structureId" INTEGER NOT NULL,

    CONSTRAINT "valeurs_structures_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "structures_nom_key" ON "structures"("nom");

-- CreateIndex
CREATE UNIQUE INDEX "valeurs_structures_indicateurId_structureId_annee_mois_key" ON "valeurs_structures"("indicateurId", "structureId", "annee", "mois");

-- AddForeignKey
ALTER TABLE "valeurs_structures" ADD CONSTRAINT "valeurs_structures_indicateurId_fkey" FOREIGN KEY ("indicateurId") REFERENCES "indicateurs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "valeurs_structures" ADD CONSTRAINT "valeurs_structures_structureId_fkey" FOREIGN KEY ("structureId") REFERENCES "structures"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
