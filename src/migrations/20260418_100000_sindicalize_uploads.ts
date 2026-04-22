import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "sindicalize_submissions"
      ADD COLUMN IF NOT EXISTS "ctps_digital_id" integer;

    ALTER TABLE "sindicalize_submissions"
      ADD COLUMN IF NOT EXISTS "contracheque_id" integer;

    DO $$ BEGIN
      ALTER TABLE "sindicalize_submissions"
        ADD CONSTRAINT "sindicalize_submissions_ctps_digital_fk"
        FOREIGN KEY ("ctps_digital_id") REFERENCES "media"("id") ON DELETE SET NULL ON UPDATE NO ACTION;
    EXCEPTION WHEN duplicate_object THEN null;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "sindicalize_submissions"
        ADD CONSTRAINT "sindicalize_submissions_contracheque_fk"
        FOREIGN KEY ("contracheque_id") REFERENCES "media"("id") ON DELETE SET NULL ON UPDATE NO ACTION;
    EXCEPTION WHEN duplicate_object THEN null;
    END $$;

    CREATE INDEX IF NOT EXISTS "sindicalize_submissions_ctps_digital_idx"
      ON "sindicalize_submissions" USING btree ("ctps_digital_id");
    CREATE INDEX IF NOT EXISTS "sindicalize_submissions_contracheque_idx"
      ON "sindicalize_submissions" USING btree ("contracheque_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "sindicalize_submissions" DROP COLUMN IF EXISTS "ctps_digital_id";
    ALTER TABLE "sindicalize_submissions" DROP COLUMN IF EXISTS "contracheque_id";
  `)
}
