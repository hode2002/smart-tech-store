/*
  Warnings:

  - You are about to drop the column `option_id` on the `carts` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `carts` DROP FOREIGN KEY `carts_option_id_fkey`;

-- DropIndex
DROP INDEX `carts_user_id_product_option_id_option_id_idx` ON `carts`;

-- AlterTable
ALTER TABLE `carts` DROP COLUMN `option_id`;

-- CreateIndex
CREATE INDEX `carts_user_id_product_option_id_idx` ON `carts`(`user_id`, `product_option_id`);
