'use client'

import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { KanbanColumn as KanbanColumnType, KanbanTask } from '@/types/kanban'
import { TaskCard } from './TaskCard'

interface KanbanColumnProps {
  column: KanbanColumnType
  onTaskEdit?: (task: KanbanTask) => void
  onTaskDelete?: (taskId: string) => void
  onTaskAdd?: (columnId: string) => void
  onTaskDrop?: (taskId: string, newColumnId: string) => void
  onDragStart?: (taskId: string) => void
  onDragEnd?: () => void
  isDragOver?: boolean
  draggedTaskId?: string | null
}

export function KanbanColumn({ 
  column, 
  onTaskEdit, 
  onTaskDelete, 
  onTaskAdd,
  onTaskDrop,
  onDragStart,
  onDragEnd,
  isDragOver = false,
  draggedTaskId
}: KanbanColumnProps) {
  const [draggedOver, setDraggedOver] = React.useState(false)
  const [dragDepth, setDragDepth] = React.useState(0)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    
    // Only show drag over state if the dragged task isn't already in this column
    const taskId = e.dataTransfer.getData('text/plain') || draggedTaskId
    const taskExistsInColumn = column.tasks.some(task => task.id === taskId)
    
    if (!taskExistsInColumn) {
      setDraggedOver(true)
    }
  }

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault()
    setDragDepth(prev => prev + 1)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setDragDepth(prev => {
      const newDepth = prev - 1
      if (newDepth <= 0) {
        setDraggedOver(false)
      }
      return Math.max(0, newDepth)
    })
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDraggedOver(false)
    setDragDepth(0)
    
    const taskId = e.dataTransfer.getData('text/plain')
    if (taskId && onTaskDrop) {
      // Check if task is not already in this column
      const taskExistsInColumn = column.tasks.some(task => task.id === taskId)
      if (!taskExistsInColumn) {
        onTaskDrop(taskId, column.id)
      }
    }
  }

  const getColumnColor = (status: string) => {
    switch (status) {
      case 'todo':
        return 'bg-slate-100 text-slate-800'
      case 'in-progress':
        return 'bg-blue-100 text-blue-800'
      case 'done':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="flex flex-col h-full min-w-80 max-w-80">
      <Card className="flex-1 flex flex-col">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CardTitle className="text-sm font-semibold">
                {column.title}
              </CardTitle>
              <Badge 
                variant="secondary" 
                className={cn('text-xs px-2 py-1', getColumnColor(column.status))}
              >
                {column.tasks.length}
                {column.maxTasks && ` / ${column.maxTasks}`}
              </Badge>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={() => onTaskAdd?.(column.id)}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent 
          className={cn(
            'flex-1 flex flex-col gap-3 transition-all duration-200 min-h-32 column-drop-zone relative',
            draggedOver && 'drag-over bg-blue-50 border-2 border-dashed border-blue-300 scale-[1.01]'
          )}
          onDragOver={handleDragOver}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {column.tasks.length === 0 && (
            <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm">
              No tasks
            </div>
          )}
          
          {column.tasks.map((task) => (
            <div key={task.id} className="group">
              <TaskCard
                task={task}
                onEdit={onTaskEdit}
                onDelete={onTaskDelete}
                onDragStart={onDragStart}
                onDragEnd={onDragEnd}
                isDragging={draggedTaskId === task.id}
              />
            </div>
          ))}
          
          {draggedOver && column.tasks.length === 0 && (
            <div className="h-20 border-2 border-dashed border-blue-300 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 text-sm animate-pulse">
              <Plus className="h-4 w-4 mr-2" />
              Drop task here
            </div>
          )}
          
          {draggedOver && column.tasks.length > 0 && (
            <div className="h-2 border-t-2 border-dashed border-blue-400 bg-blue-100 rounded animate-pulse" />
          )}
        </CardContent>
      </Card>
    </div>
  )
}