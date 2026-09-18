-- CreateEnum
CREATE TYPE "RoleUtilisateur" AS ENUM ('ADMIN', 'AGENT_SAISIE');

-- CreateEnum
CREATE TYPE "TypeIndicateur" AS ENUM ('SAISI', 'CALCULE');

-- CreateTable
CREATE TABLE "districts" (
    "id" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,
    "actif" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "districts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "programmes" (
    "id" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,
    "actif" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "programmes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "indicateurs" (
    "id" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,
    "type" "TypeIndicateur" NOT NULL DEFAULT 'SAISI',
    "unite" TEXT,
    "actif" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "programmeId" INTEGER NOT NULL,
    "numerateurId" INTEGER,
    "denominateurId" INTEGER,

    CONSTRAINT "indicateurs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "valeurs_mensuelles" (
    "id" SERIAL NOT NULL,
    "annee" INTEGER NOT NULL,
    "mois" INTEGER NOT NULL,
    "valeur" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "indicateurId" INTEGER NOT NULL,
    "districtId" INTEGER NOT NULL,

    CONSTRAINT "valeurs_mensuelles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "services" (
    "id" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,
    "description" TEXT,
    "responsable" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "services_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "utilisateurs" (
    "id" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "motDePasse" TEXT NOT NULL,
    "role" "RoleUtilisateur" NOT NULL DEFAULT 'AGENT_SAISIE',
    "actif" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "serviceId" INTEGER,

    CONSTRAINT "utilisateurs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "historiques_saisie" (
    "id" SERIAL NOT NULL,
    "ancienneValeur" DOUBLE PRECISION,
    "nouvelleValeur" DOUBLE PRECISION NOT NULL,
    "dateModification" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "valeurMensuelleId" INTEGER NOT NULL,
    "utilisateurId" INTEGER NOT NULL,

    CONSTRAINT "historiques_saisie_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "districts_nom_key" ON "districts"("nom");

-- CreateIndex
CREATE UNIQUE INDEX "programmes_nom_key" ON "programmes"("nom");

-- CreateIndex
CREATE UNIQUE INDEX "valeurs_mensuelles_indicateurId_districtId_annee_mois_key" ON "valeurs_mensuelles"("indicateurId", "districtId", "annee", "mois");

-- CreateIndex
CREATE UNIQUE INDEX "services_nom_key" ON "services"("nom");

-- CreateIndex
CREATE UNIQUE INDEX "utilisateurs_email_key" ON "utilisateurs"("email");

-- AddForeignKey
ALTER TABLE "indicateurs" ADD CONSTRAINT "indicateurs_programmeId_fkey" FOREIGN KEY ("programmeId") REFERENCES "programmes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "indicateurs" ADD CONSTRAINT "indicateurs_numerateurId_fkey" FOREIGN KEY ("numerateurId") REFERENCES "indicateurs"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "indicateurs" ADD CONSTRAINT "indicateurs_denominateurId_fkey" FOREIGN KEY ("denominateurId") REFERENCES "indicateurs"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "valeurs_mensuelles" ADD CONSTRAINT "valeurs_mensuelles_indicateurId_fkey" FOREIGN KEY ("indicateurId") REFERENCES "indicateurs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "valeurs_mensuelles" ADD CONSTRAINT "valeurs_mensuelles_districtId_fkey" FOREIGN KEY ("districtId") REFERENCES "districts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "utilisateurs" ADD CONSTRAINT "utilisateurs_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "services"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "historiques_saisie" ADD CONSTRAINT "historiques_saisie_valeurMensuelleId_fkey" FOREIGN KEY ("valeurMensuelleId") REFERENCES "valeurs_mensuelles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "historiques_saisie" ADD CONSTRAINT "historiques_saisie_utilisateurId_fkey" FOREIGN KEY ("utilisateurId") REFERENCES "utilisateurs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
