import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  // Criar nova tabela para teamSections
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "sindicato_page_team_sections" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "title" varchar,
      "badge" varchar,
      "description" varchar
    );
  `)

  // Criar tabela para members dentro de teamSections
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "sindicato_page_team_sections_members" (
      "_order" integer NOT NULL,
      "_parent_id" varchar NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "name" varchar,
      "role" varchar,
      "image_id" integer,
      "image_alt" varchar
    );
  `)

  // Criar índices
  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "sindicato_page_team_sections_order_idx" ON "sindicato_page_team_sections" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "sindicato_page_team_sections_parent_id_idx" ON "sindicato_page_team_sections" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "sindicato_page_team_sections_members_order_idx" ON "sindicato_page_team_sections_members" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "sindicato_page_team_sections_members_parent_id_idx" ON "sindicato_page_team_sections_members" USING btree ("_parent_id");
  `)

  // Remover tabelas antigas
  await db.execute(sql`
    DROP TABLE IF EXISTS "sindicato_page_diretoria_executiva_members";
    DROP TABLE IF EXISTS "sindicato_page_conselho_fiscal_members";
  `)

  // Remover colunas antigas da tabela principal
  await db.execute(sql`
    ALTER TABLE "sindicato_page" DROP COLUMN IF EXISTS "diretoria_executiva_badge";
    ALTER TABLE "sindicato_page" DROP COLUMN IF EXISTS "diretoria_executiva_title";
    ALTER TABLE "sindicato_page" DROP COLUMN IF EXISTS "diretoria_executiva_description";
    ALTER TABLE "sindicato_page" DROP COLUMN IF EXISTS "conselho_fiscal_badge";
    ALTER TABLE "sindicato_page" DROP COLUMN IF EXISTS "conselho_fiscal_title";
    ALTER TABLE "sindicato_page" DROP COLUMN IF EXISTS "conselho_fiscal_description";
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  // Restaurar colunas antigas
  await db.execute(sql`
    ALTER TABLE "sindicato_page" ADD COLUMN IF NOT EXISTS "diretoria_executiva_badge" varchar;
    ALTER TABLE "sindicato_page" ADD COLUMN IF NOT EXISTS "diretoria_executiva_title" varchar;
    ALTER TABLE "sindicato_page" ADD COLUMN IF NOT EXISTS "diretoria_executiva_description" varchar;
    ALTER TABLE "sindicato_page" ADD COLUMN IF NOT EXISTS "conselho_fiscal_badge" varchar;
    ALTER TABLE "sindicato_page" ADD COLUMN IF NOT EXISTS "conselho_fiscal_title" varchar;
    ALTER TABLE "sindicato_page" ADD COLUMN IF NOT EXISTS "conselho_fiscal_description" varchar;
  `)

  // Restaurar tabelas antigas
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "sindicato_page_diretoria_executiva_members" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "name" varchar,
      "role" varchar,
      "image_id" integer,
      "image_alt" varchar
    );
    CREATE TABLE IF NOT EXISTS "sindicato_page_conselho_fiscal_members" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "name" varchar,
      "role" varchar,
      "image_id" integer,
      "image_alt" varchar
    );
  `)

  // Remover novas tabelas
  await db.execute(sql`
    DROP TABLE IF EXISTS "sindicato_page_team_sections_members";
    DROP TABLE IF EXISTS "sindicato_page_team_sections";
  `)
}
