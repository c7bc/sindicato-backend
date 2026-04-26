import { NextResponse } from 'next/server'
import config from '@payload-config'
import { getPayload } from 'payload'
import { put, list } from '@vercel/blob'

export async function GET() {
  const t = process.env.BLOB_READ_WRITE_TOKEN || ''
  const payload = await getPayload({ config })
  const media = payload.collections['media']
  const beforeChangeCount = media?.config?.hooks?.beforeChange?.length || 0
  const upload = media?.config?.upload as { disableLocalStorage?: boolean } | undefined

  let directPutOk: string | null = null
  let directPutErr: string | null = null
  try {
    const r = await put(`media/blob-debug-${Date.now()}.txt`, 'debug', {
      access: 'public',
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: 'text/plain',
      token: t,
    })
    directPutOk = r.url
  } catch (e) {
    directPutErr = e instanceof Error ? e.message : String(e)
  }

  let lsOk: string[] = []
  let lsErr: string | null = null
  try {
    const r = await list({ prefix: 'media/blob-debug', token: t, limit: 5 })
    lsOk = r.blobs.map((b) => b.url)
  } catch (e) {
    lsErr = e instanceof Error ? e.message : String(e)
  }

  return NextResponse.json({
    tokenLen: t.length,
    tokenPrefix: t.slice(0, 20),
    tokenMatchRegex: /^vercel_blob_rw_[a-z\d]+_[a-z\d]+$/i.test(t),
    mediaUploadConfig: upload,
    mediaBeforeChangeHooks: beforeChangeCount,
    directPutOk,
    directPutErr,
    listOk: lsOk,
    listErr: lsErr,
  })
}
