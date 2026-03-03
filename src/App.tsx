import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import TicTacToe from "./pages/TicTacToe";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/games/tic-tac-toe" element={<TicTacToe />} />
    </Routes>
  );
};

export default App;