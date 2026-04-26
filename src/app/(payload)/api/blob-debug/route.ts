import { NextResponse } from 'next/server'
import config from '@payload-config'
import { getPayload } from 'payload'

const logs: any[] = []
let patched = false

export async function GET() {
  const payload = await getPayload({ config })
  const media = payload.collections['media']
  const cfg = media?.config

  // Inject a beforeChange hook that logs req.file and data, and ALSO inject as FIRST hook
  if (!patched) {
    const probe = async ({ data, req }: any) => {
      logs.push({
        when: 'beforeChange-probe',
        hasReqFile: !!req?.file,
        reqFileKeys: req?.file ? Object.keys(req.file) : null,
        dataFilename: data?.filename,
        dataMimeType: data?.mimeType,
      })
      return data
    }
    if (cfg?.hooks) {
      cfg.hooks.beforeChange = [probe, ...(cfg.hooks.beforeChange || [])]
    }
    patched = true
  }

  const png = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==', 'base64')
  let result: any = null
  let err: string | null = null
  const before = logs.length
  try {
    const doc = await payload.create({
      collection: 'media',
      data: { alt: 'probe-create' },
      file: {
        data: png,
        mimetype: 'image/png',
        name: `probe-${Date.now()}.png`,
        size: png.length,
      },
    })
    result = { id: doc.id, filename: doc.filename, url: doc.url }

    // Check if in blob
    if (doc.filename) {
      const r = await fetch(`https://t5nhsatjphczs4ej.public.blob.vercel-storage.com/media/${encodeURIComponent(doc.filename)}`)
      logs.push({ when: 'after-create-blob-check', status: r.status })
    }
  } catch (e) {
    err = e instanceof Error ? `${e.message}\n${e.stack?.slice(0, 400)}` : String(e)
  }

  return NextResponse.json({
    patched,
    result,
    err,
    capturedLogs: logs.slice(before),
    totalLogs: logs.length,
  })
}
