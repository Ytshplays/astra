
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';

const BOARD_SIZE = 20;
const CELL_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_FOOD = { x: 15, y: 15 };
const GAME_SPEED = 150;

type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

export function SnakeGame() {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [food, setFood] = useState(INITIAL_FOOD);
  const [direction, setDirection] = useState<Direction>('RIGHT');
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);

  const createFood = () => {
    let newFood;
    do {
      newFood = {
        x: Math.floor(Math.random() * BOARD_SIZE),
        y: Math.floor(Math.random() * BOARD_SIZE),
      };
    } while (
      snake.some((segment) => segment.x === newFood.x && segment.y === newFood.y)
    );
    return newFood;
  };

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowUp':
        if (direction !== 'DOWN') setDirection('UP');
        break;
      case 'ArrowDown':
        if (direction !== 'UP') setDirection('DOWN');
        break;
      case 'ArrowLeft':
        if (direction !== 'RIGHT') setDirection('LEFT');
        break;
      case 'ArrowRight':
        if (direction !== 'LEFT') setDirection('RIGHT');
        break;
    }
  }, [direction]);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setFood(INITIAL_FOOD);
    setDirection('RIGHT');
    setScore(0);
    setGameOver(false);
  };
  
  const moveSnake = useCallback(() => {
    if (gameOver) return;

    const newSnake = [...snake];
    const head = { ...newSnake[0] };

    switch (direction) {
      case 'UP': head.y -= 1; break;
      case 'DOWN': head.y += 1; break;
      case 'LEFT': head.x -= 1; break;
      case 'RIGHT': head.x += 1; break;
    }

    if (
      head.x < 0 ||
      head.x >= BOARD_SIZE ||
      head.y < 0 ||
      head.y >= BOARD_SIZE ||
      newSnake.some((segment) => segment.x === head.x && segment.y === head.y)
    ) {
      setGameOver(true);
      return;
    }

    newSnake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
      setScore(score + 1);
      setFood(createFood());
    } else {
      newSnake.pop();
    }

    setSnake(newSnake);
  }, [snake, direction, food.x, food.y, gameOver, score]);


  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  useEffect(() => {
    const gameInterval = setInterval(moveSnake, GAME_SPEED);
    return () => clearInterval(gameInterval);
  }, [moveSnake]);

  return (
    <div className="flex flex-col items-center p-4 bg-card rounded-b-lg">
      <div className="mb-4 text-lg font-bold">Score: {score}</div>
      <div
        style={{
          width: BOARD_SIZE * CELL_SIZE,
          height: BOARD_SIZE * CELL_SIZE,
          display: 'grid',
          gridTemplateColumns: `repeat(${BOARD_SIZE}, 1fr)`,
          border: '1px solid hsl(var(--border))',
          position: 'relative',
        }}
        className="bg-background"
      >
        {gameOver && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/70">
            <p className="text-4xl font-bold text-white">Game Over</p>
            <Button onClick={resetGame} className="mt-4">Play Again</Button>
          </div>
        )}
        {snake.map((segment, index) => (
          <div
            key={index}
            style={{
              gridColumnStart: segment.x + 1,
              gridRowStart: segment.y + 1,
              backgroundColor: index === 0 ? 'hsl(var(--primary))' : 'hsl(var(--accent))',
            }}
          ></div>
        ))}
        <div
          style={{
            gridColumnStart: food.x + 1,
            gridRowStart: food.y + 1,
            backgroundColor: 'hsl(var(--destructive))',
            borderRadius: '50%',
          }}
        ></div>
      </div>
       <div className="mt-4 text-sm text-muted-foreground">
        Use arrow keys to move.
      </div>
    </div>
  );
}
