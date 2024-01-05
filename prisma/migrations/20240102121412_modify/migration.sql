/*
  Warnings:

  - You are about to drop the column `product_id` on the `caregories` table. All the data in the column will be lost.
  - Added the required column `category_id` to the `products` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `caregories` DROP FOREIGN KEY `caregories_product_id_fkey`;

-- AlterTable
ALTER TABLE `caregories` DROP COLUMN `product_id`;

-- AlterTable
ALTER TABLE `products` ADD COLUMN `category_id` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `products` ADD CONSTRAINT `products_category_id_fkey` FOREIGN KEY (`category_id`) REFERENCES `caregories`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
