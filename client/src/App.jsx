import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Builder from "./pages/Builder";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Orders from "./pages/Orders";
import Checkout from "./pages/Checkout";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import VerifyEmail from "./pages/VerifyEmail";
import Admin from "./pages/Admin";

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
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin/orders" element={<Admin />} />
        <Route path="/admin/inventory" element={<Admin />} />

      </Routes>

    </BrowserRouter>
  );
}

export default App;
