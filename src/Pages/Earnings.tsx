import { useEffect, useState } from "react";
import {
  Users,
  Wallet,
  IndianRupee,
  ArrowUpRight,
  ArrowDownRight,
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
  <div className="bg-white rounded-lg shadow-md">
    <div className="p-6">
      <div className="flex items-center justify-between space-x-4">
        <div className="flex items-center space-x-4">
          <div className={`p-2 rounded-full ${color.bg}`}>
            <Icon className={`${color.text}`} size={28} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <h3 className="text-2xl font-bold">{value}</h3>
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [earnings, setEarnings] = useState<any>(null);
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

  const stats = earnings
    ? [
        {
          icon: IndianRupee,
          title: "Direct Referral Income",
          value: `₹${earnings.directReferralIncome.toLocaleString()}`,
          trend: null, // Add trend logic if needed
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

      {isLoading ? (
        <div className="flex items-center justify-center h-screen w-screen">
          <BarLoader color="black" />
        </div>
      ) : (
        <div className="space-y-4 flex-grow p-6 overflow-y-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-800">My Earnings</h1>
            <p className="text-gray-500">
              Track your earnings and financial performance
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {stats.map((stat, index) => (
              <StatCard key={index} {...stat} />
            ))}
          </div>

          {/* Transactions Table */}
          <div className="bg-white rounded-lg shadow-md">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6">
                Transaction History
              </h2>
              <p className="text-sm text-gray-500">No transaction data yet.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Earnings;
