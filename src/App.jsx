import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Guess from "./pages/Guess";
import AdminPanel from "./pages/AdminPanel";
import { AuthProvider } from "./contexts/AuthContext";
import Ranking from "./pages/Ranking";
import LandingPage from "./pages/LandingPage";
import GuessHistory from "./pages/GuessHistory";
import Profile from "./pages/Profile"; 

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/home" element={<Home />} />
          <Route path="/guess/:id" element={<Guess />} />
          <Route path="/guess" element={<GuessHistory />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/ranking" element={<Ranking />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
