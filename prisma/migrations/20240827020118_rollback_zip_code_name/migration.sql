/*
  Warnings:

  - You are about to drop the column `zipCode` on the `kelurahan` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "kelurahan" DROP COLUMN "zipCode",
ADD COLUMN     "zip_code" VARCHAR(5);
