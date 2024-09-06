/*
  Warnings:

  - You are about to drop the `api_key` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `api_key_tier` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "api_key" DROP CONSTRAINT "api_key_tier_id_fkey";

-- DropTable
DROP TABLE "api_key";

-- DropTable
DROP TABLE "api_key_tier";
