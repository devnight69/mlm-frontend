import { useEffect, useState } from "react";
import {
  Users,
  Menu,
  TreePine,
  Award,
  Link,
  MedalIcon,
  Copy,
  Gift,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { RootState } from "../redux/store/rootReducer";
import { menuItems } from "./utils";
import Sidebar from "../components/Sidebar";
import axiosInstance from "../apis/axiosInstance";
import { BarLoader } from "react-spinners";

// Existing components from previous dashboard can be integrated here
const DashboardStats = (adminProfileDetails: any) => {
  // const profileDetails = useSelector((state:RootState) => state.AuthSlice.userDetails);
  console.log(adminProfileDetails);
  const [networkData] = useState({
    totalReferrals: 5,
    totalEarnings: 15500,
    rank: adminProfileDetails?.adminProfileDetails?.rank,
    currentLevel: adminProfileDetails?.adminProfileDetails?.level,
    referralCode: adminProfileDetails?.adminProfileDetails?.referralCode,
  });

  const copyReferralCode = () => {
    navigator.clipboard.writeText(networkData.referralCode);
    toast.success("Referral code copied!");
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="bg-white shadow-md rounded-lg p-6 flex items-center">
        <Users className="text-blue-500 mr-4" size={48} />
        <div>
          <h2 className="text-xl font-bold">Total Referrals</h2>
          <p className="text-3xl font-extrabold text-blue-600">
            {networkData.totalReferrals}
          </p>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6 flex items-center">
        <MedalIcon className="text-purple-500 mr-4" size={48} />
        <div>
          <h2 className="text-xl font-bold">Rank</h2>
          <p className="text-3xl font-extrabold text-purple-600">
            {networkData.rank}
          </p>
        </div>
      </div>
      <div className="bg-white shadow-md rounded-lg p-6 flex items-center">
        <TreePine className="text-purple-500 mr-4" size={48} />
        <div>
          <h2 className="text-xl font-bold">Network Level</h2>
          <p className="text-3xl font-extrabold text-purple-600">
            {networkData.currentLevel}
          </p>
        </div>
      </div>
      <div className="bg-white shadow-md rounded-lg p-6 flex items-center">
        <Gift className="text-purple-500 mr-4" size={48} />
        <div className="flex flex-col">
          <h2 className="text-xl font-bold">Your Referral Code:</h2>
          <div className="text-xl flex flex-row gap-2 font-medium items-center">
            <p>{networkData.referralCode} </p>
            <button onClick={copyReferralCode} className="">
              <Copy size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const navigate = useNavigate();
  const profileDetails = useSelector(
    (state: RootState) => state.AuthSlice.userDetails
  );

  const handleLogout = () => {
    localStorage.clear();
    toast.success("Logged out successfully!");
    navigate("/login");
  };

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [adminProfileDetails, setAdminProfileDetails] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    } else {
      setIsSidebarOpen(true);
    }
  }, []);

  const getUserProfile = async () => {
    setIsLoading(true);
    try {
      const response: any = await axiosInstance.get(
        `update/user/${profileDetails?.user?.id}`,
        {
          headers: {
            Authorization: `Bearer ${profileDetails?.token}`,
          },
        }
      );
      console.log(response, "Res");
      if (response?.data?.response) {
        setIsLoading(false);
        setAdminProfileDetails(response?.data?.data?.userDetails);
      }
    } catch (error: any) {
      setIsLoading(false);
      console.log(error);
      toast.error("Failed to fetch profile details");
    }
  };

  useEffect(() => {
    getUserProfile();
  }, []);

  return (
    <div className="flex min-h-screen bg-blue-50">
      {isSidebarOpen && (
        <Sidebar
          isSidebarOpen={isSidebarOpen}
          menuItems={menuItems}
          profileDetails={profileDetails}
          setIsSidebarOpen={setIsSidebarOpen}
          handleLogout={handleLogout}
        />
      )}

      {isLoading ? (
        <div className="flex items-center justify-center h-screen w-screen">
          <BarLoader color="black" />
        </div>
      ) : (
        <div className="flex-grow p-6 overflow-y-auto">
          {/* Mobile Header with Sidebar Toggle */}
          <header className="md:hidden flex justify-between items-center mb-6">
            <button onClick={() => setIsSidebarOpen(true)}>
              <Menu size={24} />
            </button>
            <div className="text-xl font-bold">Dashboard</div>
            <div className="w-6"></div>
          </header>

          {/* Main Dashboard Content */}
          <div className="space-y-6">
            <DashboardStats adminProfileDetails={adminProfileDetails} />

            {/* Other Dashboard Sections */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Referral Guidelines */}
              <div className="bg-white shadow-md rounded-lg p-6">
                <h2 className="text-2xl font-bold mb-4">Referral Guidelines</h2>
                <div className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg flex items-start">
                    <Link className="text-blue-500 mr-3 mt-1" size={32} />
                    <div>
                      <h3 className="font-semibold mb-2">Referral Structure</h3>
                      <p>
                        You can refer as many people as you want! Your first 5
                        referrals will be placed in your{" "}
                        <strong>first level</strong>. If you refer more than 5
                        people, they will be placed in your{" "}
                        <strong>second level</strong>, and you’ll also earn
                        commissions from them.
                      </p>
                    </div>
                  </div>

                  <div className="bg-green-50 p-4 rounded-lg flex items-start">
                    <Award className="text-green-500 mr-3 mt-1" size={32} />
                    <div>
                      <h3 className="font-semibold mb-2">Earning Potential</h3>
                      <p>
                        Earn commission from your network up to 10th levels
                        deep.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
