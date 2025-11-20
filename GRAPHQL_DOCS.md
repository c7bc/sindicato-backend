# Documentação GraphQL - Collections Principais

**Base URL:** `http://localhost:3000/api/graphql`

---

## 1. Sites

**Slug:** `sites`

### Query - Buscar todos os sites
```graphql
query {
  Sites {
    docs {
      id
      name
      url
      slug
      contact {
        phone
        email
        address
        whatsapp
        workingHours
      }
      header {
        logo {
          url
        }
        logoAlt
        navItems {
          label
          href
        }
      }
      footer {
        logo {
          url
        }
        description
        socialLinks {
          facebook
          instagram
          twitter
          youtube
        }
      }
      hero {
        title
        description
        image {
          url
        }
        imageAlt
        primaryButtonText
        primaryButtonHref
        secondaryButtonText
        secondaryButtonHref
      }
    }
  }
}
```

### Query - Buscar site por slug
```graphql
query GetSiteBySlug($slug: String!) {
  Sites(where: { slug: { equals: $slug } }) {
    docs {
      id
      name
      url
      slug
      contact {
        phone
        email
        address
        whatsapp
        workingHours
      }
      header {
        logo {
          url
        }
        navItems {
          label
          href
        }
      }
      footer {
        description
        socialLinks {
          facebook
          instagram
          twitter
          youtube
        }
      }
      hero {
        title
        description
        image {
          url
        }
        primaryButtonText
        primaryButtonHref
      }
    }
  }
}
```

**Variáveis:**
```json
{
  "slug": "sindicato-belem"
}
```

---

## 2. Posts (Notícias/Publicações)

**Slug:** `posts`

Esta collection gerencia todas as notícias e publicações do site, com suporte a drafts, SEO, categorias e múltiplos sites.

### Estrutura dos Campos

- `title` - Título da notícia (obrigatório)
- `slug` - URL amigável (gerada automaticamente do título)
- `heroImage` - Imagem de destaque (upload Media)
- `content` - Conteúdo em rich text (Lexical JSON com h1-h4, hr)
- `sites[]` - Sites onde a notícia aparece (hasMany, obrigatório)
- `categories[]` - Categorias da notícia (hasMany)
- `publishedAt` - Data de publicação
- `authors[]` - Autores (relationship com users)
- `populatedAuthors[]` - Dados dos autores populados (id, name)
- `meta` - Campos SEO:
  - `title` - Título SEO
  - `description` - Descrição SEO
  - `image` - Imagem SEO
- `_status` - Status: `draft` ou `published`

### Query - Buscar posts por site (com paginação)
```graphql
query GetPostsBySite($siteId: JSON!, $page: Int, $limit: Int) {
  Posts(
    where: {
      sites: { in: [$siteId] }
      _status: { equals: published }
    }
    sort: "-publishedAt"
    page: $page
    limit: $limit
  ) {
    docs {
      id
      title
      slug
      publishedAt
      heroImage {
        url
        alt
        width
        height
      }
      meta {
        title
        description
        image {
          url
        }
      }
      categories {
        id
        title
        slug
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

**Variáveis:**
```json
{
  "siteId": "1",
  "page": 1,
  "limit": 10
}
```

### Query - Buscar post por slug (completo)
```graphql
query GetPostBySlug($slug: String!, $siteId: JSON!) {
  Posts(
    where: {
      slug: { equals: $slug }
      sites: { in: [$siteId] }
      _status: { equals: published }
    }
  ) {
    docs {
      id
      title
      slug
      publishedAt
      heroImage {
        url
        alt
        width
        height
      }
      content
      categories {
        id
        title
        slug
      }
      populatedAuthors {
        id
        name
      }
      meta {
        title
        description
        image {
          url
        }
      }
    }
  }
}
```

### Query - Buscar posts por categoria
```graphql
query GetPostsByCategory($categoryId: JSON!, $siteId: JSON!) {
  Posts(
    where: {
      categories: { in: [$categoryId] }
      sites: { in: [$siteId] }
      _status: { equals: published }
    }
    sort: "-publishedAt"
    limit: 20
  ) {
    docs {
      id
      title
      slug
      publishedAt
      heroImage {
        url
        alt
      }
      meta {
        description
      }
      categories {
        id
        title
        slug
      }
    }
    totalDocs
  }
}
```

### Query - Buscar posts recentes (para home)
```graphql
query GetRecentPosts($siteId: JSON!) {
  Posts(
    where: {
      sites: { in: [$siteId] }
      _status: { equals: published }
    }
    sort: "-publishedAt"
    limit: 5
  ) {
    docs {
      id
      title
      slug
      publishedAt
      heroImage {
        url
      }
      meta {
        description
      }
    }
  }
}
```

### Query - Buscar posts por período
```graphql
query GetPostsByDateRange($siteId: JSON!, $startDate: DateTime!, $endDate: DateTime!) {
  Posts(
    where: {
      sites: { in: [$siteId] }
      _status: { equals: published }
      publishedAt: {
        greater_than_equal: $startDate
        less_than_equal: $endDate
      }
    }
    sort: "-publishedAt"
  ) {
    docs {
      id
      title
      slug
      publishedAt
    }
  }
}
```

### Query - Pesquisar posts
```graphql
query SearchPosts($siteId: JSON!, $search: String!) {
  Posts(
    where: {
      sites: { in: [$siteId] }
      _status: { equals: published }
      title: { like: $search }
    }
    sort: "-publishedAt"
    limit: 20
  ) {
    docs {
      id
      title
      slug
      publishedAt
      heroImage {
        url
      }
    }
  }
}
```

**Variáveis:**
```json
{
  "siteId": "1",
  "search": "%sindicato%"
}
```

### Exemplo de Resposta
```json
{
  "data": {
    "Posts": {
      "docs": [
        {
          "id": "1",
          "title": "Sindicato conquista novo acordo coletivo",
          "slug": "sindicato-conquista-novo-acordo-coletivo",
          "publishedAt": "2024-01-15T10:30:00.000Z",
          "heroImage": {
            "url": "/media/acordo-coletivo.jpg",
            "alt": "Assinatura do acordo coletivo",
            "width": 1200,
            "height": 630
          },
          "content": {
            "root": {
              "children": [
                {
                  "type": "paragraph",
                  "children": [{ "text": "O Sindicato dos Radialistas..." }]
                }
              ]
            }
          },
          "categories": [
            {
              "id": "1",
              "title": "Acordos",
              "slug": "acordos"
            }
          ],
          "populatedAuthors": [
            {
              "id": "1",
              "name": "Admin"
            }
          ],
          "meta": {
            "title": "Sindicato conquista novo acordo coletivo | Sindicato dos Radialistas",
            "description": "Confira os detalhes do novo acordo coletivo conquistado pelo sindicato",
            "image": {
              "url": "/media/acordo-coletivo.jpg"
            }
          }
        }
      ],
      "totalDocs": 45,
      "totalPages": 5,
      "page": 1,
      "hasNextPage": true,
      "hasPrevPage": false
    }
  }
}
```

### Notas Importantes

1. **Drafts e publicação** - Posts têm sistema de drafts. Sempre filtre com `_status: { equals: published }` para não mostrar rascunhos

2. **Multi-site** - Posts podem pertencer a múltiplos sites. Use `{ sites: { in: [$siteId] } }` para filtrar

3. **Slug automático** - O slug é gerado automaticamente do título (lowercase, sem acentos, hífens)

4. **Rich Text** - O campo `content` usa Lexical Editor e retorna JSON que precisa ser convertido para HTML

5. **SEO** - Use os campos `meta` para OpenGraph e tags meta

6. **Data de publicação** - `publishedAt` é preenchido automaticamente quando o post é publicado

### Exemplo JavaScript - Buscar Posts com Paginação
```javascript
async function getPosts(siteId, page = 1, limit = 10) {
  const query = `
    query GetPosts($siteId: JSON!, $page: Int!, $limit: Int!) {
      Posts(
        where: {
          sites: { in: [$siteId] }
          _status: { equals: published }
        }
        sort: "-publishedAt"
        page: $page
        limit: $limit
      ) {
        docs {
          id
          title
          slug
          publishedAt
          heroImage { url alt }
          meta { description }
          categories { title slug }
        }
        totalDocs
        totalPages
        hasNextPage
      }
    }
  `

  const data = await fetchGraphQL(query, { siteId, page, limit })
  return data.Posts
}

// Uso
const { docs: posts, hasNextPage, totalPages } = await getPosts("1", 1, 10)

posts.forEach(post => {
  console.log(`${post.title} - ${post.publishedAt}`)
  console.log(`  /posts/${post.slug}`)
})
```

---

## 3. Categories (Categorias)

**Slug:** `categories`

Collection simples para organizar posts por categorias.

### Estrutura dos Campos

- `title` - Nome da categoria (obrigatório)
- `slug` - URL amigável (gerada automaticamente)

### Query - Buscar todas as categorias
```graphql
query {
  Categories {
    docs {
      id
      title
      slug
    }
  }
}
```

### Query - Buscar categoria por slug
```graphql
query GetCategoryBySlug($slug: String!) {
  Categories(where: { slug: { equals: $slug } }) {
    docs {
      id
      title
      slug
    }
  }
}
```

### Query - Buscar categorias com contagem de posts
```graphql
query GetCategoriesWithPosts($siteId: JSON!) {
  Categories {
    docs {
      id
      title
      slug
    }
  }
}

# Nota: Para contar posts por categoria, faça queries separadas
# ou use a API REST que tem suporte a agregações
```

### Exemplo de Resposta
```json
{
  "data": {
    "Categories": {
      "docs": [
        {
          "id": "1",
          "title": "Acordos Coletivos",
          "slug": "acordos-coletivos"
        },
        {
          "id": "2",
          "title": "Eventos",
          "slug": "eventos"
        },
        {
          "id": "3",
          "title": "Jurídico",
          "slug": "juridico"
        },
        {
          "id": "4",
          "title": "Comunicados",
          "slug": "comunicados"
        }
      ]
    }
  }
}
```

### Exemplo JavaScript - Menu de Categorias
```javascript
async function getCategories() {
  const query = `
    query {
      Categories {
        docs {
          id
          title
          slug
        }
      }
    }
  `

  const data = await fetchGraphQL(query)
  return data.Categories.docs
}

// Uso com posts filtrados
async function getPostsByCategory(categorySlug, siteId) {
  // Primeiro busca a categoria
  const categories = await fetchGraphQL(`
    query GetCategory($slug: String!) {
      Categories(where: { slug: { equals: $slug } }) {
        docs { id title }
      }
    }
  `, { slug: categorySlug })

  const category = categories.Categories.docs[0]
  if (!category) return null

  // Depois busca os posts
  const posts = await fetchGraphQL(`
    query GetPosts($categoryId: JSON!, $siteId: JSON!) {
      Posts(
        where: {
          categories: { in: [$categoryId] }
          sites: { in: [$siteId] }
          _status: { equals: published }
        }
        sort: "-publishedAt"
      ) {
        docs {
          id
          title
          slug
          publishedAt
          heroImage { url }
        }
      }
    }
  `, { categoryId: category.id, siteId })

  return {
    category,
    posts: posts.Posts.docs
  }
}
```

---

## 4. CTA Sections (Seções CTA)

**Slug:** `cta-sections`

### Query - Buscar CTA por página e site
```graphql
query GetCTAByPageAndSite($page: CtaSection_page_Input!, $siteId: JSON!) {
  CtaSections(
    where: {
      page: { equals: $page }
      site: { equals: $siteId }
    }
  ) {
    docs {
      id
      page
      title
      description
      primaryButtonText
      primaryButtonHref
      secondaryButtonText
      secondaryButtonHref
      image {
        url
        alt
      }
      imageAlt
    }
  }
}
```

**Variáveis:**
```json
{
  "page": "sindicato",
  "siteId": "1"
}
```

**Valores válidos para `page`:**
- `sindicato`
- `juridico`
- `servicos`

### Query - Buscar todos os CTAs de um site
```graphql
query GetAllCTAsBySite($siteId: JSON!) {
  CtaSections(where: { site: { equals: $siteId } }) {
    docs {
      id
      page
      title
      description
      primaryButtonText
      primaryButtonHref
      secondaryButtonText
      secondaryButtonHref
      image {
        url
      }
    }
  }
}
```

---

## 5. Announcement Cards (Cartões de Anúncio)

**Slug:** `announcement-cards`

### Query - Buscar cartões por página e site
```graphql
query GetAnnouncementsByPageAndSite($page: AnnouncementCard_page_Input!, $siteId: JSON!) {
  AnnouncementCards(
    where: {
      page: { equals: $page }
      site: { equals: $siteId }
    }
  ) {
    docs {
      id
      page
      title
      description
      primaryButtonText
      primaryButtonHref
      image {
        url
        alt
      }
      imageAlt
    }
  }
}
```

**Variáveis:**
```json
{
  "page": "juridico",
  "siteId": "1"
}
```

**Valores válidos para `page`:**
- `sindicato`
- `juridico`
- `servicos`

---

## 6. Sindicato Page (Página do Sindicato)

**Slug:** `sindicato-page`

Esta collection contém o conteúdo específico da página institucional do Sindicato, incluindo localizações e seções de equipe dinâmicas.

### Query - Buscar página do sindicato por site
```graphql
query GetSindicatoPageBySite($siteId: JSON!) {
  SindicatoPages(where: { site: { equals: $siteId } }) {
    docs {
      id
      site {
        id
        name
        slug
      }
      locationsSection {
        badge
        title
        description
        mapEmbedUrl
        locations {
          id
          title
          description
          address
          mapUrl
          icon
        }
      }
      teamSections {
        id
        title
        badge
        description
        members {
          id
          name
          role
          image {
            url
            alt
            width
            height
          }
          imageAlt
        }
      }
    }
  }
}
```

**Variáveis:**
```json
{
  "siteId": "1"
}
```

### Estrutura dos Campos

#### locationsSection
Seção de localizações/sedes do sindicato:
- `badge` - Texto badge (ex: "Nossas sedes")
- `title` - Título da seção
- `description` - Descrição
- `mapEmbedUrl` - URL do Google Maps Embed
- `locations[]` - Array de localizações:
  - `title` - Nome da sede (ex: "Sede Principal - Belém")
  - `description` - Informações adicionais (ex: horários)
  - `address` - Endereço em rich text (Lexical JSON)
  - `mapUrl` - Link direto do Google Maps
  - `icon` - Ícone: `map-pin`, `building`, ou `office`

#### teamSections
Array de seções de equipe (dinâmico - permite múltiplas seções):
- `title` - Título da seção (ex: "Diretoria Executiva", "Conselho Fiscal")
- `badge` - Badge opcional (ex: "Gestão 2023-2026")
- `description` - Descrição da seção
- `members[]` - Membros da equipe:
  - `name` - Nome do membro
  - `role` - Cargo (ex: "Presidente", "Tesoureiro")
  - `image` - Foto do membro (upload Media)
  - `imageAlt` - Texto alternativo da imagem

### Query Completa - Página do Sindicato com Site
```graphql
query GetFullSindicatoPage($siteSlug: String!) {
  # Primeiro busca o site
  Sites(where: { slug: { equals: $siteSlug } }) {
    docs {
      id
      name
      contact {
        phone
        email
        address
        whatsapp
      }
    }
  }

  # Depois busca a página do sindicato pelo siteId
  # (será necessário duas requests ou usar o ID retornado)
}
```

### Exemplo de Resposta
```json
{
  "data": {
    "SindicatoPages": {
      "docs": [
        {
          "id": "1",
          "site": {
            "id": "1",
            "name": "Sindicato dos Radialistas",
            "slug": "sindicato-belem"
          },
          "locationsSection": {
            "badge": "Nossas sedes",
            "title": "Onde nos encontrar",
            "description": "Visite uma de nossas sedes para atendimento presencial",
            "mapEmbedUrl": "https://www.google.com/maps/embed?pb=...",
            "locations": [
              {
                "id": "loc-1",
                "title": "Sede Principal - Belém",
                "description": "Segunda a sexta, 8h às 17h",
                "address": {
                  "root": {
                    "children": [...]
                  }
                },
                "mapUrl": "https://maps.google.com/?q=...",
                "icon": "building"
              }
            ]
          },
          "teamSections": [
            {
              "id": "section-1",
              "title": "Diretoria Executiva",
              "badge": "Gestão 2023-2026",
              "description": "Conheça a diretoria executiva do sindicato",
              "members": [
                {
                  "id": "member-1",
                  "name": "João Silva",
                  "role": "Presidente",
                  "image": {
                    "url": "/media/joao-silva.jpg",
                    "alt": "João Silva",
                    "width": 400,
                    "height": 400
                  },
                  "imageAlt": "Foto do presidente João Silva"
                },
                {
                  "id": "member-2",
                  "name": "Maria Santos",
                  "role": "Vice-Presidente",
                  "image": {
                    "url": "/media/maria-santos.jpg"
                  }
                }
              ]
            },
            {
              "id": "section-2",
              "title": "Conselho Fiscal",
              "badge": "Gestão 2023-2026",
              "description": null,
              "members": [
                {
                  "id": "member-3",
                  "name": "Carlos Oliveira",
                  "role": "Conselheiro Titular",
                  "image": null
                }
              ]
            }
          ]
        }
      ]
    }
  }
}
```

### Notas Importantes

1. **Uma página por site** - Cada site pode ter apenas uma SindicatoPage (campo `site` é unique)

2. **TeamSections é dinâmico** - Diferente de ter tabs fixas, agora você pode criar quantas seções quiser (Diretoria, Conselho, Comissões, etc.)

3. **Rich Text no endereço** - O campo `address` usa Lexical Editor, retorna JSON que precisa ser convertido para HTML

4. **Imagens opcionais** - Membros podem ou não ter foto

### Exemplo JavaScript - Buscar e Renderizar
```javascript
async function getSindicatoPage(siteId) {
  const query = `
    query GetSindicatoPage($siteId: JSON!) {
      SindicatoPages(where: { site: { equals: $siteId } }) {
        docs {
          locationsSection {
            title
            locations {
              title
              description
              mapUrl
            }
          }
          teamSections {
            title
            badge
            members {
              name
              role
              image {
                url
              }
            }
          }
        }
      }
    }
  `

  const data = await fetchGraphQL(query, { siteId })
  return data.SindicatoPages.docs[0] || null
}

// Uso
const sindicatoPage = await getSindicatoPage("1")

// Renderizar seções de equipe dinamicamente
sindicatoPage.teamSections.forEach(section => {
  console.log(`=== ${section.title} ===`)
  console.log(section.badge || '')

  section.members.forEach(member => {
    console.log(`${member.name} - ${member.role}`)
  })
})
```

---

## 7. Jurídico Page (Página Jurídico)

**Slug:** `juridico-page`

Esta collection contém o conteúdo da página do departamento jurídico, com informações de contato e abas de conteúdo (Atendimento, Plantão, Escritórios, etc.).

### Query - Buscar página jurídico por site
```graphql
query GetJuridicoPageBySite($siteId: JSON!) {
  JuridicoPages(where: { site: { equals: $siteId } }) {
    docs {
      id
      site {
        id
        name
        slug
      }
      contactInfo {
        badge
        title
        description
        contacts {
          id
          icon
          title
          description
          linkText
          linkHref
        }
      }
      tabs {
        id
        label
        badge
        content
      }
    }
  }
}
```

**Variáveis:**
```json
{
  "siteId": "1"
}
```

### Estrutura dos Campos

#### contactInfo
Seção de informações de contato do jurídico:
- `badge` - Texto badge (ex: "Fale conosco")
- `title` - Título da seção
- `description` - Descrição
- `contacts[]` - Array de contatos:
  - `icon` - Ícone: `mail`, `map-pin`, ou `phone`
  - `title` - Título do contato (ex: "E-mail", "Telefone")
  - `description` - Descrição adicional
  - `linkText` - Texto visível do link (ex: "juridico@sindicato.org")
  - `linkHref` - Link completo (ex: "mailto:juridico@sindicato.org", "tel:+5591999999999")

#### tabs
Array de abas de conteúdo:
- `id` - Slug único da aba (ex: "atendimento", "plantao-juridico")
- `label` - Texto da aba (ex: "Atendimento", "Plantão Jurídico")
- `badge` - Badge opcional (ex: "Novo")
- `content` - Conteúdo em rich text (Lexical JSON)

**Abas sugeridas:**
- `atendimento` - Atendimento
- `plantao-juridico` - Plantão Jurídico
- `escritorios` - Escritórios Conveniados
- `homologacao` - Homologação
- `consulta-processual` - Consulta Processual
- `acoes-coletivas` - Ações Coletivas

### Exemplo de Resposta
```json
{
  "data": {
    "JuridicoPages": {
      "docs": [
        {
          "id": "1",
          "site": {
            "id": "1",
            "name": "Sindicato dos Radialistas",
            "slug": "sindicato-belem"
          },
          "contactInfo": {
            "badge": "Fale conosco",
            "title": "Entre em contato com o Jurídico",
            "description": "Nossa equipe está pronta para atendê-lo",
            "contacts": [
              {
                "id": "contact-1",
                "icon": "mail",
                "title": "E-mail",
                "description": "Resposta em até 24h",
                "linkText": "juridico@sindicato.org.br",
                "linkHref": "mailto:juridico@sindicato.org.br"
              },
              {
                "id": "contact-2",
                "icon": "phone",
                "title": "Telefone",
                "description": "Segunda a sexta, 8h às 17h",
                "linkText": "(91) 3222-1234",
                "linkHref": "tel:+559132221234"
              },
              {
                "id": "contact-3",
                "icon": "map-pin",
                "title": "Endereço",
                "description": null,
                "linkText": "Rua dos Mundurucus, 123 - Belém/PA",
                "linkHref": "https://maps.google.com/?q=..."
              }
            ]
          },
          "tabs": [
            {
              "id": "atendimento",
              "label": "Atendimento",
              "badge": null,
              "content": {
                "root": {
                  "children": [
                    {
                      "type": "heading",
                      "tag": "h2",
                      "children": [{ "text": "Como funciona o atendimento" }]
                    },
                    {
                      "type": "paragraph",
                      "children": [{ "text": "O departamento jurídico atende..." }]
                    }
                  ]
                }
              }
            },
            {
              "id": "plantao-juridico",
              "label": "Plantão Jurídico",
              "badge": "Novo",
              "content": {
                "root": {
                  "children": [...]
                }
              }
            },
            {
              "id": "escritorios",
              "label": "Escritórios Conveniados",
              "badge": null,
              "content": {
                "root": {
                  "children": [...]
                }
              }
            }
          ]
        }
      ]
    }
  }
}
```

### Notas Importantes

1. **Uma página por site** - Cada site pode ter apenas uma JuridicoPage (campo `site` é unique)

2. **Tabs dinâmicas** - Você pode criar quantas abas quiser, não está limitado às sugeridas

3. **Rich Text nas tabs** - O campo `content` usa Lexical Editor com suporte a h1-h4, retorna JSON

4. **Links de contato** - Use prefixos apropriados:
   - `mailto:` para emails
   - `tel:` para telefones
   - `https://` para URLs

### Exemplo JavaScript - Buscar e Renderizar Tabs
```javascript
async function getJuridicoPage(siteId) {
  const query = `
    query GetJuridicoPage($siteId: JSON!) {
      JuridicoPages(where: { site: { equals: $siteId } }) {
        docs {
          contactInfo {
            title
            contacts {
              icon
              title
              linkText
              linkHref
            }
          }
          tabs {
            id
            label
            badge
            content
          }
        }
      }
    }
  `

  const data = await fetchGraphQL(query, { siteId })
  return data.JuridicoPages.docs[0] || null
}

// Uso
const juridicoPage = await getJuridicoPage("1")

// Renderizar tabs
const [activeTab, setActiveTab] = useState(juridicoPage.tabs[0]?.id)

// Encontrar conteúdo da tab ativa
const activeContent = juridicoPage.tabs.find(tab => tab.id === activeTab)?.content

// Renderizar contatos
juridicoPage.contactInfo.contacts.forEach(contact => {
  console.log(`${contact.icon}: ${contact.title}`)
  console.log(`  ${contact.linkText} -> ${contact.linkHref}`)
})
```

---

## 8. Serviços Page (Página de Serviços)

**Slug:** `servicos-page`

Esta collection contém o conteúdo da página de serviços e benefícios, incluindo hero, convênios por categoria e instalações próprias.

### Query - Buscar página de serviços por site
```graphql
query GetServicosPageBySite($siteId: JSON!) {
  ServicosPages(where: { site: { equals: $siteId } }) {
    docs {
      id
      site {
        id
        name
        slug
      }
      hero {
        badge
        title
        description
        image {
          url
          alt
          width
          height
        }
        imageAlt
        features {
          id
          icon
          title
          description
        }
      }
      benefits {
        badge
        title
        subtitle
        categories {
          id
          name
          benefits {
            id
            name
            discount
            address
            phone
            hours
            observations
          }
        }
      }
      facilities {
        id
        badge
        title
        description
        image {
          url
          alt
        }
        imageAlt
        priceTable {
          id
          description
          price
        }
        generalInfo {
          id
          info
        }
        contactInfo {
          hours
          email
          phone
        }
        regulations {
          id
          rule
        }
      }
    }
  }
}
```

**Variáveis:**
```json
{
  "siteId": "1"
}
```

### Estrutura dos Campos

#### hero
Seção hero da página de serviços:
- `badge` - Texto badge (ex: "Vantagens Exclusivas")
- `title` - Título principal
- `description` - Descrição
- `image` - Imagem de fundo (upload Media)
- `imageAlt` - Texto alternativo
- `features[]` - Lista de destaques:
  - `icon` - Nome do ícone (ex: "shield", "heart", "star")
  - `title` - Título do destaque
  - `description` - Descrição

#### benefits
Seção de convênios e benefícios:
- `badge` - Texto badge (ex: "Convênios")
- `title` - Título da seção
- `subtitle` - Subtítulo
- `categories[]` - Categorias de benefícios:
  - `id` - Slug da categoria (ex: "educacao", "saude")
  - `name` - Nome da categoria (ex: "Educação", "Saúde")
  - `benefits[]` - Estabelecimentos/benefícios:
    - `name` - Nome do estabelecimento
    - `discount` - Desconto oferecido (ex: "40% nas mensalidades")
    - `address` - Endereço
    - `phone` - Telefone
    - `hours` - Horário de funcionamento
    - `observations` - Observações adicionais

#### facilities
Array de instalações próprias:
- `badge` - Badge (ex: "Instalações Próprias")
- `title` - Nome da instalação (ex: "Alojamento para Radialistas")
- `description` - Descrição
- `image` - Foto da instalação
- `imageAlt` - Texto alternativo
- `priceTable[]` - Tabela de preços:
  - `description` - Descrição do serviço
  - `price` - Valor
- `generalInfo[]` - Informações gerais:
  - `info` - Texto da informação
- `contactInfo` - Contato da instalação:
  - `hours` - Horário
  - `email` - E-mail
  - `phone` - Telefone
- `regulations[]` - Normas/regras:
  - `rule` - Texto da regra

### Exemplo de Resposta
```json
{
  "data": {
    "ServicosPages": {
      "docs": [
        {
          "id": "1",
          "site": {
            "id": "1",
            "name": "Sindicato dos Radialistas",
            "slug": "sindicato-belem"
          },
          "hero": {
            "badge": "Vantagens Exclusivas",
            "title": "Benefícios para Associados",
            "description": "Confira todos os convênios e serviços exclusivos",
            "image": {
              "url": "/media/servicos-hero.jpg",
              "alt": "Benefícios do sindicato"
            },
            "imageAlt": "Benefícios exclusivos para associados",
            "features": [
              {
                "id": "feat-1",
                "icon": "shield",
                "title": "Proteção Jurídica",
                "description": "Assistência jurídica completa"
              },
              {
                "id": "feat-2",
                "icon": "heart",
                "title": "Saúde",
                "description": "Convênios com clínicas e hospitais"
              }
            ]
          },
          "benefits": {
            "badge": "Convênios",
            "title": "Nossos Parceiros",
            "subtitle": "Descontos exclusivos para associados",
            "categories": [
              {
                "id": "educacao",
                "name": "Educação",
                "benefits": [
                  {
                    "id": "ben-1",
                    "name": "Faculdade XYZ",
                    "discount": "40% nas mensalidades",
                    "address": "Av. Nazaré, 1000 - Belém/PA",
                    "phone": "(91) 3222-1234",
                    "hours": "Segunda a sexta, 8h às 20h",
                    "observations": "Válido para cursos de graduação"
                  },
                  {
                    "id": "ben-2",
                    "name": "Escola de Idiomas ABC",
                    "discount": "30% em todos os cursos",
                    "address": "Rua dos Mundurucus, 500",
                    "phone": "(91) 3333-4444",
                    "hours": null,
                    "observations": null
                  }
                ]
              },
              {
                "id": "saude",
                "name": "Saúde",
                "benefits": [
                  {
                    "id": "ben-3",
                    "name": "Clínica Saúde Total",
                    "discount": "20% em consultas",
                    "address": "Tv. Padre Eutíquio, 200",
                    "phone": "(91) 3111-2222",
                    "hours": "Segunda a sábado, 7h às 18h",
                    "observations": "Apresentar carteirinha do sindicato"
                  }
                ]
              }
            ]
          },
          "facilities": [
            {
              "id": "fac-1",
              "badge": "Instalações Próprias",
              "title": "Alojamento para Radialistas",
              "description": "Hospedagem confortável para radialistas em trânsito",
              "image": {
                "url": "/media/alojamento.jpg",
                "alt": "Alojamento do sindicato"
              },
              "imageAlt": "Vista do alojamento",
              "priceTable": [
                {
                  "id": "price-1",
                  "description": "Diária (associado)",
                  "price": "R$ 50,00"
                },
                {
                  "id": "price-2",
                  "description": "Diária (não associado)",
                  "price": "R$ 80,00"
                }
              ],
              "generalInfo": [
                {
                  "id": "info-1",
                  "info": "Capacidade: 20 pessoas"
                },
                {
                  "id": "info-2",
                  "info": "Wi-Fi gratuito"
                }
              ],
              "contactInfo": {
                "hours": "Recepção 24h",
                "email": "alojamento@sindicato.org.br",
                "phone": "(91) 3222-5678"
              },
              "regulations": [
                {
                  "id": "rule-1",
                  "rule": "Check-in: 14h / Check-out: 12h"
                },
                {
                  "id": "rule-2",
                  "rule": "Proibido fumar nas dependências"
                }
              ]
            }
          ]
        }
      ]
    }
  }
}
```

### Notas Importantes

1. **Uma página por site** - Cada site pode ter apenas uma ServicosPage (campo `site` é unique)

2. **Categorias de benefícios** - Use o campo `id` como slug para criar tabs/filtros no frontend

3. **Instalações flexíveis** - Array permite múltiplas instalações (alojamento, ginásio, etc.)

4. **Tabela de preços** - Estrutura flexível para qualquer tipo de precificação

### Exemplo JavaScript - Buscar e Renderizar Benefícios
```javascript
async function getServicosPage(siteId) {
  const query = `
    query GetServicosPage($siteId: JSON!) {
      ServicosPages(where: { site: { equals: $siteId } }) {
        docs {
          hero {
            title
            description
            features {
              icon
              title
              description
            }
          }
          benefits {
            title
            categories {
              id
              name
              benefits {
                name
                discount
                address
                phone
              }
            }
          }
          facilities {
            title
            description
            priceTable {
              description
              price
            }
            contactInfo {
              phone
              email
            }
          }
        }
      }
    }
  `

  const data = await fetchGraphQL(query, { siteId })
  return data.ServicosPages.docs[0] || null
}

// Uso
const servicosPage = await getServicosPage("1")

// Renderizar categorias de benefícios com tabs
const [activeCategory, setActiveCategory] = useState(
  servicosPage.benefits.categories[0]?.id
)

// Encontrar benefícios da categoria ativa
const activeBenefits = servicosPage.benefits.categories
  .find(cat => cat.id === activeCategory)?.benefits || []

// Renderizar tabs
servicosPage.benefits.categories.forEach(category => {
  console.log(`Tab: ${category.name} (${category.id})`)
})

// Renderizar benefícios
activeBenefits.forEach(benefit => {
  console.log(`${benefit.name} - ${benefit.discount}`)
  if (benefit.phone) console.log(`  Tel: ${benefit.phone}`)
})
```

---

## Filtros Comuns

### Operadores de comparação
```graphql
where: {
  field: { equals: "valor" }           # igual
  field: { not_equals: "valor" }       # diferente
  field: { in: ["a", "b"] }            # está em
  field: { not_in: ["a", "b"] }        # não está em
  field: { like: "%texto%" }           # contém
  field: { contains: "texto" }         # contém (case sensitive)
  field: { greater_than: 10 }          # maior que
  field: { less_than: 10 }             # menor que
  field: { exists: true }              # existe
}
```

### Combinando filtros (AND)
```graphql
where: {
  AND: [
    { page: { equals: "sindicato" } }
    { site: { equals: "1" } }
  ]
}
```

### Combinando filtros (OR)
```graphql
where: {
  OR: [
    { page: { equals: "sindicato" } }
    { page: { equals: "juridico" } }
  ]
}
```

---

## Paginação e Ordenação

```graphql
query {
  Posts(
    limit: 10           # quantidade por página
    page: 1             # número da página
    sort: "-publishedAt" # ordenar (- = decrescente)
  ) {
    docs { ... }
    totalDocs           # total de documentos
    totalPages          # total de páginas
    page                # página atual
    hasNextPage         # tem próxima página
    hasPrevPage         # tem página anterior
  }
}
```

---

## Exemplo Completo - Fetch com JavaScript

```javascript
async function fetchGraphQL(query, variables = {}) {
  const response = await fetch('http://localhost:3000/api/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query, variables }),
  })

  const { data, errors } = await response.json()

  if (errors) {
    console.error('GraphQL Errors:', errors)
    throw new Error(errors[0].message)
  }

  return data
}

// Exemplo: Buscar posts de um site
const GET_POSTS = `
  query GetPosts($siteId: JSON!) {
    Posts(
      where: {
        sites: { in: [$siteId] }
        _status: { equals: published }
      }
      sort: "-publishedAt"
      limit: 10
    ) {
      docs {
        id
        title
        slug
        publishedAt
        heroImage {
          url
        }
      }
    }
  }
`

const data = await fetchGraphQL(GET_POSTS, { siteId: "1" })
console.log(data.Posts.docs)
```

---

## Dicas Importantes

1. **IDs são strings** - Sempre passe IDs como strings (`"1"` não `1`)

2. **Relationships** - Use `in` para arrays e `equals` para single:
   - Posts têm `sites: hasMany` → use `{ sites: { in: [$siteId] } }`
   - CTASections têm `site: single` → use `{ site: { equals: $siteId } }`

3. **Status de publicação** - Posts têm drafts, filtre com:
   ```graphql
   _status: { equals: published }
   ```

4. **Nomes GraphQL** - O Payload converte slugs para PascalCase:
   - `posts` → `Posts`
   - `cta-sections` → `CtaSections`
   - `announcement-cards` → `AnnouncementCards`

5. **Media URLs** - Sempre acesse `url` dentro do campo upload:
   ```graphql
   heroImage {
     url
     alt
   }
   ```
