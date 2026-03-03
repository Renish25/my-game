import React, { useState, useEffect } from "react";

type Player = "X" | "O";
type SquareValue = Player | null;
type Difficulty = "easy" | "hard";
type GameMode = "single" | "two";

const winningCombinations: number[][] = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

const TicTacToe: React.FC = () => {
  const [board, setBoard] = useState<SquareValue[]>(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);

  // Load saved values from localStorage
  const [mode, setMode] = useState<GameMode>(() =>
    (localStorage.getItem("mode") as GameMode) || "single"
  );

  const [difficulty, setDifficulty] = useState<Difficulty>(() =>
    (localStorage.getItem("difficulty") as Difficulty) || "easy"
  );

  useEffect(() => {
    localStorage.setItem("mode", mode);
  }, [mode]);

  useEffect(() => {
    localStorage.setItem("difficulty", difficulty);
  }, [difficulty]);

  const calculateWinner = (squares: SquareValue[]): Player | null => {
    for (const [a, b, c] of winningCombinations) {
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  };

  const winner = calculateWinner(board);
  const isDraw = !winner && board.every((sq) => sq !== null);

  const handleClick = (index: number) => {
    if (board[index] || winner) return;

    const newBoard = [...board];
    newBoard[index] = isXNext ? "X" : "O";
    setBoard(newBoard);
    setIsXNext(!isXNext);
  };

  // ---------------- AI SECTION ----------------

  const randomMove = (squares: SquareValue[]) => {
    const empty = squares
      .map((val, idx) => (val === null ? idx : null))
      .filter((val) => val !== null) as number[];

    return empty[Math.floor(Math.random() * empty.length)];
  };

  const minimax = (squares: SquareValue[], isMax: boolean): number => {
    const result = calculateWinner(squares);
    if (result === "O") return 1;
    if (result === "X") return -1;
    if (squares.every((sq) => sq !== null)) return 0;

    if (isMax) {
      let best = -Infinity;
      for (let i = 0; i < 9; i++) {
        if (!squares[i]) {
          squares[i] = "O";
          best = Math.max(best, minimax(squares, false));
          squares[i] = null;
        }
      }
      return best;
    } else {
      let best = Infinity;
      for (let i = 0; i < 9; i++) {
        if (!squares[i]) {
          squares[i] = "X";
          best = Math.min(best, minimax(squares, true));
          squares[i] = null;
        }
      }
      return best;
    }
  };

  const bestMove = () => {
    let move = -1;
    let bestScore = -Infinity;

    for (let i = 0; i < 9; i++) {
      if (!board[i]) {
        board[i] = "O";
        const score = minimax(board, false);
        board[i] = null;
        if (score > bestScore) {
          bestScore = score;
          move = i;
        }
      }
    }

    return move;
  };

  // AI Move (only in single mode and O's turn)
  useEffect(() => {
    if (
      mode === "single" &&
      !isXNext &&
      !winner &&
      !isDraw
    ) {
      const timeout = setTimeout(() => {
        const newBoard = [...board];
        const move =
          difficulty === "easy"
            ? randomMove(newBoard)
            : bestMove();

        if (move !== -1 && move !== undefined) {
          newBoard[move] = "O";
          setBoard(newBoard);
          setIsXNext(true);
        }
      }, 400);

      return () => clearTimeout(timeout);
    }
  }, [board, isXNext, winner, isDraw, mode, difficulty]);

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
  };

  // ---------------- UI ----------------

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center p-6">
      <div className="bg-white/10 backdrop-blur-lg shadow-2xl rounded-3xl p-8 w-full max-w-md text-center border border-white/20">

        <h1 className="text-3xl font-bold text-white mb-6">
          🎮 Tic Tac Toe
        </h1>

        {/* Mode Dropdown */}
        <div className="mb-3 text-white">
          <label className="mr-2 font-semibold">Mode:</label>
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value as GameMode)}
            className="px-3 py-1 rounded-lg text-gray-800 focus:outline-none"
          >
            <option value="single">Single Player</option>
            <option value="two">Two Player</option>
          </select>
        </div>

        {/* Difficulty Dropdown */}
        {mode === "single" && (
          <div className="mb-4 text-white">
            <label className="mr-2 font-semibold">Difficulty:</label>
            <select
              value={difficulty}
              onChange={(e) =>
                setDifficulty(e.target.value as Difficulty)
              }
              className="px-3 py-1 rounded-lg text-gray-800 focus:outline-none"
            >
              <option value="easy">Easy</option>
              <option value="hard">Hard</option>
            </select>
          </div>
        )}

        {/* Status */}
        <div className="mb-6 text-lg font-semibold text-white">
          {winner
            ? `🏆 Winner: ${winner}`
            : isDraw
              ? "🤝 It's a Draw!"
              : `Next Player: ${isXNext ? "X" : "O"}`}
        </div>

        {/* Board */}
        <div className="grid grid-cols-3 justify-center">
          {board.map((value, index) => (
            <button
              key={index}
              onClick={() => handleClick(index)}
              className="w-full h-20 bg-white/20 backdrop-blur-md text-white text-3xl font-bold rounded-xl border border-white/30 
                       hover:bg-white/30 transition-all duration-200 
                       flex items-center justify-center"
            >
              {value}
            </button>
          ))}
        </div>

        {/* Reset */}
        <button
          onClick={resetGame}
          className="mt-6 w-full bg-white text-indigo-600 font-semibold py-2 rounded-xl 
                   hover:bg-gray-100 transition-all duration-300 shadow-lg"
        >
          Restart Game
        </button>
      </div>
    </div>
  );
};

export default TicTacToe;