/*
  Warnings:

  - Added the required column `slug` to the `banners` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `banners` ADD COLUMN `slug` VARCHAR(191) NOT NULL;
