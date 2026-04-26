import { sql } from '@payloadcms/db-vercel-postgres/drizzle'
import type { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-vercel-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // Adicionar coluna prefix na tabela media (e nas tabelas de versions se existirem)
  // O plugin-cloud-storage agora usa prefix='media' pra alinhar paths do blob
  // com o que o frontend espera (resolveMediaUrl busca em /media/<filename>)
  await db.execute(sql`
    ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "prefix" varchar;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "media" DROP COLUMN IF EXISTS "prefix";
  `)
}
