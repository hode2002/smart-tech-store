/*
  Warnings:

  - You are about to drop the column `price` on the `product_option` table. All the data in the column will be lost.
  - You are about to drop the column `discount` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `is_deleted` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `is_sale` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `release_date` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `slug` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `thumbnail` on the `products` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[product_option_id]` on the table `order_details` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `product_option_id` to the `carts` table without a default value. This is not possible if the table is not empty.
  - Made the column `product_id` on table `carts` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `product_option_id` to the `order_details` table without a default value. This is not possible if the table is not empty.
  - Added the required column `product_option_id` to the `product_images` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `product_option` table without a default value. This is not possible if the table is not empty.
  - Added the required column `thumbnail` to the `product_option` table without a default value. This is not possible if the table is not empty.
  - Added the required column `product_option_id` to the `reviews` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `carts` DROP FOREIGN KEY `carts_product_id_fkey`;

-- DropIndex
DROP INDEX `products_slug_is_sale_discount_is_deleted_idx` ON `products`;

-- AlterTable
ALTER TABLE `carts` ADD COLUMN `product_option_id` INTEGER NOT NULL,
    MODIFY `product_id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `order_details` ADD COLUMN `product_option_id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `product_images` ADD COLUMN `product_option_id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `product_option` DROP COLUMN `price`,
    ADD COLUMN `discount` DOUBLE NOT NULL DEFAULT 0,
    ADD COLUMN `is_deleted` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `is_sale` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `price_modifier` DOUBLE NOT NULL DEFAULT 0,
    ADD COLUMN `slug` VARCHAR(191) NOT NULL,
    ADD COLUMN `thumbnail` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `products` DROP COLUMN `discount`,
    DROP COLUMN `is_deleted`,
    DROP COLUMN `is_sale`,
    DROP COLUMN `release_date`,
    DROP COLUMN `slug`,
    DROP COLUMN `thumbnail`;

-- AlterTable
ALTER TABLE `reviews` ADD COLUMN `product_option_id` INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `order_details_product_option_id_key` ON `order_details`(`product_option_id`);

-- CreateIndex
CREATE INDEX `product_option_slug_is_sale_is_deleted_idx` ON `product_option`(`slug`, `is_sale`, `is_deleted`);

-- AddForeignKey
ALTER TABLE `carts` ADD CONSTRAINT `carts_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `carts` ADD CONSTRAINT `carts_product_option_id_fkey` FOREIGN KEY (`product_option_id`) REFERENCES `product_option`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `product_images` ADD CONSTRAINT `product_images_product_option_id_fkey` FOREIGN KEY (`product_option_id`) REFERENCES `product_option`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `order_details` ADD CONSTRAINT `order_details_product_option_id_fkey` FOREIGN KEY (`product_option_id`) REFERENCES `product_option`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reviews` ADD CONSTRAINT `reviews_product_option_id_fkey` FOREIGN KEY (`product_option_id`) REFERENCES `product_option`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
