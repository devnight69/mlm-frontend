import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axiosInstance from "../apis/axiosInstance";
import { toast } from "react-toastify";
import { RootState } from "../redux/store/rootReducer";
import { BarLoader } from "react-spinners";
import Sidebar from "../components/Sidebar";
import { menuItems } from "./utils";
import { useNavigate } from "react-router-dom";

const WithdrawEarnings = () => {
  const [amount, setAmount] = useState<number | string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const profileDetails = useSelector(
    (state: RootState) => state.AuthSlice.userDetails
  );
  const [earnings, setEarnings] = useState<any>(null);
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.clear();
    toast.success("Logged out successfully!");
    navigate("/login");
  };

  const getMyEarning = async () => {
    setIsLoading(true);
    try {
      const response: any = await axiosInstance.get(
        `/update/user/wallet/${profileDetails?.user?.id}`,
        {
          headers: {
            Authorization: `Bearer ${profileDetails?.token}`,
          },
        }
      );
      if (response?.data?.response) {
        setIsLoading(false);
        setEarnings(response?.data?.data);
      }
    } catch (error) {
      setIsLoading(false);
      console.log(error);
      toast.error(
        "Failed to fetch earnings, Please try again after some time!"
      );
    }
  };

  useEffect(() => {
    getMyEarning();
  }, []);

  const totalEarnings =
    earnings?.directReferralIncome + earnings?.indirectReferralIncome;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (!isNaN(Number(value))) {
      setAmount(value);
    }
  };

  const handleWithdraw = async () => {
    if (Number(amount) > totalEarnings) {
      toast.error("Amount exceeds your total earnings.");
      return;
    }

    if (Number(amount) <= 0) {
      toast.error("Please enter a valid amount.");
      return;
    }

    setIsLoading(true);
    const payload = {
      userId: profileDetails?.user?.id,
      amountRequested: Number(amount),
    };

    try {
      const response = await axiosInstance.post(
        "/withdraw/withdrawal",
        payload,
        {
          headers: {
            Authorization: `Bearer ${profileDetails?.token}`,
          },
        }
      );

      if (response?.data?.response) {
        toast.success("Withdrawal request submitted successfully!");
        setAmount("");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-blue-50">
      <div
        className={`
        fixed md:static z-50 inset-y-0 left-0 
        w-64 bg-white shadow-2xl 
        transform transition-transform duration-300
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
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

      {isLoading ? (
        <div className="flex items-center justify-center h-screen w-screen">
          <BarLoader color="black" />
        </div>
      ) : (
        <div className="min-h-screen w-screen bg-gray-50 flex items-center justify-center p-6">
          <div className="w-full max-w-md bg-white shadow-md rounded-lg p-6">
            <h2 className="text-2xl font-bold text-center mb-4">
              Withdraw Earnings
            </h2>
            <p className="text-center mb-6">
              Available Earnings:{" "}
              <span className="font-bold text-green-500">₹{totalEarnings}</span>
            </p>

            <div className="mb-4">
              <label
                htmlFor="withdraw-amount"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Enter Withdrawal Amount
              </label>
              <input
                type="text"
                id="withdraw-amount"
                value={amount}
                onChange={handleInputChange}
                placeholder="Enter amount"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              onClick={handleWithdraw}
              disabled={isLoading}
              className={`w-full px-4 py-2 text-white font-medium rounded-lg ${
                isLoading
                  ? "bg-blue-300 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600 transition"
              }`}
            >
              {isLoading ? "Processing..." : "Withdraw"}
            </button>

            <p className="text-sm text-gray-500 text-center mt-4">
              Please ensure the entered amount does not exceed your available
              earnings.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default WithdrawEarnings;
