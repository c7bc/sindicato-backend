# Posts e Categorias - Documentação GraphQL

---

## Posts (Notícias/Publicações)

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

---

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

---

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

---

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

---

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

---

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

---

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

---

### Exemplo de Resposta (Posts)

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

---

### Notas Importantes (Posts)

1. **Drafts e publicação** - Posts têm sistema de drafts. Sempre filtre com `_status: { equals: published }` para não mostrar rascunhos

2. **Multi-site** - Posts podem pertencer a múltiplos sites. Use `{ sites: { in: [$siteId] } }` para filtrar

3. **Slug automático** - O slug é gerado automaticamente do título (lowercase, sem acentos, hífens)

4. **Rich Text** - O campo `content` usa Lexical Editor e retorna JSON que precisa ser convertido para HTML

5. **SEO** - Use os campos `meta` para OpenGraph e tags meta

6. **Data de publicação** - `publishedAt` é preenchido automaticamente quando o post é publicado

---

### Exemplo JavaScript (Posts)

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

  const response = await fetch('/api/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables: { siteId, page, limit } }),
  })

  const { data } = await response.json()
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

## Categories (Categorias)

**Slug:** `categories`

Collection simples para organizar posts por categorias.

### Estrutura dos Campos

- `title` - Nome da categoria (obrigatório)
- `slug` - URL amigável (gerada automaticamente)

---

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

---

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

### Exemplo de Resposta (Categories)

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

---

### Exemplo JavaScript (Categories)

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

  const response = await fetch('/api/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query }),
  })

  const { data } = await response.json()
  return data.Categories.docs
}

// Uso com posts filtrados
async function getPostsByCategory(categorySlug, siteId) {
  // Primeiro busca a categoria
  const catQuery = `
    query GetCategory($slug: String!) {
      Categories(where: { slug: { equals: $slug } }) {
        docs { id title }
      }
    }
  `

  const catResponse = await fetch('/api/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: catQuery, variables: { slug: categorySlug } }),
  })

  const { data: catData } = await catResponse.json()
  const category = catData.Categories.docs[0]
  if (!category) return null

  // Depois busca os posts
  const postsQuery = `
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
  `

  const postsResponse = await fetch('/api/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: postsQuery,
      variables: { categoryId: category.id, siteId }
    }),
  })

  const { data: postsData } = await postsResponse.json()

  return {
    category,
    posts: postsData.Posts.docs
  }
}
```
