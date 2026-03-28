/*
  Warnings:

  - You are about to drop the column `blogBody` on the `blogs` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `blogs` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[slug]` on the table `blogs` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `authorId` to the `blogs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `content` to the `blogs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `blogs` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "blogs" DROP CONSTRAINT "blogs_userId_fkey";

-- AlterTable
ALTER TABLE "blogs" DROP COLUMN "blogBody",
DROP COLUMN "userId",
ADD COLUMN     "authorId" TEXT NOT NULL,
ADD COLUMN     "content" TEXT NOT NULL,
ADD COLUMN     "slug" TEXT NOT NULL,
ADD COLUMN     "thumbnail" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "blogs_slug_key" ON "blogs"("slug");

-- AddForeignKey
ALTER TABLE "blogs" ADD CONSTRAINT "blogs_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
