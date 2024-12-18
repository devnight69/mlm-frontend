import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { resetAuthSlice } from "../redux/slices/AuthSlice";
import { useNavigate } from "react-router-dom";
import { RootState } from "../redux/store/rootReducer";
import axiosInstance from "../apis/axiosInstance";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";

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

  const dispatch = useDispatch();
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

  return (
    <>
      {isLoading ? (
        <div className="flex items-center justify-center h-screen">
          <ClipLoader color="black" size={24} />
        </div>
      ) : (
        <div className="p-6 bg-blue-50 min-h-screen">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold text-blue-600 mb-6">Profile</h1>

            {/* Profile Details View */}
            {!activeSection && (
              <div>
                {/* Profile Picture / Basic Info */}
                <div className="flex items-center space-x-6 mb-6 p-4 border rounded-lg shadow-md bg-white">
                  {/* Profile Image or Gender Placeholder */}
                  <div className="w-24 h-24 rounded-full bg-blue-200 flex items-center justify-center text-4xl text-blue-800 font-bold shadow">
                    {adminProfileDetails?.userDetails?.gender === "M"
                      ? "M"
                      : "F"}
                  </div>

                  {/* User Information */}
                  <div className="space-y-2">
                    {adminProfileDetails?.userDetails?.name && (
                      <p className="text-gray-600  text-lg">
                        <span className="text-gray-800 font-semibold">
                          Name:
                        </span>{" "}
                        {adminProfileDetails.userDetails.name}
                      </p>
                    )}
                    {adminProfileDetails?.userDetails?.email && (
                      <p className="text-gray-600">
                        <span className="font-semibold text-gray-800">
                          Email:
                        </span>{" "}
                        {adminProfileDetails.userDetails.email}
                      </p>
                    )}
                    {adminProfileDetails?.userDetails?.mobileNumber && (
                      <p className="text-gray-600">
                        <span className="font-semibold text-gray-800">
                          Mobile Number:
                        </span>{" "}
                        {adminProfileDetails.userDetails.mobileNumber}
                      </p>
                    )}
                    {adminProfileDetails?.userDetails?.referralCode && (
                      <p className="text-gray-600">
                        <span className="font-semibold text-gray-800">
                          Referral Code:
                        </span>{" "}
                        {adminProfileDetails.userDetails.referralCode}
                      </p>
                    )}
                    {adminProfileDetails?.userDetails?.fatherName && (
                      <p className="text-gray-600">
                        <span className="font-semibold text-gray-800">
                          Father's Name:
                        </span>{" "}
                        {adminProfileDetails.userDetails.fatherName}
                      </p>
                    )}
                    {adminProfileDetails?.userDetails?.husbandName && (
                      <p className="text-gray-600">
                        <span className="font-semibold text-gray-800">
                          Husband's Name:
                        </span>{" "}
                        {adminProfileDetails.userDetails.husbandName}
                      </p>
                    )}
                  </div>
                </div>

                {/* Address Details */}
                <div className="mt-4">
                  <h2 className="text-xl font-bold text-blue-600">Address</h2>
                  {adminProfileDetails?.addressDetails?.addressLine1 ? (
                    <div className="text-gray-700 mt-2">
                      <p>
                        <span className="font-semibold">Address Line 1:</span>{" "}
                        {adminProfileDetails.addressDetails.addressLine1}
                      </p>
                      {adminProfileDetails?.addressDetails?.addressLine2 && (
                        <p>
                          <span className="font-semibold">Address Line 2:</span>{" "}
                          {adminProfileDetails.addressDetails.addressLine2}
                        </p>
                      )}
                      {adminProfileDetails?.addressDetails?.city && (
                        <p>
                          <span className="font-semibold">City:</span>{" "}
                          {adminProfileDetails.addressDetails.city}
                        </p>
                      )}
                      {adminProfileDetails?.addressDetails?.state && (
                        <p>
                          <span className="font-semibold">State:</span>{" "}
                          {adminProfileDetails.addressDetails.state}
                        </p>
                      )}
                      {adminProfileDetails?.addressDetails?.pincode && (
                        <p>
                          <span className="font-semibold">Pincode:</span>{" "}
                          {adminProfileDetails.addressDetails.pincode}
                        </p>
                      )}
                      {adminProfileDetails?.addressDetails?.country && (
                        <p>
                          <span className="font-semibold">Country:</span>{" "}
                          {adminProfileDetails.addressDetails.country}
                        </p>
                      )}
                    </div>
                  ) : (
                    <p className="text-gray-700">No Address Available</p>
                  )}
                </div>

                {/* Bank Details */}
                <div className="mt-4">
                  <h2 className="text-xl font-bold text-blue-600">
                    Bank Details
                  </h2>
                  {adminProfileDetails?.bankDetails &&
                  Object.keys(adminProfileDetails?.bankDetails).length > 0 ? (
                    <div className="text-gray-700 mt-2 space-y-2">
                      {adminProfileDetails?.bankDetails?.accountNumber && (
                        <p>
                          <span className="font-semibold">Account Number:</span>{" "}
                          {adminProfileDetails.bankDetails.accountNumber}
                        </p>
                      )}
                      {adminProfileDetails?.bankDetails?.ifscCode && (
                        <p>
                          <span className="font-semibold">IFSC Code:</span>{" "}
                          {adminProfileDetails.bankDetails.ifscCode}
                        </p>
                      )}
                      {adminProfileDetails?.bankDetails?.branchName && (
                        <p>
                          <span className="font-semibold">Branch Name:</span>{" "}
                          {adminProfileDetails.bankDetails.branchName}
                        </p>
                      )}
                      {adminProfileDetails?.bankDetails?.accountHolderName && (
                        <p>
                          <span className="font-semibold">Account Holder:</span>{" "}
                          {adminProfileDetails.bankDetails.accountHolderName}
                        </p>
                      )}
                    </div>
                  ) : (
                    <p className="text-gray-700 mt-2">
                      No Bank Details Available
                    </p>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="mt-6 space-x-4">
                  <button
                    onClick={() => setActiveSection("profile")}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 focus:ring focus:ring-blue-300"
                  >
                    Update Profile
                  </button>
                  <button
                    onClick={() => setActiveSection("bank")}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 focus:ring focus:ring-blue-300"
                  >
                    Update Bank Details
                  </button>
                  <button
                    onClick={() => navigate("/pin-management")}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 focus:ring focus:ring-blue-300"
                  >
                    Pin Management
                  </button>
                  <button
                    onClick={() => {
                      dispatch(resetAuthSlice());
                      navigate("/login");
                    }}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 focus:ring focus:ring-blue-300"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}

            {/* Update Profile and Address Section */}
            {activeSection === "profile" && (
              <form onSubmit={handleSubmit} className="space-y-6">
                <h2 className="text-2xl font-bold text-blue-600 mb-4">
                  Update Profile & Address
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Personal Information */}
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-blue-200 p-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-blue-200 p-2"
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
                      className="w-full border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-blue-200 p-2"
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
                      className="w-full border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-blue-200 p-2"
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
                      className="w-full border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-blue-200 p-2"
                    />
                  </div>

                  {/* Address Information */}
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Address Line 1
                    </label>
                    <input
                      type="text"
                      name="address.addressLine1"
                      value={formData.address.addressLine1}
                      onChange={handleInputChange}
                      className="w-full border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-blue-200 p-2"
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
                      className="w-full border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-blue-200 p-2"
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
                      className="w-full border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-blue-200 p-2"
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
                      className="w-full border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-blue-200 p-2"
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
                      className="w-full border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-blue-200 p-2"
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
                      className="w-full border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-blue-200 p-2"
                      required
                    />
                  </div>

                  {/* Form Submit Buttons */}
                  <div className="flex space-x-4 mt-6">
                    <button
                      type="submit"
                      className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 focus:ring focus:ring-blue-300"
                      disabled={isLoading}
                    >
                      {isLoading ? "Updating..." : "Update Profile & Address"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveSection(null)}
                      className="w-full bg-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-400"
                      disabled={isLoading}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </form>
            )}

            {/* Update Bank Details Section */}
            {activeSection === "bank" && (
              <form onSubmit={handleBankDetailsSubmit} className="space-y-6">
                <h2 className="text-2xl font-bold text-blue-600 mb-4">
                  Update Bank Details
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Account Number
                    </label>
                    <input
                      type="text"
                      name="accountNumber"
                      value={bankDetails.accountNumber}
                      onChange={(e) => handleInputChange(e, setBankDetails)}
                      className="w-full border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-blue-200 p-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Confirm Account Number
                    </label>
                    <input
                      type="text"
                      name="confirmAccountNumber"
                      value={bankDetails.confirmAccountNumber}
                      onChange={(e) => handleInputChange(e, setBankDetails)}
                      className="w-full border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-blue-200 p-2"
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
                      onChange={(e) => handleInputChange(e, setBankDetails)}
                      className="w-full border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-blue-200 p-2"
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
                      onChange={(e) => handleInputChange(e, setBankDetails)}
                      className="w-full border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-blue-200 p-2"
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
                      onChange={(e) => handleInputChange(e, setBankDetails)}
                      className="w-full border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-blue-200 p-2"
                      required
                    />
                  </div>
                </div>
                <div className="flex space-x-4 mt-6">
                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 focus:ring focus:ring-blue-300"
                  >
                    Update Bank Details
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveSection(null)}
                    className="w-full bg-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default Profile;
