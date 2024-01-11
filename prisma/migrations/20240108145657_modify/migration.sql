/*
  Warnings:

  - You are about to drop the column `product_id` on the `product_images` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `product_images` DROP FOREIGN KEY `product_images_product_id_fkey`;

-- AlterTable
ALTER TABLE `product_images` DROP COLUMN `product_id`;
