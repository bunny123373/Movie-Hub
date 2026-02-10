import React from 'react'
import { Film, Search, Heart, FolderOpen } from 'lucide-react'

const icons = {
  movies: Film,
  search: Search,
  watchlist: Heart,
  default: FolderOpen
}

const EmptyState = ({ 
  type = 'default', 
  title = 'No items found', 
  description = 'There are no items to display at the moment.',
  action = null
}) => {
  const Icon = icons[type] || icons.default

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
        <Icon className="w-12 h-12 text-gray-400" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500 text-center max-w-md mb-6">{description}</p>
      {action && (
        <button
          onClick={action.onClick}
          className="btn-primary"
        >
          {action.label}
        </button>
      )}
    </div>
  )
}

export default EmptyState
