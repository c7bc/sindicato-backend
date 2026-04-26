import { NextResponse } from 'next/server'
import { put } from '@vercel/blob'
import path from 'path'

export async function GET() {
  const token = process.env.BLOB_READ_WRITE_TOKEN || ''
  const filename = `plugin-sig-test-${Date.now()}.png`
  const buffer = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==', 'base64')
  const fileKey = path.posix.join('', filename)

  const tries: any[] = []

  // Test 1: EXACT plugin signature (no allowOverwrite)
  try {
    const r = await put(fileKey, buffer, {
      access: 'public',
      addRandomSuffix: false,
      cacheControlMaxAge: 60 * 60 * 24 * 365,
      contentType: 'image/png',
      token,
    })
    tries.push({ test: 'plugin-sig', ok: r.url })
  } catch (e: any) {
    tries.push({
      test: 'plugin-sig',
      err: `${e?.constructor?.name}: ${e?.message}`,
      stack: e?.stack?.slice(0, 400),
    })
  }

  // Test 2: WITH allowOverwrite
  try {
    const r = await put(fileKey + '.allow', buffer, {
      access: 'public',
      addRandomSuffix: false,
      allowOverwrite: true,
      cacheControlMaxAge: 60 * 60 * 24 * 365,
      contentType: 'image/png',
      token,
    })
    tries.push({ test: 'with-allow-overwrite', ok: r.url })
  } catch (e: any) {
    tries.push({ test: 'with-allow-overwrite', err: e?.message })
  }

  return NextResponse.json({ tries })
}
