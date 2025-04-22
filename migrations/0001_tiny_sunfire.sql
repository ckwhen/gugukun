PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_reminders` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` text,
	`remind_type` text,
	`created_at` text DEFAULT '2025-04-22T13:06:17.117Z',
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_reminders`("id", "user_id", "remind_type", "created_at") SELECT "id", "user_id", "remind_type", "created_at" FROM `reminders`;--> statement-breakpoint
DROP TABLE `reminders`;--> statement-breakpoint
ALTER TABLE `__new_reminders` RENAME TO `reminders`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_users` (
	`id` text PRIMARY KEY NOT NULL,
	`weight` integer,
	`target_water` integer,
	`unit` text,
	`created_at` text DEFAULT '2025-04-22T13:06:17.115Z'
);
--> statement-breakpoint
INSERT INTO `__new_users`("id", "weight", "target_water", "unit", "created_at") SELECT "id", "weight", "target_water", "unit", "created_at" FROM `users`;--> statement-breakpoint
DROP TABLE `users`;--> statement-breakpoint
ALTER TABLE `__new_users` RENAME TO `users`;--> statement-breakpoint
CREATE TABLE `__new_water_logs` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` text NOT NULL,
	`amount` integer NOT NULL,
	`created_at` text DEFAULT '2025-04-22T13:06:17.117Z',
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_water_logs`("id", "user_id", "amount", "created_at") SELECT "id", "user_id", "amount", "created_at" FROM `water_logs`;--> statement-breakpoint
DROP TABLE `water_logs`;--> statement-breakpoint
ALTER TABLE `__new_water_logs` RENAME TO `water_logs`;