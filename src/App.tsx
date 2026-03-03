import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import TicTacToe from "./pages/TicTacToe";
import RockPaperScissors from "./pages/RockPaperScissors";
import SnakeGame from "./pages/SnakeGame";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/games/tic-tac-toe" element={<TicTacToe />} />
      <Route path="/games/rock-paper-scissors" element={<RockPaperScissors />} />
      <Route path="/games/snake" element={<SnakeGame />} />
    </Routes>
  );
};

export default App;