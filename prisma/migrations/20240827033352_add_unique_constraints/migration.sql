/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `kabupaten` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `provinsi` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "kabupaten_provinsi_id_key";

-- CreateIndex
CREATE UNIQUE INDEX "kabupaten_name_key" ON "kabupaten"("name");

-- CreateIndex
CREATE UNIQUE INDEX "provinsi_name_key" ON "provinsi"("name");
