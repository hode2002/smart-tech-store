/*
  Warnings:

  - You are about to drop the column `cart_id` on the `products` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `products` DROP FOREIGN KEY `products_cart_id_fkey`;

-- AlterTable
ALTER TABLE `carts` ADD COLUMN `product_id` INTEGER NULL;

-- AlterTable
ALTER TABLE `products` DROP COLUMN `cart_id`;

-- AddForeignKey
ALTER TABLE `carts` ADD CONSTRAINT `carts_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
