-- AlterTable
ALTER TABLE "public"."permissions" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "public"."roles" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "public"."users" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;
