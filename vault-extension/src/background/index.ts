import { getCachedCredentials, setCachedCredentials, getPendingRequests, addPendingRequest, removePendingRequest, getSettings } from '../lib/storage'
import type { Message } from '../types'

// ─── Message Router ───

chrome.runtime.onMessage.addListener(
  (message: Message, sender: chrome.runtime.MessageSender, sendResponse: (response?: any) => void) => {
    handleMessage(message, sender, sendResponse)
    return true // keep channel open for async response
  }
)

async function handleMessage(
  message: Message,
  sender: chrome.runtime.MessageSender,
  sendResponse: (response?: any) => void
) {
  try {
    switch (message.type) {
      case 'PERMISSION_REQUEST': {
        await handlePermissionRequest(message.payload)
        sendResponse({ success: true })
        break
      }

      case 'PERMISSION_RESPONSE': {
        await handlePermissionResponse(message.payload)
        sendResponse({ success: true })
        break
      }

      case 'FETCH_CREDENTIALS': {
        const creds = await fetchCredentials(message.payload)
        sendResponse({ data: creds })
        break
      }

      case 'CLEAR_CACHE': {
        await chrome.storage.local.remove('credentials_cache')
        sendResponse({ success: true })
        break
      }

      case 'GET_PENDING_REQUESTS': {
        const pending = await getPendingRequests()
        sendResponse({ data: pending })
        break
      }

      default:
        sendResponse({ error: 'Unknown message type' })
    }
  } catch (error) {
    console.error('[Vault BG] Error handling message:', error)
    sendResponse({ error: String(error) })
  }
}

// ─── Permission Request Handling ───

async function handlePermissionRequest(payload: any) {
  const request = {
    id: crypto.randomUUID(),
    domain: payload.domain,
    fields: payload.fields,
    category: payload.category || 'IDENTITY',
    requestId: payload.requestId || crypto.randomUUID(),
    timestamp: Date.now(),
  }

  await addPendingRequest(request)

  // Update badge
  const pending = await getPendingRequests()
  await chrome.action.setBadgeText({ text: String(pending.length) })
  await chrome.action.setBadgeBackgroundColor({ color: '#4F7F73' })

  // Show notification
  const settings = await getSettings()
  if (settings.permissionNotifications) {
    chrome.notifications.create({
      type: 'basic',
      iconUrl: chrome.runtime.getURL('public/icons/icon128.png'),
      title: 'Vault — Permission Request',
      message: `${payload.domain} is requesting your ${(payload.category || 'Identity').toLowerCase()} credentials`,
    })
  }
}

// ─── Permission Response Handling ───

async function handlePermissionResponse(payload: any) {
  const { requestId, approved } = payload

  if (approved) {
    // In real implementation, fetch credential data and send to content script
    console.log('[Vault BG] Permission approved for request:', requestId)
  }

  await removePendingRequest(requestId)

  // Update badge
  const pending = await getPendingRequests()
  if (pending.length > 0) {
    await chrome.action.setBadgeText({ text: String(pending.length) })
  } else {
    await chrome.action.setBadgeText({ text: '' })
  }
}

// ─── Credential Fetching with Cache ───

async function fetchCredentials(params?: any) {
  // Try cache first
  const cached = await getCachedCredentials()
  if (cached && !params?.category && !params?.search) {
    return cached
  }

  // Fetch from API
  const settings = await getSettings()
  const base = settings.apiEndpoint || 'http://localhost:3001'
  const url = new URL(`${base}/api/credentials`)
  if (params?.category) url.searchParams.set('category', params.category)
  if (params?.search) url.searchParams.set('search', params.search)

  const res = await fetch(url.toString())
  if (!res.ok) throw new Error('Failed to fetch credentials')
  const data = await res.json()

  // Cache if no filters
  if (!params?.category && !params?.search) {
    await setCachedCredentials(data)
  }

  return data
}

// ─── Expiry Alerts on Startup ───

chrome.runtime.onStartup.addListener(async () => {
  try {
    const settings = await getSettings()
    if (!settings.expiryAlerts) return

    const cached = await getCachedCredentials()
    if (!cached) return

    const thirtyDaysFromNow = Date.now() + 30 * 24 * 60 * 60 * 1000
    const expiring = cached.filter(
      (c) => c.expiryDate && new Date(c.expiryDate).getTime() < thirtyDaysFromNow
    )

    if (expiring.length > 0) {
      chrome.notifications.create({
        type: 'basic',
        iconUrl: chrome.runtime.getURL('public/icons/icon128.png'),
        title: 'Vault — Expiry Alert',
        message: `${expiring.length} credential${expiring.length > 1 ? 's' : ''} will expire within 30 days`,
      })
    }
  } catch (error) {
    console.error('[Vault BG] Expiry check error:', error)
  }
})

// ─── Install / Update ───

chrome.runtime.onInstalled.addListener(async () => {
  console.log('[Vault] Extension installed/updated')
  // Clear old badge
  await chrome.action.setBadgeText({ text: '' })
})
