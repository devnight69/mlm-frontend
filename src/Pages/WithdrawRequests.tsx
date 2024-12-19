import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axiosInstance from "../apis/axiosInstance";
import { toast } from "react-toastify";
import { RootState } from "../redux/store/rootReducer";
import { BarLoader } from "react-spinners";
import Sidebar from "../components/Sidebar";
import { menuItems } from "./utils";
import { useNavigate } from "react-router-dom";

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
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

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
        <div className="flex-1 p-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Withdrawal Requests</h2>
              {pagination && (
                <div className="text-sm text-gray-600">
                  Showing {withdrawalRequests.length} of {pagination.total}{" "}
                  requests
                </div>
              )}
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
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
        </div>
      )}
    </div>
  );
};

export default WithdrawRequests;
