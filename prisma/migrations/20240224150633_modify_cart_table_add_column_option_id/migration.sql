/*
  Warnings:

  - Added the required column `option_id` to the `carts` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `carts` ADD COLUMN `option_id` INTEGER NOT NULL;
