import { NextResponse } from 'next/server'
import config from '@payload-config'
import { getPayload } from 'payload'

const logs: any[] = []
let patched = false

export async function GET() {
  const payload = await getPayload({ config })
  const media = payload.collections['media']
  const cfg = media?.config

  if (!patched) {
    const beforeHooks = cfg?.hooks?.beforeChange || []
    // Wrap each existing beforeChange hook to log
    const wrapped = beforeHooks.map((h: any, i: number) => {
      return async (args: any) => {
        logs.push({ stage: `before-h${i}`, hasFile: !!args?.req?.file, dataFilename: args?.data?.filename })
        try {
          const r = await h(args)
          logs.push({ stage: `after-h${i}`, ok: true })
          return r
        } catch (e) {
          logs.push({ stage: `after-h${i}`, err: e instanceof Error ? e.message : String(e), stack: e instanceof Error ? e.stack?.slice(0, 300) : null })
          throw e
        }
      }
    })
    if (cfg?.hooks) {
      cfg.hooks.beforeChange = wrapped
    }
    patched = true
  }

  const png = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==', 'base64')
  let result: any = null
  let err: any = null
  const before = logs.length
  try {
    const doc = await payload.create({
      collection: 'media',
      data: { alt: 'wrap-test' },
      file: {
        data: png,
        mimetype: 'image/png',
        name: `wrap-${Date.now()}.png`,
        size: png.length,
      },
    })
    result = { id: doc.id, filename: doc.filename }
    if (doc.filename) {
      const r = await fetch(`https://t5nhsatjphczs4ej.public.blob.vercel-storage.com/media/${encodeURIComponent(doc.filename)}`)
      logs.push({ stage: 'blob-check', status: r.status })
    }
  } catch (e) {
    err = e instanceof Error ? { msg: e.message, stack: e.stack?.slice(0, 600) } : String(e)
  }

  return NextResponse.json({ patched, result, err, capturedLogs: logs.slice(before) })
}
