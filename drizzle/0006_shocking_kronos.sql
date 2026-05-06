CREATE TABLE `community_questions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`frage` text NOT NULL,
	`von` varchar(255) NOT NULL,
	`vonEmail` varchar(320),
	`datum` timestamp NOT NULL DEFAULT (now()),
	`antwort` text,
	`antwortDatum` timestamp,
	CONSTRAINT `community_questions_id` PRIMARY KEY(`id`)
);
