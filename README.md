# Sindicato Backend

Backend headless que serve três sites institucionais de sindicatos do Pará a partir de uma única base de conteúdo e um único painel administrativo.

Projeto freelance desenvolvido sob demanda. Cada sindicato tem sua própria URL, identidade visual e conteúdo, mas todos compartilham este mesmo backend — o que simplifica a manutenção e permite que o cliente gerencie tudo pelo mesmo admin.

## Sites atendidos

| Sindicato | Frontend |
|-----------|----------|
| Sindicato dos Radialistas do Pará | `sindicato-radialista.vercel.app` |
| SITIBEGAM (Trabalhadores da Indústria de Bebidas) | `sitibegam.vercel.app` |
| SINDESC-PA (Profissionais de Enfermagem) | `sindesc-pa.vercel.app` |

## Stack

- **Payload CMS 3** rodando em cima de **Next.js 15**
- **Postgres** (Vercel Postgres / Neon) via `@payloadcms/db-vercel-postgres`
- **Vercel Blob Storage** pra upload de mídia
- Deploy: **Vercel**

## O que o backend oferece

### Multi-tenant por site
Cada documento (post, página, CTA, anúncio, ACT/CCT, denúncia, etc) é vinculado a um `site`. Os frontends filtram por `site` automaticamente, garantindo que o conteúdo do SITIBEGAM não apareça no site do Radialistas e vice-versa.

### Collections principais

- **Sites** — configuração de cada sindicato: logo, cores, nav, contato, social, banners do hero (carrossel), webhook de revalidação
- **Posts** — notícias, artigos, revistas e cartilhas (tudo unificado com `categories`)
- **Media** — uploads (imagens, PDFs) pro Vercel Blob
- **Categories** — taxonomia dos posts
- **ActsCcts** — Acordos e Convenções Coletivas de Trabalho: tipo (ACT/CCT), ano, empresa, PDF
- **Denuncias** — canal de denúncias com geração automática de protocolo (`DEN-YYYY-NNNN`), anonimato opcional, status gerenciável pelo admin e upload de prova
- **SindicatoPage / JuridicoPage / ServicosPage** — páginas institucionais com conteúdo editável
- **CTASections / AnnouncementCards** — banners reutilizáveis por página
- **ContactSubmissions / NewsletterSubmissions / SindicalizeSubmissions** — formulários públicos

### Webhooks de revalidação

Quando qualquer conteúdo muda no admin, um hook dispara POST pro `webhookUrl` de cada site, que invalida o cache do Next.js (`revalidateTag` + `revalidatePath`). Permite edição em tempo real sem precisar de novo deploy.

## Desenvolvimento

Requisitos: Node 20+, pnpm ou bun, acesso ao Postgres/Vercel Blob.

```bash
# Instalar dependências
pnpm install

# Subir em dev
pnpm dev

# Admin panel
# http://localhost:3000/admin

# Rodar migrations pendentes
pnpm payload migrate

# Gerar tipos TypeScript das collections
pnpm generate:types
```

### Variáveis de ambiente

Criar `.env.local` com:

```
DATABASE_URL=...              # Vercel Postgres ou Neon
DATABASE_URL_UNPOOLED=...     # Connection direta pra migrations
BLOB_READ_WRITE_TOKEN=...     # Vercel Blob
PAYLOAD_SECRET=...            # Segredo do Payload
CRON_SECRET=...               # Jobs agendados
```

## Estrutura

```
src/
├── collections/      # Collections do Payload (conteúdo)
├── migrations/       # Migrações SQL do banco
├── hooks/            # Hooks globais (cache revalidation)
├── access/           # Regras de acesso (anyone, authenticated)
├── endpoints/        # Endpoints customizados
├── fields/           # Definições de fields reutilizáveis
├── plugins/          # Plugins customizados
└── utilities/        # Utilitários
```

## Deploy

O deploy é automático via Vercel integrado ao GitHub. Cada push em `main` dispara build + deploy.

**Importante**: as migrations devem ser aplicadas manualmente ou via script antes do deploy em produção — o Payload não roda migrations automaticamente.

## Licença

Projeto proprietário — uso restrito aos clientes contratantes. Código não é de uso livre.
