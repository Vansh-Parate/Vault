import React from 'react'
import {
  Fingerprint,
  GraduationCap,
  Briefcase,
  Landmark,
  HeartPulse,
  Award,
  Building2,
  FileText,
} from 'lucide-react'
import type { Category } from '../types'

const iconMap: Record<Category, React.FC<any>> = {
  IDENTITY: Fingerprint,
  EDUCATION: GraduationCap,
  EMPLOYMENT: Briefcase,
  FINANCIAL: Landmark,
  HEALTHCARE: HeartPulse,
  SKILLS: Award,
  GOVERNMENT: Building2,
}

export const getCategoryIcon = (category: Category, size = 20) => {
  const Icon = iconMap[category] || FileText
  return <Icon size={size} className="category-icon" />
}

interface CategoryIconProps {
  category: Category
  size?: number
}

const CategoryIcon: React.FC<CategoryIconProps> = ({ category, size = 20 }) => {
  return getCategoryIcon(category, size)
}

export default CategoryIcon
