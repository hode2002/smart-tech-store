/*
  Warnings:

  - You are about to drop the column `is_deltete` on the `brands` table. All the data in the column will be lost.
  - You are about to drop the column `product_id` on the `brands` table. All the data in the column will be lost.
  - You are about to drop the column `is_deltete` on the `caregories` table. All the data in the column will be lost.
  - You are about to drop the column `is_deltete` on the `products` table. All the data in the column will be lost.
  - Added the required column `brand_id` to the `products` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `brands` DROP FOREIGN KEY `brands_product_id_fkey`;

-- DropIndex
DROP INDEX `brands_slug_is_deltete_idx` ON `brands`;

-- DropIndex
DROP INDEX `caregories_slug_is_deltete_idx` ON `caregories`;

-- DropIndex
DROP INDEX `products_slug_is_sale_stock_discount_is_deltete_idx` ON `products`;

-- AlterTable
ALTER TABLE `brands` DROP COLUMN `is_deltete`,
    DROP COLUMN `product_id`,
    ADD COLUMN `is_delete` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `caregories` DROP COLUMN `is_deltete`,
    ADD COLUMN `is_delete` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `products` DROP COLUMN `is_deltete`,
    ADD COLUMN `brand_id` INTEGER NOT NULL,
    ADD COLUMN `is_delete` BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX `brands_slug_is_delete_idx` ON `brands`(`slug`, `is_delete`);

-- CreateIndex
CREATE INDEX `caregories_slug_is_delete_idx` ON `caregories`(`slug`, `is_delete`);

-- CreateIndex
CREATE INDEX `products_slug_is_sale_stock_discount_is_delete_idx` ON `products`(`slug`, `is_sale`, `stock`, `discount`, `is_delete`);

-- AddForeignKey
ALTER TABLE `products` ADD CONSTRAINT `products_brand_id_fkey` FOREIGN KEY (`brand_id`) REFERENCES `brands`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
