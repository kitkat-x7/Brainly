/*
  Warnings:

  - The primary key for the `Contentandtag` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `tagid` on the `Contentandtag` table. All the data in the column will be lost.
  - The primary key for the `Tag` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Tag` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[tag]` on the table `Tag` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `tagname` to the `Contentandtag` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Contentandtag" DROP CONSTRAINT "Contentandtag_tagid_fkey";

-- AlterTable
ALTER TABLE "Contentandtag" DROP CONSTRAINT "Contentandtag_pkey",
DROP COLUMN "tagid",
ADD COLUMN     "tagname" TEXT NOT NULL,
ADD CONSTRAINT "Contentandtag_pkey" PRIMARY KEY ("contentid", "tagname");

-- AlterTable
ALTER TABLE "Tag" DROP CONSTRAINT "Tag_pkey",
DROP COLUMN "id";

-- CreateIndex
CREATE UNIQUE INDEX "Tag_tag_key" ON "Tag"("tag");

-- AddForeignKey
ALTER TABLE "Contentandtag" ADD CONSTRAINT "Contentandtag_tagname_fkey" FOREIGN KEY ("tagname") REFERENCES "Tag"("tag") ON DELETE CASCADE ON UPDATE CASCADE;
