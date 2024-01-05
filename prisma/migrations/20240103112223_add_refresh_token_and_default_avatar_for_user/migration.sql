-- AlterTable
ALTER TABLE `users` ADD COLUMN `refresh_token` VARCHAR(191) NULL,
    MODIFY `avatar` VARCHAR(191) NULL DEFAULT 'https://t3.ftcdn.net/jpg/03/64/62/36/360_F_364623623_ERzQYfO4HHHyawYkJ16tREsizLyvcaeg.jpg';
