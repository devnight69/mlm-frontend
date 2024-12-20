import { useEffect, useState } from "react";
import {
  Users,
  Wallet,
  IndianRupee,
  ArrowUpRight,
  ArrowDownRight,
  Menu,
} from "lucide-react";
import Sidebar from "../components/Sidebar";
import { BarLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store/rootReducer";
import { toast } from "react-toastify";
import { menuItems } from "./utils";
import axiosInstance from "../apis/axiosInstance";

const StatCard = ({ icon: Icon, title, value, trend, color }: any) => (
  <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
    <div className="p-4 md:p-6">
      <div className="flex items-center justify-between space-x-3 md:space-x-4">
        <div className="flex items-center space-x-3 md:space-x-4">
          <div className={`p-2 rounded-full ${color.bg}`}>
            <Icon className={`${color.text}`} size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
            <h3 className="text-lg md:text-2xl font-bold">{value}</h3>
          </div>
        </div>
        {trend && (
          <div
            className={`flex items-center ${
              trend.isPositive ? "text-green-500" : "text-red-500"
            }`}
          >
            {trend.isPositive ? (
              <ArrowUpRight size={20} />
            ) : (
              <ArrowDownRight size={20} />
            )}
            <span className="text-sm font-medium">{trend.value}%</span>
          </div>
        )}
      </div>
    </div>
  </div>
);

const Earnings = () => {
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

  const navigate = useNavigate();
  const profileDetails = useSelector(
    (state: RootState) => state.AuthSlice.userDetails
  );

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

  const stats = earnings
    ? [
        {
          icon: IndianRupee,
          title: "Direct Referral Income",
          value: `₹${earnings.directReferralIncome.toLocaleString()}`,
          trend: null,
          color: { bg: "bg-blue-100", text: "text-blue-600" },
        },
        {
          icon: Wallet,
          title: "Indirect Referral Income",
          value: `₹${earnings.indirectReferralIncome.toLocaleString()}`,
          trend: null,
          color: { bg: "bg-green-100", text: "text-green-600" },
        },
        {
          icon: Users,
          title: "Total Referral Income",
          value: `₹${(
            earnings.directReferralIncome + earnings.indirectReferralIncome
          ).toLocaleString()}`,
          trend: null,
          color: { bg: "bg-purple-100", text: "text-purple-600" },
        },
      ]
    : [];

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
          <h1 className="text-xl font-bold">My Earnings</h1>
          <div className="w-8"></div> {/* Spacer for center alignment */}
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
            <BarLoader color="black" />
          </div>
        ) : (
          <div className="p-4 md:p-6 space-y-4 overflow-y-auto">
            {/* Desktop Header */}
            <div className="hidden md:block mb-6">
              <h1 className="text-2xl font-bold text-gray-800">My Earnings</h1>
              <p className="text-gray-500">
                Track your earnings and financial performance
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {stats.map((stat, index) => (
                <StatCard key={index} {...stat} />
              ))}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
              <button
                onClick={() => navigate("/withdraw-earnings")}
                className="p-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center space-x-2"
              >
                <Wallet size={20} />
                <span>Withdraw Earnings</span>
              </button>
              <button
                onClick={() => navigate("/earnings")}
                className="p-4 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors flex items-center justify-center space-x-2"
              >
                <IndianRupee size={20} />
                <span>View Withdrawal Requests</span>
              </button>
            </div>

            {/* Transaction History */}
            <div className="bg-white rounded-lg shadow-md">
              <div className="p-4 md:p-6">
                <h2 className="text-lg md:text-xl font-bold text-gray-800 mb-4">
                  Transaction History
                </h2>

                {/* Mobile Transaction List */}
                <div className="md:hidden space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-500 text-center">
                      No transaction data available yet.
                    </p>
                  </div>
                </div>

                {/* Desktop Transaction Table */}
                <div className="hidden md:block">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                          Date
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                          Type
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                          Amount
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td
                          className="px-4 py-8 text-center text-gray-500"
                          colSpan={4}
                        >
                          No transaction data available yet.
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Earnings;
