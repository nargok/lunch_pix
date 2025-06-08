CREATE TABLE "lunch_pix_bento_tag" (
	"id" uuid PRIMARY KEY NOT NULL,
	"bentoId" uuid NOT NULL,
	"tagId" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "lunch_pix_bento" (
	"id" uuid PRIMARY KEY NOT NULL,
	"userId" varchar(255) NOT NULL,
	"title" text NOT NULL,
	"memo" text,
	"photoUrl" text,
	"date" date NOT NULL,
	"createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "lunch_pix_tag" (
	"id" uuid PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"userId" varchar(255) NOT NULL
);
--> statement-breakpoint
ALTER TABLE "lunch_pix_bento_tag" ADD CONSTRAINT "lunch_pix_bento_tag_bentoId_lunch_pix_bento_id_fk" FOREIGN KEY ("bentoId") REFERENCES "public"."lunch_pix_bento"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lunch_pix_bento_tag" ADD CONSTRAINT "lunch_pix_bento_tag_tagId_lunch_pix_tag_id_fk" FOREIGN KEY ("tagId") REFERENCES "public"."lunch_pix_tag"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lunch_pix_bento" ADD CONSTRAINT "lunch_pix_bento_userId_lunch_pix_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."lunch_pix_user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lunch_pix_tag" ADD CONSTRAINT "lunch_pix_tag_userId_lunch_pix_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."lunch_pix_user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "bento_tag_bento_id_idx" ON "lunch_pix_bento_tag" USING btree ("bentoId");--> statement-breakpoint
CREATE INDEX "bento_tag_tag_id_idx" ON "lunch_pix_bento_tag" USING btree ("tagId");--> statement-breakpoint
CREATE INDEX "bento_user_id_idx" ON "lunch_pix_bento" USING btree ("userId");--> statement-breakpoint
CREATE INDEX "bento_date_idx" ON "lunch_pix_bento" USING btree ("date");--> statement-breakpoint
CREATE INDEX "tag_user_id_idx" ON "lunch_pix_tag" USING btree ("userId");--> statement-breakpoint
CREATE INDEX "tag_name_idx" ON "lunch_pix_tag" USING btree ("name");