import type { Category } from '../types'

export const CATEGORY_CONFIG: Record<Category, { label: string; icon: string; color: string }> = {
  IDENTITY: { label: 'Identity', icon: 'Fingerprint', color: '#4F7F73' },
  EDUCATION: { label: 'Education', icon: 'GraduationCap', color: '#4F7F73' },
  EMPLOYMENT: { label: 'Employment', icon: 'Briefcase', color: '#4F7F73' },
  FINANCIAL: { label: 'Financial', icon: 'Landmark', color: '#4F7F73' },
  HEALTHCARE: { label: 'Healthcare', icon: 'HeartPulse', color: '#4F7F73' },
  SKILLS: { label: 'Skills', icon: 'Award', color: '#4F7F73' },
  GOVERNMENT: { label: 'Government', icon: 'Building2', color: '#4F7F73' },
}

export const ALL_CATEGORIES: Category[] = [
  'IDENTITY',
  'EDUCATION',
  'EMPLOYMENT',
  'FINANCIAL',
  'HEALTHCARE',
  'SKILLS',
  'GOVERNMENT',
]

export const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

export const EXPIRY_OPTIONS = [
  { label: '24 hours', value: '24h' },
  { label: '7 days', value: '7d' },
  { label: '30 days', value: '30d' },
  { label: 'Never', value: 'never' },
] as const
