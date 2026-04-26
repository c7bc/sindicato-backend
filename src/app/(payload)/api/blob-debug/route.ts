import { NextResponse } from 'next/server'
import config from '@payload-config'
import { getPayload } from 'payload'
import { getIncomingFiles } from '@payloadcms/plugin-cloud-storage/utilities'

const logs: any[] = []
let patched = false

export async function GET() {
  const payload = await getPayload({ config })
  const media = payload.collections['media']
  const cfg = media?.config

  if (!patched) {
    const beforeHooks = cfg?.hooks?.beforeChange || []
    const wrapped = beforeHooks.map((h: any) => {
      return async (args: any) => {
        const filesIn = getIncomingFiles({ data: args.data, req: args.req })
        logs.push({
          stage: 'pre-hook',
          filesIn_len: filesIn.length,
          file0_filename: filesIn[0]?.filename,
          file0_buffer_len: filesIn[0]?.buffer?.length,
        })
        const r = await h(args)
        logs.push({ stage: 'post-hook' })
        return r
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
      data: { alt: 'getincoming-test' },
      file: {
        data: png,
        mimetype: 'image/png',
        name: `gif-${Date.now()}.png`,
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
