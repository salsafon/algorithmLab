import { Routes, Route } from "react-router-dom";
import { Home }       from "./pages/Home/Home";
import { Visualizer } from "./pages/Visualizer/Visualizer";
import { Graph }      from "./pages/Graph/Graph";
import { Quiz }       from "./pages/Quiz/Quiz";
import { CheatSheet } from "./pages/CheatSheet/CheatSheet";

export default function App() {
  return (
    <Routes>
      <Route path="/"            element={<Home />}       />
      <Route path="/visualizer"  element={<Visualizer />} />
      <Route path="/graph"       element={<Graph />}      />
      <Route path="/quiz"        element={<Quiz />}       />
      <Route path="/cheatsheet"  element={<CheatSheet />} />
    </Routes>
  );
}