/*
  Warnings:

  - You are about to drop the column `created_at` on the `crops` table. All the data in the column will be lost.
  - You are about to drop the column `deleted_at` on the `crops` table. All the data in the column will be lost.
  - You are about to drop the column `harvest_id` on the `crops` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `crops` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `harvests` table. All the data in the column will be lost.
  - You are about to drop the column `deleted_at` on the `harvests` table. All the data in the column will be lost.
  - You are about to drop the column `property_id` on the `harvests` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `harvests` table. All the data in the column will be lost.
  - You are about to drop the column `cpf_cnpj` on the `producers` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `producers` table. All the data in the column will be lost.
  - You are about to drop the column `deleted_at` on the `producers` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `producers` table. All the data in the column will be lost.
  - You are about to drop the column `agricultural_area` on the `properties` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `properties` table. All the data in the column will be lost.
  - You are about to drop the column `deleted_at` on the `properties` table. All the data in the column will be lost.
  - You are about to drop the column `producer_id` on the `properties` table. All the data in the column will be lost.
  - You are about to drop the column `total_area` on the `properties` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `properties` table. All the data in the column will be lost.
  - You are about to drop the column `vegetation_area` on the `properties` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[cpfCnpj]` on the table `producers` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `harvestId` to the `crops` table without a default value. This is not possible if the table is not empty.
  - Added the required column `propertyId` to the `harvests` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cpfCnpj` to the `producers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `agriculturalArea` to the `properties` table without a default value. This is not possible if the table is not empty.
  - Added the required column `producerId` to the `properties` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalArea` to the `properties` table without a default value. This is not possible if the table is not empty.
  - Added the required column `vegetationArea` to the `properties` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "crops" DROP CONSTRAINT "crops_harvest_id_fkey";

-- DropForeignKey
ALTER TABLE "harvests" DROP CONSTRAINT "harvests_property_id_fkey";

-- DropForeignKey
ALTER TABLE "properties" DROP CONSTRAINT "properties_producer_id_fkey";

-- DropIndex
DROP INDEX "producers_cpf_cnpj_key";

-- AlterTable
ALTER TABLE "crops" DROP COLUMN "created_at",
DROP COLUMN "deleted_at",
DROP COLUMN "harvest_id",
DROP COLUMN "updated_at",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "harvestId" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "harvests" DROP COLUMN "created_at",
DROP COLUMN "deleted_at",
DROP COLUMN "property_id",
DROP COLUMN "updated_at",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "propertyId" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "producers" DROP COLUMN "cpf_cnpj",
DROP COLUMN "created_at",
DROP COLUMN "deleted_at",
DROP COLUMN "updated_at",
ADD COLUMN     "cpfCnpj" VARCHAR(14) NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "properties" DROP COLUMN "agricultural_area",
DROP COLUMN "created_at",
DROP COLUMN "deleted_at",
DROP COLUMN "producer_id",
DROP COLUMN "total_area",
DROP COLUMN "updated_at",
DROP COLUMN "vegetation_area",
ADD COLUMN     "agriculturalArea" INTEGER NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "producerId" TEXT NOT NULL,
ADD COLUMN     "totalArea" INTEGER NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "vegetationArea" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "producers_cpfCnpj_key" ON "producers"("cpfCnpj");

-- AddForeignKey
ALTER TABLE "properties" ADD CONSTRAINT "properties_producerId_fkey" FOREIGN KEY ("producerId") REFERENCES "producers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "harvests" ADD CONSTRAINT "harvests_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "properties"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "crops" ADD CONSTRAINT "crops_harvestId_fkey" FOREIGN KEY ("harvestId") REFERENCES "harvests"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
