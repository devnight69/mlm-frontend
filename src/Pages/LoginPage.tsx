import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BarLoader } from "react-spinners";
import axiosInstance from "../apis/axiosInstance";
import { useDispatch } from "react-redux";
import { setAuthSlice } from "../redux/slices/AuthSlice";
import { toast } from "react-toastify";
import { Eye, EyeOff, Lock, Phone } from "lucide-react";

const LoginPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    usernameOrEmail: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    usernameOrEmail: "",
    password: "",
  });

  // Validate phone number and password
  const validateInput = () => {
    let isValid = true;
    let tempErrors = { usernameOrEmail: "", password: "" };

    // Validate phone number
    if (!/^\d{10}$/.test(formData.usernameOrEmail)) {
      tempErrors.usernameOrEmail = "Please enter a valid 10-digit phone number";
      isValid = false;
    }

    // Validate password
    if (formData.password.length < 6) {
      tempErrors.password = "Password must be at least 6 characters long";
      isValid = false;
    }

    setErrors(tempErrors);
    return isValid;
  };

  // Handle input changes
  const handleInputChange = (e: any) => {
    const { name, value } = e.target;

    if (name === "usernameOrEmail") {
      // Restrict input to max 10 digits
      if (value.length > 10 || !/^\d*$/.test(value)) {
        return;
      }
    }

    setFormData({ ...formData, [name]: value });

    // Clear specific error when input is updated
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  };

  // Handle login logic
  const handleLogin = async (e: any) => {
    e.preventDefault();

    if (!validateInput()) return;

    setIsLoading(true);

    try {
      const response = await axiosInstance.post("/auth/login", {
        username: formData.usernameOrEmail,
        password: formData.password,
      });

      if (response?.data?.response) {
        localStorage.setItem("token", response?.data?.token);
        dispatch(setAuthSlice({ userDetails: response?.data?.data }));
        toast.success("Logged in successfully!");
        navigate("/dashboard");
      }
    } catch (error: any) {
      console.log(error);
      toast.error(error?.response?.data?.data || "Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white shadow-2xl rounded-2xl overflow-hidden">
        <div className="px-8 py-10">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-blue-800 mb-2">
              Welcome Back
            </h1>
            <p className="text-gray-500">Sign in to access your dashboard</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {/* Phone Number Input */}
            <div>
              <label
                htmlFor="usernameOrEmail"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Phone Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="usernameOrEmail"
                  name="usernameOrEmail"
                  value={formData.usernameOrEmail}
                  onChange={handleInputChange}
                  placeholder="Enter your phone number"
                  className={`
                    pl-10 w-full px-4 py-3 border rounded-lg shadow-sm 
                    focus:outline-none focus:ring-2 focus:ring-blue-500 
                    ${
                      errors.usernameOrEmail
                        ? "border-red-500 focus:border-red-500"
                        : "border-gray-300"
                    }
                  `}
                  required
                />
              </div>
              {errors.usernameOrEmail && (
                <p className="mt-2 text-sm text-red-500">
                  {errors.usernameOrEmail}
                </p>
              )}
            </div>

            {/* Password Input */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter your password"
                  className={`
                    pl-10 w-full px-4 py-3 border rounded-lg shadow-sm 
                    focus:outline-none focus:ring-2 focus:ring-blue-500 
                    ${
                      errors.password
                        ? "border-red-500 focus:border-red-500"
                        : "border-gray-300"
                    }
                  `}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-2 text-sm text-red-500">{errors.password}</p>
              )}
            </div>

            {/* Forgot Password Link */}
            <div className="text-right">
              <a
                href="/forgot-password"
                className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
              >
                Forgot Password?
              </a>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className={`
                  w-full flex items-center justify-center px-4 py-3 rounded-lg 
                  text-white font-semibold transition-all duration-300 
                  ${
                    isLoading
                      ? "bg-blue-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700 hover:shadow-lg"
                  }
                `}
              >
                {isLoading ? <BarLoader color="#ffffff" /> : "Sign In"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
