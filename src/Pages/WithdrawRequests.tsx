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

interface WithdrawalRequest {
  _id: string;
  user: {
    _id: string;
    name: string;
    email: string;
  };
  amountRequested: number;
  status: "pending" | "approved" | "denied";
  deductionAmount: number;
  netAmount: number;
  createdAt: string;
  updatedAt: string;
}

interface PaginationInfo {
  total: number;
  page: number;
  pages: number;
  limit: number;
}

const WithdrawRequests = () => {
  const [withdrawalRequests, setWithdrawalRequests] = useState<
    WithdrawalRequest[]
  >([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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

  const fetchWithdrawalRequests = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get(
        "/withdraw/withdrawal/requests",
        {
          headers: {
            Authorization: `Bearer ${profileDetails?.token}`,
          },
        }
      );
      if (response?.data?.response) {
        setWithdrawalRequests(response.data.data.withdrawalRequests);
        setPagination(response.data.data.pagination);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch withdrawal requests");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWithdrawalRequests();
  }, []);

  const handleStatusUpdate = async (
    withdrawalRequestId: string,
    status: "approved" | "denied"
  ) => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.post(
        "/withdraw/withdrawal/approve-or-deny",
        {
          withdrawalRequestId,
          status,
        },
        {
          headers: {
            Authorization: `Bearer ${profileDetails?.token}`,
          },
        }
      );

      if (response?.data?.response) {
        toast.success(`Withdrawal request ${status} successfully`);
        fetchWithdrawalRequests();
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update withdrawal status");
    } finally {
      setIsLoading(false);
    }
  };

  const RequestCard = ({ request }: { request: WithdrawalRequest }) => (
    <div className="bg-white p-4 rounded-lg shadow mb-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-medium">{request.user.name}</h3>
        <span
          className={`px-2 py-1 rounded-full text-xs ${
            request.status === "pending"
              ? "bg-yellow-100 text-yellow-800"
              : request.status === "approved"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {request.status}
        </span>
      </div>
      <div className="text-sm text-gray-600 mb-2">{request.user.email}</div>
      <div className="grid grid-cols-2 gap-2 text-sm mb-3">
        <div>
          <div className="text-gray-600">Amount:</div>
          <div>₹{request.amountRequested.toFixed(2)}</div>
        </div>
        <div>
          <div className="text-gray-600">Deduction:</div>
          <div>₹{request.deductionAmount.toFixed(2)}</div>
        </div>
        <div>
          <div className="text-gray-600">Net Amount:</div>
          <div>₹{request.netAmount.toFixed(2)}</div>
        </div>
        <div>
          <div className="text-gray-600">Date:</div>
          <div>{new Date(request.createdAt).toLocaleDateString()}</div>
        </div>
      </div>
      {request.status === "pending" && (
        <div className="flex space-x-2">
          <button
            onClick={() => handleStatusUpdate(request._id, "approved")}
            className="flex-1 px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition"
          >
            Approve
          </button>
          <button
            onClick={() => handleStatusUpdate(request._id, "denied")}
            className="flex-1 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
          >
            Deny
          </button>
        </div>
      )}
    </div>
  );

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
        <div className="p-4 md:p-8">
          {/* Mobile Header */}
          <div className="px-4 pb-4 md:hidden flex items-center justify-between">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 hover:bg-blue-100 rounded-lg"
            >
              <Menu size={24} />
            </button>
            <h1 className="text-xl font-bold">Withdraw Requests</h1>
            <div className="w-8"></div> {/* Spacer for center alignment */}
          </div>

          {/* Desktop Header */}
          <div className="hidden md:flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Withdrawal Requests</h2>
            {pagination && (
              <div className="text-sm text-gray-600">
                Showing {withdrawalRequests.length} of {pagination.total}{" "}
                requests
              </div>
            )}
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <BarLoader color="black" />
            </div>
          ) : (
            <>
              {/* Mobile View */}
              <div className="md:hidden">
                {withdrawalRequests.map((request) => (
                  <RequestCard key={request._id} request={request} />
                ))}
              </div>

              {/* Desktop View */}
              <div className="hidden md:block bg-white rounded-lg shadow-md p-6">
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                          User
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                          Email
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                          Amount
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                          Deduction
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                          Net Amount
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {withdrawalRequests.map((request) => (
                        <tr key={request._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm text-gray-800">
                            {request.user.name}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-800">
                            {request.user.email}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-800">
                            ₹{request.amountRequested.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-800">
                            ₹{request.deductionAmount.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-800">
                            ₹{request.netAmount.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-800">
                            {new Date(request.createdAt).toLocaleString()}
                          </td>
                          <td className="px-6 py-4 text-sm">
                            <span
                              className={`px-2 py-1 rounded-full text-xs ${
                                request.status === "pending"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : request.status === "approved"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {request.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm">
                            {request.status === "pending" && (
                              <div className="space-x-2">
                                <button
                                  onClick={() =>
                                    handleStatusUpdate(request._id, "approved")
                                  }
                                  className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition"
                                >
                                  Approve
                                </button>
                                <button
                                  onClick={() =>
                                    handleStatusUpdate(request._id, "denied")
                                  }
                                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
                                >
                                  Deny
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {withdrawalRequests.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      No withdrawal requests found
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default WithdrawRequests;
