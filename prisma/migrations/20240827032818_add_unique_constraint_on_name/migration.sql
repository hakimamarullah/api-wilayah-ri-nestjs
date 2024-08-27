/*
  Warnings:

  - A unique constraint covering the columns `[provinsi_id]` on the table `kabupaten` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `kecamatan` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `kelurahan` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "kabupaten_provinsi_id_key" ON "kabupaten"("provinsi_id");

-- CreateIndex
CREATE UNIQUE INDEX "kecamatan_name_key" ON "kecamatan"("name");

-- CreateIndex
CREATE UNIQUE INDEX "kelurahan_name_key" ON "kelurahan"("name");
