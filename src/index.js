import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPasswordOtpGenerate from "./pages/ForgotPasswordOtpGenerate";
import ChangePassword from "./pages/ChangePassword";
import Dashboard from "./pages/Dashboard";
import PlayerProfile from "./pages/PlayerProfile";
import DepositMethod from "./pages/DepositMethod";
import DepositAmount from "./pages/DepositAmount";
import SendDepositRequestForm from "./pages/SendDepositRequest";
import WithdrawAmount from "./pages/WithdrawAmount";
import PlayerBank from "./pages/PlayerBank";
import SendWithdrawRequestForm from "./pages/SendWithdrawRequest";
import StoreBankForm from "./pages/StoreBank";
import ListBank from "./pages/ListBank";
import EditBank from "./pages/EditBank";
import DepositHistory from "./pages/DepositHistory";
import Statement from "./pages/Statement";
import WithdrawHistory from "./pages/WithdrawHistory";
import Providers from "./pages/Providers";
import Games from "./pages/Games";
import TurboGames from "./pages/TurboGames";
import TempGame from "./pages/TempGame";
import GamePage from "./pages/GamePage";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./components/PrivateRoute";
import PublicRoute from "./components/PublicRoute";
import "./index.css";
import Layout from "./pages/Layout";
const token = localStorage.getItem("Token");

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>  {/* Move BrowserRouter outside AuthProvider */}
    <AuthProvider>
      <Routes>
        <Route element={<PublicRoute />}>
          <Route path="/" element={<App />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPasswordOtpGenerate />} />
        </Route>


        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<PlayerProfile />} />
          <Route path="/deposit-request" element={<SendDepositRequestForm />} />
          <Route path="/deposit-method" element={<DepositMethod />} />
          <Route path="/store-bank" element={<StoreBankForm />} />
          <Route path="/list-bank" element={<ListBank />} />
          <Route path="/edit-bank/:id" element={<EditBank token={token} />} />
          <Route path="/withdraw-amount" element={<WithdrawAmount />} />
          <Route path="/player-bank" element={<PlayerBank />} />
          <Route path="/withdraw-request" element={<SendWithdrawRequestForm />} />
          <Route path="/deposit-history" element={<DepositHistory />} />
          <Route path="/withdraw-history" element={<WithdrawHistory />} />
          <Route path="/deposit-amount" element={<DepositAmount />} />
          <Route path="/statement" element={<Statement />} />
          <Route path="/logout" element={<Layout />} />
          <Route path="/change-password" element={<ChangePassword />} />
        </Route>

        <Route path="/providers" element={<Providers />} />
        <Route path="/games" element={<Games />} />
        <Route path="/turbo-games" element={<TurboGames />} />
        <Route path="/temp-game" element={<TempGame />} />
        <Route path="/games/:gameName" element={<GamePage />} />
      </Routes>
    </AuthProvider>
  </BrowserRouter>
);


