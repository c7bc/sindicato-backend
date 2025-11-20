# Sistema de Revalidação de Cache via Webhook

Este documento descreve como funciona o sistema de revalidação de cache do backend Payload CMS, que notifica o frontend Next.js para invalidar o cache quando documentos são criados, atualizados ou deletados.

## Visão Geral

O sistema utiliza hooks do Payload CMS (`afterChange` e `afterDelete`) para detectar mudanças em collections e enviar webhooks para o frontend, permitindo revalidação granular do cache.

## Arquitetura

```
┌─────────────────┐      ┌──────────────────┐      ┌─────────────────┐
│  Payload CMS    │      │    Webhook       │      │  Frontend       │
│  (Backend)      │ ──── │    Request       │ ──── │  (Next.js)      │
│                 │      │                  │      │                 │
│  • afterChange  │      │  POST /api/...   │      │  • revalidateTag│
│  • afterDelete  │      │                  │      │  • revalidatePath│
└─────────────────┘      └──────────────────┘      └─────────────────┘
```

## Configuração

### 1. Configurar Site com Webhook

Cada site cadastrado na collection `sites` deve ter:

| Campo | Descrição |
|-------|-----------|
| `webhookUrl` | URL do endpoint de revalidação no frontend |
| `webhookSecret` | Secret para autenticação do webhook (opcional) |

Exemplo:
```json
{
  "id": "site-1",
  "name": "Site Principal",
  "webhookUrl": "https://meusite.com/api/revalidate",
  "webhookSecret": "meu-secret-seguro"
}
```

### 2. Adicionar Hooks às Collections

Importe e adicione as hooks nas collections que precisam de revalidação:

```typescript
import {
  revalidateCacheAfterChange,
  revalidateCacheAfterDelete
} from '@/hooks/revalidateCache'

export const Posts: CollectionConfig = {
  slug: 'posts',
  hooks: {
    afterChange: [revalidateCacheAfterChange],
    afterDelete: [revalidateCacheAfterDelete],
  },
  // ...
}
```

## Payload do Webhook

Quando um documento é criado, atualizado ou deletado, o backend envia um POST request com o seguinte payload:

```json
{
  "collection": "posts",
  "operation": "update",
  "siteId": "site-1",
  "timestamp": "2025-11-20T14:30:00.000Z",
  "id": "abc123",
  "slug": "meu-post-exemplo"
}
```

### Campos do Payload

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `collection` | `string` | Slug da collection (ex: `posts`, `categories`, `sites`) |
| `operation` | `string` | Operação realizada: `create`, `update` ou `delete` |
| `siteId` | `string \| number` | ID do site associado |
| `timestamp` | `string` | Data/hora da operação em ISO 8601 |
| `id` | `string \| number` | ID do documento afetado |
| `slug` | `string` | Slug do documento (se existir) |

### Headers da Requisição

```
Content-Type: application/json
x-revalidate-secret: <webhookSecret>  // apenas se configurado
```

## Comportamento por Tipo de Collection

### Collections com Múltiplos Sites (ex: Posts)

Documentos que têm um campo `sites` (array) disparam webhooks para **cada site** associado:

```typescript
// Post associado a 3 sites = 3 webhooks enviados
{
  sites: ['site-1', 'site-2', 'site-3']
}
```

### Collections com Site Único

Documentos que têm um campo `site` (relação única) disparam webhook apenas para aquele site.

### Collection Sites

Quando um documento da própria collection `sites` é modificado, o webhook é enviado para o próprio site (se tiver `webhookUrl` configurado).

## Implementação no Frontend (Next.js)

### Exemplo de Endpoint de Revalidação

```typescript
// app/api/revalidate/route.ts
import { revalidateTag, revalidatePath } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  // Verificar secret
  const secret = request.headers.get('x-revalidate-secret')
  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ error: 'Invalid secret' }, { status: 401 })
  }

  const body = await request.json()
  const { collection, operation, id, slug } = body

  // Revalidação granular baseada na collection
  switch (collection) {
    case 'posts':
      // Revalidar post específico
      if (slug) {
        revalidateTag(`post_${slug}`)
        revalidatePath(`/posts/${slug}`)
      }
      // Revalidar listagem de posts
      revalidateTag('posts')
      revalidatePath('/posts')
      break

    case 'categories':
      revalidateTag('categories')
      if (slug) {
        revalidateTag(`category_${slug}`)
      }
      break

    case 'sites':
      // Revalidar dados do site (header, footer, etc)
      revalidateTag('site-config')
      break

    default:
      // Revalidação genérica
      revalidateTag(collection)
  }

  return NextResponse.json({
    revalidated: true,
    collection,
    operation,
    timestamp: new Date().toISOString()
  })
}
```

### Estratégias de Revalidação

#### Por Tag (Recomendado)

```typescript
// No fetch do frontend
const posts = await fetch('...', {
  next: { tags: ['posts', `post_${slug}`] }
})

// Na revalidação
revalidateTag('posts')        // Invalida listagem
revalidateTag(`post_${slug}`) // Invalida post específico
```

#### Por Path

```typescript
revalidatePath('/posts')           // Página de listagem
revalidatePath(`/posts/${slug}`)   // Página do post
revalidatePath('/', 'layout')      // Layout inteiro
```

## Logs e Debug

O sistema registra logs no Payload:

**Sucesso:**
```
Cache revalidado para site site-1, collection: posts
```

**Erro:**
```
Falha ao revalidar cache para site site-1: 500 Internal Server Error
Erro ao enviar webhook de revalidação: <error>
```

## Fluxo Completo

1. **Usuário edita post** no Payload Admin
2. **Hook `afterChange`** é disparada
3. **Backend identifica sites** associados ao post
4. **Para cada site**, envia webhook com payload completo
5. **Frontend recebe** webhook e valida secret
6. **Frontend revalida** cache usando `id` e `slug` para precisão
7. **Próximo request** do usuário busca dados atualizados

## Troubleshooting

### Webhook não está sendo enviado

- Verificar se o site tem `webhookUrl` configurado
- Verificar se a collection tem as hooks adicionadas
- Checar logs do Payload para erros

### Frontend não está revalidando

- Verificar se o `webhookSecret` está correto
- Confirmar que as tags usadas no `fetch` correspondem às revalidadas
- Verificar logs do endpoint de revalidação

### Revalidação muito ampla

- Usar `slug` e `id` do payload para revalidação granular
- Evitar `revalidatePath('/', 'layout')` desnecessariamente
- Preferir `revalidateTag` sobre `revalidatePath`

## Arquivo de Referência

O código das hooks está em: `src/hooks/revalidateCache.ts`
