CREATE TABLE `community_users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`email` varchar(320) NOT NULL,
	`password` varchar(255) NOT NULL,
	`name` varchar(255) NOT NULL,
	`mustChangePassword` int NOT NULL DEFAULT 0,
	`isActive` int NOT NULL DEFAULT 1,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `community_users_id` PRIMARY KEY(`id`),
	CONSTRAINT `community_users_email_unique` UNIQUE(`email`)
);
