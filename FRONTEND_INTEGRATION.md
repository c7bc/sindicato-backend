# Sindicato Backend - Documentação para Integração Frontend

## Visão Geral

Backend desenvolvido com **PayloadCMS 3.x** para gerenciamento de conteúdo de sites de sindicatos, com suporte a múltiplos sites.

### Stack Técnica
- **CMS**: PayloadCMS 3.59.1
- **Framework**: Next.js 15
- **Banco de Dados**: Vercel Postgres
- **Storage**: Vercel Blob Storage
- **Idioma**: Português Brasileiro (pt-BR)

### Conceito Multi-Site
O sistema suporta múltiplos sites de sindicatos. Cada site tem suas próprias configurações (header, footer, contato) e pode ter conteúdos específicos (posts, páginas, CTAs).

---

## Endpoints da API

### REST API
- **Base URL**: `{BACKEND_URL}/api`
- Todas as collections têm endpoints REST automáticos

### GraphQL
- **Endpoint**: `{BACKEND_URL}/api/graphql`
- **Playground**: `{BACKEND_URL}/api/graphql-playground`

### Preview (Draft)
- **Endpoint**: `{BACKEND_URL}/next/preview`
- **Params**: `?path=/posts/slug&collection=posts&slug=post-slug&previewSecret=SECRET`

---

## Sistema de Revalidação de Cache (Webhook)

Quando qualquer conteúdo é criado, atualizado ou deletado, o backend envia um webhook para o frontend para invalidar o cache.

### Configuração no Admin

Em cada **Site**, configure na sidebar:
- **URL do Webhook**: `https://seusite.com/api/revalidate`
- **Secret do Webhook**: Token secreto para autenticação

### Request Enviada pelo Backend

```http
POST {webhookUrl}
Content-Type: application/json
x-revalidate-secret: {webhookSecret}

{
  "collection": "posts",
  "operation": "create" | "update" | "delete",
  "siteId": "site-id-123",
  "timestamp": "2025-01-01T12:00:00.000Z"
}
```

### Collections que Disparam Webhook
- sites
- posts
- contact-submissions
- newsletter-submissions
- sindicalize-submissions
- sindicato-page
- juridico-page
- servicos-page
- cta-sections
- announcement-cards

### Implementação no Frontend (Next.js App Router)

```typescript
// app/api/revalidate/route.ts
import { revalidateTag, revalidatePath } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const secret = request.headers.get('x-revalidate-secret')

  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ error: 'Invalid secret' }, { status: 401 })
  }

  const body = await request.json()
  const { collection, operation, siteId } = body

  // Revalidar por tag (recomendado)
  revalidateTag(collection)

  // Ou revalidar paths específicos
  switch (collection) {
    case 'posts':
      revalidatePath('/noticias')
      revalidatePath('/noticias/[slug]', 'page')
      break
    case 'sites':
      revalidatePath('/', 'layout') // Revalida tudo
      break
    case 'sindicato-page':
      revalidatePath('/sindicato')
      break
    case 'juridico-page':
      revalidatePath('/juridico')
      break
    case 'servicos-page':
      revalidatePath('/servicos')
      break
    // ... outros cases
  }

  return NextResponse.json({
    revalidated: true,
    collection,
    operation,
    timestamp: new Date().toISOString()
  })
}
```

---

## Collections - Referência Completa

### Resumo de Permissões

| Collection | Slug | Leitura Pública | Criação Pública |
|------------|------|-----------------|-----------------|
| Users | `users` | Não | Não |
| Media | `media` | Sim | Não |
| Categories | `categories` | Sim | Não |
| Posts | `posts` | Só publicados | Não |
| Sites | `sites` | Sim | Não |
| Contact Submissions | `contact-submissions` | Não | **Sim** |
| Newsletter Submissions | `newsletter-submissions` | Não | **Sim** |
| Sindicalize Submissions | `sindicalize-submissions` | Não | **Sim** |
| Sindicato Page | `sindicato-page` | Sim | Não |
| Juridico Page | `juridico-page` | Sim | Não |
| Servicos Page | `servicos-page` | Sim | Não |
| CTA Sections | `cta-sections` | Sim | Não |
| Announcement Cards | `announcement-cards` | Sim | Não |

---

## 1. Sites

**Slug**: `sites`

A collection principal que configura cada site do sistema.

### Campos

```typescript
interface Site {
  id: string
  name: string                    // Nome do site
  url: string                     // URL do site
  slug: string                    // Auto-gerado do name
  webhookUrl?: string             // URL para revalidação
  webhookSecret?: string          // Secret do webhook

  contact: {
    phone?: string                // Ex: (91) 3344-7769
    email?: string                // Ex: contato@sindicato.org.br
    address?: string              // Endereço completo
    whatsapp?: string             // Ex: (91) 99999-9999
    workingHours?: string         // Ex: Segunda a Sexta: 8h às 18h
  }

  header: {
    logo?: Media                  // Upload de imagem
    logoAlt?: string              // Texto alternativo
    navItems?: Array<{
      label: string               // Ex: INÍCIO
      href: string                // Ex: /
    }>                            // Máximo 8 itens
  }

  footer: {
    logo?: Media
    description?: string          // Texto sobre o sindicato
    socialLinks: {
      facebook?: string
      instagram?: string
      twitter?: string
      youtube?: string
    }
  }

  hero: {
    title?: string
    description?: string
    image?: Media
    imageAlt?: string
    primaryButtonText?: string
    primaryButtonHref?: string
    secondaryButtonText?: string
    secondaryButtonHref?: string
  }

  createdAt: string
  updatedAt: string
}
```

### Buscar Site

```typescript
// Por slug
const response = await fetch(
  `${API_URL}/api/sites?where[slug][equals]=meu-sindicato`
)
const { docs } = await response.json()
const site = docs[0]

// Por ID
const response = await fetch(`${API_URL}/api/sites/${siteId}`)
const site = await response.json()
```

---

## 2. Posts (Notícias)

**Slug**: `posts`

Sistema de notícias com suporte a rascunhos, agendamento e SEO.

### Campos

```typescript
interface Post {
  id: string
  title: string                   // Título da notícia
  slug: string                    // URL slug (auto-gerado)
  heroImage?: Media               // Imagem de destaque
  content: LexicalRichText        // Conteúdo em Rich Text

  sites: Site[] | string[]        // Relacionamento múltiplo
  categories?: Category[] | string[]

  publishedAt?: string            // Data de publicação
  authors?: User[] | string[]
  populatedAuthors?: Array<{      // Auto-populado (somente leitura)
    id: string
    name: string
  }>

  meta: {
    title?: string                // SEO title
    description?: string          // SEO description
    image?: Media                 // SEO image (og:image)
  }

  _status: 'draft' | 'published'  // Status do documento
  createdAt: string
  updatedAt: string
}
```

### Buscar Posts

```typescript
// Posts publicados de um site específico
const response = await fetch(
  `${API_URL}/api/posts?` + new URLSearchParams({
    'where[sites][contains]': siteId,
    'where[_status][equals]': 'published',
    'sort': '-publishedAt',
    'limit': '10',
    'page': '1'
  })
)

const { docs, totalDocs, totalPages, page, hasNextPage } = await response.json()

// Post por slug
const response = await fetch(
  `${API_URL}/api/posts?where[slug][equals]=${slug}&where[_status][equals]=published`
)
const { docs } = await response.json()
const post = docs[0]
```

### GraphQL Query

```graphql
query GetPosts($siteId: String!, $limit: Int, $page: Int) {
  Posts(
    where: {
      sites: { contains: $siteId }
      _status: { equals: published }
    }
    sort: "-publishedAt"
    limit: $limit
    page: $page
  ) {
    docs {
      id
      title
      slug
      publishedAt
      heroImage {
        url
        alt
        sizes {
          medium { url width height }
          thumbnail { url }
        }
      }
      categories {
        id
        title
        slug
      }
      meta {
        description
        image { url }
      }
      populatedAuthors {
        id
        name
      }
    }
    totalDocs
    totalPages
    page
    hasNextPage
    hasPrevPage
  }
}
```

---

## 3. Media (Mídias)

**Slug**: `media`

Armazenamento de imagens e arquivos.

### Campos

```typescript
interface Media {
  id: string
  alt?: string                    // Texto alternativo
  caption?: LexicalRichText       // Legenda

  url: string                     // URL original
  filename: string
  mimeType: string
  filesize: number
  width?: number
  height?: number

  sizes: {
    thumbnail?: { url: string, width: number, height: number }   // 300px
    square?: { url: string, width: number, height: number }      // 500x500
    small?: { url: string, width: number, height: number }       // 600px
    medium?: { url: string, width: number, height: number }      // 900px
    large?: { url: string, width: number, height: number }       // 1400px
    xlarge?: { url: string, width: number, height: number }      // 1920px
    og?: { url: string, width: number, height: number }          // 1200x630
  }

  createdAt: string
  updatedAt: string
}
```

### Uso no Frontend

```typescript
// Imagem responsiva
<Image
  src={media.sizes?.medium?.url || media.url}
  alt={media.alt || ''}
  width={media.sizes?.medium?.width || media.width}
  height={media.sizes?.medium?.height || media.height}
/>

// Picture com srcSet
<picture>
  <source
    media="(max-width: 600px)"
    srcSet={media.sizes?.small?.url}
  />
  <source
    media="(max-width: 900px)"
    srcSet={media.sizes?.medium?.url}
  />
  <img
    src={media.sizes?.large?.url || media.url}
    alt={media.alt || ''}
  />
</picture>
```

---

## 4. Categories (Categorias)

**Slug**: `categories`

Categorias hierárquicas para posts.

### Campos

```typescript
interface Category {
  id: string
  title: string
  slug: string                    // Auto-gerado
  parent?: Category | string      // Categoria pai (hierarquia)
  breadcrumbs?: Array<{           // Auto-populado
    id: string
    label: string
    url: string
  }>

  createdAt: string
  updatedAt: string
}
```

### Buscar Categorias

```typescript
// Todas as categorias
const response = await fetch(`${API_URL}/api/categories`)
const { docs } = await response.json()

// Categoria por slug
const response = await fetch(
  `${API_URL}/api/categories?where[slug][equals]=${slug}`
)
```

---

## 5. Sindicato Page

**Slug**: `sindicato-page`

Página institucional do sindicato. **Uma por site** (relacionamento único).

### Campos

```typescript
interface SindicatoPage {
  id: string

  locationsSection: {
    badge?: string                // Ex: "Nossas sedes"
    title: string
    description?: string
    mapEmbedUrl?: string          // URL do Google Maps Embed

    locations?: Array<{
      title: string               // Ex: "Sede Principal - Belém"
      description?: string        // Ex: "Horário de funcionamento"
      address?: LexicalRichText   // Endereço completo
      mapUrl?: string             // Link do Google Maps
      icon?: 'map-pin' | 'building' | 'office'
    }>
  }

  diretoriaExecutiva: {
    badge?: string                // Ex: "Gestão 2023-2026"
    title: string                 // Ex: "Diretoria Executiva"
    description?: string

    members?: Array<{
      name: string
      role: string                // Ex: "Presidente"
      image?: Media
      imageAlt?: string
    }>
  }

  conselhoFiscal: {
    badge?: string
    title: string
    description?: string

    members?: Array<{
      name: string
      role: string
      image?: Media
      imageAlt?: string
    }>
  }

  site: Site | string             // Relacionamento único

  createdAt: string
  updatedAt: string
}
```

### Buscar Página do Sindicato

```typescript
const response = await fetch(
  `${API_URL}/api/sindicato-page?where[site][equals]=${siteId}`
)
const { docs } = await response.json()
const sindicatoPage = docs[0]
```

---

## 6. Juridico Page

**Slug**: `juridico-page`

Página do departamento jurídico. **Uma por site**.

### Campos

```typescript
interface JuridicoPage {
  id: string

  contactInfo: {
    badge?: string                // Ex: "Fale conosco"
    title: string
    description?: string

    contacts?: Array<{
      icon: 'mail' | 'map-pin' | 'phone'
      title: string               // Ex: "E-mail"
      description?: string
      linkText: string            // Ex: "juridico@sindicato.org.br"
      linkHref: string            // Ex: "mailto:juridico@sindicato.org.br"
    }>
  }

  tabs?: Array<{
    id: string                    // Ex: "atendimento"
    label: string                 // Ex: "Atendimento"
    badge?: string                // Ex: "Novo"
    content: LexicalRichText      // Conteúdo da aba
  }>

  site: Site | string

  createdAt: string
  updatedAt: string
}
```

### Buscar Página Jurídico

```typescript
const response = await fetch(
  `${API_URL}/api/juridico-page?where[site][equals]=${siteId}`
)
const { docs } = await response.json()
const juridicoPage = docs[0]
```

---

## 7. Servicos Page

**Slug**: `servicos-page`

Página de serviços e benefícios. **Uma por site**.

### Campos

```typescript
interface ServicosPage {
  id: string

  hero: {
    badge?: string                // Ex: "Vantagens Exclusivas"
    title: string
    description?: string
    image?: Media
    imageAlt?: string

    features?: Array<{
      icon?: string               // Nome do ícone (shield, heart, star)
      title: string
      description?: string
    }>
  }

  benefits: {
    badge?: string                // Ex: "Convênios"
    title: string
    subtitle?: string

    categories?: Array<{
      id: string                  // Ex: "educacao"
      name: string                // Ex: "Educação"

      benefits?: Array<{
        name: string              // Nome do estabelecimento
        discount?: string         // Ex: "40% nas mensalidades"
        address?: string
        phone?: string
        hours?: string
        observations?: string
      }>
    }>
  }

  facilities?: Array<{
    badge?: string                // Ex: "Instalações Próprias"
    title: string                 // Ex: "Alojamento para Radialistas"
    description?: string
    image?: Media
    imageAlt?: string

    priceTable?: Array<{
      description: string         // Ex: "Diária (associado)"
      price: string               // Ex: "R$ 50,00"
    }>

    generalInfo?: Array<{
      info: string
    }>

    contactInfo: {
      hours?: string
      email?: string
      phone?: string
    }

    regulations?: Array<{
      rule: string
    }>
  }>

  site: Site | string

  createdAt: string
  updatedAt: string
}
```

### Buscar Página Serviços

```typescript
const response = await fetch(
  `${API_URL}/api/servicos-page?where[site][equals]=${siteId}`
)
const { docs } = await response.json()
const servicosPage = docs[0]
```

---

## 8. CTA Sections

**Slug**: `cta-sections`

Seções de Call-to-Action para as páginas.

### Campos

```typescript
interface CTASection {
  id: string
  page: 'sindicato' | 'juridico' | 'servicos'
  title: string
  description?: string
  primaryButtonText?: string
  primaryButtonHref?: string
  secondaryButtonText?: string
  secondaryButtonHref?: string
  image?: Media
  imageAlt?: string
  site: Site | string

  createdAt: string
  updatedAt: string
}
```

### Buscar CTAs

```typescript
// CTAs de uma página específica para um site
const response = await fetch(
  `${API_URL}/api/cta-sections?` + new URLSearchParams({
    'where[site][equals]': siteId,
    'where[page][equals]': 'sindicato'
  })
)
const { docs } = await response.json()
```

---

## 9. Announcement Cards

**Slug**: `announcement-cards`

Cartões de anúncios para as páginas.

### Campos

```typescript
interface AnnouncementCard {
  id: string
  page: 'sindicato' | 'juridico' | 'servicos'
  title: string
  description?: string
  primaryButtonText?: string
  primaryButtonHref?: string
  image?: Media
  imageAlt?: string
  site: Site | string

  createdAt: string
  updatedAt: string
}
```

### Buscar Cartões

```typescript
const response = await fetch(
  `${API_URL}/api/announcement-cards?` + new URLSearchParams({
    'where[site][equals]': siteId,
    'where[page][equals]': 'servicos'
  })
)
const { docs } = await response.json()
```

---

## Formulários Públicos

Estas collections permitem criação pública (sem autenticação).

### 10. Contact Submissions (Contato)

**Slug**: `contact-submissions`

```typescript
interface ContactSubmission {
  nome: string                    // Obrigatório
  email: string                   // Obrigatório
  telefone: string                // Obrigatório - Formato: (00) 00000-0000
  assunto: string                 // Obrigatório
  mensagem: string                // Obrigatório
  site: string                    // Obrigatório - ID do site
}
```

#### Enviar Formulário de Contato

```typescript
async function submitContact(data: ContactSubmission) {
  const response = await fetch(`${API_URL}/api/contact-submissions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.errors?.[0]?.message || 'Erro ao enviar mensagem')
  }

  return response.json()
}

// Uso
await submitContact({
  nome: 'João Silva',
  email: 'joao@email.com',
  telefone: '(91) 99999-9999',
  assunto: 'Dúvida sobre sindicalização',
  mensagem: 'Gostaria de saber mais sobre...',
  site: 'site-id-123'
})
```

---

### 11. Newsletter Submissions

**Slug**: `newsletter-submissions`

```typescript
interface NewsletterSubmission {
  nomeCompleto: string            // Obrigatório
  email: string                   // Obrigatório
  celular: string                 // Obrigatório - Formato: (00) 00000-0000
  newsletterAccepted: boolean     // Obrigatório - deve ser true
  site: string                    // Obrigatório - ID do site
}
```

#### Enviar Inscrição na Newsletter

```typescript
async function submitNewsletter(data: NewsletterSubmission) {
  const response = await fetch(`${API_URL}/api/newsletter-submissions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.errors?.[0]?.message || 'Erro ao inscrever')
  }

  return response.json()
}

// Uso
await submitNewsletter({
  nomeCompleto: 'Maria Santos',
  email: 'maria@email.com',
  celular: '(91) 98888-8888',
  newsletterAccepted: true,
  site: 'site-id-123'
})
```

---

### 12. Sindicalize Submissions (Sindicalização)

**Slug**: `sindicalize-submissions`

```typescript
interface SindicalizeSubmission {
  nomeCompleto: string            // Obrigatório
  cpf: string                     // Obrigatório - Formato: 000.000.000-00
  email: string                   // Obrigatório
  celular: string                 // Obrigatório - Formato: (00) 00000-0000
  dataNascimento: string          // Obrigatório - ISO date
  empresaVeiculo: string          // Obrigatório - Empresa/Veículo
  cargoFuncao: string             // Obrigatório - Cargo/Função
  assinaturaDigital: string       // Obrigatório - ID da mídia (upload)
  declaracaoLida: boolean         // Obrigatório - deve ser true
  site: string                    // Obrigatório - ID do site
}
```

#### Enviar Solicitação de Sindicalização

Este formulário requer upload de assinatura digital primeiro:

```typescript
// 1. Primeiro, fazer upload da assinatura
async function uploadSignature(file: File): Promise<string> {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('alt', 'Assinatura digital')

  const response = await fetch(`${API_URL}/api/media`, {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    throw new Error('Erro ao enviar assinatura')
  }

  const media = await response.json()
  return media.doc.id
}

// 2. Depois, enviar o formulário
async function submitSindicalize(
  data: Omit<SindicalizeSubmission, 'assinaturaDigital'>,
  signatureFile: File
) {
  // Upload da assinatura
  const signatureId = await uploadSignature(signatureFile)

  // Enviar formulário
  const response = await fetch(`${API_URL}/api/sindicalize-submissions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ...data,
      assinaturaDigital: signatureId,
    }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.errors?.[0]?.message || 'Erro ao enviar solicitação')
  }

  return response.json()
}

// Uso
await submitSindicalize({
  nomeCompleto: 'Carlos Oliveira',
  cpf: '123.456.789-00',
  email: 'carlos@email.com',
  celular: '(91) 97777-7777',
  dataNascimento: '1985-03-15',
  empresaVeiculo: 'Rádio XYZ',
  cargoFuncao: 'Locutor',
  declaracaoLida: true,
  site: 'site-id-123'
}, signatureFile)
```

---

## Exemplos de Integração Completos

### Página Home

```typescript
// lib/api.ts
const API_URL = process.env.NEXT_PUBLIC_API_URL

export async function getSiteData(siteSlug: string) {
  const response = await fetch(
    `${API_URL}/api/sites?where[slug][equals]=${siteSlug}`,
    { next: { tags: ['sites'] } }
  )
  const { docs } = await response.json()
  return docs[0]
}

export async function getLatestPosts(siteId: string, limit = 6) {
  const params = new URLSearchParams({
    'where[sites][contains]': siteId,
    'where[_status][equals]': 'published',
    'sort': '-publishedAt',
    'limit': String(limit),
  })

  const response = await fetch(
    `${API_URL}/api/posts?${params}`,
    { next: { tags: ['posts'] } }
  )

  return response.json()
}

// app/page.tsx
export default async function HomePage() {
  const site = await getSiteData('meu-sindicato')
  const { docs: posts } = await getLatestPosts(site.id)

  return (
    <main>
      {/* Hero */}
      {site.hero && (
        <section>
          <h1>{site.hero.title}</h1>
          <p>{site.hero.description}</p>
          {site.hero.image && (
            <Image
              src={site.hero.image.sizes?.large?.url || site.hero.image.url}
              alt={site.hero.imageAlt || ''}
              width={1400}
              height={600}
            />
          )}
          {site.hero.primaryButtonText && (
            <a href={site.hero.primaryButtonHref}>
              {site.hero.primaryButtonText}
            </a>
          )}
        </section>
      )}

      {/* Posts */}
      <section>
        <h2>Últimas Notícias</h2>
        <div className="grid">
          {posts.map((post) => (
            <article key={post.id}>
              {post.heroImage && (
                <Image
                  src={post.heroImage.sizes?.medium?.url}
                  alt={post.heroImage.alt || post.title}
                  width={600}
                  height={400}
                />
              )}
              <h3>{post.title}</h3>
              <p>{post.meta?.description}</p>
              <a href={`/noticias/${post.slug}`}>Leia mais</a>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}
```

### Página de Notícias com Paginação

```typescript
// app/noticias/page.tsx
interface Props {
  searchParams: { page?: string }
}

export default async function NoticiasPage({ searchParams }: Props) {
  const site = await getSiteData('meu-sindicato')
  const page = Number(searchParams.page) || 1

  const params = new URLSearchParams({
    'where[sites][contains]': site.id,
    'where[_status][equals]': 'published',
    'sort': '-publishedAt',
    'limit': '12',
    'page': String(page),
  })

  const response = await fetch(
    `${API_URL}/api/posts?${params}`,
    { next: { tags: ['posts'] } }
  )

  const { docs, totalPages, hasNextPage, hasPrevPage } = await response.json()

  return (
    <main>
      <h1>Notícias</h1>

      <div className="grid">
        {docs.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>

      {/* Paginação */}
      <nav>
        {hasPrevPage && (
          <a href={`/noticias?page=${page - 1}`}>Anterior</a>
        )}
        <span>Página {page} de {totalPages}</span>
        {hasNextPage && (
          <a href={`/noticias?page=${page + 1}`}>Próxima</a>
        )}
      </nav>
    </main>
  )
}
```

### Página do Sindicato

```typescript
// app/sindicato/page.tsx
export default async function SindicatoPage() {
  const site = await getSiteData('meu-sindicato')

  // Buscar página do sindicato
  const response = await fetch(
    `${API_URL}/api/sindicato-page?where[site][equals]=${site.id}`,
    { next: { tags: ['sindicato-page'] } }
  )
  const { docs } = await response.json()
  const pageData = docs[0]

  // Buscar CTAs desta página
  const ctaResponse = await fetch(
    `${API_URL}/api/cta-sections?where[site][equals]=${site.id}&where[page][equals]=sindicato`,
    { next: { tags: ['cta-sections'] } }
  )
  const { docs: ctas } = await ctaResponse.json()

  // Buscar anúncios desta página
  const announcementResponse = await fetch(
    `${API_URL}/api/announcement-cards?where[site][equals]=${site.id}&where[page][equals]=sindicato`,
    { next: { tags: ['announcement-cards'] } }
  )
  const { docs: announcements } = await announcementResponse.json()

  return (
    <main>
      {/* Localizações */}
      {pageData.locationsSection && (
        <section>
          {pageData.locationsSection.badge && (
            <span className="badge">{pageData.locationsSection.badge}</span>
          )}
          <h1>{pageData.locationsSection.title}</h1>
          <p>{pageData.locationsSection.description}</p>

          {pageData.locationsSection.mapEmbedUrl && (
            <iframe
              src={pageData.locationsSection.mapEmbedUrl}
              width="100%"
              height="400"
              loading="lazy"
            />
          )}

          <div className="locations-grid">
            {pageData.locationsSection.locations?.map((location, index) => (
              <div key={index} className="location-card">
                <h3>{location.title}</h3>
                <p>{location.description}</p>
                {/* Renderizar rich text do endereço */}
                <div
                  dangerouslySetInnerHTML={{
                    __html: serializeLexical(location.address)
                  }}
                />
                {location.mapUrl && (
                  <a href={location.mapUrl} target="_blank">
                    Ver no mapa
                  </a>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Diretoria Executiva */}
      {pageData.diretoriaExecutiva && (
        <section>
          <h2>{pageData.diretoriaExecutiva.title}</h2>
          <div className="members-grid">
            {pageData.diretoriaExecutiva.members?.map((member, index) => (
              <div key={index} className="member-card">
                {member.image && (
                  <Image
                    src={member.image.sizes?.square?.url || member.image.url}
                    alt={member.imageAlt || member.name}
                    width={200}
                    height={200}
                  />
                )}
                <h4>{member.name}</h4>
                <p>{member.role}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* CTAs */}
      {ctas.map((cta) => (
        <section key={cta.id} className="cta-section">
          <h2>{cta.title}</h2>
          <p>{cta.description}</p>
          <div className="buttons">
            {cta.primaryButtonText && (
              <a href={cta.primaryButtonHref} className="btn-primary">
                {cta.primaryButtonText}
              </a>
            )}
            {cta.secondaryButtonText && (
              <a href={cta.secondaryButtonHref} className="btn-secondary">
                {cta.secondaryButtonText}
              </a>
            )}
          </div>
        </section>
      ))}
    </main>
  )
}
```

### Layout com Header e Footer

```typescript
// app/layout.tsx
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const site = await getSiteData('meu-sindicato')

  return (
    <html lang="pt-BR">
      <body>
        {/* Header */}
        <header>
          {site.header?.logo && (
            <a href="/">
              <Image
                src={site.header.logo.url}
                alt={site.header.logoAlt || site.name}
                width={150}
                height={50}
              />
            </a>
          )}

          <nav>
            {site.header?.navItems?.map((item, index) => (
              <a key={index} href={item.href}>
                {item.label}
              </a>
            ))}
          </nav>
        </header>

        {children}

        {/* Footer */}
        <footer>
          {site.footer?.logo && (
            <Image
              src={site.footer.logo.url}
              alt={site.name}
              width={120}
              height={40}
            />
          )}

          <p>{site.footer?.description}</p>

          {/* Redes Sociais */}
          <div className="social-links">
            {site.footer?.socialLinks?.facebook && (
              <a href={site.footer.socialLinks.facebook} target="_blank">
                Facebook
              </a>
            )}
            {site.footer?.socialLinks?.instagram && (
              <a href={site.footer.socialLinks.instagram} target="_blank">
                Instagram
              </a>
            )}
            {site.footer?.socialLinks?.twitter && (
              <a href={site.footer.socialLinks.twitter} target="_blank">
                Twitter
              </a>
            )}
            {site.footer?.socialLinks?.youtube && (
              <a href={site.footer.socialLinks.youtube} target="_blank">
                YouTube
              </a>
            )}
          </div>

          {/* Contato */}
          <div className="contact">
            {site.contact?.phone && (
              <a href={`tel:${site.contact.phone.replace(/\D/g, '')}`}>
                {site.contact.phone}
              </a>
            )}
            {site.contact?.email && (
              <a href={`mailto:${site.contact.email}`}>
                {site.contact.email}
              </a>
            )}
            {site.contact?.whatsapp && (
              <a
                href={`https://wa.me/55${site.contact.whatsapp.replace(/\D/g, '')}`}
                target="_blank"
              >
                WhatsApp
              </a>
            )}
            {site.contact?.address && (
              <address>{site.contact.address}</address>
            )}
            {site.contact?.workingHours && (
              <p>{site.contact.workingHours}</p>
            )}
          </div>
        </footer>
      </body>
    </html>
  )
}
```

---

## Renderização de Rich Text (Lexical)

O backend usa Lexical Editor. Para renderizar no frontend:

### Opção 1: Usar @payloadcms/richtext-lexical/react

```typescript
import { RichText } from '@payloadcms/richtext-lexical/react'

<RichText data={post.content} />
```

### Opção 2: Serializar para HTML

```typescript
import {
  type SerializedEditorState,
} from '@payloadcms/richtext-lexical/lexical'
import {
  consolidateHTMLConverters,
  convertLexicalToHTML,
} from '@payloadcms/richtext-lexical'

async function serializeLexical(
  editorState: SerializedEditorState
): Promise<string> {
  return await convertLexicalToHTML({
    converters: consolidateHTMLConverters(),
    data: editorState,
  })
}

// Uso
const htmlContent = await serializeLexical(post.content)
<div dangerouslySetInnerHTML={{ __html: htmlContent }} />
```

---

## Variáveis de Ambiente (Frontend)

```env
# URL do backend
NEXT_PUBLIC_API_URL=https://seu-backend.vercel.app

# Secret para webhook de revalidação
REVALIDATE_SECRET=seu-secret-aqui

# Para preview mode
PREVIEW_SECRET=mesmo-secret-do-backend
```

---

## Queries Úteis

### Posts por Categoria

```typescript
const params = new URLSearchParams({
  'where[sites][contains]': siteId,
  'where[categories][contains]': categoryId,
  'where[_status][equals]': 'published',
  'sort': '-publishedAt',
})

const response = await fetch(`${API_URL}/api/posts?${params}`)
```

### Buscar Posts (Search)

```typescript
// O plugin search indexa posts automaticamente
const response = await fetch(
  `${API_URL}/api/search?where[doc.relationTo][equals]=posts&limit=20`
)
```

### Posts Relacionados

```typescript
// Posts da mesma categoria
const params = new URLSearchParams({
  'where[sites][contains]': siteId,
  'where[categories][contains]': categoryId,
  'where[id][not_equals]': currentPostId,
  'where[_status][equals]': 'published',
  'limit': '3',
})
```

---

## Tratamento de Erros

```typescript
async function fetchAPI<T>(url: string): Promise<T> {
  const response = await fetch(url)

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Recurso não encontrado')
    }
    if (response.status === 401) {
      throw new Error('Não autorizado')
    }
    throw new Error(`Erro ${response.status}: ${response.statusText}`)
  }

  return response.json()
}

// Para formulários
async function submitForm(url: string, data: unknown) {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const error = await response.json()

    // Erros de validação do Payload
    if (error.errors) {
      const messages = error.errors.map((e: any) =>
        `${e.field}: ${e.message}`
      ).join('\n')
      throw new Error(messages)
    }

    throw new Error(error.message || 'Erro ao enviar formulário')
  }

  return response.json()
}
```

---

## Checklist de Integração

- [ ] Configurar variáveis de ambiente
- [ ] Implementar endpoint `/api/revalidate`
- [ ] Criar funções de fetch para cada collection
- [ ] Implementar layout com header/footer do site
- [ ] Criar página home com hero e posts
- [ ] Criar listagem de notícias com paginação
- [ ] Criar página individual de notícia
- [ ] Criar página do sindicato
- [ ] Criar página jurídico com tabs
- [ ] Criar página de serviços
- [ ] Implementar formulário de contato
- [ ] Implementar formulário de newsletter
- [ ] Implementar formulário de sindicalização
- [ ] Configurar renderização de Rich Text
- [ ] Testar revalidação de cache

---

## Suporte

Para dúvidas sobre o backend, consulte a documentação do PayloadCMS:
- https://payloadcms.com/docs

Para reportar problemas:
- Abra uma issue no repositório do projeto
