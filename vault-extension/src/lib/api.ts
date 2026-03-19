import axios from 'axios'
import { getSettings } from './storage'

const getBaseUrl = async (): Promise<string> => {
  const settings = await getSettings()
  return settings.apiEndpoint || 'http://localhost:3001'
}

export const api = {
  getCredentials: async (params?: { category?: string; search?: string }) => {
    const base = await getBaseUrl()
    return axios.get(`${base}/api/credentials`, { params })
  },
  getCredential: async (id: string) => {
    const base = await getBaseUrl()
    return axios.get(`${base}/api/credentials/${id}`)
  },
  generateShareLink: async (id: string, expiresIn: string) => {
    const base = await getBaseUrl()
    return axios.post(`${base}/api/credentials/${id}/share`, { expiresIn })
  },
  getStats: async () => {
    const base = await getBaseUrl()
    return axios.get(`${base}/api/stats`)
  },
  getLogs: async () => {
    const base = await getBaseUrl()
    return axios.get(`${base}/api/logs`)
  },
  testConnection: async () => {
    const base = await getBaseUrl()
    return axios.get(`${base}/api/stats`, { timeout: 5000 })
  },
}
