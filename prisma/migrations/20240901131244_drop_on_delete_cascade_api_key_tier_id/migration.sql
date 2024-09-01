-- DropForeignKey
ALTER TABLE "api_key" DROP CONSTRAINT "api_key_tier_id_fkey";

-- AlterTable
ALTER TABLE "api_key" ALTER COLUMN "tier_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "api_key" ADD CONSTRAINT "api_key_tier_id_fkey" FOREIGN KEY ("tier_id") REFERENCES "api_key_tier"("id") ON DELETE SET NULL ON UPDATE CASCADE;
