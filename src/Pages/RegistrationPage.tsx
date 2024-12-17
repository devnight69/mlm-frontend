import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../apis/axiosInstance";
import { ClipLoader } from "react-spinners";
import { toast, ToastContainer } from "react-toastify"; // Update import
import "react-toastify/dist/ReactToastify.css";
import { useDispatch } from "react-redux";
import { setAuthSlice } from "../redux/slices/AuthSlice";

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
  const navigate = useNavigate();

  // Fetch referral details from the API
  const handleReferralSubmit = async () => {
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

  const dispatch = useDispatch();
  // Validate form data and proceed
  const handleRegistrationSubmit = async () => {
    const { name, mobileNumber, email, password, confirmPassword } = formData;

    if (!name || !mobileNumber || !email || !password || !confirmPassword) {
      toast.warning("Please fill in all fields");
      return;
    }
    if (password !== confirmPassword) {
      toast.warning("Passwords do not match");
      return;
    }
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
        dispatch(setAuthSlice({ userDetails: response?.data }));
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white shadow-md rounded-lg">
        {/* Step 1: Enter Referral ID */}
        {step === 1 && (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4 text-center">
              Enter Referral ID
            </h2>
            <input
              type="text"
              value={referralId}
              onChange={(e) => setReferralId(e.target.value)}
              placeholder="Referral ID"
              className="border rounded w-full p-2 mb-4"
            />
            <button
              onClick={handleReferralSubmit}
              className="w-full bg-blue-500 text-white p-2 rounded flex justify-center"
              disabled={isLoading}
            >
              {isLoading ? (
                <ClipLoader color="#ffffff" size={20} />
              ) : (
                "Continue"
              )}
            </button>
          </div>
        )}

        {/* Step 2: Show Referrer Details */}
        {step === 2 && referrerDetails && (
          <div className="p-6 text-center">
            <p>
              <strong>Name:</strong> {referrerDetails.name}
            </p>
            <button
              onClick={() => setStep(3)}
              className="w-full bg-blue-500 text-white p-2 rounded mt-4"
            >
              Continue to Registration
            </button>
          </div>
        )}

        {/* Step 3: User Details */}
        {step === 3 && (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4 text-center">
              Registration Details
            </h2>
            <input
              placeholder="Name"
              className="border rounded w-full p-2 mb-4"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
            <input
              placeholder="Mobile Number"
              className="border rounded w-full p-2 mb-4"
              value={formData.mobileNumber}
              onChange={(e) =>
                setFormData({ ...formData, mobileNumber: e.target.value })
              }
            />
            <input
              placeholder="Email"
              className="border rounded w-full p-2 mb-4"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
            <input
              placeholder="Password"
              type="password"
              className="border rounded w-full p-2 mb-4"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
            <input
              placeholder="Confirm Password"
              type="password"
              className="border rounded w-full p-2 mb-4"
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData({ ...formData, confirmPassword: e.target.value })
              }
            />
            <input
              placeholder="Enter PIN"
              type="text"
              className="border rounded w-full p-2 mb-4"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
            />
            <button
              onClick={handleRegistrationSubmit}
              className="w-full bg-blue-500 text-white p-2 rounded flex justify-center"
              disabled={isLoading}
            >
              {isLoading ? <ClipLoader color="#ffffff" size={20} /> : "Submit"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RegistrationPage;
