CREATE TABLE `enrollments` (
	`guild_id` text NOT NULL,
	`user_id` text NOT NULL,
	`channel_id` text NOT NULL,
	`starting_at` integer NOT NULL,
	`interval_hours` integer NOT NULL,
	PRIMARY KEY(`guild_id`, `user_id`)
);
--> statement-breakpoint
CREATE TABLE `reminders` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`guild_id` text NOT NULL,
	`user_id` text NOT NULL,
	`remind_at` integer NOT NULL,
	`fired` integer,
	FOREIGN KEY (`guild_id`,`user_id`) REFERENCES `enrollments`(`guild_id`,`user_id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `shares` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`guild_id` text NOT NULL,
	`user_id` text NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`guild_id`,`user_id`) REFERENCES `enrollments`(`guild_id`,`user_id`) ON UPDATE no action ON DELETE no action
);
