'use client'

import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu'
import { MoreVertical, Edit2, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { KanbanTask } from '@/types/kanban'

interface TaskCardProps {
  task: KanbanTask
  onEdit?: (task: KanbanTask) => void
  onDelete?: (taskId: string) => void
  isDragging?: boolean
  onDragStart?: (taskId: string) => void
  onDragEnd?: () => void
}

export function TaskCard({ 
  task, 
  onEdit, 
  onDelete, 
  isDragging = false,
  onDragStart,
  onDragEnd
}: TaskCardProps) {
  const [dragState, setDragState] = React.useState<'idle' | 'dragging' | 'drag-over'>('idle')
  const priorityColors = {
    low: 'bg-green-100 text-green-800 hover:bg-green-200',
    medium: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200',
    high: 'bg-red-100 text-red-800 hover:bg-red-200'
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    })
  }

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('text/plain', task.id)
    e.dataTransfer.effectAllowed = 'move'
    setDragState('dragging')
    onDragStart?.(task.id)
    
    // Create a custom drag image
    const dragImage = e.currentTarget.cloneNode(true) as HTMLElement
    dragImage.style.transform = 'rotate(3deg)'
    dragImage.style.opacity = '0.8'
    document.body.appendChild(dragImage)
    e.dataTransfer.setDragImage(dragImage, 50, 50)
    
    setTimeout(() => {
      document.body.removeChild(dragImage)
    }, 0)
  }

  const handleDragEnd = (e: React.DragEvent) => {
    setDragState('idle')
    onDragEnd?.()
  }

  return (
    <Card 
      className={cn(
        'cursor-move transition-all duration-200 hover:shadow-md task-card select-none',
        dragState === 'dragging' && 'opacity-30 scale-95',
        isDragging && 'opacity-50 transform rotate-2'
      )}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <CardTitle className="text-sm font-medium leading-5">
            {task.title}
          </CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => e.preventDefault()}
              >
                <MoreVertical className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-36">
              <DropdownMenuItem onClick={() => onEdit?.(task)}>
                <Edit2 className="mr-2 h-3 w-3" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => onDelete?.(task.id)}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="mr-2 h-3 w-3" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        {task.description && (
          <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
            {task.description}
          </p>
        )}
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge 
              variant="secondary" 
              className={cn('text-xs px-2 py-0.5', priorityColors[task.priority])}
            >
              {task.priority}
            </Badge>
            
            {task.dueDate && (
              <span className="text-xs text-muted-foreground">
                {formatDate(task.dueDate)}
              </span>
            )}
          </div>
          
          {task.assignee && (
            <Avatar className="h-5 w-5">
              <AvatarImage src="" alt={task.assignee} />
              <AvatarFallback className="text-xs">
                {getInitials(task.assignee)}
              </AvatarFallback>
            </Avatar>
          )}
        </div>
      </CardContent>
    </Card>
  )
}