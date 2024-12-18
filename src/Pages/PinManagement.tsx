import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store/rootReducer";
import axiosInstance from "../apis/axiosInstance";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";

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

  return (
    <>
      {isLoading ? (
        <div className="flex items-center justify-center h-screen">
          <ClipLoader color="black" size={24} />
        </div>
      ) : (
        <div className="p-4 space-y-4">
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Pin Management
              </h3>
            </div>
            <div className="px-4 py-5 sm:p-6">
              {adminProfileDetails?.userDetails?.userType === "Admin" && (
                <div className="flex space-x-4 mb-4">
                  <button
                    onClick={openCreatePinDialog}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                  >
                    Create New Pin
                  </button>
                </div>
              )}

              {/* Pins Table */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Pin Code
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Validity Date
                      </th>
                      {adminProfileDetails?.userDetails?.userType ===
                        "Admin" && (
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      )}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {pins.map((pin: any) => (
                      <tr key={pin._id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {pin.pinCode}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {pin.status}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(pin.validityDate).toLocaleDateString()}
                        </td>
                        {adminProfileDetails?.userDetails?.userType ===
                          "Admin" && (
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
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
                              className={`
                          ${
                            pin.status === "used" ||
                            pin.status === "transferred"
                              ? "text-gray-400 border-gray-300 cursor-not-allowed"
                              : "text-blue-600 hover:text-blue-900 border-blue-600"
                          } 
                          border px-3 py-1 rounded
                        `}
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

          {/* Create Pin Dialog */}
          {isCreatePinDialogOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg shadow-xl p-6 w-[500px]">
                <h3 className="text-lg font-semibold mb-4">Create New Pin</h3>

                <div className="mb-4">
                  <h4 className="text-md font-medium mb-2">Select Package</h4>
                  {packages.length === 0 ? (
                    <p className="text-gray-500">Loading packages...</p>
                  ) : (
                    <div className="space-y-2">
                      {packages.map((pkg: any) => (
                        <div
                          key={pkg.id}
                          onClick={() => setSelectedPackage(pkg)}
                          className={`
                        border p-3 rounded cursor-pointer transition-all
                        ${
                          selectedPackage?.id === pkg.id
                            ? "border-blue-500 bg-blue-50 ring-2 ring-blue-300"
                            : "border-gray-300 hover:bg-gray-100"
                        }
                      `}
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="font-semibold">{pkg.productName}</p>
                              <p className="text-sm text-gray-600">
                                Price: ₹{pkg.productPrice} | Direct Income:{" "}
                                {pkg.directIncome}
                              </p>
                            </div>
                            {selectedPackage?.id === pkg.id && (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6 text-blue-500"
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

                <div className="flex justify-end space-x-2 mt-4">
                  <button
                    onClick={() => setIsCreatePinDialogOpen(false)}
                    className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    //@ts-ignore
                    onClick={() =>
                      createPin(adminDetails?.user?.id, selectedPackage?.id)
                    }
                    disabled={!selectedPackage}
                    className={`
                  px-4 py-2 rounded 
                  ${
                    selectedPackage
                      ? "bg-blue-500 text-white hover:bg-blue-600"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }
                `}
                  >
                    Create Pin
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Transfer Pin Dialog */}
          {isTransferPinDialogOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg shadow-xl p-6 w-96">
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
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => setUserDetails(null)}
                        className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
                      >
                        Back
                      </button>
                      <button
                        onClick={() => transferPin(selectedPin)}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
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
    </>
  );
};

export default PinManagement;
