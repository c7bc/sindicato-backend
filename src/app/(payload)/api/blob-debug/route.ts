import { NextResponse } from 'next/server'
import config from '@payload-config'
import { getPayload } from 'payload'

export async function GET() {
  const payload = await getPayload({ config })

  // Inspect Media collection deeply
  const media = payload.collections['media']
  const cfg = media?.config

  const handlers = (cfg?.upload as any)?.handlers
  const handlerInfo = Array.isArray(handlers)
    ? handlers.map((h: any, i: number) => ({
        idx: i,
        type: typeof h,
        isNull: h === null,
        isUndefined: h === undefined,
        name: h?.name || null,
      }))
    : 'not array'

  const beforeChange = cfg?.hooks?.beforeChange || []
  const beforeChangeInfo = beforeChange.map((h: any, i: number) => ({
    idx: i,
    type: typeof h,
    name: h?.name || h?.toString().slice(0, 100),
  }))

  // Try the staticHandler manually
  let staticHandlerInfo: any = 'no handler'
  try {
    if (Array.isArray(handlers) && handlers.length > 0) {
      const h = handlers[0]
      staticHandlerInfo = {
        type: typeof h,
        callable: typeof h === 'function',
        funcStr: typeof h === 'function' ? h.toString().slice(0, 300) : null,
      }
    }
  } catch (e) {
    staticHandlerInfo = String(e)
  }

  // Capture any error during create with full stack
  const png = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==', 'base64')
  let createErr: any = null
  try {
    await payload.create({
      collection: 'media',
      data: { alt: 'deep-debug' },
      file: {
        data: png,
        mimetype: 'image/png',
        name: `deep-debug-${Date.now()}.png`,
        size: png.length,
      },
    })
  } catch (e) {
    createErr = {
      msg: e instanceof Error ? e.message : String(e),
      stack: e instanceof Error ? e.stack?.slice(0, 1000) : null,
    }
  }

  return NextResponse.json({
    handlerInfo,
    beforeChangeInfo,
    staticHandlerInfo,
    createErr,
  })
}
