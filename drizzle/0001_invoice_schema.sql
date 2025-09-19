CREATE TABLE "invoice" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"invoice_number" text NOT NULL,
	"date" timestamp NOT NULL,
	"vendor" text NOT NULL,
	"total_amount" numeric(12,2) NOT NULL,
	"created_at" timestamp NOT NULL DEFAULT NOW(),
	"updated_at" timestamp NOT NULL DEFAULT NOW(),
	CONSTRAINT "invoice_invoice_number_unique" UNIQUE("invoice_number")
);
--> statement-breakpoint
CREATE TABLE "invoice_item" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"invoice_id" uuid NOT NULL,
	"description" text NOT NULL,
	"quantity" numeric(10,3) NOT NULL,
	"unit_price" numeric(12,2) NOT NULL,
	"line_total" numeric(12,2) NOT NULL,
	"created_at" timestamp NOT NULL DEFAULT NOW(),
	"updated_at" timestamp NOT NULL DEFAULT NOW()
);
--> statement-breakpoint
ALTER TABLE "invoice_item" ADD CONSTRAINT "invoice_item_invoice_id_invoice_id_fk" FOREIGN KEY ("invoice_id") REFERENCES "public"."invoice"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
CREATE INDEX "idx_invoice_date" ON "invoice" USING btree ("date");
--> statement-breakpoint
CREATE INDEX "idx_invoice_vendor" ON "invoice" USING btree ("vendor");
--> statement-breakpoint
CREATE INDEX "idx_invoice_item_invoice_id" ON "invoice_item" USING btree ("invoice_id");