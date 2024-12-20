import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "../redux/store/rootReducer";
import axiosInstance from "../apis/axiosInstance";
import { toast } from "react-toastify";
import { BarLoader } from "react-spinners";
import { User, Edit, MapPin, CreditCard, Save, X, Menu } from "lucide-react";
import ProfileNavigation from "./NavigationBC";
import { menuItems } from "./utils";
import Sidebar from "../components/Sidebar";

function Profile() {
  const [isLoading, setIsLoading] = useState(false);
  const [adminProfileDetails, setAdminProfileDetails] = useState<any>({
    userDetails: {},
    bankDetails: {},
    addressDetails: {},
  });
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const profileDetails = useSelector(
    (state: RootState) => state.AuthSlice.userDetails
  );

  console.log(profileDetails);

  const [formData, setFormData] = useState<any>({
    name: "",
    email: "",
    gender: "M",
    fatherName: "",
    husbandName: "",
    address: {
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      pincode: "",
      country: "",
    },
  });

  const [bankDetails, setBankDetails] = useState<any>({
    accountNumber: "",
    confirmAccountNumber: "",
    ifscCode: "",
    branchName: "",
    accountHolderName: "",
  });

  const navigate = useNavigate();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    setStateFunction?: React.Dispatch<React.SetStateAction<any>>
  ) => {
    const { name, value } = e.target;

    // If a specific setState function is provided (for bank details)
    if (setStateFunction) {
      setStateFunction((prevState: any) => ({
        ...prevState,
        [name]: value,
      }));
      return;
    }

    // Check if the input is nested in address
    if (name.startsWith("address.")) {
      const addressField = name.split(".")[1];
      setFormData((prevState: any) => ({
        ...prevState,
        address: {
          ...prevState.address,
          [addressField]: value,
        },
      }));
    } else {
      // Handle top-level fields
      setFormData((prevState: any) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

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
        setAdminProfileDetails(response?.data?.data);

        // Populate form data with existing details
        setFormData({
          name: response?.data?.data?.userDetails?.name,
          email: response?.data?.data?.userDetails?.email,
          gender: response?.data?.data?.userDetails?.gender || "M",
          fatherName: response?.data?.data?.userDetails?.fatherName || "",
          husbandName: response?.data?.data?.userDetails?.husbandName || "",
          address: {
            addressLine1:
              response?.data?.data?.addressDetails?.addressLine1 || "",
            addressLine2:
              response?.data?.data?.addressDetails?.addressLine2 || "",
            city: response?.data?.data?.addressDetails?.city || "",
            state: response?.data?.data?.addressDetails?.state || "",
            pincode: response?.data?.data?.addressDetails?.pincode || "",
            country: response?.data?.data?.addressDetails?.country || "",
          },
        });

        // Populate bank details if available
        if (response?.data?.data?.bankDetails) {
          setBankDetails({
            accountNumber:
              response?.data?.data?.bankDetails?.accountNumber || "",
            confirmAccountNumber:
              response?.data?.data?.bankDetails?.accountNumber || "",
            ifscCode: response?.data?.data?.bankDetails?.ifscCode || "",
            branchName: response?.data?.data?.bankDetails?.branchName || "",
            accountHolderName:
              response?.data?.data?.bankDetails?.accountHolderName || "",
          });
        }
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axiosInstance.put(
        `/update/user/${profileDetails?.user?.id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${profileDetails?.token}`,
          },
        }
      );

      if (response?.data?.response) {
        toast.success("Profile Updated Successfully!");
        // Optionally refresh profile details
        getUserProfile();
        setActiveSection(null);
      }
    } catch (error: any) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBankDetailsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // Validate bank details
      if (bankDetails.accountNumber !== bankDetails.confirmAccountNumber) {
        toast.error("Account numbers do not match");
        setIsLoading(false);
        return;
      }

      const response = await axiosInstance.put(
        `/update/user/${profileDetails?.user?.id}/bank-details`,
        {
          accountNumber: bankDetails?.accountNumber,
          accountHolderName: bankDetails?.accountHolderName,
          // bankName: "Sample Bank",
          branchName: bankDetails?.branchName,
          ifscCode: bankDetails?.ifscCode,
        },
        {
          headers: {
            Authorization: `Bearer ${profileDetails?.token}`,
          },
        }
      );

      if (response?.data?.response) {
        toast.success("Bank Details Updated Successfully!");
        getUserProfile();
        setActiveSection(null);
      }
    } catch (error: any) {
      console.log(error);
      toast.error(
        error?.response?.data?.message || "Failed to update bank details"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  useEffect(() => {
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    } else {
      setIsSidebarOpen(true);
    }
  }, []);
  const handleLogout = () => {
    localStorage.clear();
    toast.success("Logged out successfully!");
    navigate("/login");
  };

  return (
    <>
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

        <div className="flex-1">
          {/* Mobile Header */}
          <div className="p-4 md:hidden flex items-center justify-between">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 hover:bg-blue-100 rounded-lg"
            >
              <Menu size={24} />
            </button>
            <h1 className="text-xl font-bold">My Profile</h1>
            <div className="w-8"></div> {/* Spacer for center alignment */}
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center h-screen w-screen">
              <BarLoader color="black" />
            </div>
          ) : (
            <div className="flex-grow p-6 overflow-y-auto">
              <div className="  mx-auto ">
                <div className="bg-white shadow-2xl rounded-2xl overflow-hidden">
                  <ProfileNavigation
                    activeSection={activeSection}
                    onBack={() =>
                      activeSection ? setActiveSection(null) : navigate(-1)
                    }
                  />

                  {/* Profile Content */}
                  {!activeSection && (
                    <main className="p-6">
                      <div className="max-w-7xl mx-auto">
                        {/* Profile Header Card */}
                        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
                          <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6">
                            <div className="flex items-center space-x-4">
                              <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center text-blue-600 text-2xl font-bold">
                                {adminProfileDetails?.userDetails?.gender ===
                                "M"
                                  ? "M"
                                  : "F"}
                              </div>
                              <div className="text-white">
                                <h1 className="text-2xl font-bold">
                                  {" "}
                                  {adminProfileDetails?.userDetails?.name}
                                </h1>
                                <p className="opacity-90">
                                  {" "}
                                  {adminProfileDetails?.userDetails?.email}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Content Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Personal Information */}
                          <div className="bg-white rounded-xl shadow-sm p-6 md:col-span-2">
                            <div className="flex items-center justify-between mb-4">
                              <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                                <User className="w-5 h-5 mr-2 text-blue-500" />
                                Personal Information
                              </h2>
                              <button
                                className="text-blue-500 hover:text-blue-600"
                                onClick={() => setActiveSection("profile")}
                              >
                                <Edit className="w-5 h-5" />
                              </button>
                            </div>
                            <div className="grid md:grid-cols-2 gap-6">
                              <div>
                                <label className="text-sm text-gray-500">
                                  Full Name
                                </label>
                                <p className="text-gray-800 font-medium">
                                  {adminProfileDetails?.userDetails?.name}
                                </p>
                              </div>
                              <div>
                                <label className="text-sm text-gray-500">
                                  Email
                                </label>
                                <p className="text-gray-800 font-medium">
                                  {adminProfileDetails?.userDetails?.email}
                                </p>
                              </div>
                              <div>
                                <label className="text-sm text-gray-500">
                                  Gender
                                </label>
                                <p className="text-gray-800 font-medium">
                                  {adminProfileDetails?.userDetails?.gender ===
                                  "M"
                                    ? "Male"
                                    : "Female"}
                                </p>
                              </div>
                              <div>
                                <label className="text-sm text-gray-500">
                                  Referral Code
                                </label>
                                <p className="text-gray-800 font-medium">
                                  {
                                    adminProfileDetails?.userDetails
                                      ?.referralCode
                                  }
                                </p>
                              </div>
                              <div>
                                <label className="text-sm text-gray-500">
                                  Father's Name
                                </label>
                                <p className="text-gray-800 font-medium">
                                  {adminProfileDetails.userDetails.fatherName ||
                                    "Not Available"}
                                </p>
                              </div>
                              <div>
                                <label className="text-sm text-gray-500">
                                  Husband's Name
                                </label>
                                <p className="text-gray-800 font-medium">
                                  {adminProfileDetails.userDetails
                                    .husbandName || "Not Available"}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Address Information */}
                          <div className="bg-white rounded-xl shadow-sm p-6 md:col-span-2">
                            <div className="flex items-center justify-between mb-4">
                              <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                                <MapPin className="w-5 h-5 mr-2 text-green-500" />
                                Address Details
                              </h2>
                              <button
                                className="text-green-500 hover:text-green-600"
                                onClick={() => setActiveSection("profile")}
                              >
                                <Edit className="w-5 h-5" />
                              </button>
                            </div>
                            <div className="grid md:grid-cols-2 gap-6">
                              <div>
                                <label className="text-sm text-gray-500">
                                  Address Line 1
                                </label>
                                <p className="text-gray-800 font-medium">
                                  {adminProfileDetails?.addressDetails
                                    ?.addressLine1 || "Not Available"}
                                </p>
                              </div>
                              <div>
                                <label className="text-sm text-gray-500">
                                  Address Line 2
                                </label>
                                <p className="text-gray-800 font-medium">
                                  {adminProfileDetails?.addressDetails
                                    ?.addressLine2 || "Not Available"}
                                </p>
                              </div>
                              <div>
                                <label className="text-sm text-gray-500">
                                  City
                                </label>
                                <p className="text-gray-800 font-medium">
                                  {adminProfileDetails?.addressDetails?.city ||
                                    "Not Available"}
                                </p>
                              </div>
                              <div>
                                <label className="text-sm text-gray-500">
                                  State
                                </label>
                                <p className="text-gray-800 font-medium">
                                  {adminProfileDetails?.addressDetails?.state ||
                                    "Not Available"}
                                </p>
                              </div>
                              <div>
                                <label className="text-sm text-gray-500">
                                  Pincode
                                </label>
                                <p className="text-gray-800 font-medium">
                                  {adminProfileDetails?.addressDetails
                                    ?.pincode || "Not Available"}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Bank Details */}
                          <div className="bg-white rounded-xl shadow-sm p-6 md:col-span-2">
                            <div className="flex items-center justify-between mb-4">
                              <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                                <CreditCard className="w-5 h-5 mr-2 text-purple-500" />
                                Bank Details
                              </h2>
                              <button
                                className="text-purple-500 hover:text-purple-600"
                                onClick={() => setActiveSection("bank")}
                              >
                                <Edit className="w-5 h-5" />
                              </button>
                            </div>
                            <div className="grid md:grid-cols-2 gap-6">
                              <div>
                                <label className="text-sm text-gray-500">
                                  Account Number
                                </label>
                                <p className="text-gray-800 font-medium">
                                  {adminProfileDetails?.bankDetails
                                    ?.accountNumber || "Not Available"}
                                </p>
                              </div>
                              <div>
                                <label className="text-sm text-gray-500">
                                  Bank Name
                                </label>
                                <p className="text-gray-800 font-medium">
                                  {adminProfileDetails?.bankDetails
                                    ?.branchName || "Not Available"}
                                </p>
                              </div>
                              <div>
                                <label className="text-sm text-gray-500">
                                  IFSC Code
                                </label>
                                <p className="text-gray-800 font-medium">
                                  {adminProfileDetails?.bankDetails
                                    ?.branchName || "Not Available"}
                                </p>
                              </div>
                              <div>
                                <label className="text-sm text-gray-500">
                                  Account Holder Name
                                </label>
                                <p className="text-gray-800 font-medium">
                                  {adminProfileDetails?.bankDetails
                                    ?.accountHolderName || "Not Available"}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </main>
                  )}

                  {/* Update Profile Section */}
                  {activeSection === "profile" && (
                    <div className="p-8">
                      <h2 className="text-2xl font-bold text-blue-600 mb-6">
                        Update Profile
                      </h2>
                      <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-gray-700 font-semibold mb-2">
                              Name
                            </label>
                            <input
                              type="text"
                              name="name"
                              value={formData.name}
                              onChange={handleInputChange}
                              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-300"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-gray-700 font-semibold mb-2">
                              Email
                            </label>
                            <input
                              type="email"
                              name="email"
                              value={formData.email}
                              onChange={handleInputChange}
                              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-300"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-gray-700 font-medium mb-2">
                              Gender
                            </label>
                            <select
                              name="gender"
                              value={formData.gender}
                              onChange={handleInputChange}
                              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-300"
                              required
                            >
                              <option value="M">Male</option>
                              <option value="F">Female</option>
                              <option value="O">Other</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-gray-700 font-medium mb-2">
                              Father Name
                            </label>
                            <input
                              type="text"
                              name="fatherName"
                              value={formData.fatherName}
                              onChange={handleInputChange}
                              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-300"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-gray-700 font-medium mb-2">
                              Husband Name
                            </label>
                            <input
                              type="text"
                              name="husbandName"
                              value={formData.husbandName}
                              onChange={handleInputChange}
                              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-300"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-gray-700 font-medium mb-2">
                              Address Line 1
                            </label>
                            <input
                              type="text"
                              name="address.addressLine1"
                              value={formData.address.addressLine1}
                              onChange={handleInputChange}
                              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-300"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-gray-700 font-medium mb-2">
                              Address Line 2
                            </label>
                            <input
                              type="text"
                              name="address.addressLine2"
                              value={formData.address.addressLine2}
                              onChange={handleInputChange}
                              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-300"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-gray-700 font-medium mb-2">
                              City
                            </label>
                            <input
                              type="text"
                              name="address.city"
                              value={formData.address.city}
                              onChange={handleInputChange}
                              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-300"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-gray-700 font-medium mb-2">
                              State
                            </label>
                            <input
                              type="text"
                              name="address.state"
                              value={formData.address.state}
                              onChange={handleInputChange}
                              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-300"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-gray-700 font-medium mb-2">
                              Pincode
                            </label>
                            <input
                              type="text"
                              name="address.pincode"
                              value={formData.address.pincode}
                              onChange={handleInputChange}
                              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-300"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-gray-700 font-medium mb-2">
                              Country
                            </label>
                            <input
                              type="text"
                              name="address.country"
                              value={formData.address.country}
                              onChange={handleInputChange}
                              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-300"
                              required
                            />
                          </div>
                        </div>
                        <div className="flex space-x-4 mt-6">
                          <button
                            type="submit"
                            className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition flex items-center justify-center"
                          >
                            <Save className="mr-2" /> Save Changes
                          </button>
                          <button
                            type="button"
                            onClick={() => setActiveSection(null)}
                            className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition flex items-center justify-center"
                          >
                            <X className="mr-2" /> Cancel
                          </button>
                        </div>
                      </form>
                    </div>
                  )}

                  {/* Update Bank Details Section */}
                  {activeSection === "bank" && (
                    <div className="p-8">
                      <h2 className="text-2xl font-bold text-blue-600 mb-6">
                        Update Bank Details
                      </h2>
                      <form
                        onSubmit={handleBankDetailsSubmit}
                        className="space-y-6"
                      >
                        <div className="grid md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-gray-700 font-semibold mb-2">
                              Account Number
                            </label>
                            <input
                              type="text"
                              name="accountNumber"
                              value={bankDetails.accountNumber}
                              onChange={(e) =>
                                handleInputChange(e, setBankDetails)
                              }
                              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-300"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-gray-700 font-semibold mb-2">
                              Confirm Account Number
                            </label>
                            <input
                              type="text"
                              name="confirmAccountNumber"
                              value={bankDetails.confirmAccountNumber}
                              onChange={(e) =>
                                handleInputChange(e, setBankDetails)
                              }
                              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-300"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-gray-700 font-medium mb-2">
                              IFSC Code
                            </label>

                            <input
                              type="text"
                              name="ifscCode"
                              value={bankDetails.ifscCode}
                              onChange={(e) =>
                                handleInputChange(e, setBankDetails)
                              }
                              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-300"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-gray-700 font-medium mb-2">
                              Branch Name
                            </label>
                            <input
                              type="text"
                              name="branchName"
                              value={bankDetails.branchName}
                              onChange={(e) =>
                                handleInputChange(e, setBankDetails)
                              }
                              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-300"
                              required
                            />
                          </div>
                          <div className="md:col-span-2">
                            <label className="block text-gray-700 font-medium mb-2">
                              Account Holder Name
                            </label>
                            <input
                              type="text"
                              name="accountHolderName"
                              value={bankDetails.accountHolderName}
                              onChange={(e) =>
                                handleInputChange(e, setBankDetails)
                              }
                              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-300"
                              required
                            />
                          </div>
                        </div>
                        <div className="flex space-x-4 mt-6">
                          <button
                            type="submit"
                            className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition flex items-center justify-center"
                          >
                            <Save className="mr-2" /> Update Bank Details
                          </button>
                          <button
                            type="button"
                            onClick={() => setActiveSection(null)}
                            className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition flex items-center justify-center"
                          >
                            <X className="mr-2" /> Cancel
                          </button>
                        </div>
                      </form>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Profile;
