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

## 2. Posts (Notícias)

**Slug:** `posts`

### Query - Buscar posts por site
```graphql
query GetPostsBySite($siteId: JSON!) {
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
        alt
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
      content
    }
    totalDocs
    hasNextPage
  }
}
```

**Variáveis:**
```json
{
  "siteId": "1"
}
```

### Query - Buscar post por slug
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

---

## 3. Categories

**Slug:** `categories`

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
