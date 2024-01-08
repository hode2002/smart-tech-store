/*
  Warnings:

  - You are about to drop the column `is_delete` on the `brands` table. All the data in the column will be lost.
  - You are about to drop the column `is_delete` on the `categories` table. All the data in the column will be lost.
  - You are about to drop the column `is_delete` on the `products` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `brands_slug_is_delete_idx` ON `brands`;

-- DropIndex
DROP INDEX `categories_slug_is_delete_idx` ON `categories`;

-- DropIndex
DROP INDEX `products_slug_is_sale_stock_discount_is_delete_idx` ON `products`;

-- AlterTable
ALTER TABLE `brands` DROP COLUMN `is_delete`,
    ADD COLUMN `is_deleted` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `categories` DROP COLUMN `is_delete`,
    ADD COLUMN `is_deleted` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `products` DROP COLUMN `is_delete`,
    ADD COLUMN `is_deleted` BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX `brands_slug_is_deleted_idx` ON `brands`(`slug`, `is_deleted`);

-- CreateIndex
CREATE INDEX `categories_slug_is_deleted_idx` ON `categories`(`slug`, `is_deleted`);

-- CreateIndex
CREATE INDEX `products_slug_is_sale_stock_discount_is_deleted_idx` ON `products`(`slug`, `is_sale`, `stock`, `discount`, `is_deleted`);
