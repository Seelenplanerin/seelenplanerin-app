CREATE TABLE `affiliate_clicks` (
	`id` int AUTO_INCREMENT NOT NULL,
	`affiliateCode` varchar(20) NOT NULL,
	`ipHash` varchar(64),
	`userAgent` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `affiliate_clicks_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `affiliate_codes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`email` varchar(320) NOT NULL,
	`code` varchar(20) NOT NULL,
	`name` varchar(255) NOT NULL,
	`isActive` int NOT NULL DEFAULT 1,
	`totalClicks` int NOT NULL DEFAULT 0,
	`totalSales` int NOT NULL DEFAULT 0,
	`totalEarnings` int NOT NULL DEFAULT 0,
	`totalPaid` int NOT NULL DEFAULT 0,
	`password` varchar(255),
	`paypalEmail` varchar(320),
	`iban` varchar(50),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `affiliate_codes_id` PRIMARY KEY(`id`),
	CONSTRAINT `affiliate_codes_email_unique` UNIQUE(`email`),
	CONSTRAINT `affiliate_codes_code_unique` UNIQUE(`code`)
);
--> statement-breakpoint
CREATE TABLE `affiliate_payouts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`affiliateCode` varchar(20) NOT NULL,
	`amount` int NOT NULL,
	`method` varchar(50) NOT NULL DEFAULT 'paypal',
	`reference` varchar(255),
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `affiliate_payouts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `affiliate_sales` (
	`id` int AUTO_INCREMENT NOT NULL,
	`affiliateCode` varchar(20) NOT NULL,
	`productName` varchar(255) NOT NULL,
	`saleAmount` int NOT NULL,
	`commissionRate` int NOT NULL DEFAULT 20,
	`commissionAmount` int NOT NULL,
	`customerEmail` varchar(320),
	`customerName` varchar(255),
	`status` varchar(20) NOT NULL DEFAULT 'pending',
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `affiliate_sales_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `community_users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`email` varchar(320) NOT NULL,
	`password` varchar(255) NOT NULL,
	`name` varchar(255) NOT NULL,
	`mustChangePassword` int NOT NULL DEFAULT 0,
	`isActive` int NOT NULL DEFAULT 1,
	`emailConsent` int NOT NULL DEFAULT 0,
	`emailConsentDate` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `community_users_id` PRIMARY KEY(`id`),
	CONSTRAINT `community_users_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
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
--> statement-breakpoint
CREATE TABLE `push_messages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`body` text NOT NULL,
	`data` text,
	`sentTo` int NOT NULL DEFAULT 0,
	`sentSuccess` int NOT NULL DEFAULT 0,
	`sentFailed` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `push_messages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `push_tokens` (
	`id` int AUTO_INCREMENT NOT NULL,
	`token` varchar(255) NOT NULL,
	`platform` varchar(20),
	`communityEmail` varchar(320),
	`isActive` int NOT NULL DEFAULT 1,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `push_tokens_id` PRIMARY KEY(`id`),
	CONSTRAINT `push_tokens_token_unique` UNIQUE(`token`)
);
--> statement-breakpoint
CREATE TABLE `seelenjournal_attachments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`entryId` int NOT NULL,
	`filename` varchar(500) NOT NULL,
	`url` text NOT NULL,
	`type` varchar(20) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `seelenjournal_attachments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `seelenjournal_clients` (
	`id` int AUTO_INCREMENT NOT NULL,
	`email` varchar(320) NOT NULL,
	`password` varchar(255) NOT NULL,
	`name` varchar(255) NOT NULL,
	`readingDate` timestamp,
	`internalNote` text,
	`isActive` int NOT NULL DEFAULT 1,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `seelenjournal_clients_id` PRIMARY KEY(`id`),
	CONSTRAINT `seelenjournal_clients_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE TABLE `seelenjournal_entries` (
	`id` int AUTO_INCREMENT NOT NULL,
	`clientId` int NOT NULL,
	`title` varchar(500) NOT NULL,
	`content` text,
	`category` varchar(100),
	`date` timestamp NOT NULL DEFAULT (now()),
	`isPublished` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `seelenjournal_entries_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `seelenjournal_messages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`clientId` int NOT NULL,
	`content` text NOT NULL,
	`fromAdmin` int NOT NULL DEFAULT 0,
	`isRead` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `seelenjournal_messages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`openId` varchar(64) NOT NULL,
	`name` text,
	`email` varchar(320),
	`loginMethod` varchar(64),
	`role` enum('user','admin') NOT NULL DEFAULT 'user',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`lastSignedIn` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_openId_unique` UNIQUE(`openId`)
);
