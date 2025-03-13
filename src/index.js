import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import PlayerProfile from "./pages/PlayerProfile";
import DepositMethod from "./pages/DepositMethod";
import DepositAmount from "./pages/DepositAmount";
import SendDepositRequestForm from "./pages/SendDepositRequest";
import SendWithdrawRequestForm from "./pages/SendWithdrawRequest";
import StoreBankForm from "./pages/StoreBank";
import ListBank from "./pages/ListBank";
import DepositHistory from "./pages/DepositHistory";
import WithdrawHistory from "./pages/WithdrawHistory";
import Providers from "./pages/Providers";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./components/PrivateRoute";
import "./index.css";
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<PlayerProfile />} />
          <Route path="/deposit-request" element={<SendDepositRequestForm />} />
          <Route path="/deposit-method" element={<DepositMethod />} />
          <Route path="/store-bank" element={<StoreBankForm/>} />
          <Route path="/list-bank" element={<ListBank/>} />
          <Route path="/withdraw-request" element={<SendWithdrawRequestForm/>} />
          <Route path="/deposit-history" element={<DepositHistory/>} />
          <Route path="/withdraw-history" element={<WithdrawHistory/>} />
          <Route path="/deposit-amount" element={<DepositAmount/>} />
          <Route path="/providers" element={<Providers/>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);
