'use client'

import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, MoreHorizontal } from 'lucide-react'
import { cn } from '@/lib/utils'
import { KanbanBoard as KanbanBoardType, KanbanTask } from '@/types/kanban'
import { KanbanColumn } from './KanbanColumn'
import { TaskModal } from './TaskModal'
import { useKanbanState } from '@/hooks/useKanbanState'

interface KanbanBoardProps {
  initialBoard: KanbanBoardType
  onBoardChange?: (board: KanbanBoardType) => void
  className?: string
}

export function KanbanBoard({ 
  initialBoard, 
  onBoardChange,
  className 
}: KanbanBoardProps) {
  const { 
    board, 
    moveTask, 
    deleteTask, 
    saveTaskChanges,
    getTask,
    getColumn
  } = useKanbanState(initialBoard)

  const [draggedTaskId, setDraggedTaskId] = React.useState<string | null>(null)
  const [taskModal, setTaskModal] = React.useState<{
    isOpen: boolean
    mode: 'create' | 'edit'
    task?: KanbanTask | null
    columnId?: string
  }>({
    isOpen: false,
    mode: 'create',
    task: null,
    columnId: undefined
  })

  // Notify parent component when board changes
  React.useEffect(() => {
    onBoardChange?.(board)
  }, [board, onBoardChange])

  const handleDragStart = (taskId: string) => {
    setDraggedTaskId(taskId)
  }

  const handleDragEnd = () => {
    setDraggedTaskId(null)
  }

  const handleTaskDrop = (taskId: string, newColumnId: string) => {
    const sourceColumn = board.columns.find(col => 
      col.tasks.some(task => task.id === taskId)
    )
    
    const targetColumn = board.columns.find(col => col.id === newColumnId)
    
    if (!sourceColumn || !targetColumn || sourceColumn.id === newColumnId) {
      return
    }

    moveTask(taskId, newColumnId, targetColumn.status)
  }

  const handleTaskEdit = (task: KanbanTask) => {
    setTaskModal({
      isOpen: true,
      mode: 'edit',
      task,
      columnId: undefined
    })
  }

  const handleTaskDelete = (taskId: string) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      deleteTask(taskId)
    }
  }

  const handleTaskAdd = (columnId: string) => {
    const column = getColumn(columnId)
    setTaskModal({
      isOpen: true,
      mode: 'create',
      task: null,
      columnId
    })
  }

  const handleModalClose = () => {
    setTaskModal({
      isOpen: false,
      mode: 'create',
      task: null,
      columnId: undefined
    })
  }

  const handleTaskSave = (taskData: Partial<KanbanTask>) => {
    saveTaskChanges(taskData, taskModal.columnId)
  }

  return (
    <div 
      className={cn('flex flex-col h-full kanban-board', className)}
      data-dragging={draggedTaskId !== null}
    >
      {/* Board Header */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-bold">
                {board.title}
              </CardTitle>
              {board.description && (
                <p className="text-sm text-muted-foreground mt-1">
                  {board.description}
                </p>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleTaskAdd(board.columns[0]?.id)}
                disabled={!board.columns.length}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Task
              </Button>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Kanban Columns */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-x-auto">
          <div className="flex gap-6 h-full min-w-max px-1 pb-6">
            {board.columns.map((column) => (
              <KanbanColumn
                key={column.id}
                column={column}
                onTaskEdit={handleTaskEdit}
                onTaskDelete={handleTaskDelete}
                onTaskAdd={handleTaskAdd}
                onTaskDrop={handleTaskDrop}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                draggedTaskId={draggedTaskId}
              />
            ))}
            
            {/* Add Column Button */}
            <div className="min-w-80 max-w-80">
              <Card className="h-32 border-dashed border-2 hover:border-primary/50 transition-colors cursor-pointer">
                <CardContent className="h-full flex items-center justify-center">
                  <Button variant="ghost" className="text-muted-foreground">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Column
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Task Modal */}
      <TaskModal
        isOpen={taskModal.isOpen}
        onClose={handleModalClose}
        onSave={handleTaskSave}
        task={taskModal.task}
        mode={taskModal.mode}
        columnId={taskModal.columnId}
        columnStatus={taskModal.columnId ? getColumn(taskModal.columnId)?.status : 'todo'}
      />
    </div>
  )
}