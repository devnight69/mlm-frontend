import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../apis/axiosInstance";
import { BarLoader } from "react-spinners";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store/rootReducer";
import Sidebar from "../components/Sidebar";
import { menuItems } from "./utils";
import {
  ChevronRight,
  CreditCard,
  Lock,
  Mail,
  Phone,
  User,
} from "lucide-react";

const StepIndicator = ({ currentStep, steps }: any) => (
  <div className="flex items-center justify-center mb-8">
    {steps.map(
      //@ts-ignore
      (step: any, index: any) => (
        <div key={index} className="flex items-center">
          <div
            className={`flex items-center justify-center w-8 h-8 rounded-full border-2 
            ${
              currentStep >= index + 1
                ? "border-blue-500 bg-blue-500 text-white"
                : "border-gray-300 text-gray-300"
            }`}
          >
            {currentStep > index + 1 ? "✓" : index + 1}
          </div>
          {index < steps.length - 1 && (
            <div
              className={`w-16 h-0.5 mx-2 ${
                currentStep > index + 1 ? "bg-blue-500" : "bg-gray-300"
              }`}
            />
          )}
        </div>
      )
    )}
  </div>
);

const InputField = ({ icon: Icon, error, ...props }: any) => (
  <div className="mb-4">
    <div className="relative">
      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
        <Icon size={18} />
      </div>
      <input
        {...props}
        className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
          error ? "border-red-500" : "border-gray-200"
        } focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200`}
      />
    </div>
    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
  </div>
);

const RegistrationPage = () => {
  const [step, setStep] = useState(1);
  const [referralId, setReferralId] = useState("");
  const [referrerDetails, setReferrerDetails] = useState<any>(null);
  const [formData, setFormData] = useState<any>({
    name: "",
    mobileNumber: "",
    email: "",
    password: "",
    confirmPassword: "",
    referralCode: "",
  });
  const [pin, setPin] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<any>({});
  const navigate = useNavigate();

  const validateReferralId = () => referralId.trim() !== "";
  const validateName = () => formData.name.trim() !== "";
  const validateMobileNumber = () => /^[0-9]{10}$/.test(formData.mobileNumber);
  const validateEmail = () => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);
  const validatePassword = () =>
    /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/.test(
      formData.password
    );
  const validateConfirmPassword = () =>
    formData.password === formData.confirmPassword;

  // Referral ID Submission
  const handleReferralSubmit = async () => {
    if (!validateReferralId()) {
      toast.warning("Referral ID is required.");
      return;
    }

    setIsLoading(true);
    try {
      const response: any = await axiosInstance.get(
        `/auth/user/name/${referralId}`
      );
      if (response?.data?.response) {
        setReferrerDetails(response?.data?.data);
        setFormData({ ...formData, referralCode: referralId });
        setStep(2);
      } else {
        toast.error("Invalid Referral ID. Please try again.");
      }
    } catch (error) {
      toast.error("Invalid Referral ID. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Final Registration Submission
  const handleRegistrationSubmit = async () => {
    const newErrors: any = {};

    if (!validateName()) newErrors.name = "Name is required.";
    if (!validateMobileNumber())
      newErrors.mobileNumber = "Enter a valid 10-digit mobile number.";
    if (!validateEmail()) newErrors.email = "Enter a valid email address.";
    if (!validatePassword())
      newErrors.password =
        "Password must be at least 8 characters long, with at least one number and one special character.";
    if (!validateConfirmPassword())
      newErrors.confirmPassword = "Passwords do not match.";

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    setIsLoading(true);
    const payload = {
      name: formData.name,
      mobileNumber: formData.mobileNumber,
      email: formData.email,
      password: formData.password,
      referralCode: formData.referralCode,
      pin: pin,
    };

    try {
      const response: any = await axiosInstance.post("/auth/register", payload);
      if (response?.data?.response) {
        toast.success("Registration Successful!");
        navigate("/dashboard");
      } else {
        toast.error("Registration failed. Please try again.");
      }
    } catch (error) {
      toast.error("Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const [pins, setPins] = useState<any>([]);

  useEffect(() => {
    fetchPins();
  }, []);

  console.log(pins, "pins");

  const adminDetails = useSelector(
    (state: RootState) => state.AuthSlice.userDetails
  );

  const fetchPins = async () => {
    try {
      const response: any = await axiosInstance.get(
        `/pin/pins/${adminDetails?.user?.id}`,
        {
          headers: {
            Authorization: `Bearer ${adminDetails?.token}`,
          },
        }
      );
      const availablePins = response.data.data.pins.filter(
        (pin: any) => pin.status === "available" || pin.status === "transferred"
      );
      setPins(availablePins);
    } catch (error: any) {
      console.log(error);
      toast.error(error?.response?.data?.message);
    }
  };
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const profileDetails = useSelector(
    (state: RootState) => state.AuthSlice.userDetails
  );

  const handleLogout = () => {
    localStorage.clear();
    toast.success("Logged out successfully!");
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div
        className={`
      fixed md:static z-50 inset-y-0 left-0 
      w-64 bg-white shadow-2xl 
      transform transition-transform duration-300
      md:translate-x-0
    `}
      >
        {isSidebarOpen && (
          <Sidebar
            menuItems={menuItems}
            profileDetails={profileDetails}
            setIsSidebarOpen={setIsSidebarOpen}
            handleLogout={handleLogout}
          />
        )}
      </div>

      <div className="flex-grow flex items-center justify-center p-8">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 transition-all duration-300">
          <StepIndicator
            currentStep={step}
            steps={["Referral", "Verify", "Register"]}
          />

          {step === 1 && (
            <div className="space-y-6 transition-all duration-300">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  Enter Referral ID
                </h2>
                <p className="text-gray-500 mb-6">
                  Please enter your referral code to continue
                </p>
              </div>
              <InputField
                icon={CreditCard}
                type="text"
                placeholder="Enter Referral ID"
                value={referralId}
                onChange={(e: any) => setReferralId(e.target.value)}
                error={errors.referralId}
              />
              <button
                onClick={handleReferralSubmit}
                disabled={isLoading}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
              >
                {isLoading ? (
                  <BarLoader color="#ffffff" />
                ) : (
                  <>
                    <span>Continue</span>
                    <ChevronRight size={18} />
                  </>
                )}
              </button>
            </div>
          )}

          {step === 2 && referrerDetails && (
            <div className="text-center space-y-6 transition-all duration-300">
              <div className="p-6 bg-blue-50 rounded-lg">
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                  Referrer Details
                </h2>
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                  <User size={32} className="text-blue-500" />
                </div>
                <p className="text-lg font-medium text-gray-700">
                  {referrerDetails.name}
                </p>
              </div>
              <button
                onClick={() => setStep(3)}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
              >
                <span>Continue to Registration</span>
                <ChevronRight size={18} />
              </button>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4 transition-all duration-300">
              <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
                Complete Registration
              </h2>

              <InputField
                icon={User}
                type="text"
                placeholder="Full Name"
                value={formData.name}
                onChange={(e: any) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                error={errors.name}
              />

              <InputField
                icon={Phone}
                type="tel"
                placeholder="Mobile Number"
                value={formData.mobileNumber}
                onChange={(e: any) =>
                  setFormData({ ...formData, mobileNumber: e.target.value })
                }
                error={errors.mobileNumber}
              />

              <InputField
                icon={Mail}
                type="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={(e: any) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                error={errors.email}
              />

              <InputField
                icon={Lock}
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={(e: any) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                error={errors.password}
              />

              <InputField
                icon={Lock}
                type="password"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={(e: any) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
                error={errors.confirmPassword}
              />

              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <CreditCard size={18} />
                </div>
                <select
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 appearance-none"
                >
                  <option value="" disabled>
                    Select PIN
                  </option>
                  {pins.map((pin: any) => (
                    <option key={pin._id} value={pin.pinCode}>
                      {pin.pinCode}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={handleRegistrationSubmit}
                disabled={isLoading}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2 mt-6"
              >
                {isLoading ? (
                  <BarLoader color="#ffffff" />
                ) : (
                  <>
                    <span>Complete Registration</span>
                    <ChevronRight size={18} />
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RegistrationPage;
