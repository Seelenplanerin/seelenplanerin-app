CREATE TABLE `raunaechte_codes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`code` varchar(16) NOT NULL,
	`deviceId` varchar(255),
	`year` int NOT NULL,
	`isActive` int NOT NULL DEFAULT 1,
	`activatedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `raunaechte_codes_id` PRIMARY KEY(`id`),
	CONSTRAINT `raunaechte_codes_code_unique` UNIQUE(`code`)
);
