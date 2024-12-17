import { useState } from "react";

function Profile() {
  //@ts-ignore
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [activeSection, setActiveSection] = useState(null);

  const [profile, setProfile] = useState({
    gender: "M", // Dummy gender, can toggle M/F
    husbandOrFatherName: "John Doe",
    email: "johndoe@example.com",
    password: "********",
  });

  const [address, setAddress] = useState<any>({
    addressLine: "123 Main St",
    state: "California",
    district: "Los Angeles",
    pin: "90001",
    country: "USA",
    landmark: "Near Central Park",
  });

  const [bankDetails, setBankDetails] = useState<any>({
    accountNumber: "1234567890",
    confirmAccountNumber: "1234567890",
    ifsc: "ABC123456",
    branchName: "Downtown Branch",
    accountHolderName: "John Doe",
  });

  const handleInputChange = (e: any, setState: any) => {
    const { name, value } = e.target;
    setState((prevState: any) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <div className="p-6 bg-blue-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-blue-600 mb-6">Profile</h1>

        {/* Show Profile Details */}
        {!activeSection && (
          <div>
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-24 h-24 rounded-full bg-blue-200 flex items-center justify-center text-4xl text-blue-800 font-bold">
                {profile.gender === "M" ? "M" : "F"}
              </div>
              <div>
                <p className="text-gray-800 font-medium text-lg">
                  Name: {profile.husbandOrFatherName}
                </p>
                <p className="text-gray-600 font-medium">
                  Email: {profile.email}
                </p>
              </div>
            </div>

            <div className="mt-4">
              <h2 className="text-xl font-bold text-blue-600">Address</h2>
              <p className="text-gray-700 mt-2">{address.addressLine}</p>
              <p className="text-gray-700">
                {address.district}, {address.state}, {address.pin}
              </p>
              <p className="text-gray-700">{address.country}</p>
              <p className="text-gray-700">Landmark: {address.landmark}</p>
            </div>

            <div className="mt-4">
              <h2 className="text-xl font-bold text-blue-600">Bank Details</h2>
              <p className="text-gray-700 mt-2">
                Account Number: {bankDetails.accountNumber}
              </p>
              <p className="text-gray-700">IFSC: {bankDetails.ifsc}</p>
              <p className="text-gray-700">Branch: {bankDetails.branchName}</p>
              <p className="text-gray-700">
                Account Holder: {bankDetails.accountHolderName}
              </p>
            </div>

            <div className="mt-6 space-x-4">
              <button
                //@ts-ignore
                onClick={() => setActiveSection("profile")}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 focus:ring focus:ring-blue-300"
              >
                Update Profile
              </button>
              <button
                //@ts-ignore
                onClick={() => setActiveSection("address")}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 focus:ring focus:ring-blue-300"
              >
                Update Address
              </button>
              <button
                //@ts-ignore
                onClick={() => setActiveSection("bank")}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 focus:ring focus:ring-blue-300"
              >
                Update Bank Details
              </button>
            </div>
          </div>
        )}

        {/* Update Profile Section */}
        {activeSection === "profile" && (
          <div>
            <h2 className="text-xl font-bold text-blue-600 mb-4">
              Update Profile
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 font-medium">
                  Husband/Father Name
                </label>
                <input
                  type="text"
                  name="husbandOrFatherName"
                  value={profile.husbandOrFatherName}
                  onChange={(e) => handleInputChange(e, setProfile)}
                  className="w-full border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-blue-200 p-2"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium">Email</label>
                <input
                  type="email"
                  name="email"
                  value={profile.email}
                  onChange={(e) => handleInputChange(e, setProfile)}
                  className="w-full border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-blue-200 p-2"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={profile.password}
                  onChange={(e) => handleInputChange(e, setProfile)}
                  className="w-full border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-blue-200 p-2"
                />
              </div>
            </div>
            <button
              onClick={() => setActiveSection(null)}
              className="mt-6 w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 focus:ring focus:ring-blue-300"
            >
              Save Profile
            </button>
          </div>
        )}

        {/* Update Address Section */}
        {activeSection === "address" && (
          <div>
            <h2 className="text-xl font-bold text-blue-600 mb-4">
              Update Address
            </h2>
            <div className="space-y-4">
              {Object.keys(address).map((key) => (
                <div key={key}>
                  <label className="block text-gray-700 font-medium capitalize">
                    {key.replace(/([A-Z])/g, " $1")}
                  </label>
                  <input
                    type="text"
                    name={key}
                    value={address[key]}
                    onChange={(e) => handleInputChange(e, setAddress)}
                    className="w-full border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-blue-200 p-2"
                  />
                </div>
              ))}
            </div>
            <button
              onClick={() => setActiveSection(null)}
              className="mt-6 w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 focus:ring focus:ring-blue-300"
            >
              Save Address
            </button>
          </div>
        )}

        {/* Update Bank Details Section */}
        {activeSection === "bank" && (
          <div>
            <h2 className="text-xl font-bold text-blue-600 mb-4">
              Update Bank Details
            </h2>
            <div className="space-y-4">
              {Object.keys(bankDetails).map((key) => (
                <div key={key}>
                  <label className="block text-gray-700 font-medium capitalize">
                    {key.replace(/([A-Z])/g, " $1")}
                  </label>
                  <input
                    type="text"
                    name={key}
                    value={bankDetails[key]}
                    onChange={(e) => handleInputChange(e, setBankDetails)}
                    className="w-full border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-blue-200 p-2"
                  />
                </div>
              ))}
            </div>
            <button
              onClick={() => setActiveSection(null)}
              className="mt-6 w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 focus:ring focus:ring-blue-300"
            >
              Save Bank Details
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;
