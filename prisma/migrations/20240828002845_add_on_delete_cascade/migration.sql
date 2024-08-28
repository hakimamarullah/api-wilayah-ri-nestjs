-- DropForeignKey
ALTER TABLE "kabupaten" DROP CONSTRAINT "kabupaten_provinsi_id_fkey";

-- DropForeignKey
ALTER TABLE "kecamatan" DROP CONSTRAINT "kecamatan_kabupaten_id_fkey";

-- DropForeignKey
ALTER TABLE "kelurahan" DROP CONSTRAINT "kelurahan_kecamatan_id_fkey";

-- AddForeignKey
ALTER TABLE "kabupaten" ADD CONSTRAINT "kabupaten_provinsi_id_fkey" FOREIGN KEY ("provinsi_id") REFERENCES "provinsi"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kecamatan" ADD CONSTRAINT "kecamatan_kabupaten_id_fkey" FOREIGN KEY ("kabupaten_id") REFERENCES "kabupaten"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kelurahan" ADD CONSTRAINT "kelurahan_kecamatan_id_fkey" FOREIGN KEY ("kecamatan_id") REFERENCES "kecamatan"("id") ON DELETE CASCADE ON UPDATE CASCADE;
