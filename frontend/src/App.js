import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import AppNavbar from "./pages/Navbar";
import CreatePage from "./pages/CreatePage";
import QueryPage from "./pages/QueryPage";

function App() {
  return (
    <Router>
      <AppNavbar />
      <Routes>
        <Route path="/" element={<Navigate to="/create" />} />
        <Route path="/create" element={<CreatePage />} />
        <Route path="/query" element={<QueryPage />} />
      </Routes>
    </Router>
  );
}

export default App;
