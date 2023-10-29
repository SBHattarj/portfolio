CREATE TABLE IF NOT EXISTS "cert_link" (
	"id" serial PRIMARY KEY NOT NULL,
	"text" text NOT NULL,
	"url" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "visitor" (
	"id" serial PRIMARY KEY NOT NULL,
	"cookie_hash" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"invalidate_by" timestamp NOT NULL,
	"intro_complete" boolean DEFAULT false,
	CONSTRAINT "visitor_cookie_hash_unique" UNIQUE("cookie_hash")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "project" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"url" text NOT NULL,
	"creation_date" date NOT NULL,
	"type" text DEFAULT 'name' NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "project_type" (
	"name" text PRIMARY KEY NOT NULL,
	"color" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "skill" (
	"name" text PRIMARY KEY NOT NULL,
	"linked_in_assesment" serial NOT NULL,
	"certificate" serial NOT NULL,
	"logo" text
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "project" ADD CONSTRAINT "project_type_project_type_name_fk" FOREIGN KEY ("type") REFERENCES "project_type"("name") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "skill" ADD CONSTRAINT "skill_linked_in_assesment_cert_link_id_fk" FOREIGN KEY ("linked_in_assesment") REFERENCES "cert_link"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "skill" ADD CONSTRAINT "skill_certificate_cert_link_id_fk" FOREIGN KEY ("certificate") REFERENCES "cert_link"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
