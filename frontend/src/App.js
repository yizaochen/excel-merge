import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import QueryPage from "./pages/QueryPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" exact element={<HomePage />} />
        <Route path="/query" element={<QueryPage />} />
      </Routes>
    </Router>
  );
}

export default App;
