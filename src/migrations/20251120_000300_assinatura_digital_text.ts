import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // Remove a coluna antiga (foreign key para media)
  await db.execute(sql`
    ALTER TABLE "sindicalize_submissions" DROP COLUMN IF EXISTS "assinatura_digital_id";
  `)

  // Adiciona a nova coluna texto para base64
  await db.execute(sql`
    ALTER TABLE "sindicalize_submissions" ADD COLUMN "assinatura_digital" varchar NOT NULL DEFAULT '';
  `)

  // Remove o default depois de adicionar
  await db.execute(sql`
    ALTER TABLE "sindicalize_submissions" ALTER COLUMN "assinatura_digital" DROP DEFAULT;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  // Remove a coluna texto
  await db.execute(sql`
    ALTER TABLE "sindicalize_submissions" DROP COLUMN IF EXISTS "assinatura_digital";
  `)

  // Recria a coluna como foreign key
  await db.execute(sql`
    ALTER TABLE "sindicalize_submissions" ADD COLUMN "assinatura_digital_id" integer REFERENCES "media"("id") ON DELETE SET NULL;
  `)
}
