import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Home from "./pages/Home";
import Screenplay from "./pages/Screenplay";
import Shotlist from "./pages/Shotlist";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/home" element={<Home />} />
        <Route path="/screenplay/:screenplay_id?" element={<Screenplay />} />
        <Route path="/shotlist/:screenplay_id?" element={<Shotlist />} />
      </Routes>
    </BrowserRouter>
  );
}
