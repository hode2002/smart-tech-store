/*
  Warnings:

  - You are about to drop the column `estimate_date` on the `delivery` table. All the data in the column will be lost.
  - You are about to drop the column `order_id` on the `delivery` table. All the data in the column will be lost.
  - You are about to drop the column `tracking_number` on the `delivery` table. All the data in the column will be lost.
  - You are about to drop the column `amount` on the `payments` table. All the data in the column will be lost.
  - Added the required column `charge` to the `delivery` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `delivery` table without a default value. This is not possible if the table is not empty.
  - Added the required column `note` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `total_price` to the `payments` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `delivery` DROP FOREIGN KEY `delivery_order_id_fkey`;

-- AlterTable
ALTER TABLE `delivery` DROP COLUMN `estimate_date`,
    DROP COLUMN `order_id`,
    DROP COLUMN `tracking_number`,
    ADD COLUMN `charge` INTEGER NOT NULL,
    ADD COLUMN `name` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `orders` ADD COLUMN `note` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `payments` DROP COLUMN `amount`,
    ADD COLUMN `total_price` DOUBLE NOT NULL;

-- CreateTable
CREATE TABLE `order_shipping` (
    `id` VARCHAR(191) NOT NULL,
    `order_id` VARCHAR(191) NOT NULL,
    `delivery_id` VARCHAR(191) NOT NULL,
    `estimate_date` DATETIME(3) NOT NULL,
    `tracking_number` VARCHAR(191) NOT NULL,
    `status` INTEGER NOT NULL DEFAULT 0,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `order_shipping_order_id_key`(`order_id`),
    UNIQUE INDEX `order_shipping_delivery_id_key`(`delivery_id`),
    INDEX `order_shipping_status_idx`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `order_shipping` ADD CONSTRAINT `order_shipping_order_id_fkey` FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `order_shipping` ADD CONSTRAINT `order_shipping_delivery_id_fkey` FOREIGN KEY (`delivery_id`) REFERENCES `delivery`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
