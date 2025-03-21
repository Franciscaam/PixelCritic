import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Detail from "./pages/Detail.jsx";
import Wishlist from "./pages/WishList.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Populares from "./pages/Populares.jsx";
import Navbar from "./components/Navbar.jsx";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/game/:id" element={<Detail />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/populares" element={<Populares />} />
      </Routes>
    </Router>
  );
}

export default App;