import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store/rootReducer";
import axiosInstance from "../apis/axiosInstance";
import { toast } from "react-toastify";
import { BarLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";
import { menuItems } from "./utils";
import Sidebar from "../components/Sidebar";
import { Menu } from "lucide-react";

const PinManagement = () => {
  // State management
  const [pins, setPins] = useState<any>([]);
  const [selectedPin, setSelectedPin] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [userDetails, setUserDetails] = useState<any>(null);
  const [isCreatePinDialogOpen, setIsCreatePinDialogOpen] = useState(false);
  const [isTransferPinDialogOpen, setIsTransferPinDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [adminProfileDetails, setAdminProfileDetails] = useState<any>({});

  const adminDetails = useSelector(
    (state: RootState) => state.AuthSlice.userDetails
  );

  const getUserProfile = async () => {
    setIsLoading(true);
    try {
      const response: any = await axiosInstance.get(
        `update/user/${adminDetails?.user?.id}`,
        {
          headers: {
            Authorization: `Bearer ${adminDetails?.token}`,
          },
        }
      );
      if (response?.data?.response) {
        setIsLoading(false);
        setAdminProfileDetails(response?.data?.data);
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

  console.log(adminProfileDetails, "adminProfileDetails");
  // New state for packages
  const [packages, setPackages] = useState<any>([]);
  const [selectedPackage, setSelectedPackage] = useState<any>(null);

  // Fetch all packages
  const fetchPackages = async () => {
    try {
      const response = await axiosInstance.get("/packages/get/all", {
        headers: {
          Authorization: `Bearer ${adminDetails?.token}`,
        },
      });
      if (response?.data?.response) {
        setPackages(response.data.data);
        setIsCreatePinDialogOpen(true);
      }
    } catch (error: any) {
      console.log(error);
      toast.error(error?.response?.data?.message);
    }
  };

  // Fetch all pins
  const fetchPins = async () => {
    try {
      const response = await axiosInstance.get(
        `/pin/pins/${adminDetails?.user?.id}`,
        {
          headers: {
            Authorization: `Bearer ${adminDetails?.token}`,
          },
        }
      );
      setPins(response.data.data.pins);
    } catch (error: any) {
      console.log(error);
      toast.error(error?.response?.data?.message);
    }
  };

  // Create Pin
  const createPin = async (userId: any, packageId: any) => {
    try {
      const payload = {
        userId: userId,
        packageId: packageId,
      };

      const response: any = await axiosInstance.post("/pin/create", payload, {
        headers: {
          Authorization: `Bearer ${adminDetails?.token}`,
        },
      });
      if (response?.data?.message === "PIN generated and saved successfully") {
        toast.success(response?.data?.message);
        fetchPins();
        setIsCreatePinDialogOpen(false);
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message);
    }
  };

  const fetchUserDetailsByMobile = async () => {
    try {
      const response = await axiosInstance.get(
        `/users/user/details?mobileNumber=${mobileNumber}`,
        {
          headers: {
            Authorization: `Bearer ${adminDetails?.token}`,
          },
        }
      );
      if (response.data.response) {
        setUserDetails(response.data.data);
        setIsTransferPinDialogOpen(true);
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message);
    }
  };

  // Transfer Pin
  const transferPin = async (pinId: any) => {
    try {
      const payload = {
        pin: pinId,
        userId: userDetails?.id,
      };
      const response = await axiosInstance.post("/pin/transfer-pin", payload, {
        headers: {
          Authorization: `Bearer ${adminDetails?.token}`,
        },
      });
      if (response.data.message === "Pin transferred successfully") {
        toast.success(response.data.message);
        fetchPins();
        setIsTransferPinDialogOpen(false);
        setMobileNumber("");
        setUserDetails(null);
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message);
    }
  };

  // Fetch pins on component mount
  useEffect(() => {
    fetchPins();
  }, []);

  // Open Create Pin Dialog
  const openCreatePinDialog = () => {
    fetchPackages();
  };

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
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

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-blue-50">
      {isSidebarOpen && (
        <div className="w-full md:w-64">
          <Sidebar
            isSidebarOpen={isSidebarOpen}
            menuItems={menuItems}
            profileDetails={profileDetails}
            setIsSidebarOpen={setIsSidebarOpen}
            handleLogout={handleLogout}
          />
        </div>
      )}
      <div className="flex-1">
        <div className="p-4 md:p-8">
          <div className="p-4 md:hidden flex items-center justify-between">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 hover:bg-blue-100 rounded-lg"
            >
              <Menu size={24} />
            </button>
            <h1 className="text-xl font-bold">Pin Management</h1>
            <div className="w-8"></div> {/* Spacer for center alignment */}
          </div>

          <div className="hidden md:flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Pin Management</h2>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center h-screen w-full">
              <BarLoader color="black" />
            </div>
          ) : (
            <div className="flex-grow p-2 md:p-6 overflow-y-auto w-full">
              <div className="bg-white shadow rounded-lg">
                <div className="px-3 py-4 md:px-6 md:py-5">
                  {adminProfileDetails?.userDetails?.userType === "Admin" && (
                    <div className="flex mb-4">
                      <button
                        onClick={openCreatePinDialog}
                        className="w-full md:w-auto bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                      >
                        Create New Pin
                      </button>
                    </div>
                  )}

                  <div className="overflow-x-auto -mx-3 md:mx-0 max-h-[calc(100vh-300px)] overflow-y-auto">
                    <div className="inline-block min-w-full align-middle">
                      <div className="overflow-hidden border border-gray-200 md:rounded-lg">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-3 py-2 md:px-6 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Pin Code
                              </th>
                              <th className="px-3 py-2 md:px-6 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                              </th>
                              <th className="hidden md:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Validity Date
                              </th>
                              {adminProfileDetails?.userDetails?.userType ===
                                "Admin" && (
                                <th className="px-3 py-2 md:px-6 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Actions
                                </th>
                              )}
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200 max-h-40">
                            {pins.map((pin: any) => (
                              <tr key={pin._id}>
                                <td className="px-3 py-2 md:px-6 md:py-4 whitespace-nowrap text-sm text-gray-900">
                                  {pin.pinCode}
                                </td>
                                <td className="px-3 py-2 md:px-6 md:py-4 whitespace-nowrap text-sm text-gray-900">
                                  {pin.status}
                                </td>
                                <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  {new Date(
                                    pin.validityDate
                                  ).toLocaleDateString()}
                                </td>
                                {adminProfileDetails?.userDetails?.userType ===
                                  "Admin" && (
                                  <td className="px-3 py-2 md:px-6 md:py-4 whitespace-nowrap text-sm font-medium">
                                    <button
                                      onClick={() => {
                                        setMobileNumber("");
                                        setUserDetails(null);
                                        setIsTransferPinDialogOpen(true);
                                        setSelectedPin(pin.pinCode);
                                      }}
                                      disabled={
                                        pin.status === "used" ||
                                        pin.status === "transferred"
                                      }
                                      className={`w-full md:w-auto text-center ${
                                        pin.status === "used" ||
                                        pin.status === "transferred"
                                          ? "text-gray-400 border-gray-300 cursor-not-allowed"
                                          : "text-blue-600 hover:text-blue-900 border-blue-600"
                                      } border px-2 md:px-3 py-1 rounded`}
                                    >
                                      Transfer
                                    </button>
                                  </td>
                                )}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Create Pin Dialog */}
              {isCreatePinDialogOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                  <div className="bg-white rounded-lg shadow-xl p-4 md:p-6 w-full max-w-lg">
                    <h3 className="text-lg font-semibold mb-4">
                      Create New Pin
                    </h3>

                    <div className="mb-4">
                      <h4 className="text-md font-medium mb-2">
                        Select Package
                      </h4>
                      {packages.length === 0 ? (
                        <p className="text-gray-500">Loading packages...</p>
                      ) : (
                        <div className="space-y-2 max-h-64 overflow-y-auto">
                          {packages.map((pkg: any) => (
                            <div
                              key={pkg.id}
                              onClick={() => setSelectedPackage(pkg)}
                              className={`border p-3 rounded cursor-pointer transition-all
                            ${
                              selectedPackage?.id === pkg.id
                                ? "border-blue-500 bg-blue-50 ring-2 ring-blue-300"
                                : "border-gray-300 hover:bg-gray-100"
                            }`}
                            >
                              <div className="flex justify-between items-center">
                                <div>
                                  <p className="font-semibold">
                                    {pkg.productName}
                                  </p>
                                  <p className="text-sm text-gray-600">
                                    Price: ₹{pkg.productPrice} | Direct Income:{" "}
                                    {pkg.directIncome}
                                  </p>
                                </div>
                                {selectedPackage?.id === pkg.id && (
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6 text-blue-500 flex-shrink-0"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                  </svg>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col md:flex-row justify-end space-y-2 md:space-y-0 md:space-x-2 mt-4">
                      <button
                        onClick={() => setIsCreatePinDialogOpen(false)}
                        className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 w-full md:w-auto"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() =>
                          createPin(adminDetails?.user?.id, selectedPackage?.id)
                        }
                        disabled={!selectedPackage}
                        className={`px-4 py-2 rounded w-full md:w-auto ${
                          selectedPackage
                            ? "bg-blue-500 text-white hover:bg-blue-600"
                            : "bg-gray-300 text-gray-500 cursor-not-allowed"
                        }`}
                      >
                        Create Pin
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Transfer Pin Dialog */}
              {isTransferPinDialogOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                  <div className="bg-white rounded-lg shadow-xl p-4 md:p-6 w-full max-w-md">
                    <h3 className="text-lg font-semibold mb-4">Transfer Pin</h3>
                    {!userDetails ? (
                      <div className="space-y-4">
                        <input
                          placeholder="Enter Mobile Number"
                          value={mobileNumber}
                          onChange={(e) => setMobileNumber(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                          onClick={fetchUserDetailsByMobile}
                          className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        >
                          Find User
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="text-sm text-gray-700">
                          <p>
                            <strong>Name:</strong> {userDetails.name}
                          </p>
                          <p>
                            <strong>Mobile:</strong> {userDetails.mobileNumber}
                          </p>
                          <p>
                            <strong>Email:</strong> {userDetails.email}
                          </p>
                        </div>
                        <div className="flex flex-col md:flex-row justify-end space-y-2 md:space-y-0 md:space-x-2">
                          <button
                            onClick={() => setUserDetails(null)}
                            className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 w-full md:w-auto"
                          >
                            Back
                          </button>
                          <button
                            onClick={() => transferPin(selectedPin)}
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 w-full md:w-auto"
                          >
                            Transfer Pin
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PinManagement;
