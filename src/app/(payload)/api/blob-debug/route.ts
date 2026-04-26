import { NextResponse } from 'next/server'
import config from '@payload-config'
import { getPayload } from 'payload'

export async function GET() {
  const t = process.env.BLOB_READ_WRITE_TOKEN || ''
  const payload = await getPayload({ config })
  const media = payload.collections['media']
  const beforeChangeCount = media?.config?.hooks?.beforeChange?.length || 0
  const afterChangeCount = media?.config?.hooks?.afterChange?.length || 0
  const upload = media?.config?.upload as { disableLocalStorage?: boolean; staticDir?: string } | undefined

  // Try direct PUT to blob using HTTP API
  let directPutOk: string | null = null
  let directPutErr: string | null = null
  try {
    const r = await fetch(
      'https://blob.vercel-storage.com/media/blob-debug-' + Date.now() + '.txt?addRandomSuffix=false&allowOverwrite=true',
      {
        method: 'PUT',
        headers: {
          Authorization: 'Bearer ' + t,
          'x-content-type': 'text/plain',
        },
        body: 'debug',
      },
    )
    if (r.ok) {
      const j = await r.json()
      directPutOk = j.url
    } else {
      directPutErr = `HTTP ${r.status}: ${await r.text()}`
    }
  } catch (e) {
    directPutErr = e instanceof Error ? e.message : String(e)
  }

  return NextResponse.json({
    tokenLen: t.length,
    tokenPrefix: t.slice(0, 25),
    tokenMatchRegex: /^vercel_blob_rw_[a-z\d]+_[a-z\d]+$/i.test(t),
    mediaUploadConfig: upload,
    mediaBeforeChangeHooks: beforeChangeCount,
    mediaAfterChangeHooks: afterChangeCount,
    directPutOk,
    directPutErr,
    nodeEnv: process.env.NODE_ENV,
    payloadCloud: process.env.PAYLOAD_CLOUD,
  })
}
