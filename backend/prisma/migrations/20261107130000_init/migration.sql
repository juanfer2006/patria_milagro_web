-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'USER');

-- CreateEnum
CREATE TYPE "RecordState" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "CaseStatus" AS ENUM ('OPEN', 'IN_PROGRESS', 'CLOSED');

-- CreateEnum
CREATE TYPE "SuspectStatus" AS ENUM ('PERSON_OF_INTEREST', 'DETAINED', 'CLEARED');

-- CreateEnum
CREATE TYPE "EvidenceType" AS ENUM ('PHYSICAL', 'DIGITAL', 'DOCUMENT', 'TESTIMONY', 'FORENSIC');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "state" "RecordState" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cases" (
    "id" TEXT NOT NULL,
    "caseNumber" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "incidentDate" TIMESTAMP(3) NOT NULL,
    "status" "CaseStatus" NOT NULL DEFAULT 'OPEN',
    "imageUrl" TEXT,
    "state" "RecordState" NOT NULL DEFAULT 'ACTIVE',
    "ownerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cases_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "suspects" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "alias" TEXT,
    "description" TEXT,
    "suspicionLevel" INTEGER NOT NULL DEFAULT 0,
    "status" "SuspectStatus" NOT NULL DEFAULT 'PERSON_OF_INTEREST',
    "photoUrl" TEXT,
    "state" "RecordState" NOT NULL DEFAULT 'ACTIVE',
    "caseId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "suspects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "evidences" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type" "EvidenceType" NOT NULL,
    "collectedAt" TIMESTAMP(3) NOT NULL,
    "relevance" INTEGER NOT NULL,
    "imageUrl" TEXT,
    "state" "RecordState" NOT NULL DEFAULT 'ACTIVE',
    "caseId" TEXT NOT NULL,
    "suspectId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "evidences_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "cases_caseNumber_key" ON "cases"("caseNumber");

-- CreateIndex
CREATE INDEX "cases_ownerId_idx" ON "cases"("ownerId");

-- CreateIndex
CREATE INDEX "cases_status_idx" ON "cases"("status");

-- CreateIndex
CREATE INDEX "suspects_caseId_idx" ON "suspects"("caseId");

-- CreateIndex
CREATE INDEX "evidences_caseId_idx" ON "evidences"("caseId");

-- CreateIndex
CREATE INDEX "evidences_suspectId_idx" ON "evidences"("suspectId");

-- AddForeignKey
ALTER TABLE "cases" ADD CONSTRAINT "cases_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "suspects" ADD CONSTRAINT "suspects_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "cases"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "evidences" ADD CONSTRAINT "evidences_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "cases"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "evidences" ADD CONSTRAINT "evidences_suspectId_fkey" FOREIGN KEY ("suspectId") REFERENCES "suspects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
