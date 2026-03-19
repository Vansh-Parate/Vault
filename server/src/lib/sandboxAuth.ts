type SandboxAuthResponse = {
  access_token: string
}

let cachedToken: string | null = null

const sandboxBaseUrl = () => process.env.SANDBOX_BASE_URL || 'https://api.sandbox.co.in'

const requireEnv = (key: string) => {
  const v = process.env[key]
  if (!v) throw new Error(`Missing env: ${key}`)
  return v
}

export const isSandboxConfigured = () => {
  return Boolean(process.env.SANDBOX_API_KEY && process.env.SANDBOX_API_SECRET)
}

export async function getSandboxAccessToken(forceRefresh = false): Promise<string> {
  if (cachedToken && !forceRefresh) return cachedToken

  const apiKey = requireEnv('SANDBOX_API_KEY')
  const apiSecret = requireEnv('SANDBOX_API_SECRET')

  const res = await fetch(`${sandboxBaseUrl()}/authenticate`, {
    method: 'POST',
    // Sandbox may require these as headers (some tenants reject body-only auth).
    // We send both headers + body for compatibility.
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'x-api-secret': apiSecret,
    },
    body: JSON.stringify({
      _env: 'sandbox',
      api_key: apiKey,
      api_secret: apiSecret,
    }),
  })

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`Sandbox auth failed (${res.status}): ${text || res.statusText}`)
  }

  const data = (await res.json()) as SandboxAuthResponse
  if (!data?.access_token) throw new Error('Sandbox auth failed: missing access_token')
  cachedToken = data.access_token
  return cachedToken
}

export async function sandboxRequest<T>(
  path: string,
  init: RequestInit & { headers?: Record<string, string> } = {},
  opts: { retryOn401?: boolean } = { retryOn401: true }
): Promise<T> {
  const apiKey = requireEnv('SANDBOX_API_KEY')
  const token = await getSandboxAccessToken(false)

  const make = async (authToken: string) => {
    const res = await fetch(`${sandboxBaseUrl()}${path}`, {
      ...init,
      headers: {
        'x-api-key': apiKey,
        Authorization: authToken,
        ...(init.headers || {}),
      },
    })
    return res
  }

  let res = await make(token)
  if (res.status === 401 && opts.retryOn401) {
    const refreshed = await getSandboxAccessToken(true)
    res = await make(refreshed)
  }

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`Sandbox request failed (${res.status}) ${path}: ${text || res.statusText}`)
  }

  return (await res.json()) as T
}

