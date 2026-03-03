import React, { useState } from "react";

type Choice = "rock" | "paper" | "scissors" | null;

const choices: { type: Choice; icon: string }[] = [
  { type: "rock", icon: "🪨" },
  { type: "paper", icon: "📄" },
  { type: "scissors", icon: "✂️" },
];

const getResult = (player: Choice, computer: Choice): string => {
  if (!player || !computer) return "";
  if (player === computer) return "draw";

  if (
    (player === "rock" && computer === "scissors") ||
    (player === "paper" && computer === "rock") ||
    (player === "scissors" && computer === "paper")
  ) {
    return "win";
  }

  return "lose";
};

const RockPaperScissors: React.FC = () => {
  const [playerChoice, setPlayerChoice] = useState<Choice>(null);
  const [computerChoice, setComputerChoice] = useState<Choice>(null);
  const [result, setResult] = useState<string>("");
  const [score, setScore] = useState({ win: 0, lose: 0, draw: 0 });

  const handleChoice = (choice: Choice) => {
    const random =
      choices[Math.floor(Math.random() * choices.length)].type;

    const gameResult = getResult(choice, random);

    setPlayerChoice(choice);
    setComputerChoice(random);
    setResult(gameResult);

    setScore((prev) => ({
      ...prev,
      [gameResult]: prev[gameResult as keyof typeof prev] + 1,
    }));
  };

  const resetGame = () => {
    setPlayerChoice(null);
    setComputerChoice(null);
    setResult("");
  };

  const getIcon = (choice: Choice) =>
    choices.find((c) => c.type === choice)?.icon;

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center p-6">
      <div className="bg-white/10 backdrop-blur-lg shadow-2xl rounded-3xl p-8 w-full max-w-md text-center border border-white/20">

        <h1 className="text-3xl font-bold text-white mb-6">
          ✊ Rock Paper Scissors
        </h1>

        {/* Score */}
        <div className="flex justify-between text-white mb-6 font-semibold">
          <span>🏆 {score.win}</span>
          <span>🤝 {score.draw}</span>
          <span>❌ {score.lose}</span>
        </div>

        {/* Icon Buttons */}
        <div className="flex justify-center gap-6 mb-8">
          {choices.map((choice) => (
            <button
              key={choice.type}
              onClick={() => handleChoice(choice.type)}
              className="w-20 h-20 text-4xl bg-white/20 backdrop-blur-md rounded-2xl 
                         border border-white/30 shadow-lg 
                         hover:scale-110 hover:bg-white/30 
                         transition-all duration-200"
            >
              {choice.icon}
            </button>
          ))}
        </div>

        {/* Result */}
        {playerChoice && (
          <div className="text-white space-y-2 mb-6">
            <p className="text-lg">
              You: <span className="text-3xl">{getIcon(playerChoice)}</span>
            </p>
            <p className="text-lg">
              Computer:{" "}
              <span className="text-3xl">
                {getIcon(computerChoice)}
              </span>
            </p>

            <p className="text-xl font-bold mt-3">
              {result === "win" && "🎉 You Win!"}
              {result === "lose" && "😢 You Lose!"}
              {result === "draw" && "🤝 It's a Draw!"}
            </p>
          </div>
        )}

        <button
          onClick={resetGame}
          className="w-full bg-white text-indigo-600 font-semibold py-2 rounded-xl 
                     hover:bg-gray-100 transition-all duration-300 shadow-lg"
        >
          Play Again
        </button>
      </div>
    </div>
  );
};

export default RockPaperScissors;