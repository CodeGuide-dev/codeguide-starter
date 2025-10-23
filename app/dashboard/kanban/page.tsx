'use client'

import * as React from 'react'
import { KanbanBoard } from '@/components/kanban'
import { KanbanData, KanbanBoard as KanbanBoardType } from '@/types/kanban'
import data from '../data.json'
import './kanban.css'

// This would normally come from metadata API route, but we'll set it here for now
const pageMetadata = {
  title: 'Kanban Board - CodeGuide',
  description: 'Manage your tasks and projects with our interactive Kanban board'
}

export default function KanbanPage() {
  const [boardData, setBoardData] = React.useState<KanbanBoardType | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    // Set document title
    document.title = pageMetadata.title
    
    try {
      const kanbanData = data.kanban as KanbanData
      if (kanbanData.boards && kanbanData.boards.length > 0) {
        setBoardData(kanbanData.boards[0])
      } else {
        setError('No kanban boards found')
      }
    } catch (err) {
      setError('Failed to load kanban data')
      console.error('Error loading kanban data:', err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const handleBoardChange = React.useCallback((updatedBoard: KanbanBoardType) => {
    setBoardData(updatedBoard)
    // In a real app, you might want to save to an API here
    console.log('Board updated:', updatedBoard)
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
          <p className="text-muted-foreground">Loading kanban board...</p>
        </div>
      </div>
    )
  }

  if (error || !boardData) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <div className="text-center space-y-4">
          <div className="rounded-full bg-red-100 p-3 w-16 h-16 flex items-center justify-center mx-auto">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold">Failed to load kanban board</h3>
            <p className="text-muted-foreground mt-1">
              {error || 'An unexpected error occurred'}
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col kanban-page">
      <KanbanBoard 
        initialBoard={boardData}
        onBoardChange={handleBoardChange}
        className="flex-1"
      />
    </div>
  )
}