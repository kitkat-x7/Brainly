/*
  Warnings:

  - Added the required column `hashed_email` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "hashed_email" TEXT NOT NULL;
