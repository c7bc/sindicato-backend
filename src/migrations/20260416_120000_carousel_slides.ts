import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "sites_slides" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "image_id" integer NOT NULL
    );

    DO $$ BEGIN
      ALTER TABLE "sites_slides"
        ADD CONSTRAINT "sites_slides_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "sites"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
    EXCEPTION WHEN duplicate_object THEN null;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "sites_slides"
        ADD CONSTRAINT "sites_slides_image_id_fk"
        FOREIGN KEY ("image_id") REFERENCES "media"("id") ON DELETE SET NULL ON UPDATE NO ACTION;
    EXCEPTION WHEN duplicate_object THEN null;
    END $$;

    CREATE INDEX IF NOT EXISTS "sites_slides_order_idx" ON "sites_slides" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "sites_slides_parent_id_idx" ON "sites_slides" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "sites_slides_image_idx" ON "sites_slides" USING btree ("image_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP TABLE IF EXISTS "sites_slides";
  `)
}
