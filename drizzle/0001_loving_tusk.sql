CREATE TABLE `meditations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`emoji` varchar(10) DEFAULT '🧘‍♀️',
	`audioUrl` text NOT NULL,
	`isPremium` int NOT NULL DEFAULT 1,
	`isActive` int NOT NULL DEFAULT 1,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `meditations_id` PRIMARY KEY(`id`)
);
