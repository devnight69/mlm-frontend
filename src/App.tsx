import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LandingPage from "./Pages/LandingPage";
import LoginPage from "./Pages/LoginPage";
import RegistrationPage from "./Pages/RegistrationPage";
import Dashboard from "./Pages/Dashboard";
import Profile from "./Pages/Profile";
import { ToastContainer } from "react-toastify";
import PinManagement from "./Pages/PinManagement";
import AboutUs from "./Pages/AboutUs";
import Earnings from "./Pages/Earnings";
import ReferralNetwork from "./Pages/ReferralNetwork";
import WithdrawEarnings from "./Pages/WithdrawEarning";
import WithdrawRequests from "./Pages/WithdrawRequests";

// Authentication Context (you'll need to implement this)
const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  // Check if token exists in localStorage
  const token = localStorage.getItem("token");

  // If no token, redirect to landing page
  if (!token) {
    return <Navigate to="/" replace />;
  }

  // If token exists, render the children (protected routes)
  return <>{children}</>;
};

// Authentication Redirect Component
const AuthRedirect = () => {
  // Check if token exists in localStorage
  const token = localStorage.getItem("token");

  // If token exists, redirect to dashboard
  // If no token, stay on landing page
  return token ? <Navigate to="/dashboard" replace /> : <LandingPage />;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Landing Page Route with Redirect Logic */}
        <Route path="/" element={<AuthRedirect />} />
        <Route path="/home" element={<LandingPage />} />
        <Route path="/about" element={<AboutUs />} />

        {/* Login Page Route */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegistrationPage />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
        <Route
          path="/pin-management"
          element={
            <PrivateRoute>
              <PinManagement />
            </PrivateRoute>
          }
        />
        <Route
          path="/earnings"
          element={
            <PrivateRoute>
              <Earnings />
            </PrivateRoute>
          }
        />
        <Route
          path="/referral-network"
          element={
            <PrivateRoute>
              <ReferralNetwork />
            </PrivateRoute>
          }
        />
        <Route
          path="/withdraw-earnings"
          element={
            <PrivateRoute>
              <WithdrawEarnings />
            </PrivateRoute>
          }
        />
        <Route
          path="/withdraw-requests"
          element={
            <PrivateRoute>
              <WithdrawRequests />
            </PrivateRoute>
          }
        />

        {/* Fallback Route (404 Not Found) */}
        <Route
          path="*"
          element={
            <div className="text-center mt-10">
              <h1 className="text-3xl font-bold text-red-600">
                404 - Not Found
              </h1>
              <p className="text-gray-600 mt-4">
                The page you are looking for does not exist.
              </p>
            </div>
          }
        />
      </Routes>
      <ToastContainer />
    </Router>
  );
}

export default App;
