export type Category =
  | 'IDENTITY'
  | 'EDUCATION'
  | 'EMPLOYMENT'
  | 'FINANCIAL'
  | 'HEALTHCARE'
  | 'SKILLS'
  | 'GOVERNMENT'

export type Status = 'PENDING' | 'VERIFIED' | 'REJECTED' | 'EXPIRED'

export interface Credential {
  id: string
  userId: string
  category: Category
  title: string
  issuer: string | null
  issuedDate: string | null
  expiryDate: string | null
  status: Status
  metadata: Record<string, any>
  documentUrl: string | null
  documentName: string | null
  createdAt: string
  updatedAt: string
  _count?: {
    shareLinks?: number
    accessLogs?: number
  }
  shareLinks?: ShareLink[]
}

export interface ShareLink {
  id: string
  token: string
  credentialId: string
  expiresAt: string | null
  views: number
  createdAt: string
}

export interface AccessLog {
  id: string
  userId: string
  credentialId: string
  action: string
  accessedBy: string
  timestamp: string
  credential?: {
    title: string
    category: Category
  }
}

export interface Stats {
  totalCredentials: number
  verifiedCount: number
  pendingCount: number
  totalShared: number
  categories: CategoryCount[]
  recentActivity: AccessLog[]
}

export interface CategoryCount {
  category: Category
  count: number
}

export interface PermissionRequest {
  id: string
  domain: string
  fields: string[]
  category: Category
  requestId: string
  timestamp: number
}

export interface Settings {
  apiEndpoint: string
  autofillEnabled: boolean
  showOverlay: boolean
  askBeforeFill: boolean
  permissionNotifications: boolean
  expiryAlerts: boolean
}

export type ViewName =
  | 'home'
  | 'wallet'
  | 'credential-detail'
  | 'permission'
  | 'log'
  | 'settings'
  | 'share'

export type MessageType =
  | 'PERMISSION_REQUEST'
  | 'PERMISSION_RESPONSE'
  | 'FETCH_CREDENTIALS'
  | 'CLEAR_CACHE'
  | 'GET_PENDING_REQUESTS'
  | 'AUTOFILL_DATA'
  | 'AUTOFILL_TOGGLE'

export interface Message {
  type: MessageType
  payload?: any
  source: 'popup' | 'content' | 'background'
}

export const DEFAULT_SETTINGS: Settings = {
  apiEndpoint: 'http://localhost:3001',
  autofillEnabled: true,
  showOverlay: true,
  askBeforeFill: true,
  permissionNotifications: true,
  expiryAlerts: true,
}
