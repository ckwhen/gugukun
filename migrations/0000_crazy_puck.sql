CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"weight" integer,
	"target_water" integer,
	"created_at" text DEFAULT '2025-04-29T11:34:25.114Z'
);
--> statement-breakpoint
CREATE TABLE "water_logs" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "water_logs_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"user_id" text NOT NULL,
	"amount" integer NOT NULL,
	"created_at" text DEFAULT '2025-04-29T11:34:25.116Z'
);
--> statement-breakpoint
ALTER TABLE "water_logs" ADD CONSTRAINT "water_logs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;