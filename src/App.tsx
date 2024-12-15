import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./Pages/LandingPage";
import LoginPage from "./Pages/LoginPage";
import RegistrationPage from "./Pages/RegistrationPage";
import Dashboard from "./Pages/Dashboard";
import Profile from "./Pages/Profile";

function App() {
  return (
    <Router>
      <Routes>
        {/* Landing Page Route */}
        <Route path="/" element={<LandingPage />} />

        {/* Login Page Route */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegistrationPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />

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
    </Router>
  );
}

export default App;
