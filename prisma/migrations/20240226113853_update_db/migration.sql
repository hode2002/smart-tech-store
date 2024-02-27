/*
  Warnings:

  - The primary key for the `banners` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `brands` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `carts` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `product_id` on the `carts` table. All the data in the column will be lost.
  - The primary key for the `categories` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `coupons` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `delivery` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `estimate_date` on the `delivery` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `DateTime(3)`.
  - The primary key for the `history_search` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `options` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `additional_cost` on the `options` table. All the data in the column will be lost.
  - You are about to drop the column `product_option_id` on the `options` table. All the data in the column will be lost.
  - You are about to drop the column `value` on the `options` table. All the data in the column will be lost.
  - The primary key for the `order_details` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `product_id` on the `order_details` table. All the data in the column will be lost.
  - The primary key for the `orders` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `phone_number` on the `orders` table. All the data in the column will be lost.
  - The primary key for the `payments` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `product_descriptions` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `product_images` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `product_to_coupon` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `products` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `reviews` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `product_id` on the `reviews` table. All the data in the column will be lost.
  - The primary key for the `users` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the `product_option` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `phone` to the `orders` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `carts` DROP FOREIGN KEY `carts_product_id_fkey`;

-- DropForeignKey
ALTER TABLE `carts` DROP FOREIGN KEY `carts_product_option_id_fkey`;

-- DropForeignKey
ALTER TABLE `carts` DROP FOREIGN KEY `carts_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `delivery` DROP FOREIGN KEY `delivery_order_id_fkey`;

-- DropForeignKey
ALTER TABLE `history_search` DROP FOREIGN KEY `history_search_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `options` DROP FOREIGN KEY `options_product_option_id_fkey`;

-- DropForeignKey
ALTER TABLE `order_details` DROP FOREIGN KEY `order_details_order_id_fkey`;

-- DropForeignKey
ALTER TABLE `order_details` DROP FOREIGN KEY `order_details_product_id_fkey`;

-- DropForeignKey
ALTER TABLE `order_details` DROP FOREIGN KEY `order_details_product_option_id_fkey`;

-- DropForeignKey
ALTER TABLE `orders` DROP FOREIGN KEY `orders_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `payments` DROP FOREIGN KEY `payments_order_id_fkey`;

-- DropForeignKey
ALTER TABLE `product_descriptions` DROP FOREIGN KEY `product_descriptions_product_id_fkey`;

-- DropForeignKey
ALTER TABLE `product_images` DROP FOREIGN KEY `product_images_product_option_id_fkey`;

-- DropForeignKey
ALTER TABLE `product_option` DROP FOREIGN KEY `product_option_product_id_fkey`;

-- DropForeignKey
ALTER TABLE `product_to_coupon` DROP FOREIGN KEY `product_to_coupon_coupon_id_fkey`;

-- DropForeignKey
ALTER TABLE `product_to_coupon` DROP FOREIGN KEY `product_to_coupon_product_id_fkey`;

-- DropForeignKey
ALTER TABLE `products` DROP FOREIGN KEY `products_brand_id_fkey`;

-- DropForeignKey
ALTER TABLE `products` DROP FOREIGN KEY `products_category_id_fkey`;

-- DropForeignKey
ALTER TABLE `reviews` DROP FOREIGN KEY `reviews_product_id_fkey`;

-- DropForeignKey
ALTER TABLE `reviews` DROP FOREIGN KEY `reviews_product_option_id_fkey`;

-- DropForeignKey
ALTER TABLE `reviews` DROP FOREIGN KEY `reviews_user_id_fkey`;

-- DropIndex
DROP INDEX `banners_status_idx` ON `banners`;

-- DropIndex
DROP INDEX `coupons_name_start_date_end_date_idx` ON `coupons`;

-- DropIndex
DROP INDEX `options_name_value_idx` ON `options`;

-- AlterTable
ALTER TABLE `banners` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `brands` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `carts` DROP PRIMARY KEY,
    DROP COLUMN `product_id`,
    MODIFY `id` VARCHAR(191) NOT NULL,
    MODIFY `user_id` VARCHAR(191) NOT NULL,
    MODIFY `product_option_id` VARCHAR(191) NOT NULL,
    MODIFY `option_id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `categories` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `coupons` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `delivery` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    MODIFY `order_id` VARCHAR(191) NOT NULL,
    MODIFY `estimate_date` DATETIME(3) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `history_search` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    MODIFY `user_id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `options` DROP PRIMARY KEY,
    DROP COLUMN `additional_cost`,
    DROP COLUMN `product_option_id`,
    DROP COLUMN `value`,
    MODIFY `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `order_details` DROP PRIMARY KEY,
    DROP COLUMN `product_id`,
    MODIFY `id` VARCHAR(191) NOT NULL,
    MODIFY `order_id` VARCHAR(191) NOT NULL,
    MODIFY `product_option_id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `orders` DROP PRIMARY KEY,
    DROP COLUMN `phone_number`,
    ADD COLUMN `phone` VARCHAR(191) NOT NULL,
    MODIFY `id` VARCHAR(191) NOT NULL,
    MODIFY `user_id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `payments` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    MODIFY `order_id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `product_descriptions` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    MODIFY `product_id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `product_images` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    MODIFY `product_option_id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `product_to_coupon` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    MODIFY `product_id` VARCHAR(191) NOT NULL,
    MODIFY `coupon_id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `products` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    MODIFY `brand_id` VARCHAR(191) NOT NULL,
    MODIFY `category_id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `reviews` DROP PRIMARY KEY,
    DROP COLUMN `product_id`,
    MODIFY `id` VARCHAR(191) NOT NULL,
    MODIFY `user_id` VARCHAR(191) NOT NULL,
    MODIFY `product_option_id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `users` DROP PRIMARY KEY,
    ADD COLUMN `auth_type` ENUM('GOOGLE', 'EMAIL', 'FACEBOOK') NOT NULL DEFAULT 'EMAIL',
    MODIFY `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- DropTable
DROP TABLE `product_option`;

-- CreateTable
CREATE TABLE `product_options` (
    `id` VARCHAR(191) NOT NULL,
    `product_id` VARCHAR(191) NOT NULL,
    `thumbnail` VARCHAR(191) NOT NULL,
    `label_image` VARCHAR(191) NOT NULL,
    `price_modifier` DOUBLE NOT NULL DEFAULT 0,
    `stock` INTEGER NOT NULL DEFAULT 0,
    `sku` VARCHAR(191) NOT NULL,
    `discount` DOUBLE NOT NULL DEFAULT 0,
    `is_sale` BOOLEAN NOT NULL DEFAULT false,
    `is_deleted` BOOLEAN NOT NULL DEFAULT false,
    `slug` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `product_options_slug_is_sale_is_deleted_idx`(`slug`, `is_sale`, `is_deleted`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `technical_specs` (
    `id` VARCHAR(191) NOT NULL,
    `product_option_id` VARCHAR(191) NOT NULL,
    `screen` VARCHAR(191) NULL,
    `screen_size` VARCHAR(191) NULL,
    `os` VARCHAR(191) NULL,
    `front_camera` VARCHAR(191) NULL,
    `rear_camera` VARCHAR(191) NULL,
    `chip` VARCHAR(191) NULL,
    `ram` VARCHAR(191) NULL,
    `rom` VARCHAR(191) NULL,
    `sim` VARCHAR(191) NULL,
    `battery` VARCHAR(191) NULL,
    `connection` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `technical_specs_product_option_id_key`(`product_option_id`),
    INDEX `technical_specs_screen_size_ram_rom_connection_idx`(`screen_size`, `ram`, `rom`, `connection`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `product_option_values` (
    `id` VARCHAR(191) NOT NULL,
    `product_option_id` VARCHAR(191) NOT NULL,
    `option_id` VARCHAR(191) NOT NULL,
    `value` VARCHAR(191) NOT NULL,
    `adjust_price` DOUBLE NOT NULL DEFAULT 0,

    INDEX `product_option_values_product_option_id_option_id_idx`(`product_option_id`, `option_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `banners_status_slug_idx` ON `banners`(`status`, `slug`);

-- CreateIndex
CREATE INDEX `carts_user_id_product_option_id_option_id_idx` ON `carts`(`user_id`, `product_option_id`, `option_id`);

-- CreateIndex
CREATE INDEX `coupons_name_start_date_end_date_status_idx` ON `coupons`(`name`, `start_date`, `end_date`, `status`);

-- AddForeignKey
ALTER TABLE `product_to_coupon` ADD CONSTRAINT `product_to_coupon_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `product_to_coupon` ADD CONSTRAINT `product_to_coupon_coupon_id_fkey` FOREIGN KEY (`coupon_id`) REFERENCES `coupons`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `carts` ADD CONSTRAINT `carts_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `carts` ADD CONSTRAINT `carts_product_option_id_fkey` FOREIGN KEY (`product_option_id`) REFERENCES `product_options`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `carts` ADD CONSTRAINT `carts_option_id_fkey` FOREIGN KEY (`option_id`) REFERENCES `options`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `products` ADD CONSTRAINT `products_brand_id_fkey` FOREIGN KEY (`brand_id`) REFERENCES `brands`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `products` ADD CONSTRAINT `products_category_id_fkey` FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `product_options` ADD CONSTRAINT `product_options_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `technical_specs` ADD CONSTRAINT `technical_specs_product_option_id_fkey` FOREIGN KEY (`product_option_id`) REFERENCES `product_options`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `product_option_values` ADD CONSTRAINT `product_option_values_product_option_id_fkey` FOREIGN KEY (`product_option_id`) REFERENCES `product_options`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `product_option_values` ADD CONSTRAINT `product_option_values_option_id_fkey` FOREIGN KEY (`option_id`) REFERENCES `options`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `product_descriptions` ADD CONSTRAINT `product_descriptions_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `product_images` ADD CONSTRAINT `product_images_product_option_id_fkey` FOREIGN KEY (`product_option_id`) REFERENCES `product_options`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `orders` ADD CONSTRAINT `orders_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `order_details` ADD CONSTRAINT `order_details_order_id_fkey` FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `order_details` ADD CONSTRAINT `order_details_product_option_id_fkey` FOREIGN KEY (`product_option_id`) REFERENCES `product_options`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `payments` ADD CONSTRAINT `payments_order_id_fkey` FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `delivery` ADD CONSTRAINT `delivery_order_id_fkey` FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `history_search` ADD CONSTRAINT `history_search_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reviews` ADD CONSTRAINT `reviews_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reviews` ADD CONSTRAINT `reviews_product_option_id_fkey` FOREIGN KEY (`product_option_id`) REFERENCES `product_options`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
