import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    DO $$ BEGIN
      CREATE TYPE "public"."enum_acts_ccts_type" AS ENUM('ACT', 'CCT');
    EXCEPTION WHEN duplicate_object THEN null;
    END $$;

    CREATE TABLE IF NOT EXISTS "acts_ccts" (
      "id" serial PRIMARY KEY NOT NULL,
      "type" "enum_acts_ccts_type" NOT NULL,
      "title" varchar NOT NULL,
      "year" numeric NOT NULL,
      "company" varchar,
      "description" varchar,
      "file_id" integer NOT NULL,
      "published_at" timestamp(3) with time zone,
      "site_id" integer NOT NULL,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );

    DO $$ BEGIN
      ALTER TABLE "acts_ccts"
        ADD CONSTRAINT "acts_ccts_file_id_fk"
        FOREIGN KEY ("file_id") REFERENCES "media"("id") ON DELETE SET NULL ON UPDATE NO ACTION;
    EXCEPTION WHEN duplicate_object THEN null;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "acts_ccts"
        ADD CONSTRAINT "acts_ccts_site_id_fk"
        FOREIGN KEY ("site_id") REFERENCES "sites"("id") ON DELETE SET NULL ON UPDATE NO ACTION;
    EXCEPTION WHEN duplicate_object THEN null;
    END $$;

    CREATE INDEX IF NOT EXISTS "acts_ccts_file_idx" ON "acts_ccts" USING btree ("file_id");
    CREATE INDEX IF NOT EXISTS "acts_ccts_site_idx" ON "acts_ccts" USING btree ("site_id");
    CREATE INDEX IF NOT EXISTS "acts_ccts_year_idx" ON "acts_ccts" USING btree ("year");
    CREATE INDEX IF NOT EXISTS "acts_ccts_type_idx" ON "acts_ccts" USING btree ("type");
    CREATE INDEX IF NOT EXISTS "acts_ccts_created_at_idx" ON "acts_ccts" USING btree ("created_at");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP TABLE IF EXISTS "acts_ccts";
    DROP TYPE IF EXISTS "public"."enum_acts_ccts_type";
  `)
}
