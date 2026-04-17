CREATE TABLE `academy_waitlist` (
	`id` int AUTO_INCREMENT NOT NULL,
	`email` varchar(320) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `academy_waitlist_id` PRIMARY KEY(`id`),
	CONSTRAINT `academy_waitlist_email_unique` UNIQUE(`email`)
);
