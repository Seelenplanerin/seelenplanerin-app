CREATE TABLE `seelenjournal_klientinnen` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`email` varchar(320) NOT NULL,
	`notizen` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `seelenjournal_klientinnen_id` PRIMARY KEY(`id`),
	CONSTRAINT `seelenjournal_klientinnen_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE TABLE `seelenjournal_pdfs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`klientinId` int NOT NULL,
	`titel` varchar(500) NOT NULL,
	`pdfUrl` text NOT NULL,
	`fileName` varchar(500) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `seelenjournal_pdfs_id` PRIMARY KEY(`id`)
);
