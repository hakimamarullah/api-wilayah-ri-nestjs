/*
  Warnings:

  - A unique constraint covering the columns `[name,provinsi_id]` on the table `kabupaten` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name,kabupaten_id]` on the table `kecamatan` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name,kecamatan_id]` on the table `kelurahan` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "kabupaten_name_key";

-- DropIndex
DROP INDEX "kecamatan_name_key";

-- DropIndex
DROP INDEX "kelurahan_name_key";

-- CreateIndex
CREATE UNIQUE INDEX "kabupaten_name_provinsi_id_key" ON "kabupaten"("name", "provinsi_id");

-- CreateIndex
CREATE UNIQUE INDEX "kecamatan_name_kabupaten_id_key" ON "kecamatan"("name", "kabupaten_id");

-- CreateIndex
CREATE UNIQUE INDEX "kelurahan_name_kecamatan_id_key" ON "kelurahan"("name", "kecamatan_id");
