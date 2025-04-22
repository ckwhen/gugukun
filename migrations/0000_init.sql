CREATE TABLE `reminders` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` text,
	`remind_type` text,
	`created_at` text DEFAULT '2025-04-22T08:05:10.261Z',
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`weight` integer,
	`target_water` integer,
	`unit` text,
	`created_at` text DEFAULT '2025-04-22T08:05:10.259Z'
);
--> statement-breakpoint
CREATE TABLE `water_logs` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` text,
	`amount` integer,
	`created_at` text DEFAULT '2025-04-22T08:05:10.261Z',
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
