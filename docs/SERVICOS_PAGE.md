# Página de Serviços - Documentação GraphQL

**Slug:** `servicos-page`

Esta collection contém o conteúdo da página de serviços e benefícios, incluindo hero, convênios por categoria e instalações próprias.

---

## Query Principal

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

---

## Estrutura dos Campos

### hero
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

### benefits
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

### facilities
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

---

## Exemplo de Resposta

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

---

## Notas Importantes

1. **Uma página por site** - Cada site pode ter apenas uma ServicosPage (campo `site` é unique)

2. **Categorias de benefícios** - Use o campo `id` como slug para criar tabs/filtros no frontend

3. **Instalações flexíveis** - Array permite múltiplas instalações (alojamento, ginásio, etc.)

4. **Tabela de preços** - Estrutura flexível para qualquer tipo de precificação

---

## Exemplo JavaScript

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

  const response = await fetch('/api/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables: { siteId } }),
  })

  const { data } = await response.json()
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
