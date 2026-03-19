import React from 'react'
import type { Category } from '../types'
import { CATEGORY_CONFIG } from '../lib/constants'

interface CategoryBadgeProps {
  category: Category
}

const CategoryBadge: React.FC<CategoryBadgeProps> = ({ category }) => {
  const config = CATEGORY_CONFIG[category]
  return <span className="category-badge">{config.label}</span>
}

export default CategoryBadge
