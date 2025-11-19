import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_posts_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__posts_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_sindicato_page_locations_section_locations_icon" AS ENUM('map-pin', 'building', 'office');
  CREATE TYPE "public"."enum_juridico_page_contact_info_contacts_icon" AS ENUM('mail', 'map-pin', 'phone');
  CREATE TYPE "public"."enum_cta_sections_page" AS ENUM('sindicato', 'juridico', 'servicos');
  CREATE TYPE "public"."enum_announcement_cards_page" AS ENUM('sindicato', 'juridico', 'servicos');
  CREATE TYPE "public"."enum_redirects_to_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_payload_jobs_log_task_slug" AS ENUM('inline', 'schedulePublish');
  CREATE TYPE "public"."enum_payload_jobs_log_state" AS ENUM('failed', 'succeeded');
  CREATE TYPE "public"."enum_payload_jobs_task_slug" AS ENUM('inline', 'schedulePublish');
  CREATE TABLE "sites_header_nav_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"href" varchar NOT NULL
  );
  
  CREATE TABLE "sites" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"url" varchar NOT NULL,
  	"generate_slug" boolean DEFAULT true,
  	"slug" varchar NOT NULL,
  	"contact_phone" varchar,
  	"contact_email" varchar,
  	"contact_address" varchar,
  	"contact_whatsapp" varchar,
  	"contact_working_hours" varchar,
  	"header_logo_id" integer,
  	"header_logo_alt" varchar,
  	"footer_logo_id" integer,
  	"footer_description" varchar,
  	"footer_social_links_facebook" varchar,
  	"footer_social_links_instagram" varchar,
  	"footer_social_links_twitter" varchar,
  	"footer_social_links_youtube" varchar,
  	"hero_title" varchar,
  	"hero_description" varchar,
  	"hero_image_id" integer,
  	"hero_image_alt" varchar,
  	"hero_primary_button_text" varchar,
  	"hero_primary_button_href" varchar,
  	"hero_secondary_button_text" varchar,
  	"hero_secondary_button_href" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "posts_populated_authors" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar
  );
  
  CREATE TABLE "posts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"hero_image_id" integer,
  	"content" jsonb,
  	"meta_title" varchar,
  	"meta_image_id" integer,
  	"meta_description" varchar,
  	"published_at" timestamp(3) with time zone,
  	"generate_slug" boolean DEFAULT true,
  	"slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_posts_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "posts_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"sites_id" integer,
  	"categories_id" integer,
  	"users_id" integer
  );
  
  CREATE TABLE "_posts_v_version_populated_authors" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"name" varchar
  );
  
  CREATE TABLE "_posts_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_hero_image_id" integer,
  	"version_content" jsonb,
  	"version_meta_title" varchar,
  	"version_meta_image_id" integer,
  	"version_meta_description" varchar,
  	"version_published_at" timestamp(3) with time zone,
  	"version_generate_slug" boolean DEFAULT true,
  	"version_slug" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__posts_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_posts_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"sites_id" integer,
  	"categories_id" integer,
  	"users_id" integer
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar,
  	"caption" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric,
  	"sizes_thumbnail_url" varchar,
  	"sizes_thumbnail_width" numeric,
  	"sizes_thumbnail_height" numeric,
  	"sizes_thumbnail_mime_type" varchar,
  	"sizes_thumbnail_filesize" numeric,
  	"sizes_thumbnail_filename" varchar,
  	"sizes_square_url" varchar,
  	"sizes_square_width" numeric,
  	"sizes_square_height" numeric,
  	"sizes_square_mime_type" varchar,
  	"sizes_square_filesize" numeric,
  	"sizes_square_filename" varchar,
  	"sizes_small_url" varchar,
  	"sizes_small_width" numeric,
  	"sizes_small_height" numeric,
  	"sizes_small_mime_type" varchar,
  	"sizes_small_filesize" numeric,
  	"sizes_small_filename" varchar,
  	"sizes_medium_url" varchar,
  	"sizes_medium_width" numeric,
  	"sizes_medium_height" numeric,
  	"sizes_medium_mime_type" varchar,
  	"sizes_medium_filesize" numeric,
  	"sizes_medium_filename" varchar,
  	"sizes_large_url" varchar,
  	"sizes_large_width" numeric,
  	"sizes_large_height" numeric,
  	"sizes_large_mime_type" varchar,
  	"sizes_large_filesize" numeric,
  	"sizes_large_filename" varchar,
  	"sizes_xlarge_url" varchar,
  	"sizes_xlarge_width" numeric,
  	"sizes_xlarge_height" numeric,
  	"sizes_xlarge_mime_type" varchar,
  	"sizes_xlarge_filesize" numeric,
  	"sizes_xlarge_filename" varchar,
  	"sizes_og_url" varchar,
  	"sizes_og_width" numeric,
  	"sizes_og_height" numeric,
  	"sizes_og_mime_type" varchar,
  	"sizes_og_filesize" numeric,
  	"sizes_og_filename" varchar
  );
  
  CREATE TABLE "categories_breadcrumbs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"doc_id" integer,
  	"url" varchar,
  	"label" varchar
  );
  
  CREATE TABLE "categories" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"generate_slug" boolean DEFAULT true,
  	"slug" varchar NOT NULL,
  	"parent_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "contact_submissions" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"nome" varchar NOT NULL,
  	"email" varchar NOT NULL,
  	"telefone" varchar NOT NULL,
  	"assunto" varchar NOT NULL,
  	"mensagem" varchar NOT NULL,
  	"site_id" integer NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "newsletter_submissions" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"nome_completo" varchar NOT NULL,
  	"email" varchar NOT NULL,
  	"celular" varchar NOT NULL,
  	"newsletter_accepted" boolean DEFAULT false NOT NULL,
  	"site_id" integer NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "sindicalize_submissions" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"nome_completo" varchar NOT NULL,
  	"cpf" varchar NOT NULL,
  	"email" varchar NOT NULL,
  	"celular" varchar NOT NULL,
  	"data_nascimento" timestamp(3) with time zone NOT NULL,
  	"empresa_veiculo" varchar NOT NULL,
  	"cargo_funcao" varchar NOT NULL,
  	"assinatura_digital_id" integer NOT NULL,
  	"declaracao_lida" boolean DEFAULT false NOT NULL,
  	"site_id" integer NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "sindicato_page_locations_section_locations" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"description" varchar,
  	"address" jsonb,
  	"map_url" varchar,
  	"icon" "enum_sindicato_page_locations_section_locations_icon" DEFAULT 'map-pin'
  );
  
  CREATE TABLE "sindicato_page_diretoria_executiva_members" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"role" varchar NOT NULL,
  	"image_id" integer,
  	"image_alt" varchar
  );
  
  CREATE TABLE "sindicato_page_conselho_fiscal_members" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"role" varchar NOT NULL,
  	"image_id" integer,
  	"image_alt" varchar
  );
  
  CREATE TABLE "sindicato_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"locations_section_badge" varchar,
  	"locations_section_title" varchar NOT NULL,
  	"locations_section_description" varchar,
  	"locations_section_map_embed_url" varchar,
  	"diretoria_executiva_badge" varchar,
  	"diretoria_executiva_title" varchar NOT NULL,
  	"diretoria_executiva_description" varchar,
  	"conselho_fiscal_badge" varchar,
  	"conselho_fiscal_title" varchar NOT NULL,
  	"conselho_fiscal_description" varchar,
  	"site_id" integer NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "juridico_page_contact_info_contacts" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" "enum_juridico_page_contact_info_contacts_icon" NOT NULL,
  	"title" varchar NOT NULL,
  	"description" varchar,
  	"link_text" varchar NOT NULL,
  	"link_href" varchar NOT NULL
  );
  
  CREATE TABLE "juridico_page_tabs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"badge" varchar,
  	"content" jsonb NOT NULL
  );
  
  CREATE TABLE "juridico_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"contact_info_badge" varchar,
  	"contact_info_title" varchar NOT NULL,
  	"contact_info_description" varchar,
  	"site_id" integer NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "servicos_page_hero_features" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" varchar,
  	"title" varchar NOT NULL,
  	"description" varchar
  );
  
  CREATE TABLE "servicos_page_benefits_categories_benefits" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"discount" varchar,
  	"address" varchar,
  	"phone" varchar,
  	"hours" varchar,
  	"observations" varchar
  );
  
  CREATE TABLE "servicos_page_benefits_categories" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL
  );
  
  CREATE TABLE "servicos_page_facilities_price_table" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"description" varchar NOT NULL,
  	"price" varchar NOT NULL
  );
  
  CREATE TABLE "servicos_page_facilities_general_info" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"info" varchar NOT NULL
  );
  
  CREATE TABLE "servicos_page_facilities_regulations" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"rule" varchar NOT NULL
  );
  
  CREATE TABLE "servicos_page_facilities" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"badge" varchar,
  	"title" varchar NOT NULL,
  	"description" varchar,
  	"image_id" integer,
  	"image_alt" varchar,
  	"contact_info_hours" varchar,
  	"contact_info_email" varchar,
  	"contact_info_phone" varchar
  );
  
  CREATE TABLE "servicos_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_badge" varchar,
  	"hero_title" varchar NOT NULL,
  	"hero_description" varchar,
  	"hero_image_id" integer,
  	"hero_image_alt" varchar,
  	"benefits_badge" varchar,
  	"benefits_title" varchar NOT NULL,
  	"benefits_subtitle" varchar,
  	"site_id" integer NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "cta_sections" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"page" "enum_cta_sections_page" NOT NULL,
  	"title" varchar NOT NULL,
  	"description" varchar,
  	"primary_button_text" varchar,
  	"primary_button_href" varchar,
  	"secondary_button_text" varchar,
  	"secondary_button_href" varchar,
  	"image_id" integer,
  	"image_alt" varchar,
  	"site_id" integer NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "announcement_cards" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"page" "enum_announcement_cards_page" NOT NULL,
  	"title" varchar NOT NULL,
  	"description" varchar,
  	"primary_button_text" varchar,
  	"primary_button_href" varchar,
  	"image_id" integer,
  	"image_alt" varchar,
  	"site_id" integer NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "redirects" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"from" varchar NOT NULL,
  	"to_type" "enum_redirects_to_type" DEFAULT 'reference',
  	"to_url" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "redirects_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"posts_id" integer
  );
  
  CREATE TABLE "search_categories" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"relation_to" varchar,
  	"category_i_d" varchar,
  	"title" varchar
  );
  
  CREATE TABLE "search" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"priority" numeric,
  	"slug" varchar,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "search_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"posts_id" integer
  );
  
  CREATE TABLE "payload_jobs_log" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"executed_at" timestamp(3) with time zone NOT NULL,
  	"completed_at" timestamp(3) with time zone NOT NULL,
  	"task_slug" "enum_payload_jobs_log_task_slug" NOT NULL,
  	"task_i_d" varchar NOT NULL,
  	"input" jsonb,
  	"output" jsonb,
  	"state" "enum_payload_jobs_log_state" NOT NULL,
  	"error" jsonb
  );
  
  CREATE TABLE "payload_jobs" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"input" jsonb,
  	"completed_at" timestamp(3) with time zone,
  	"total_tried" numeric DEFAULT 0,
  	"has_error" boolean DEFAULT false,
  	"error" jsonb,
  	"task_slug" "enum_payload_jobs_task_slug",
  	"queue" varchar DEFAULT 'default',
  	"wait_until" timestamp(3) with time zone,
  	"processing" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"sites_id" integer,
  	"posts_id" integer,
  	"media_id" integer,
  	"categories_id" integer,
  	"users_id" integer,
  	"contact_submissions_id" integer,
  	"newsletter_submissions_id" integer,
  	"sindicalize_submissions_id" integer,
  	"sindicato_page_id" integer,
  	"juridico_page_id" integer,
  	"servicos_page_id" integer,
  	"cta_sections_id" integer,
  	"announcement_cards_id" integer,
  	"redirects_id" integer,
  	"search_id" integer,
  	"payload_jobs_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "sites_header_nav_items" ADD CONSTRAINT "sites_header_nav_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."sites"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "sites" ADD CONSTRAINT "sites_header_logo_id_media_id_fk" FOREIGN KEY ("header_logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "sites" ADD CONSTRAINT "sites_footer_logo_id_media_id_fk" FOREIGN KEY ("footer_logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "sites" ADD CONSTRAINT "sites_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts_populated_authors" ADD CONSTRAINT "posts_populated_authors_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts" ADD CONSTRAINT "posts_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts" ADD CONSTRAINT "posts_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts_rels" ADD CONSTRAINT "posts_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_rels" ADD CONSTRAINT "posts_rels_sites_fk" FOREIGN KEY ("sites_id") REFERENCES "public"."sites"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_rels" ADD CONSTRAINT "posts_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_rels" ADD CONSTRAINT "posts_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_version_populated_authors" ADD CONSTRAINT "_posts_v_version_populated_authors_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_parent_id_posts_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."posts"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_version_hero_image_id_media_id_fk" FOREIGN KEY ("version_hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v_rels" ADD CONSTRAINT "_posts_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_rels" ADD CONSTRAINT "_posts_v_rels_sites_fk" FOREIGN KEY ("sites_id") REFERENCES "public"."sites"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_rels" ADD CONSTRAINT "_posts_v_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_rels" ADD CONSTRAINT "_posts_v_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "categories_breadcrumbs" ADD CONSTRAINT "categories_breadcrumbs_doc_id_categories_id_fk" FOREIGN KEY ("doc_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "categories_breadcrumbs" ADD CONSTRAINT "categories_breadcrumbs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "categories" ADD CONSTRAINT "categories_parent_id_categories_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "contact_submissions" ADD CONSTRAINT "contact_submissions_site_id_sites_id_fk" FOREIGN KEY ("site_id") REFERENCES "public"."sites"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "newsletter_submissions" ADD CONSTRAINT "newsletter_submissions_site_id_sites_id_fk" FOREIGN KEY ("site_id") REFERENCES "public"."sites"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "sindicalize_submissions" ADD CONSTRAINT "sindicalize_submissions_assinatura_digital_id_media_id_fk" FOREIGN KEY ("assinatura_digital_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "sindicalize_submissions" ADD CONSTRAINT "sindicalize_submissions_site_id_sites_id_fk" FOREIGN KEY ("site_id") REFERENCES "public"."sites"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "sindicato_page_locations_section_locations" ADD CONSTRAINT "sindicato_page_locations_section_locations_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."sindicato_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "sindicato_page_diretoria_executiva_members" ADD CONSTRAINT "sindicato_page_diretoria_executiva_members_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "sindicato_page_diretoria_executiva_members" ADD CONSTRAINT "sindicato_page_diretoria_executiva_members_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."sindicato_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "sindicato_page_conselho_fiscal_members" ADD CONSTRAINT "sindicato_page_conselho_fiscal_members_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "sindicato_page_conselho_fiscal_members" ADD CONSTRAINT "sindicato_page_conselho_fiscal_members_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."sindicato_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "sindicato_page" ADD CONSTRAINT "sindicato_page_site_id_sites_id_fk" FOREIGN KEY ("site_id") REFERENCES "public"."sites"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "juridico_page_contact_info_contacts" ADD CONSTRAINT "juridico_page_contact_info_contacts_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."juridico_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "juridico_page_tabs" ADD CONSTRAINT "juridico_page_tabs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."juridico_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "juridico_page" ADD CONSTRAINT "juridico_page_site_id_sites_id_fk" FOREIGN KEY ("site_id") REFERENCES "public"."sites"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "servicos_page_hero_features" ADD CONSTRAINT "servicos_page_hero_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."servicos_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "servicos_page_benefits_categories_benefits" ADD CONSTRAINT "servicos_page_benefits_categories_benefits_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."servicos_page_benefits_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "servicos_page_benefits_categories" ADD CONSTRAINT "servicos_page_benefits_categories_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."servicos_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "servicos_page_facilities_price_table" ADD CONSTRAINT "servicos_page_facilities_price_table_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."servicos_page_facilities"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "servicos_page_facilities_general_info" ADD CONSTRAINT "servicos_page_facilities_general_info_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."servicos_page_facilities"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "servicos_page_facilities_regulations" ADD CONSTRAINT "servicos_page_facilities_regulations_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."servicos_page_facilities"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "servicos_page_facilities" ADD CONSTRAINT "servicos_page_facilities_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "servicos_page_facilities" ADD CONSTRAINT "servicos_page_facilities_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."servicos_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "servicos_page" ADD CONSTRAINT "servicos_page_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "servicos_page" ADD CONSTRAINT "servicos_page_site_id_sites_id_fk" FOREIGN KEY ("site_id") REFERENCES "public"."sites"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "cta_sections" ADD CONSTRAINT "cta_sections_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "cta_sections" ADD CONSTRAINT "cta_sections_site_id_sites_id_fk" FOREIGN KEY ("site_id") REFERENCES "public"."sites"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "announcement_cards" ADD CONSTRAINT "announcement_cards_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "announcement_cards" ADD CONSTRAINT "announcement_cards_site_id_sites_id_fk" FOREIGN KEY ("site_id") REFERENCES "public"."sites"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "redirects_rels" ADD CONSTRAINT "redirects_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."redirects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "redirects_rels" ADD CONSTRAINT "redirects_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "search_categories" ADD CONSTRAINT "search_categories_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."search"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "search" ADD CONSTRAINT "search_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "search_rels" ADD CONSTRAINT "search_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."search"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "search_rels" ADD CONSTRAINT "search_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_jobs_log" ADD CONSTRAINT "payload_jobs_log_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."payload_jobs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_sites_fk" FOREIGN KEY ("sites_id") REFERENCES "public"."sites"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_contact_submissions_fk" FOREIGN KEY ("contact_submissions_id") REFERENCES "public"."contact_submissions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_newsletter_submissions_fk" FOREIGN KEY ("newsletter_submissions_id") REFERENCES "public"."newsletter_submissions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_sindicalize_submissions_fk" FOREIGN KEY ("sindicalize_submissions_id") REFERENCES "public"."sindicalize_submissions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_sindicato_page_fk" FOREIGN KEY ("sindicato_page_id") REFERENCES "public"."sindicato_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_juridico_page_fk" FOREIGN KEY ("juridico_page_id") REFERENCES "public"."juridico_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_servicos_page_fk" FOREIGN KEY ("servicos_page_id") REFERENCES "public"."servicos_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_cta_sections_fk" FOREIGN KEY ("cta_sections_id") REFERENCES "public"."cta_sections"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_announcement_cards_fk" FOREIGN KEY ("announcement_cards_id") REFERENCES "public"."announcement_cards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_redirects_fk" FOREIGN KEY ("redirects_id") REFERENCES "public"."redirects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_search_fk" FOREIGN KEY ("search_id") REFERENCES "public"."search"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_payload_jobs_fk" FOREIGN KEY ("payload_jobs_id") REFERENCES "public"."payload_jobs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "sites_header_nav_items_order_idx" ON "sites_header_nav_items" USING btree ("_order");
  CREATE INDEX "sites_header_nav_items_parent_id_idx" ON "sites_header_nav_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "sites_slug_idx" ON "sites" USING btree ("slug");
  CREATE INDEX "sites_header_header_logo_idx" ON "sites" USING btree ("header_logo_id");
  CREATE INDEX "sites_footer_footer_logo_idx" ON "sites" USING btree ("footer_logo_id");
  CREATE INDEX "sites_hero_hero_image_idx" ON "sites" USING btree ("hero_image_id");
  CREATE INDEX "sites_updated_at_idx" ON "sites" USING btree ("updated_at");
  CREATE INDEX "sites_created_at_idx" ON "sites" USING btree ("created_at");
  CREATE INDEX "posts_populated_authors_order_idx" ON "posts_populated_authors" USING btree ("_order");
  CREATE INDEX "posts_populated_authors_parent_id_idx" ON "posts_populated_authors" USING btree ("_parent_id");
  CREATE INDEX "posts_hero_image_idx" ON "posts" USING btree ("hero_image_id");
  CREATE INDEX "posts_meta_meta_image_idx" ON "posts" USING btree ("meta_image_id");
  CREATE UNIQUE INDEX "posts_slug_idx" ON "posts" USING btree ("slug");
  CREATE INDEX "posts_updated_at_idx" ON "posts" USING btree ("updated_at");
  CREATE INDEX "posts_created_at_idx" ON "posts" USING btree ("created_at");
  CREATE INDEX "posts__status_idx" ON "posts" USING btree ("_status");
  CREATE INDEX "posts_rels_order_idx" ON "posts_rels" USING btree ("order");
  CREATE INDEX "posts_rels_parent_idx" ON "posts_rels" USING btree ("parent_id");
  CREATE INDEX "posts_rels_path_idx" ON "posts_rels" USING btree ("path");
  CREATE INDEX "posts_rels_sites_id_idx" ON "posts_rels" USING btree ("sites_id");
  CREATE INDEX "posts_rels_categories_id_idx" ON "posts_rels" USING btree ("categories_id");
  CREATE INDEX "posts_rels_users_id_idx" ON "posts_rels" USING btree ("users_id");
  CREATE INDEX "_posts_v_version_populated_authors_order_idx" ON "_posts_v_version_populated_authors" USING btree ("_order");
  CREATE INDEX "_posts_v_version_populated_authors_parent_id_idx" ON "_posts_v_version_populated_authors" USING btree ("_parent_id");
  CREATE INDEX "_posts_v_parent_idx" ON "_posts_v" USING btree ("parent_id");
  CREATE INDEX "_posts_v_version_version_hero_image_idx" ON "_posts_v" USING btree ("version_hero_image_id");
  CREATE INDEX "_posts_v_version_meta_version_meta_image_idx" ON "_posts_v" USING btree ("version_meta_image_id");
  CREATE INDEX "_posts_v_version_version_slug_idx" ON "_posts_v" USING btree ("version_slug");
  CREATE INDEX "_posts_v_version_version_updated_at_idx" ON "_posts_v" USING btree ("version_updated_at");
  CREATE INDEX "_posts_v_version_version_created_at_idx" ON "_posts_v" USING btree ("version_created_at");
  CREATE INDEX "_posts_v_version_version__status_idx" ON "_posts_v" USING btree ("version__status");
  CREATE INDEX "_posts_v_created_at_idx" ON "_posts_v" USING btree ("created_at");
  CREATE INDEX "_posts_v_updated_at_idx" ON "_posts_v" USING btree ("updated_at");
  CREATE INDEX "_posts_v_latest_idx" ON "_posts_v" USING btree ("latest");
  CREATE INDEX "_posts_v_autosave_idx" ON "_posts_v" USING btree ("autosave");
  CREATE INDEX "_posts_v_rels_order_idx" ON "_posts_v_rels" USING btree ("order");
  CREATE INDEX "_posts_v_rels_parent_idx" ON "_posts_v_rels" USING btree ("parent_id");
  CREATE INDEX "_posts_v_rels_path_idx" ON "_posts_v_rels" USING btree ("path");
  CREATE INDEX "_posts_v_rels_sites_id_idx" ON "_posts_v_rels" USING btree ("sites_id");
  CREATE INDEX "_posts_v_rels_categories_id_idx" ON "_posts_v_rels" USING btree ("categories_id");
  CREATE INDEX "_posts_v_rels_users_id_idx" ON "_posts_v_rels" USING btree ("users_id");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "media_sizes_thumbnail_sizes_thumbnail_filename_idx" ON "media" USING btree ("sizes_thumbnail_filename");
  CREATE INDEX "media_sizes_square_sizes_square_filename_idx" ON "media" USING btree ("sizes_square_filename");
  CREATE INDEX "media_sizes_small_sizes_small_filename_idx" ON "media" USING btree ("sizes_small_filename");
  CREATE INDEX "media_sizes_medium_sizes_medium_filename_idx" ON "media" USING btree ("sizes_medium_filename");
  CREATE INDEX "media_sizes_large_sizes_large_filename_idx" ON "media" USING btree ("sizes_large_filename");
  CREATE INDEX "media_sizes_xlarge_sizes_xlarge_filename_idx" ON "media" USING btree ("sizes_xlarge_filename");
  CREATE INDEX "media_sizes_og_sizes_og_filename_idx" ON "media" USING btree ("sizes_og_filename");
  CREATE INDEX "categories_breadcrumbs_order_idx" ON "categories_breadcrumbs" USING btree ("_order");
  CREATE INDEX "categories_breadcrumbs_parent_id_idx" ON "categories_breadcrumbs" USING btree ("_parent_id");
  CREATE INDEX "categories_breadcrumbs_doc_idx" ON "categories_breadcrumbs" USING btree ("doc_id");
  CREATE UNIQUE INDEX "categories_slug_idx" ON "categories" USING btree ("slug");
  CREATE INDEX "categories_parent_idx" ON "categories" USING btree ("parent_id");
  CREATE INDEX "categories_updated_at_idx" ON "categories" USING btree ("updated_at");
  CREATE INDEX "categories_created_at_idx" ON "categories" USING btree ("created_at");
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE INDEX "contact_submissions_site_idx" ON "contact_submissions" USING btree ("site_id");
  CREATE INDEX "contact_submissions_updated_at_idx" ON "contact_submissions" USING btree ("updated_at");
  CREATE INDEX "contact_submissions_created_at_idx" ON "contact_submissions" USING btree ("created_at");
  CREATE INDEX "newsletter_submissions_site_idx" ON "newsletter_submissions" USING btree ("site_id");
  CREATE INDEX "newsletter_submissions_updated_at_idx" ON "newsletter_submissions" USING btree ("updated_at");
  CREATE INDEX "newsletter_submissions_created_at_idx" ON "newsletter_submissions" USING btree ("created_at");
  CREATE INDEX "sindicalize_submissions_assinatura_digital_idx" ON "sindicalize_submissions" USING btree ("assinatura_digital_id");
  CREATE INDEX "sindicalize_submissions_site_idx" ON "sindicalize_submissions" USING btree ("site_id");
  CREATE INDEX "sindicalize_submissions_updated_at_idx" ON "sindicalize_submissions" USING btree ("updated_at");
  CREATE INDEX "sindicalize_submissions_created_at_idx" ON "sindicalize_submissions" USING btree ("created_at");
  CREATE INDEX "sindicato_page_locations_section_locations_order_idx" ON "sindicato_page_locations_section_locations" USING btree ("_order");
  CREATE INDEX "sindicato_page_locations_section_locations_parent_id_idx" ON "sindicato_page_locations_section_locations" USING btree ("_parent_id");
  CREATE INDEX "sindicato_page_diretoria_executiva_members_order_idx" ON "sindicato_page_diretoria_executiva_members" USING btree ("_order");
  CREATE INDEX "sindicato_page_diretoria_executiva_members_parent_id_idx" ON "sindicato_page_diretoria_executiva_members" USING btree ("_parent_id");
  CREATE INDEX "sindicato_page_diretoria_executiva_members_image_idx" ON "sindicato_page_diretoria_executiva_members" USING btree ("image_id");
  CREATE INDEX "sindicato_page_conselho_fiscal_members_order_idx" ON "sindicato_page_conselho_fiscal_members" USING btree ("_order");
  CREATE INDEX "sindicato_page_conselho_fiscal_members_parent_id_idx" ON "sindicato_page_conselho_fiscal_members" USING btree ("_parent_id");
  CREATE INDEX "sindicato_page_conselho_fiscal_members_image_idx" ON "sindicato_page_conselho_fiscal_members" USING btree ("image_id");
  CREATE UNIQUE INDEX "sindicato_page_site_idx" ON "sindicato_page" USING btree ("site_id");
  CREATE INDEX "sindicato_page_updated_at_idx" ON "sindicato_page" USING btree ("updated_at");
  CREATE INDEX "sindicato_page_created_at_idx" ON "sindicato_page" USING btree ("created_at");
  CREATE INDEX "juridico_page_contact_info_contacts_order_idx" ON "juridico_page_contact_info_contacts" USING btree ("_order");
  CREATE INDEX "juridico_page_contact_info_contacts_parent_id_idx" ON "juridico_page_contact_info_contacts" USING btree ("_parent_id");
  CREATE INDEX "juridico_page_tabs_order_idx" ON "juridico_page_tabs" USING btree ("_order");
  CREATE INDEX "juridico_page_tabs_parent_id_idx" ON "juridico_page_tabs" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "juridico_page_site_idx" ON "juridico_page" USING btree ("site_id");
  CREATE INDEX "juridico_page_updated_at_idx" ON "juridico_page" USING btree ("updated_at");
  CREATE INDEX "juridico_page_created_at_idx" ON "juridico_page" USING btree ("created_at");
  CREATE INDEX "servicos_page_hero_features_order_idx" ON "servicos_page_hero_features" USING btree ("_order");
  CREATE INDEX "servicos_page_hero_features_parent_id_idx" ON "servicos_page_hero_features" USING btree ("_parent_id");
  CREATE INDEX "servicos_page_benefits_categories_benefits_order_idx" ON "servicos_page_benefits_categories_benefits" USING btree ("_order");
  CREATE INDEX "servicos_page_benefits_categories_benefits_parent_id_idx" ON "servicos_page_benefits_categories_benefits" USING btree ("_parent_id");
  CREATE INDEX "servicos_page_benefits_categories_order_idx" ON "servicos_page_benefits_categories" USING btree ("_order");
  CREATE INDEX "servicos_page_benefits_categories_parent_id_idx" ON "servicos_page_benefits_categories" USING btree ("_parent_id");
  CREATE INDEX "servicos_page_facilities_price_table_order_idx" ON "servicos_page_facilities_price_table" USING btree ("_order");
  CREATE INDEX "servicos_page_facilities_price_table_parent_id_idx" ON "servicos_page_facilities_price_table" USING btree ("_parent_id");
  CREATE INDEX "servicos_page_facilities_general_info_order_idx" ON "servicos_page_facilities_general_info" USING btree ("_order");
  CREATE INDEX "servicos_page_facilities_general_info_parent_id_idx" ON "servicos_page_facilities_general_info" USING btree ("_parent_id");
  CREATE INDEX "servicos_page_facilities_regulations_order_idx" ON "servicos_page_facilities_regulations" USING btree ("_order");
  CREATE INDEX "servicos_page_facilities_regulations_parent_id_idx" ON "servicos_page_facilities_regulations" USING btree ("_parent_id");
  CREATE INDEX "servicos_page_facilities_order_idx" ON "servicos_page_facilities" USING btree ("_order");
  CREATE INDEX "servicos_page_facilities_parent_id_idx" ON "servicos_page_facilities" USING btree ("_parent_id");
  CREATE INDEX "servicos_page_facilities_image_idx" ON "servicos_page_facilities" USING btree ("image_id");
  CREATE INDEX "servicos_page_hero_hero_image_idx" ON "servicos_page" USING btree ("hero_image_id");
  CREATE UNIQUE INDEX "servicos_page_site_idx" ON "servicos_page" USING btree ("site_id");
  CREATE INDEX "servicos_page_updated_at_idx" ON "servicos_page" USING btree ("updated_at");
  CREATE INDEX "servicos_page_created_at_idx" ON "servicos_page" USING btree ("created_at");
  CREATE INDEX "cta_sections_image_idx" ON "cta_sections" USING btree ("image_id");
  CREATE INDEX "cta_sections_site_idx" ON "cta_sections" USING btree ("site_id");
  CREATE INDEX "cta_sections_updated_at_idx" ON "cta_sections" USING btree ("updated_at");
  CREATE INDEX "cta_sections_created_at_idx" ON "cta_sections" USING btree ("created_at");
  CREATE INDEX "announcement_cards_image_idx" ON "announcement_cards" USING btree ("image_id");
  CREATE INDEX "announcement_cards_site_idx" ON "announcement_cards" USING btree ("site_id");
  CREATE INDEX "announcement_cards_updated_at_idx" ON "announcement_cards" USING btree ("updated_at");
  CREATE INDEX "announcement_cards_created_at_idx" ON "announcement_cards" USING btree ("created_at");
  CREATE UNIQUE INDEX "redirects_from_idx" ON "redirects" USING btree ("from");
  CREATE INDEX "redirects_updated_at_idx" ON "redirects" USING btree ("updated_at");
  CREATE INDEX "redirects_created_at_idx" ON "redirects" USING btree ("created_at");
  CREATE INDEX "redirects_rels_order_idx" ON "redirects_rels" USING btree ("order");
  CREATE INDEX "redirects_rels_parent_idx" ON "redirects_rels" USING btree ("parent_id");
  CREATE INDEX "redirects_rels_path_idx" ON "redirects_rels" USING btree ("path");
  CREATE INDEX "redirects_rels_posts_id_idx" ON "redirects_rels" USING btree ("posts_id");
  CREATE INDEX "search_categories_order_idx" ON "search_categories" USING btree ("_order");
  CREATE INDEX "search_categories_parent_id_idx" ON "search_categories" USING btree ("_parent_id");
  CREATE INDEX "search_slug_idx" ON "search" USING btree ("slug");
  CREATE INDEX "search_meta_meta_image_idx" ON "search" USING btree ("meta_image_id");
  CREATE INDEX "search_updated_at_idx" ON "search" USING btree ("updated_at");
  CREATE INDEX "search_created_at_idx" ON "search" USING btree ("created_at");
  CREATE INDEX "search_rels_order_idx" ON "search_rels" USING btree ("order");
  CREATE INDEX "search_rels_parent_idx" ON "search_rels" USING btree ("parent_id");
  CREATE INDEX "search_rels_path_idx" ON "search_rels" USING btree ("path");
  CREATE INDEX "search_rels_posts_id_idx" ON "search_rels" USING btree ("posts_id");
  CREATE INDEX "payload_jobs_log_order_idx" ON "payload_jobs_log" USING btree ("_order");
  CREATE INDEX "payload_jobs_log_parent_id_idx" ON "payload_jobs_log" USING btree ("_parent_id");
  CREATE INDEX "payload_jobs_completed_at_idx" ON "payload_jobs" USING btree ("completed_at");
  CREATE INDEX "payload_jobs_total_tried_idx" ON "payload_jobs" USING btree ("total_tried");
  CREATE INDEX "payload_jobs_has_error_idx" ON "payload_jobs" USING btree ("has_error");
  CREATE INDEX "payload_jobs_task_slug_idx" ON "payload_jobs" USING btree ("task_slug");
  CREATE INDEX "payload_jobs_queue_idx" ON "payload_jobs" USING btree ("queue");
  CREATE INDEX "payload_jobs_wait_until_idx" ON "payload_jobs" USING btree ("wait_until");
  CREATE INDEX "payload_jobs_processing_idx" ON "payload_jobs" USING btree ("processing");
  CREATE INDEX "payload_jobs_updated_at_idx" ON "payload_jobs" USING btree ("updated_at");
  CREATE INDEX "payload_jobs_created_at_idx" ON "payload_jobs" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_sites_id_idx" ON "payload_locked_documents_rels" USING btree ("sites_id");
  CREATE INDEX "payload_locked_documents_rels_posts_id_idx" ON "payload_locked_documents_rels" USING btree ("posts_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_categories_id_idx" ON "payload_locked_documents_rels" USING btree ("categories_id");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_locked_documents_rels_contact_submissions_id_idx" ON "payload_locked_documents_rels" USING btree ("contact_submissions_id");
  CREATE INDEX "payload_locked_documents_rels_newsletter_submissions_id_idx" ON "payload_locked_documents_rels" USING btree ("newsletter_submissions_id");
  CREATE INDEX "payload_locked_documents_rels_sindicalize_submissions_id_idx" ON "payload_locked_documents_rels" USING btree ("sindicalize_submissions_id");
  CREATE INDEX "payload_locked_documents_rels_sindicato_page_id_idx" ON "payload_locked_documents_rels" USING btree ("sindicato_page_id");
  CREATE INDEX "payload_locked_documents_rels_juridico_page_id_idx" ON "payload_locked_documents_rels" USING btree ("juridico_page_id");
  CREATE INDEX "payload_locked_documents_rels_servicos_page_id_idx" ON "payload_locked_documents_rels" USING btree ("servicos_page_id");
  CREATE INDEX "payload_locked_documents_rels_cta_sections_id_idx" ON "payload_locked_documents_rels" USING btree ("cta_sections_id");
  CREATE INDEX "payload_locked_documents_rels_announcement_cards_id_idx" ON "payload_locked_documents_rels" USING btree ("announcement_cards_id");
  CREATE INDEX "payload_locked_documents_rels_redirects_id_idx" ON "payload_locked_documents_rels" USING btree ("redirects_id");
  CREATE INDEX "payload_locked_documents_rels_search_id_idx" ON "payload_locked_documents_rels" USING btree ("search_id");
  CREATE INDEX "payload_locked_documents_rels_payload_jobs_id_idx" ON "payload_locked_documents_rels" USING btree ("payload_jobs_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "sites_header_nav_items" CASCADE;
  DROP TABLE "sites" CASCADE;
  DROP TABLE "posts_populated_authors" CASCADE;
  DROP TABLE "posts" CASCADE;
  DROP TABLE "posts_rels" CASCADE;
  DROP TABLE "_posts_v_version_populated_authors" CASCADE;
  DROP TABLE "_posts_v" CASCADE;
  DROP TABLE "_posts_v_rels" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "categories_breadcrumbs" CASCADE;
  DROP TABLE "categories" CASCADE;
  DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "contact_submissions" CASCADE;
  DROP TABLE "newsletter_submissions" CASCADE;
  DROP TABLE "sindicalize_submissions" CASCADE;
  DROP TABLE "sindicato_page_locations_section_locations" CASCADE;
  DROP TABLE "sindicato_page_diretoria_executiva_members" CASCADE;
  DROP TABLE "sindicato_page_conselho_fiscal_members" CASCADE;
  DROP TABLE "sindicato_page" CASCADE;
  DROP TABLE "juridico_page_contact_info_contacts" CASCADE;
  DROP TABLE "juridico_page_tabs" CASCADE;
  DROP TABLE "juridico_page" CASCADE;
  DROP TABLE "servicos_page_hero_features" CASCADE;
  DROP TABLE "servicos_page_benefits_categories_benefits" CASCADE;
  DROP TABLE "servicos_page_benefits_categories" CASCADE;
  DROP TABLE "servicos_page_facilities_price_table" CASCADE;
  DROP TABLE "servicos_page_facilities_general_info" CASCADE;
  DROP TABLE "servicos_page_facilities_regulations" CASCADE;
  DROP TABLE "servicos_page_facilities" CASCADE;
  DROP TABLE "servicos_page" CASCADE;
  DROP TABLE "cta_sections" CASCADE;
  DROP TABLE "announcement_cards" CASCADE;
  DROP TABLE "redirects" CASCADE;
  DROP TABLE "redirects_rels" CASCADE;
  DROP TABLE "search_categories" CASCADE;
  DROP TABLE "search" CASCADE;
  DROP TABLE "search_rels" CASCADE;
  DROP TABLE "payload_jobs_log" CASCADE;
  DROP TABLE "payload_jobs" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TYPE "public"."enum_posts_status";
  DROP TYPE "public"."enum__posts_v_version_status";
  DROP TYPE "public"."enum_sindicato_page_locations_section_locations_icon";
  DROP TYPE "public"."enum_juridico_page_contact_info_contacts_icon";
  DROP TYPE "public"."enum_cta_sections_page";
  DROP TYPE "public"."enum_announcement_cards_page";
  DROP TYPE "public"."enum_redirects_to_type";
  DROP TYPE "public"."enum_payload_jobs_log_task_slug";
  DROP TYPE "public"."enum_payload_jobs_log_state";
  DROP TYPE "public"."enum_payload_jobs_task_slug";`)
}
