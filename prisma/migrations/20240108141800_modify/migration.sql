/*
  Warnings:

  - You are about to drop the column `additional_cost` on the `product_option` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `options` ADD COLUMN `additional_cost` DOUBLE NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `product_option` DROP COLUMN `additional_cost`;
