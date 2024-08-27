/*
  Warnings:

  - You are about to drop the column `zip_code` on the `kelurahan` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE kelurahan rename column zip_code to "zipCode";
