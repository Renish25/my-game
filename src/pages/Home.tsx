import { useNavigate } from "react-router-dom";

const games = [
  {
    id: 1,
    name: "Tic Tac Toe",
    path: "/games/tic-tac-toe",
    description: "Classic 2 Player Tic Tac Toe Game",
  },
  {
    id: 2,
    name: "Rock Paper Scissors",
    path: "/games/rock-paper-scissors",
    description: "Play against computer and track your score",
  },
  {
    id: 3,
    name: "Snake Game",
    path: "/games/snake",
    description: "Classic snake with increasing speed challenge",
  }
];

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-500 to-purple-600 p-8">
      <h1 className="text-4xl font-bold text-white text-center mb-10">
        🎮 My Game Collection
      </h1>

      <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {games.map((game) => (
          <div
            key={game.id}
            onClick={() => navigate(game.path)}
            className="cursor-pointer bg-white rounded-2xl shadow-lg p-6 hover:scale-105 transition-all duration-300 hover:shadow-2xl"
          >
            <h2 className="text-2xl font-semibold mb-3 text-gray-800">
              {game.name}
            </h2>
            <p className="text-gray-600">{game.description}</p>

            <button className="mt-5 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition">
              Play Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;