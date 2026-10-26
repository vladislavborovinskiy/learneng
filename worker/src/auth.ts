const MAX_AGE_SECONDS = 24 * 60 * 60

const encoder = new TextEncoder()

async function hmac(key: BufferSource, data: string) {
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    key,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )
  return crypto.subtle.sign('HMAC', cryptoKey, encoder.encode(data))
}

function toHex(buffer: ArrayBuffer) {
  return [...new Uint8Array(buffer)].map((byte) => byte.toString(16).padStart(2, '0')).join('')
}

export async function verifyInitData(initData: string, botToken: string, now = Date.now()) {
  const params = new URLSearchParams(initData)
  const hash = params.get('hash')
  if (!hash) return null
  params.delete('hash')

  const dataCheckString = [...params]
    .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
    .map(([key, value]) => `${key}=${value}`)
    .join('\n')
  const secretKey = await hmac(encoder.encode('WebAppData'), botToken)
  const expected = encoder.encode(toHex(await hmac(secretKey, dataCheckString)))
  const actual = encoder.encode(hash.toLowerCase())
  if (expected.byteLength !== actual.byteLength) return null
  if (!crypto.subtle.timingSafeEqual(expected, actual)) return null

  const authDate = Number(params.get('auth_date'))
  if (!authDate || now / 1000 - authDate > MAX_AGE_SECONDS) return null

  const user = JSON.parse(params.get('user') ?? 'null') as { id?: unknown } | null
  return typeof user?.id === 'number' ? user.id : null
}
