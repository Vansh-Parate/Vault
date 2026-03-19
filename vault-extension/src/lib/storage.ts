import type { Credential, PermissionRequest, Settings } from '../types'
import { DEFAULT_SETTINGS } from '../types'
import { CACHE_TTL } from './constants'

// Settings
export const getSettings = async (): Promise<Settings> => {
  const result = await chrome.storage.local.get('settings')
  return { ...DEFAULT_SETTINGS, ...result.settings }
}

export const saveSettings = async (settings: Partial<Settings>): Promise<void> => {
  const current = await getSettings()
  await chrome.storage.local.set({ settings: { ...current, ...settings } })
}

// Credential Cache
export const getCachedCredentials = async (): Promise<Credential[] | null> => {
  const result = await chrome.storage.local.get('credentials_cache')
  const cache = result.credentials_cache
  if (!cache) return null
  if (Date.now() - cache.fetchedAt > CACHE_TTL) return null
  return cache.data
}

export const setCachedCredentials = async (data: Credential[]): Promise<void> => {
  await chrome.storage.local.set({
    credentials_cache: {
      data,
      fetchedAt: Date.now(),
    },
  })
}

export const clearCache = async (): Promise<void> => {
  await chrome.storage.local.remove('credentials_cache')
}

// Pending Requests
export const getPendingRequests = async (): Promise<PermissionRequest[]> => {
  const result = await chrome.storage.local.get('pending_requests')
  return result.pending_requests || []
}

export const addPendingRequest = async (request: PermissionRequest): Promise<void> => {
  const pending = await getPendingRequests()
  pending.push(request)
  await chrome.storage.local.set({ pending_requests: pending })
}

export const removePendingRequest = async (requestId: string): Promise<void> => {
  const pending = await getPendingRequests()
  const updated = pending.filter((r) => r.requestId !== requestId)
  await chrome.storage.local.set({ pending_requests: updated })
}
