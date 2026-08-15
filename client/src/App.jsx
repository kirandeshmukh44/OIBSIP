import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Builder from "./pages/Builder";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Orders from "./pages/Orders";

function App() {
  return (
    <BrowserRouter>

      <Routes>

        <Route path="/" element={<Home />} />

        <Route path="/builder" element={<Builder />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/orders" element={<Orders />} />

      </Routes>

    </BrowserRouter>
  );
}

export default App;