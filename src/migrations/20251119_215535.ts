import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "posts" DROP COLUMN IF EXISTS "generate_slug";
  ALTER TABLE "_posts_v" DROP COLUMN IF EXISTS "version_generate_slug";`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "posts" ADD COLUMN "generate_slug" boolean DEFAULT true;
  ALTER TABLE "_posts_v" ADD COLUMN "version_generate_slug" boolean DEFAULT true;`)
}
