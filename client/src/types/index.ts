export type CredentialCategory = 
  | 'IDENTITY' 
  | 'EDUCATION' 
  | 'EMPLOYMENT' 
  | 'FINANCIAL' 
  | 'HEALTHCARE' 
  | 'SKILLS' 
  | 'GOVERNMENT';

export type VerificationStatus = 'PENDING' | 'VERIFIED' | 'REJECTED' | 'EXPIRED';
export type Visibility = 'PRIVATE' | 'SHAREABLE' | 'PUBLIC';

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  dateFormat: string;
  defaultVis: Visibility;
  createdAt: string;
  updatedAt: string;
}

export interface Credential {
  id: string;
  userId: string;
  category: CredentialCategory;
  title: string;
  issuer?: string;
  issuedDate?: string;
  expiryDate?: string;
  status: VerificationStatus;
  visibility: Visibility;
  metadata?: Record<string, any>;
  documentUrl?: string;
  documentName?: string;
  createdAt: string;
  updatedAt: string;
  _count?: { shareLinks: number; accessLogs: number };
  shareLinks?: ShareLink[];
}

export interface ShareLink {
  id: string;
  credentialId: string;
  token: string;
  expiresAt?: string;
  createdAt: string;
  views: number;
}

export interface AccessLog {
  id: string;
  userId: string;
  credentialId: string;
  accessedBy: string;
  action: string;
  timestamp: string;
  credential?: {
    title: string;
    category: CredentialCategory;
  };
}

export interface DashboardStats {
  totalCredentials: number;
  verifiedCount: number;
  pendingCount: number;
  totalShared: number;
  categories: { category: string; count: number }[];
  recentActivity: AccessLog[];
}

export interface CategoryField {
  name: string;
  label: string;
  type: 'text' | 'select' | 'date' | 'file' | 'textarea' | 'number' | 'url';
  required?: boolean;
  options?: string[];
}
