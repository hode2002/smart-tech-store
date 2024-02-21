/*
  Warnings:

  - You are about to drop the column `phone` on the `orders` table. All the data in the column will be lost.
  - Added the required column `is_active` to the `coupons` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone_number` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `label_image` to the `product_option` table without a default value. This is not possible if the table is not empty.
  - Added the required column `label` to the `products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `promotions` to the `products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `warranties` to the `products` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `coupons` ADD COLUMN `is_active` DATETIME(3) NOT NULL,
    ADD COLUMN `status` INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE `orders` DROP COLUMN `phone`,
    ADD COLUMN `name` VARCHAR(191) NOT NULL,
    ADD COLUMN `phone_number` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `product_option` ADD COLUMN `label_image` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `products` ADD COLUMN `label` VARCHAR(191) NOT NULL,
    ADD COLUMN `promotions` JSON NOT NULL,
    ADD COLUMN `warranties` JSON NOT NULL;

-- CreateTable
CREATE TABLE `product_to_coupon` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `product_id` INTEGER NOT NULL,
    `coupon_id` INTEGER NOT NULL,
    `activation_date` DATETIME(3) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `product_to_coupon` ADD CONSTRAINT `product_to_coupon_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `product_to_coupon` ADD CONSTRAINT `product_to_coupon_coupon_id_fkey` FOREIGN KEY (`coupon_id`) REFERENCES `coupons`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
