import { Metadata } from "next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import SnakeGame from "@/components/game/snake-game"

export const metadata: Metadata = {
  title: "Snake Game | Dashboard",
  description: "Play the classic Snake game in your dashboard",
}

export default function SnakePage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Snake Game</h2>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Classic Snake</CardTitle>
          <CardDescription>
            Use arrow keys to control the snake. Eat the red food to grow and increase your score.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SnakeGame />
        </CardContent>
      </Card>
    </div>
  )
}