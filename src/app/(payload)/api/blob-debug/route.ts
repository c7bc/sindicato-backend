import { NextResponse } from 'next/server'
import { put } from '@vercel/blob'

export async function GET() {
  const token = process.env.BLOB_READ_WRITE_TOKEN || ''

  // Test put via SDK with explicit token (same plugin would do)
  let sdkOk: string | null = null
  let sdkErr: string | null = null
  try {
    const r = await put(`media/blob-debug-sdk-${Date.now()}.png`, Buffer.from('test'), {
      access: 'public',
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: 'image/png',
      token,
    })
    sdkOk = r.url
  } catch (e) {
    sdkErr = e instanceof Error ? `${e.constructor.name}: ${e.message}\n${e.stack?.slice(0,500)}` : String(e)
  }

  return NextResponse.json({
    tokenLen: token.length,
    tokenStart: token.slice(0, 30),
    sdkOk,
    sdkErr,
  })
}
