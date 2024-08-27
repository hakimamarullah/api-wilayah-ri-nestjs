-- AlterTable
CREATE SEQUENCE kabupaten_id_seq;
ALTER TABLE "Kabupaten" ALTER COLUMN "id" SET DEFAULT nextval('kabupaten_id_seq');
ALTER SEQUENCE kabupaten_id_seq OWNED BY "Kabupaten"."id";

-- AlterTable
CREATE SEQUENCE kecamatan_id_seq;
ALTER TABLE "Kecamatan" ALTER COLUMN "id" SET DEFAULT nextval('kecamatan_id_seq');
ALTER SEQUENCE kecamatan_id_seq OWNED BY "Kecamatan"."id";

-- AlterTable
CREATE SEQUENCE kelurahan_id_seq;
ALTER TABLE "Kelurahan" ALTER COLUMN "id" SET DEFAULT nextval('kelurahan_id_seq');
ALTER SEQUENCE kelurahan_id_seq OWNED BY "Kelurahan"."id";

-- AlterTable
CREATE SEQUENCE provinsi_id_seq;
ALTER TABLE "Provinsi" ALTER COLUMN "id" SET DEFAULT nextval('provinsi_id_seq');
ALTER SEQUENCE provinsi_id_seq OWNED BY "Provinsi"."id";
