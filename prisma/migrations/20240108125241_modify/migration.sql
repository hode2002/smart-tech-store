/*
  Warnings:

  - You are about to drop the column `name` on the `product_option` table. All the data in the column will be lost.
  - You are about to drop the column `value` on the `product_option` table. All the data in the column will be lost.
  - You are about to drop the column `stock` on the `products` table. All the data in the column will be lost.
  - Added the required column `price` to the `product_option` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `product_option_name_value_idx` ON `product_option`;

-- DropIndex
DROP INDEX `products_slug_is_sale_stock_discount_is_deleted_idx` ON `products`;

-- AlterTable
ALTER TABLE `product_option` DROP COLUMN `name`,
    DROP COLUMN `value`,
    ADD COLUMN `price` DOUBLE NOT NULL,
    ADD COLUMN `stock` INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `products` DROP COLUMN `stock`;

-- CreateTable
CREATE TABLE `options` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `product_option_id` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `value` VARCHAR(191) NOT NULL,

    INDEX `options_name_value_idx`(`name`, `value`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `products_slug_is_sale_discount_is_deleted_idx` ON `products`(`slug`, `is_sale`, `discount`, `is_deleted`);

-- AddForeignKey
ALTER TABLE `options` ADD CONSTRAINT `options_product_option_id_fkey` FOREIGN KEY (`product_option_id`) REFERENCES `product_option`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
