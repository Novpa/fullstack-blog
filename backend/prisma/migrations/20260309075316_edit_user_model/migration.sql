/*
  Warnings:

  - You are about to drop the column `Province` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `city` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `user_addresses` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "Province",
DROP COLUMN "city",
DROP COLUMN "user_addresses";
