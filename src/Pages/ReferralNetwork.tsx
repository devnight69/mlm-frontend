import { useEffect, useState } from "react";
import { BarLoader } from "react-spinners";
import { ChevronDown, ChevronRight, Menu, Users } from "lucide-react";
import Sidebar from "../components/Sidebar";
import axiosInstance from "../apis/axiosInstance";
import { menuItems } from "./utils";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store/rootReducer";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const TreeNode = ({
  user,
  level = 0,
  onExpand,
  expandedNodes,
  loading,
  isMobile,
}: any) => {
  const isExpanded = expandedNodes.includes(user.referralCode);
  const hasChildren = user.referrals && user.referrals.length > 0;

  return (
    <div className={`flex flex-col items-center ${isMobile ? "w-full" : ""}`}>
      <div className="relative w-full">
        {/* Vertical line from parent */}
        {level > 0 && !isMobile && (
          <div className="absolute h-8 w-px bg-gray-300 -top-8 left-1/2 transform -translate-x-1/2" />
        )}

        {/* Node content */}
        <div
          className={`flex items-center space-x-2 py-2 px-4 cursor-pointer hover:bg-blue-50 rounded border border-gray-200 shadow-sm bg-white
            ${isMobile ? "w-full mt-2" : ""}`}
          style={isMobile ? { marginLeft: `${level * 1.5}rem` } : {}}
          onClick={() => onExpand(user.referralCode)}
        >
          {loading === user.referralCode ? (
            <div className="w-4 h-4">
              <BarLoader color="black" width={20} height={2} />
            </div>
          ) : (
            <div className="w-4">
              {hasChildren &&
                (isExpanded ? (
                  <ChevronDown size={16} />
                ) : (
                  <ChevronRight size={16} />
                ))}
            </div>
          )}
          <div className="flex items-center space-x-2">
            <div className="p-1 rounded-full bg-purple-100">
              <Users size={16} className="text-purple-600" />
            </div>
            <span className="text-sm font-medium">{user.name}</span>
          </div>
        </div>
      </div>

      {/* Children container */}
      {isExpanded && hasChildren && (
        <div
          className={`relative ${
            isMobile ? "w-full" : "mt-8 flex flex-row space-x-8"
          }`}
        >
          {/* Horizontal line to children - only show on desktop */}
          {!isMobile && user.referrals.length > 1 && (
            <div
              className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-4 h-px bg-gray-300"
              style={{
                width: `${(user.referrals.length - 1) * 8}rem`,
              }}
            />
          )}

          {user.referrals.map((referral: any) => (
            <TreeNode
              key={referral.referralCode}
              user={referral}
              level={level + 1}
              onExpand={onExpand}
              expandedNodes={expandedNodes}
              loading={loading}
              isMobile={isMobile}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const ReferralNetwork = () => {
  const [referralTree, setReferralTree] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [expandedNodes, setExpandedNodes] = useState<any>([]);
  const [loadingNode, setLoadingNode] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setIsSidebarOpen(!mobile);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    } else {
      setIsSidebarOpen(true);
    }
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

  const fetchReferrals = async (referralCode: any) => {
    setLoadingNode(referralCode);
    try {
      const response = await axiosInstance.get(
        `/update/user/${referralCode}/users`,
        {
          headers: {
            Authorization: `Bearer ${profileDetails?.token}`,
          },
        }
      );
      if (response?.data?.response) {
        return response.data.data;
      }
      return [];
    } catch (error) {
      console.error("Error fetching referrals:", error);
      return [];
    } finally {
      setLoadingNode(null);
    }
  };

  const handleExpand = async (referralCode: any) => {
    if (expandedNodes.includes(referralCode)) {
      setExpandedNodes(
        expandedNodes.filter((code: any) => code !== referralCode)
      );
      return;
    }

    setExpandedNodes([...expandedNodes, referralCode]);

    const updateTreeNode = async (nodes: any) => {
      for (let i = 0; i < nodes.length; i++) {
        if (nodes[i].referralCode === referralCode) {
          if (!nodes[i].referrals) {
            const referrals = await fetchReferrals(referralCode);
            nodes[i].referrals = referrals;
            setReferralTree([...referralTree]);
          }
        } else if (nodes[i].referrals) {
          await updateTreeNode(nodes[i].referrals);
        }
      }
    };

    await updateTreeNode(referralTree);
  };

  useEffect(() => {
    const loadInitialData = async () => {
      setIsLoading(true);
      try {
        const initialReferrals = await fetchReferrals(
          profileDetails?.user?.referralCode
        );
        setReferralTree(initialReferrals);
      } catch (error) {
        console.error("Error loading initial data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialData();
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

      <div className="flex-grow p-4 md:p-6 overflow-y-auto">
        <div className="p-4 md:hidden flex items-center justify-between">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 hover:bg-blue-100 rounded-lg"
          >
            <Menu size={24} />
          </button>

          <h1 className="text-xl font-bold"> My Referral Network</h1>
        </div>

        <div className="bg-white rounded-lg shadow-md">
          <div className="p-4 md:p-6">
            {isLoading ? (
              <div className="flex justify-center py-8">
                <BarLoader color="black" />
              </div>
            ) : referralTree.length > 0 ? (
              <div className={`mt-4 ${!isMobile && "flex justify-center"}`}>
                <div
                  className={`${
                    isMobile ? "w-full" : "inline-flex flex-col items-center"
                  }`}
                >
                  {/* Root node (current user) */}
                  <div
                    className={`${
                      isMobile ? "w-full" : ""
                    } mb-8 py-2 px-4 rounded border border-gray-200 shadow-sm bg-white`}
                  >
                    <div className="flex items-center space-x-2">
                      <div className="p-1 rounded-full bg-blue-100">
                        <Users size={16} className="text-blue-600" />
                      </div>
                      <span className="text-sm font-medium">
                        {profileDetails?.user?.name}
                      </span>
                    </div>
                  </div>
                  {/* Connecting line - only show on desktop */}
                  {!isMobile && referralTree.length > 0 && (
                    <div className="h-8 w-px bg-gray-300" />
                  )}
                  {/* First level referrals */}
                  <div
                    className={`${
                      isMobile ? "w-full" : "flex flex-row space-x-8"
                    }`}
                  >
                    {referralTree
                      .slice(0, isMobile ? undefined : 5)
                      .map((user: any) => (
                        <TreeNode
                          key={user.referralCode}
                          user={user}
                          onExpand={handleExpand}
                          expandedNodes={expandedNodes}
                          loading={loadingNode}
                          isMobile={isMobile}
                        />
                      ))}
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">
                No referrals found in your network.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReferralNetwork;
