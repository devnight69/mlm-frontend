import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axiosInstance from "../apis/axiosInstance";
import { toast } from "react-toastify";
import { RootState } from "../redux/store/rootReducer";
import { BarLoader } from "react-spinners";
import Sidebar from "../components/Sidebar";
import { menuItems } from "./utils";
import { useNavigate } from "react-router-dom";
import { Menu } from "lucide-react";

const WithdrawEarnings = () => {
  const [amount, setAmount] = useState<number | string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [earnings, setEarnings] = useState<any>(null);

  useEffect(() => {
    const handleResize = () => {
      setIsSidebarOpen(window.innerWidth >= 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const profileDetails = useSelector(
    (state: RootState) => state.AuthSlice.userDetails
  );
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
        setEarnings(response?.data?.data);
      }
    } catch (error) {
      console.log(error);
      toast.error(
        "Failed to fetch earnings, Please try again after some time!"
      );
    } finally {
      setIsLoading(false);
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
        getMyEarning(); // Refresh earnings after withdrawal
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
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        menuItems={menuItems}
        profileDetails={profileDetails}
        setIsSidebarOpen={setIsSidebarOpen}
        handleLogout={handleLogout}
      />

      <div className="flex-1">
        {/* Mobile Header */}
        <div className="p-4 md:hidden flex items-center justify-between">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 hover:bg-blue-100 rounded-lg"
          >
            <Menu size={24} />
          </button>
          <h1 className="text-xl font-bold">Withdraw Earnings</h1>
          <div className="w-8"></div> {/* Spacer for center alignment */}
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
            <BarLoader color="black" />
          </div>
        ) : (
          <div className="p-4 md:p-6 flex items-center justify-center">
            <div className="w-full max-w-md bg-white shadow-md rounded-lg p-6">
              {/* Earnings Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="text-sm text-gray-600">Direct Referral</h3>
                  <p className="text-lg font-bold text-blue-600">
                    ₹{earnings?.directReferralIncome || 0}
                  </p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="text-sm text-gray-600">Indirect Referral</h3>
                  <p className="text-lg font-bold text-green-600">
                    ₹{earnings?.indirectReferralIncome || 0}
                  </p>
                </div>
              </div>

              <h2 className="text-xl md:text-2xl font-bold text-center mb-2">
                Withdraw Earnings
              </h2>
              <p className="text-center mb-6">
                Available Balance:{" "}
                <span className="font-bold text-green-500">
                  ₹{totalEarnings || 0}
                </span>
              </p>

              <div className="mb-6">
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
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                onClick={handleWithdraw}
                disabled={isLoading}
                className={`w-full px-4 py-3 text-white font-medium rounded-lg ${
                  isLoading
                    ? "bg-blue-300 cursor-not-allowed"
                    : "bg-blue-500 hover:bg-blue-600 transition"
                }`}
              >
                {isLoading ? "Processing..." : "Withdraw"}
              </button>

              {/* Information Cards */}
              <div className="mt-6 space-y-3">
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    Minimum withdrawal amount: ₹100
                  </p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-800">
                    Processing time: 24-48 hours
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WithdrawEarnings;
