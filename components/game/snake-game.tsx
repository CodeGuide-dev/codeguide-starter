"use client"

import React, { useState, useEffect, useCallback, useReducer } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

// Game constants
const GRID_SIZE = 20
const CELL_SIZE = 20
const INITIAL_SPEED = 150

// Types
type Position = { x: number; y: number }
type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT'
type GameStatus = 'idle' | 'playing' | 'paused' | 'gameOver'

interface GameState {
  snake: Position[]
  food: Position
  direction: Direction
  gameStatus: GameStatus
  score: number
  highScore: number
}

type GameAction =
  | { type: 'START_GAME' }
  | { type: 'PAUSE_GAME' }
  | { type: 'RESUME_GAME' }
  | { type: 'RESET_GAME' }
  | { type: 'MOVE_SNAKE' }
  | { type: 'CHANGE_DIRECTION'; payload: Direction }
  | { type: 'EAT_FOOD' }
  | { type: 'GAME_OVER' }

// Game logic functions
const generateRandomFood = (snake: Position[]): Position => {
  let food: Position
  do {
    food = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE)
    }
  } while (snake.some(segment => segment.x === food.x && segment.y === food.y))
  return food
}

const moveSnake = (snake: Position[], direction: Direction): Position[] => {
  const newSnake = [...snake]
  const head = { ...newSnake[0] }

  switch (direction) {
    case 'UP':
      head.y -= 1
      break
    case 'DOWN':
      head.y += 1
      break
    case 'LEFT':
      head.x -= 1
      break
    case 'RIGHT':
      head.x += 1
      break
  }

  newSnake.unshift(head)
  return newSnake
}

const checkCollision = (snake: Position[]): boolean => {
  const head = snake[0]
  
  // Check wall collision
  if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
    return true
  }
  
  // Check self collision
  for (let i = 1; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      return true
    }
  }
  
  return false
}

const getOppositeDirection = (direction: Direction): Direction => {
  switch (direction) {
    case 'UP': return 'DOWN'
    case 'DOWN': return 'UP'
    case 'LEFT': return 'RIGHT'
    case 'RIGHT': return 'LEFT'
  }
}

// Game reducer
const gameReducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case 'START_GAME':
      return {
        ...state,
        gameStatus: 'playing'
      }

    case 'PAUSE_GAME':
      return {
        ...state,
        gameStatus: 'paused'
      }

    case 'RESUME_GAME':
      return {
        ...state,
        gameStatus: 'playing'
      }

    case 'RESET_GAME':
      const initialSnake = [{ x: 10, y: 10 }]
      return {
        snake: initialSnake,
        food: generateRandomFood(initialSnake),
        direction: 'RIGHT',
        gameStatus: 'idle',
        score: 0,
        highScore: state.highScore
      }

    case 'MOVE_SNAKE':
      if (state.gameStatus !== 'playing') return state
      
      const newSnake = moveSnake(state.snake, state.direction)
      
      if (checkCollision(newSnake)) {
        return {
          ...state,
          gameStatus: 'gameOver',
          highScore: Math.max(state.score, state.highScore)
        }
      }
      
      // Check if food is eaten
      if (newSnake[0].x === state.food.x && newSnake[0].y === state.food.y) {
        return {
          ...state,
          snake: newSnake,
          food: generateRandomFood(newSnake),
          score: state.score + 10
        }
      }
      
      // Remove tail if no food eaten
      newSnake.pop()
      return {
        ...state,
        snake: newSnake
      }

    case 'CHANGE_DIRECTION':
      const oppositeDir = getOppositeDirection(state.direction)
      if (action.payload === oppositeDir) return state
      return {
        ...state,
        direction: action.payload
      }

    case 'EAT_FOOD':
      return {
        ...state,
        score: state.score + 10
      }

    case 'GAME_OVER':
      return {
        ...state,
        gameStatus: 'gameOver',
        highScore: Math.max(state.score, state.highScore)
      }

    default:
      return state
  }
}

// Initial state
const initialState: GameState = {
  snake: [{ x: 10, y: 10 }],
  food: generateRandomFood([{ x: 10, y: 10 }]),
  direction: 'RIGHT',
  gameStatus: 'idle',
  score: 0,
  highScore: 0
}

export default function SnakeGame() {
  const [state, dispatch] = useReducer(gameReducer, initialState)
  const [gameLoop, setGameLoop] = useState<NodeJS.Timeout | null>(null)

  // Handle keyboard input
  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    if (state.gameStatus !== 'playing') return

    switch (e.key) {
      case 'ArrowUp':
        e.preventDefault()
        dispatch({ type: 'CHANGE_DIRECTION', payload: 'UP' })
        break
      case 'ArrowDown':
        e.preventDefault()
        dispatch({ type: 'CHANGE_DIRECTION', payload: 'DOWN' })
        break
      case 'ArrowLeft':
        e.preventDefault()
        dispatch({ type: 'CHANGE_DIRECTION', payload: 'LEFT' })
        break
      case 'ArrowRight':
        e.preventDefault()
        dispatch({ type: 'CHANGE_DIRECTION', payload: 'RIGHT' })
        break
    }
  }, [state.gameStatus])

  // Game loop effect
  useEffect(() => {
    if (state.gameStatus === 'playing') {
      const loop = setInterval(() => {
        dispatch({ type: 'MOVE_SNAKE' })
      }, INITIAL_SPEED)
      setGameLoop(loop)
    } else {
      if (gameLoop) {
        clearInterval(gameLoop)
        setGameLoop(null)
      }
    }

    return () => {
      if (gameLoop) {
        clearInterval(gameLoop)
      }
    }
  }, [state.gameStatus, state.direction])

  // Keyboard event listener
  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress)
    return () => {
      window.removeEventListener('keydown', handleKeyPress)
    }
  }, [handleKeyPress])

  // Game control functions
  const startGame = () => dispatch({ type: 'START_GAME' })
  const pauseGame = () => dispatch({ type: 'PAUSE_GAME' })
  const resumeGame = () => dispatch({ type: 'RESUME_GAME' })
  const resetGame = () => dispatch({ type: 'RESET_GAME' })

  // Render game board
  const renderBoard = () => {
    const board = []
    for (let y = 0; y < GRID_SIZE; y++) {
      for (let x = 0; x < GRID_SIZE; x++) {
        const isSnakeHead = state.snake[0]?.x === x && state.snake[0]?.y === y
        const isSnakeBody = state.snake.slice(1).some(segment => segment.x === x && segment.y === y)
        const isFood = state.food.x === x && state.food.y === y

        let cellClass = 'border transition-all duration-150 '
        if (isSnakeHead) {
          cellClass += 'bg-green-600 border-green-700 shadow-sm '
        } else if (isSnakeBody) {
          cellClass += 'bg-green-500 border-green-600 '
        } else if (isFood) {
          cellClass += 'bg-red-500 border-red-600 rounded-full shadow-sm animate-pulse '
        } else {
          cellClass += 'bg-background border-border '
        }

        board.push(
          <div
            key={`${x}-${y}`}
            className={cellClass}
            style={{
              width: `${CELL_SIZE}px`,
              height: `${CELL_SIZE}px`
            }}
          />
        )
      }
    }
    return board
  }

  const getStatusVariant = (status: GameStatus) => {
    switch (status) {
      case 'playing': return 'default'
      case 'paused': return 'secondary'
      case 'gameOver': return 'destructive'
      default: return 'outline'
    }
  }

  const getStatusColor = (status: GameStatus) => {
    switch (status) {
      case 'playing': return 'text-green-600'
      case 'paused': return 'text-yellow-600'
      case 'gameOver': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  return (
    <Card className="w-fit mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2">
          🐍 Snake Game
          <Badge variant={getStatusVariant(state.gameStatus)} className="ml-2">
            {state.gameStatus.toUpperCase()}
          </Badge>
        </CardTitle>
        <CardDescription>
          Use arrow keys to control the snake. Eat the red food to grow and increase your score.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Score Display */}
        <div className="flex justify-center gap-8">
          <div className="text-center">
            <div className="text-sm text-muted-foreground">Score</div>
            <div className="text-2xl font-bold">{state.score}</div>
          </div>
          <div className="text-center">
            <div className="text-sm text-muted-foreground">High Score</div>
            <div className="text-2xl font-bold text-primary">{state.highScore}</div>
          </div>
        </div>

        {/* Game Board */}
        <div className="flex justify-center">
          <div 
            className="grid border-2 border-border rounded-lg overflow-hidden shadow-sm"
            style={{
              gridTemplateColumns: `repeat(${GRID_SIZE}, ${CELL_SIZE}px)`,
              gridTemplateRows: `repeat(${GRID_SIZE}, ${CELL_SIZE}px)`
            }}
          >
            {renderBoard()}
          </div>
        </div>

        {/* Game Controls */}
        <div className="flex justify-center gap-3">
          {state.gameStatus === 'idle' && (
            <Button onClick={startGame} size="lg">
              🎮 Start Game
            </Button>
          )}
          
          {state.gameStatus === 'playing' && (
            <Button onClick={pauseGame} variant="secondary" size="lg">
              ⏸️ Pause
            </Button>
          )}
          
          {state.gameStatus === 'paused' && (
            <Button onClick={resumeGame} variant="default" size="lg">
              ▶️ Resume
            </Button>
          )}
          
          {state.gameStatus === 'gameOver' && (
            <div className="flex flex-col items-center gap-4">
              <div className={`text-2xl font-bold ${getStatusColor(state.gameStatus)}`}>
                💀 Game Over!
              </div>
              <div className="text-lg text-muted-foreground">
                Final Score: {state.score}
              </div>
              <Button onClick={resetGame} size="lg">
                🔄 New Game
              </Button>
            </div>
          )}
          
          {(state.gameStatus === 'playing' || state.gameStatus === 'paused') && (
            <Button onClick={resetGame} variant="destructive" size="lg">
              🔄 Reset
            </Button>
          )}
        </div>

        {/* Instructions */}
        <div className="text-center text-sm text-muted-foreground border-t pt-4">
          <div className="font-medium mb-2">How to Play:</div>
          <div className="flex justify-center gap-4 text-xs">
            <span>⬆️ Arrow Up</span>
            <span>⬇️ Arrow Down</span>
            <span>⬅️ Arrow Left</span>
            <span>➡️ Arrow Right</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}