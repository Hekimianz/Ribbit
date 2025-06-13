-- DropIndex
DROP INDEX "Comment_id_key";

-- DropIndex
DROP INDEX "Post_id_key";

-- DropIndex
DROP INDEX "Subribbit_id_key";

-- DropIndex
DROP INDEX "User_id_key";

-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "imagePublicId" TEXT;
