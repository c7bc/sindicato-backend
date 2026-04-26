import { NextResponse } from 'next/server'
import config from '@payload-config'
import { getPayload } from 'payload'

// In-memory log capture
const logs: string[] = []
let patched = false

export async function GET() {
  const payload = await getPayload({ config })
  const media = payload.collections['media']
  const adapter = (media?.config?.upload as any)?.adapter
  const hasAdapter = !!adapter
  const adapterKeys = adapter ? Object.keys(adapter) : []

  // Patch handleUpload to log
  if (!patched && adapter?.handleUpload) {
    const orig = adapter.handleUpload.bind(adapter)
    adapter.handleUpload = async (args: any) => {
      logs.push(`handleUpload called: filename=${args?.file?.filename} mime=${args?.file?.mimeType}`)
      try {
        const r = await orig(args)
        logs.push(`handleUpload returned ok`)
        return r
      } catch (e) {
        logs.push(`handleUpload threw: ${e instanceof Error ? e.message : String(e)}`)
        throw e
      }
    }
    patched = true
  }

  // Try create via SDK
  const png = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==', 'base64')
  let result: any = null
  let err: string | null = null
  const before = logs.length
  try {
    const doc = await payload.create({
      collection: 'media',
      data: { alt: 'patched-debug' },
      file: {
        data: png,
        mimetype: 'image/png',
        name: `patched-debug-${Date.now()}.png`,
        size: png.length,
      },
    })
    result = { id: doc.id, filename: doc.filename }
  } catch (e) {
    err = e instanceof Error ? `${e.message}\n${e.stack?.slice(0, 400)}` : String(e)
  }

  return NextResponse.json({
    hasAdapter,
    adapterKeys,
    patched,
    result,
    err,
    capturedLogs: logs.slice(before),
    allLogsCount: logs.length,
  })
}
