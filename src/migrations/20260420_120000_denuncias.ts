import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    DO $$ BEGIN
      CREATE TYPE "public"."enum_denuncias_categoria" AS ENUM(
        'assedio-moral',
        'assedio-sexual',
        'discriminacao',
        'irregularidade-trabalhista',
        'outra'
      );
    EXCEPTION WHEN duplicate_object THEN null;
    END $$;

    DO $$ BEGIN
      CREATE TYPE "public"."enum_denuncias_status" AS ENUM(
        'recebida',
        'em-analise',
        'encaminhada',
        'resolvida',
        'arquivada'
      );
    EXCEPTION WHEN duplicate_object THEN null;
    END $$;

    CREATE TABLE IF NOT EXISTS "denuncias" (
      "id" serial PRIMARY KEY NOT NULL,
      "protocolo" varchar NOT NULL,
      "categoria" "enum_denuncias_categoria" NOT NULL,
      "descricao" varchar NOT NULL,
      "anonimo" boolean DEFAULT true,
      "nome" varchar,
      "email" varchar,
      "telefone" varchar,
      "empresa" varchar,
      "anexo_id" integer,
      "status" "enum_denuncias_status" NOT NULL DEFAULT 'recebida',
      "nota_interna" varchar,
      "site_id" integer NOT NULL,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );

    DO $$ BEGIN
      ALTER TABLE "denuncias"
        ADD CONSTRAINT "denuncias_protocolo_unique" UNIQUE ("protocolo");
    EXCEPTION WHEN duplicate_object THEN null;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "denuncias"
        ADD CONSTRAINT "denuncias_anexo_id_fk"
        FOREIGN KEY ("anexo_id") REFERENCES "media"("id") ON DELETE SET NULL ON UPDATE NO ACTION;
    EXCEPTION WHEN duplicate_object THEN null;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "denuncias"
        ADD CONSTRAINT "denuncias_site_id_fk"
        FOREIGN KEY ("site_id") REFERENCES "sites"("id") ON DELETE SET NULL ON UPDATE NO ACTION;
    EXCEPTION WHEN duplicate_object THEN null;
    END $$;

    CREATE INDEX IF NOT EXISTS "denuncias_protocolo_idx" ON "denuncias" USING btree ("protocolo");
    CREATE INDEX IF NOT EXISTS "denuncias_site_idx" ON "denuncias" USING btree ("site_id");
    CREATE INDEX IF NOT EXISTS "denuncias_status_idx" ON "denuncias" USING btree ("status");
    CREATE INDEX IF NOT EXISTS "denuncias_created_at_idx" ON "denuncias" USING btree ("created_at");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP TABLE IF EXISTS "denuncias";
    DROP TYPE IF EXISTS "public"."enum_denuncias_categoria";
    DROP TYPE IF EXISTS "public"."enum_denuncias_status";
  `)
}
