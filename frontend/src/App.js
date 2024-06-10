import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import AppNavbar from "./pages/Navbar";
import CreatePage from "./pages/CreatePage";
import ReadPage from "./pages/ReadPage";
import UpdatePage from "./pages/UpdatePage";
import DeletePage from "./pages/DeletePage";

function App() {
  return (
    <Router>
      <AppNavbar />
      <Routes>
        <Route path="/" element={<Navigate to="/create" />} />
        <Route path="/create" element={<CreatePage />} />
        <Route path="/read" element={<ReadPage />} />
        <Route path="/update" element={<UpdatePage />} />
        <Route path="/delete" element={<DeletePage />} />
      </Routes>
    </Router>
  );
}

export default App;
