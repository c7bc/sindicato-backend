import { sql } from '@payloadcms/db-vercel-postgres/drizzle'
import type { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-vercel-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // Adiciona colunas de FK faltantes em payload_locked_documents_rels
  // (as migrations de acts_ccts e denuncias não incluíram essas colunas polimórficas,
  // o que quebra queries do admin que fazem JOIN com TODAS as collections).
  await db.execute(sql`
    ALTER TABLE "payload_locked_documents_rels"
      ADD COLUMN IF NOT EXISTS "acts_ccts_id" integer,
      ADD COLUMN IF NOT EXISTS "denuncias_id" integer;
  `)

  await db.execute(sql`
    DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'payload_locked_documents_rels_acts_ccts_fk') THEN
        ALTER TABLE "payload_locked_documents_rels"
          ADD CONSTRAINT "payload_locked_documents_rels_acts_ccts_fk"
          FOREIGN KEY ("acts_ccts_id") REFERENCES "acts_ccts"(id) ON DELETE CASCADE;
      END IF;
      IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'payload_locked_documents_rels_denuncias_fk') THEN
        ALTER TABLE "payload_locked_documents_rels"
          ADD CONSTRAINT "payload_locked_documents_rels_denuncias_fk"
          FOREIGN KEY ("denuncias_id") REFERENCES "denuncias"(id) ON DELETE CASCADE;
      END IF;
    END $$;
  `)

  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_acts_ccts_id_idx"
      ON "payload_locked_documents_rels" ("acts_ccts_id");
    CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_denuncias_id_idx"
      ON "payload_locked_documents_rels" ("denuncias_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "payload_locked_documents_rels"
      DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_acts_ccts_fk",
      DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_denuncias_fk";
    DROP INDEX IF EXISTS "payload_locked_documents_rels_acts_ccts_id_idx";
    DROP INDEX IF EXISTS "payload_locked_documents_rels_denuncias_id_idx";
    ALTER TABLE "payload_locked_documents_rels"
      DROP COLUMN IF EXISTS "acts_ccts_id",
      DROP COLUMN IF EXISTS "denuncias_id";
  `)
}
