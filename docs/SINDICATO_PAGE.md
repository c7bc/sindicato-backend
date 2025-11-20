# Página do Sindicato - Documentação GraphQL

**Slug:** `sindicato-page`

Esta collection contém o conteúdo específico da página institucional do Sindicato, incluindo localizações e seções de equipe dinâmicas.

---

## Query Principal

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

---

## Estrutura dos Campos

### locationsSection
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

### teamSections
Array de seções de equipe (dinâmico - permite múltiplas seções):
- `title` - Título da seção (ex: "Diretoria Executiva", "Conselho Fiscal")
- `badge` - Badge opcional (ex: "Gestão 2023-2026")
- `description` - Descrição da seção
- `members[]` - Membros da equipe:
  - `name` - Nome do membro
  - `role` - Cargo (ex: "Presidente", "Tesoureiro")
  - `image` - Foto do membro (upload Media)
  - `imageAlt` - Texto alternativo da imagem

---

## Exemplo de Resposta

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

---

## Notas Importantes

1. **Uma página por site** - Cada site pode ter apenas uma SindicatoPage (campo `site` é unique)

2. **TeamSections é dinâmico** - Diferente de ter tabs fixas, agora você pode criar quantas seções quiser (Diretoria, Conselho, Comissões, etc.)

3. **Rich Text no endereço** - O campo `address` usa Lexical Editor, retorna JSON que precisa ser convertido para HTML

4. **Imagens opcionais** - Membros podem ou não ter foto

---

## Exemplo JavaScript

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

  const response = await fetch('/api/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables: { siteId } }),
  })

  const { data } = await response.json()
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
