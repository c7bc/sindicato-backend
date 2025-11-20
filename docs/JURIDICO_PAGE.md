# Página Jurídico - Documentação GraphQL

**Slug:** `juridico-page`

Esta collection contém o conteúdo da página do departamento jurídico, com informações de contato e abas de conteúdo (Atendimento, Plantão, Escritórios, etc.).

---

## Query Principal

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

---

## Estrutura dos Campos

### contactInfo
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

### tabs
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

---

## Exemplo de Resposta

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

---

## Notas Importantes

1. **Uma página por site** - Cada site pode ter apenas uma JuridicoPage (campo `site` é unique)

2. **Tabs dinâmicas** - Você pode criar quantas abas quiser, não está limitado às sugeridas

3. **Rich Text nas tabs** - O campo `content` usa Lexical Editor com suporte a h1-h4, retorna JSON

4. **Links de contato** - Use prefixos apropriados:
   - `mailto:` para emails
   - `tel:` para telefones
   - `https://` para URLs

---

## Exemplo JavaScript

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

  const response = await fetch('/api/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables: { siteId } }),
  })

  const { data } = await response.json()
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
