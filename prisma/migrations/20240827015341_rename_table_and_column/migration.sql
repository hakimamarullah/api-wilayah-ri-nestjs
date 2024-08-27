/*
  Warnings:

  - You are about to drop the `Kabupaten` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Kecamatan` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Kelurahan` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Provinsi` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Kabupaten" DROP CONSTRAINT "Kabupaten_provinsiId_fkey";

-- DropForeignKey
ALTER TABLE "Kecamatan" DROP CONSTRAINT "Kecamatan_kabupatenId_fkey";

-- DropForeignKey
ALTER TABLE "Kelurahan" DROP CONSTRAINT "Kelurahan_kecamatanId_fkey";

-- DropTable
DROP TABLE "Kabupaten";

-- DropTable
DROP TABLE "Kecamatan";

-- DropTable
DROP TABLE "Kelurahan";

-- DropTable
DROP TABLE "Provinsi";

-- CreateTable
CREATE TABLE "provinsi" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "provinsi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kabupaten" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "provinsi_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "kabupaten_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kecamatan" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "kabupaten_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "kecamatan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kelurahan" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "zip_code" VARCHAR(5),
    "kecamatan_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "kelurahan_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "kabupaten" ADD CONSTRAINT "kabupaten_provinsi_id_fkey" FOREIGN KEY ("provinsi_id") REFERENCES "provinsi"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kecamatan" ADD CONSTRAINT "kecamatan_kabupaten_id_fkey" FOREIGN KEY ("kabupaten_id") REFERENCES "kabupaten"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kelurahan" ADD CONSTRAINT "kelurahan_kecamatan_id_fkey" FOREIGN KEY ("kecamatan_id") REFERENCES "kecamatan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
