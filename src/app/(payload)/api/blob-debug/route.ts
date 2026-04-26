import { NextResponse } from 'next/server'
import config from '@payload-config'
import { getPayload } from 'payload'

export async function GET() {
  const payload = await getPayload({ config })

  // 1x1 PNG
  const png = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==', 'base64')

  let payloadCreateOk: { id: string | number; filename?: string | null } | null = null
  let payloadCreateErr: string | null = null
  try {
    const doc = await payload.create({
      collection: 'media',
      data: { alt: 'debug-create' },
      file: {
        data: png,
        mimetype: 'image/png',
        name: `debug-create-${Date.now()}.png`,
        size: png.length,
      },
    })
    payloadCreateOk = { id: doc.id, filename: doc.filename }
  } catch (e) {
    payloadCreateErr = e instanceof Error ? `${e.message}\n${e.stack?.slice(0,500)}` : String(e)
  }

  // Check immediately if file landed in blob
  let inBlob: number | null = null
  if (payloadCreateOk?.filename) {
    try {
      const r = await fetch(`https://t5nhsatjphczs4ej.public.blob.vercel-storage.com/media/${encodeURIComponent(payloadCreateOk.filename)}`)
      inBlob = r.status
    } catch (e) {
      inBlob = -1
    }
  }

  return NextResponse.json({
    payloadCreateOk,
    payloadCreateErr,
    inBlob,
  })
}
