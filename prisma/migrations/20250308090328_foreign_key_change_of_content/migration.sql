/*
  Warnings:

  - You are about to drop the column `userid` on the `Content` table. All the data in the column will be lost.
  - Added the required column `useremail` to the `Content` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Content" DROP CONSTRAINT "Content_userid_fkey";

-- AlterTable
ALTER TABLE "Content" DROP COLUMN "userid",
ADD COLUMN     "useremail" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Content" ADD CONSTRAINT "Content_useremail_fkey" FOREIGN KEY ("useremail") REFERENCES "User"("email") ON DELETE CASCADE ON UPDATE CASCADE;
