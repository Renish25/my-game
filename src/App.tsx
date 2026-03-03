import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import TicTacToe from "./pages/TicTacToe";
import RockPaperScissors from "./pages/RockPaperScissors";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/games/tic-tac-toe" element={<TicTacToe />} />
      <Route path="/games/rock-paper-scissors" element={<RockPaperScissors />} />
    </Routes>
  );
};

export default App;