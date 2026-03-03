import React, { useEffect, useRef, useState } from "react";

type Position = { x: number; y: number };
type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT";

const GRID_SIZE = 20;
const INITIAL_SPEED = 150;

const getRandomFood = (): Position => ({
  x: Math.floor(Math.random() * GRID_SIZE),
  y: Math.floor(Math.random() * GRID_SIZE),
});

const SnakeGame: React.FC = () => {
  const [snake, setSnake] = useState<Position[]>([
    { x: 8, y: 10 },
    { x: 7, y: 10 },
  ]);
  const [food, setFood] = useState<Position>(getRandomFood());
  const [direction, setDirection] = useState<Direction>("RIGHT");
  const [score, setScore] = useState(0);
  const [speed, setSpeed] = useState(INITIAL_SPEED);
  const [gameOver, setGameOver] = useState(false);
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  const directionRef = useRef(direction);
  directionRef.current = direction;

  // Keyboard Controls
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp" && directionRef.current !== "DOWN")
        setDirection("UP");
      if (e.key === "ArrowDown" && directionRef.current !== "UP")
        setDirection("DOWN");
      if (e.key === "ArrowLeft" && directionRef.current !== "RIGHT")
        setDirection("LEFT");
      if (e.key === "ArrowRight" && directionRef.current !== "LEFT")
        setDirection("RIGHT");
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  // Game Loop
  useEffect(() => {
    if (gameOver) return;

    const interval = setInterval(() => {
      setSnake((prev) => {
        const head = { ...prev[0] };

        switch (directionRef.current) {
          case "UP":
            head.y -= 1;
            break;
          case "DOWN":
            head.y += 1;
            break;
          case "LEFT":
            head.x -= 1;
            break;
          case "RIGHT":
            head.x += 1;
            break;
        }

        // Wall collision
        if (
          head.x < 0 ||
          head.y < 0 ||
          head.x >= GRID_SIZE ||
          head.y >= GRID_SIZE
        ) {
          setGameOver(true);
          return prev;
        }

        // Self collision
        if (prev.some((segment) => segment.x === head.x && segment.y === head.y)) {
          setGameOver(true);
          return prev;
        }

        const newSnake = [head, ...prev];

        // Food collision
        if (head.x === food.x && head.y === food.y) {
          setFood(getRandomFood());
          setScore((s) => s + 1);
          setSpeed((s) => Math.max(60, s - 10)); // Increase speed
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    }, speed);

    return () => clearInterval(interval);
  }, [food, speed, gameOver]);

  const resetGame = () => {
    setSnake([
      { x: 8, y: 10 },
      { x: 7, y: 10 },
    ]);
    setFood(getRandomFood());
    setDirection("RIGHT");
    setScore(0);
    setSpeed(INITIAL_SPEED);
    setGameOver(false);
  };

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      touchStart.current = { x: touch.clientX, y: touch.clientY };
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!touchStart.current) return;

      const touch = e.changedTouches[0];
      const deltaX = touch.clientX - touchStart.current.x;
      const deltaY = touch.clientY - touchStart.current.y;

      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        if (deltaX > 30 && directionRef.current !== "LEFT")
          setDirection("RIGHT");
        else if (deltaX < -30 && directionRef.current !== "RIGHT")
          setDirection("LEFT");
      } else {
        if (deltaY > 30 && directionRef.current !== "UP")
          setDirection("DOWN");
        else if (deltaY < -30 && directionRef.current !== "DOWN")
          setDirection("UP");
      }

      touchStart.current = null;
    };

    window.addEventListener("touchstart", handleTouchStart);
    window.addEventListener("touchend", handleTouchEnd);

    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, []);

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center p-6">
      <div className="bg-white/10 backdrop-blur-lg shadow-2xl rounded-3xl py-8 px-2 text-center border border-white/20">

        <h1 className="text-3xl font-bold text-white mb-4">
          🐍 Snake Game
        </h1>

        <div className="text-white font-semibold mb-4">
          Score: {score}
        </div>

        {/* Game Board */}
        <div
          className="grid bg-black rounded-xl overflow-hidden border border-white/20"
          style={{
            gridTemplateColumns: `repeat(${GRID_SIZE}, 20px)`,
            width: GRID_SIZE * 20,
          }}
        >
          {[...Array(GRID_SIZE * GRID_SIZE)].map((_, index) => {
            const x = index % GRID_SIZE;
            const y = Math.floor(index / GRID_SIZE);

            const isSnake = snake.some(
              (segment) => segment.x === x && segment.y === y
            );
            const isFood = food.x === x && food.y === y;

            return (
              <div
                key={index}
                className={`w-5 h-5 
                  ${isSnake ? "bg-green-400" : ""}
                  ${isFood ? "bg-red-500 rounded-full" : ""}
                `}
              />
            );
          })}
        </div>

        {gameOver && (
          <div className="text-white mt-4 font-bold">
            💀 Game Over!
          </div>
        )}

        <button
          onClick={resetGame}
          className="mt-6 w-full bg-white text-indigo-600 font-semibold py-2 rounded-xl 
                     hover:bg-gray-100 transition-all duration-300 shadow-lg"
        >
          Restart Game
        </button>
        <div className="mt-6 flex flex-col items-center gap-2 md:hidden">
          <button
            onClick={() => setDirection("UP")}
            className="bg-white/20 text-white px-6 py-2 rounded-xl"
          >
            ⬆️
          </button>
          <div className="flex gap-4">
            <button
              onClick={() => setDirection("LEFT")}
              className="bg-white/20 text-white px-6 py-2 rounded-xl"
            >
              ⬅️
            </button>
            <button
              onClick={() => setDirection("RIGHT")}
              className="bg-white/20 text-white px-6 py-2 rounded-xl"
            >
              ➡️
            </button>
          </div>
          <button
            onClick={() => setDirection("DOWN")}
            className="bg-white/20 text-white px-6 py-2 rounded-xl"
          >
            ⬇️
          </button>
        </div>
      </div>
    </div>
  );
};

export default SnakeGame;