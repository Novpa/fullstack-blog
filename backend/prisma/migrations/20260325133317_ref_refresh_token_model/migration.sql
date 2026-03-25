/*
  Warnings:

  - You are about to drop the column `authorId` on the `blogs` table. All the data in the column will be lost.
  - You are about to drop the column `expiratesAt` on the `refresh_tokens` table. All the data in the column will be lost.
  - Added the required column `userId` to the `blogs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `expiresAt` to the `refresh_tokens` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "blogs" DROP CONSTRAINT "blogs_authorId_fkey";

-- AlterTable
ALTER TABLE "blogs" DROP COLUMN "authorId",
ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "refresh_tokens" DROP COLUMN "expiratesAt",
ADD COLUMN     "expiresAt" TIMESTAMP(3) NOT NULL;

-- AddForeignKey
ALTER TABLE "blogs" ADD CONSTRAINT "blogs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
