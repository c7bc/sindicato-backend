import type { CollectionAfterChangeHook, CollectionAfterDeleteHook, Payload } from 'payload'

type SiteDocument = {
  id: string | number
  webhookUrl?: string
  webhookSecret?: string
}

async function triggerRevalidation({
  payload,
  siteId,
  collection,
  operation,
  docId,
  slug,
}: {
  payload: Payload
  siteId: string | number
  collection: string
  operation: 'create' | 'update' | 'delete'
  docId?: string | number
  slug?: string
}) {
  try {
    const site = (await payload.findByID({
      collection: 'sites',
      id: siteId,
    })) as SiteDocument

    if (!site?.webhookUrl) {
      return
    }

    const response = await fetch(site.webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(site.webhookSecret && { 'x-revalidate-secret': site.webhookSecret }),
      },
      body: JSON.stringify({
        collection,
        operation,
        siteId,
        timestamp: new Date().toISOString(),
        ...(docId && { id: docId }),
        ...(slug && { slug }),
      }),
    })

    if (!response.ok) {
      payload.logger.error(
        `Falha ao revalidar cache para site ${siteId}: ${response.status} ${response.statusText}`,
      )
    } else {
      payload.logger.info(`Cache revalidado para site ${siteId}, collection: ${collection}`)
    }
  } catch (error) {
    payload.logger.error(`Erro ao enviar webhook de revalidação: ${error}`)
  }
}

export const revalidateCacheAfterChange: CollectionAfterChangeHook = async ({
  doc,
  req,
  collection,
  operation,
}) => {
  const { payload } = req

  // Se é a própria collection sites
  if (collection.slug === 'sites') {
    if (doc.webhookUrl) {
      await triggerRevalidation({
        payload,
        siteId: doc.id,
        collection: 'sites',
        operation,
        docId: doc.id,
        slug: doc.slug,
      })
    }
    return doc
  }

  // Para Posts que têm múltiplos sites
  if (doc.sites && Array.isArray(doc.sites)) {
    for (const site of doc.sites) {
      const siteId = typeof site === 'object' ? site?.id : site
      if (siteId) {
        await triggerRevalidation({
          payload,
          siteId,
          collection: collection.slug,
          operation,
          docId: doc.id,
          slug: doc.slug,
        })
      }
    }
    return doc
  }

  // Para outras collections que têm relacionamento com site único
  const siteId = typeof doc.site === 'object' ? doc.site?.id : doc.site

  if (siteId) {
    await triggerRevalidation({
      payload,
      siteId,
      collection: collection.slug,
      operation,
      docId: doc.id,
      slug: doc.slug,
    })
  }

  return doc
}

export const revalidateCacheAfterDelete: CollectionAfterDeleteHook = async ({
  doc,
  req,
  collection,
}) => {
  const { payload } = req

  // Se é a própria collection sites
  if (collection.slug === 'sites') {
    if (doc.webhookUrl) {
      await triggerRevalidation({
        payload,
        siteId: doc.id,
        collection: 'sites',
        operation: 'delete',
        docId: doc.id,
        slug: doc.slug,
      })
    }
    return doc
  }

  // Para Posts que têm múltiplos sites
  if (doc.sites && Array.isArray(doc.sites)) {
    for (const site of doc.sites) {
      const siteId = typeof site === 'object' ? site?.id : site
      if (siteId) {
        await triggerRevalidation({
          payload,
          siteId,
          collection: collection.slug,
          operation: 'delete',
          docId: doc.id,
          slug: doc.slug,
        })
      }
    }
    return doc
  }

  // Para outras collections que têm relacionamento com site único
  const siteId = typeof doc.site === 'object' ? doc.site?.id : doc.site

  if (siteId) {
    await triggerRevalidation({
      payload,
      siteId,
      collection: collection.slug,
      operation: 'delete',
      docId: doc.id,
      slug: doc.slug,
    })
  }

  return doc
}
