CREATE TABLE `displays` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`description` text,
	`created_at` text DEFAULT 'CURRENT_TIMESTAMP' NOT NULL,
	`updated_at` text DEFAULT 'CURRENT_TIMESTAMP' NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `displays_slug_unique` ON `displays` (`slug`);--> statement-breakpoint
CREATE TABLE `slides` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`display_id` integer NOT NULL,
	`title` text NOT NULL,
	`type` text NOT NULL,
	`content` text,
	`duration` integer DEFAULT 10 NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`transition` text DEFAULT 'fade' NOT NULL,
	`enabled` integer DEFAULT true NOT NULL,
	`created_at` text DEFAULT 'CURRENT_TIMESTAMP' NOT NULL,
	`updated_at` text DEFAULT 'CURRENT_TIMESTAMP' NOT NULL,
	FOREIGN KEY (`display_id`) REFERENCES `displays`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `youtube_videos` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`slide_id` integer NOT NULL,
	`url` text NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`created_at` text DEFAULT 'CURRENT_TIMESTAMP' NOT NULL,
	FOREIGN KEY (`slide_id`) REFERENCES `slides`(`id`) ON UPDATE no action ON DELETE cascade
);
