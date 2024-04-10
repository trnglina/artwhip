CREATE TABLE `enrollments` (
	`guild_id` text NOT NULL,
	`user_id` text NOT NULL,
	`reminder_channel_id` text NOT NULL,
	`deadline` text NOT NULL,
	PRIMARY KEY(`guild_id`, `user_id`)
);
--> statement-breakpoint
CREATE TABLE `fired_reminders` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`guild_id` text NOT NULL,
	`user_id` text NOT NULL,
	`fired_at` text NOT NULL,
	FOREIGN KEY (`guild_id`,`user_id`) REFERENCES `enrollments`(`guild_id`,`user_id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `shares` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`guild_id` text NOT NULL,
	`user_id` text NOT NULL,
	`created_at` text NOT NULL,
	FOREIGN KEY (`guild_id`,`user_id`) REFERENCES `enrollments`(`guild_id`,`user_id`) ON UPDATE no action ON DELETE no action
);
