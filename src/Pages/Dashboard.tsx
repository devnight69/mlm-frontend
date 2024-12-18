import { useEffect, useState } from "react";
import { TreePine, Users, Link, Award, Copy, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store/rootReducer";
import { toast } from "react-toastify";

interface UserNode {
  id: string;
  name: string;
  earnings: number;
  subReferrals?: UserNode[];
}

const Dashboard = () => {
  // Mock data for MLM network
  //@ts-ignore
  const profileDetails = useSelector(
    (state: RootState) => state.AuthSlice.userDetails
  );

  //@ts-ignore
  const [networkData, setNetworkData] = useState({
    totalReferrals: 0,
    totalEarnings: 0,
    currentLevel: 0,
    networkTree: [],
    referralCode: profileDetails?.user?.referralCode,
  });

  const [showNetworkTree, setShowNetworkTree] = useState(false);
  const copyReferralCode = () => {
    navigator.clipboard.writeText(networkData.referralCode);
    toast.success("Referral code copied!");
  };

  const ReferralNetworkNode = ({ referral }: any) => (
    <div className="bg-white shadow-md rounded-lg p-4 mb-4 relative">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-bold text-lg">{referral.name}</h3>
          <p className="text-sm text-gray-500">ID: {referral.id}</p>
        </div>
        <div className="text-right">
          <p className="font-semibold text-green-600">₹{referral.earnings}</p>
          <p className="text-xs text-gray-500">Level {referral.level}</p>
        </div>
      </div>
      {referral.subReferrals && referral.subReferrals.length > 0 && (
        <div className="mt-3 border-t pt-3">
          <h4 className="text-sm font-semibold mb-2">Sub Referrals</h4>
          <div className="space-y-2">
            {referral.subReferrals.map((subReferral: any) => (
              <div
                key={subReferral.id}
                className="flex justify-between items-center bg-gray-100 p-2 rounded"
              >
                <div>
                  <p className="font-medium">{subReferral.name}</p>
                  <p className="text-xs text-gray-500">ID: {subReferral.id}</p>
                </div>
                <div className="text-right">
                  <p className="text-green-600 font-semibold">
                    ₹{subReferral.earnings}
                  </p>
                  <p className="text-xs text-gray-500">
                    Level {subReferral.level}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const generateDummyUsers = (maxNodes: number): UserNode[] => {
    const generateNode = (id: number, level: number): UserNode => {
      const subReferralCount =
        level < 3 ? Math.floor(Math.random() * 5) + 1 : 0; // Limit depth to 3 levels
      return {
        id: `User-₹{id}`,
        name: `User ₹{id}`,
        earnings: Math.floor(Math.random() * 1000) + 100, // Random earnings
        subReferrals: subReferralCount
          ? Array.from({ length: subReferralCount }, (_, idx) =>
              generateNode(id * 10 + idx + 1, level + 1)
            )
          : [],
      };
    };

    return Array.from({ length: maxNodes }, (_, idx) =>
      generateNode(idx + 1, 1)
    );
  };

  const NetworkTreeNode = ({ node }: { node: UserNode }) => {
    return (
      <div className="flex flex-col items-center relative">
        {/* Parent Node */}
        <div className="relative mb-4">
          <div className="bg-white rounded-lg shadow-lg p-4 w-32 flex flex-col items-center border border-gray-200 hover:shadow-2xl transition-shadow duration-300">
            <h3 className="text-sm font-semibold text-gray-800">{node.name}</h3>
            <p className="text-xs text-gray-500">{node.id}</p>
            <span className="text-green-500 text-xs font-semibold">
              ₹{node.earnings}
            </span>
          </div>
          {/* Connecting Line */}
          {node.subReferrals && node.subReferrals.length > 0 && (
            <div className="absolute bottom-[-16px] left-1/2 w-0.5 h-4 bg-gray-400"></div>
          )}
        </div>

        {/* Child Nodes */}
        {node.subReferrals && node.subReferrals.length > 0 && (
          <div className="flex flex-wrap justify-center space-x-4 sm:space-x-8">
            {node.subReferrals.map((subNode) => (
              <div key={subNode.id} className="relative">
                {/* Line to Parent */}
                <div className="absolute top-[-10px] left-1/2 w-0.5 h-4 bg-gray-400"></div>
                <NetworkTreeNode node={subNode} />
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const NetworkTreeModal = ({ onClose }: any) => {
    const [networkData, setNetworkData] = useState<UserNode[]>([]);

    useEffect(() => {
      const dummyUsers = generateDummyUsers(3); // 3 top-level users
      setNetworkData(dummyUsers);
    }, []);

    return (
      <div className="fixed inset-0 bg-gray-800 bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg p-6 w-full max-w-5xl max-h-[90vh] overflow-auto relative shadow-2xl">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
          >
            Close
          </button>

          {/* Header */}
          <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
            Network Hierarchy
          </h2>

          {/* Top-Level Nodes */}
          <div className="flex flex-wrap justify-center space-x-4 sm:space-x-8">
            {networkData.map((topLevelNode) => (
              <NetworkTreeNode key={topLevelNode.id} node={topLevelNode} />
            ))}
          </div>
        </div>
      </div>
    );
  };

  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-blue-50 p-6">
      <header className="bg-white shadow-md py-4 px-6 flex justify-between items-center">
        {/* Left: MLM Title */}
        <div
          className="text-xl font-bold text-gray-800 cursor-pointer"
          onClick={() => navigate("/")}
        >
          Welcome, {profileDetails?.user?.name} | Expires in 35d
        </div>

        {/* Right: Profile Section */}
        <div
          className="flex items-center space-x-2 cursor-pointer"
          onClick={() => navigate("/profile")} // Adjust the path as per your routes
        >
          <User className="text-blue-500" size={24} />
          <span className="text-gray-700 font-medium">Profile</span>
        </div>
      </header>
      <div className="container mx-auto mt-10">
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
            <Award className="text-green-500 mr-4" size={48} />
            <div>
              <h2 className="text-xl font-bold">Total Earnings</h2>
              <p className="text-3xl font-extrabold text-green-600">
                ₹{networkData.totalEarnings}
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
        </div>

        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Your Referral Network</h2>
            <div className="flex items-center">
              <span className="mr-2 font-semibold">Referral Code:</span>
              <div className="bg-gray-100 px-3 py-1 rounded flex items-center">
                <span className="mr-2">{networkData.referralCode}</span>
                <button
                  onClick={copyReferralCode}
                  className="text-blue-500 hover:text-blue-700"
                >
                  <Copy size={20} />
                </button>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {networkData.networkTree.map((referral: any) => (
              <ReferralNetworkNode key={referral.id} referral={referral} />
            ))}
          </div>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Referral Guidelines</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <Link className="text-blue-500 mb-2" size={32} />
              <h3 className="font-semibold mb-2">Referral Limit</h3>
              <p>Each user can have a maximum of 5 direct referrals.</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <Award className="text-green-500 mb-2" size={32} />
              <h3 className="font-semibold mb-2">Earning Potential</h3>
              <p>Earn commission from your network up to 3 levels deep.</p>
            </div>
          </div>
        </div>
        {/* <div className="bg-white shadow-md rounded-lg p-6 mt-6 text-center">
          <button
            onClick={() => setShowNetworkTree(true)}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center mx-auto"
          >
            <TreePine className="mr-2" size={24} />
            Visualize Full Network Hierarchy
          </button>
        </div> */}
      </div>
      {showNetworkTree && (
        <NetworkTreeModal
          networkData={networkData}
          onClose={() => setShowNetworkTree(false)}
        />
      )}
    </div>
  );
};

export default Dashboard;
