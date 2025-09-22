'use client'

import { useState, useCallback } from 'react'
import { KanbanBoard, KanbanTask, KanbanColumn } from '@/types/kanban'

export function useKanbanState(initialBoard: KanbanBoard) {
  const [board, setBoard] = useState<KanbanBoard>(initialBoard)

  const updateTask = useCallback((taskId: string, updates: Partial<KanbanTask>) => {
    setBoard(prevBoard => ({
      ...prevBoard,
      columns: prevBoard.columns.map(column => ({
        ...column,
        tasks: column.tasks.map(task => 
          task.id === taskId ? { ...task, ...updates } : task
        )
      })),
      updatedAt: new Date().toISOString()
    }))
  }, [])

  const addTask = useCallback((columnId: string, newTask: Partial<KanbanTask>) => {
    setBoard(prevBoard => ({
      ...prevBoard,
      columns: prevBoard.columns.map(column => {
        if (column.id === columnId) {
          const task: KanbanTask = {
            id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            title: '',
            description: '',
            priority: 'medium',
            status: column.status,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            ...newTask
          } as KanbanTask

          return {
            ...column,
            tasks: [...column.tasks, task]
          }
        }
        return column
      }),
      updatedAt: new Date().toISOString()
    }))
  }, [])

  const deleteTask = useCallback((taskId: string) => {
    setBoard(prevBoard => ({
      ...prevBoard,
      columns: prevBoard.columns.map(column => ({
        ...column,
        tasks: column.tasks.filter(task => task.id !== taskId)
      })),
      updatedAt: new Date().toISOString()
    }))
  }, [])

  const moveTask = useCallback((taskId: string, targetColumnId: string, newStatus: 'todo' | 'in-progress' | 'done') => {
    setBoard(prevBoard => {
      // Find the task to move
      let taskToMove: KanbanTask | null = null
      const sourceColumns = prevBoard.columns.map(column => {
        const taskIndex = column.tasks.findIndex(task => task.id === taskId)
        if (taskIndex >= 0) {
          taskToMove = column.tasks[taskIndex]
          return {
            ...column,
            tasks: column.tasks.filter(task => task.id !== taskId)
          }
        }
        return column
      })

      if (!taskToMove) {
        return prevBoard
      }

      // Update the task status and add to target column
      const updatedTask: KanbanTask = {
        ...taskToMove,
        status: newStatus,
        updatedAt: new Date().toISOString()
      }

      const updatedColumns = sourceColumns.map(column => {
        if (column.id === targetColumnId) {
          return {
            ...column,
            tasks: [...column.tasks, updatedTask]
          }
        }
        return column
      })

      return {
        ...prevBoard,
        columns: updatedColumns,
        updatedAt: new Date().toISOString()
      }
    })
  }, [])

  const saveTaskChanges = useCallback((task: Partial<KanbanTask>, targetColumnId?: string) => {
    if (!task.id) {
      // This is a new task, find the appropriate column to add it to
      let columnId = targetColumnId
      if (!columnId) {
        const targetColumn = board.columns.find(col => 
          task.status ? col.status === task.status : col.status === 'todo'
        )
        columnId = targetColumn?.id
      }
      
      if (columnId) {
        addTask(columnId, task)
      }
    } else {
      // This is an existing task, update it
      updateTask(task.id, task)
    }
  }, [board.columns, addTask, updateTask])

  // Helper function to get task by ID
  const getTask = useCallback((taskId: string): KanbanTask | null => {
    for (const column of board.columns) {
      const task = column.tasks.find(t => t.id === taskId)
      if (task) return task
    }
    return null
  }, [board.columns])

  // Helper function to get column by task ID
  const getColumnByTaskId = useCallback((taskId: string): KanbanColumn | null => {
    return board.columns.find(column => 
      column.tasks.some(task => task.id === taskId)
    ) || null
  }, [board.columns])

  // Helper function to get column by ID
  const getColumn = useCallback((columnId: string): KanbanColumn | null => {
    return board.columns.find(column => column.id === columnId) || null
  }, [board.columns])

  return {
    board,
    setBoard,
    updateTask,
    addTask,
    deleteTask,
    moveTask,
    saveTaskChanges,
    getTask,
    getColumn,
    getColumnByTaskId
  }
}