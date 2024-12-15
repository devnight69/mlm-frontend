import { useState } from "react";
import { useNavigate } from "react-router-dom";

const RegistrationPage = () => {
  const [step, setStep] = useState(1);
  const [referralId, setReferralId] = useState("");
  const [referrerDetails, setReferrerDetails] = useState<any>(null);
  const [formData, setFormData] = useState<any>({
    userName: "",
    mobile: "",
    email: "",
    gender: "",
    dob: null,
  });
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");

  // Mock function to simulate fetching referrer details
  const fetchReferrerDetails = async (id: any) => {
    // In a real app, this would be an API call
    const mockReferrerData: any = {
      REF123: {
        name: "John Doe",
        age: 28,
        photo:
          "https://imgs.search.brave.com/_z8B4TvuD_6x3QEYEYB-n2rSUnSQO2-q5kd4UybnNp0/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/ZnJlZS1waG90by9z/bWlsZXktbWFuLXJl/bGF4aW5nLW91dGRv/b3JzXzIzLTIxNDg3/MzkzMzQuanBnP3Nl/bXQ9YWlzX2h5YnJp/ZA",
        gender: "Male",
        contact: "+1 (555) 123-4567",
      },
    };

    return mockReferrerData[id] || null;
  };

  const handleReferralSubmit = async () => {
    const details = await fetchReferrerDetails(referralId);
    if (details) {
      setReferrerDetails(details);
      setStep(2);
    } else {
      alert("Invalid Referral ID");
    }
  };

  const handleRegistrationSubmit = () => {
    // Validate form data
    const { userName, mobile, email, gender, dob } = formData;
    if (!userName || !mobile || !email || !gender || !dob) {
      alert("Please fill all details");
      return;
    }
    setStep(4);
  };

  const navigation = useNavigate();

  const handlePinSubmit = () => {
    if (pin === confirmPin) {
      // Simulate successful registration
      alert("Registration Successful!");
      navigation("/dashboard");
      // In a real app, redirect to dashboard
      // router.push('/dashboard');
    } else {
      alert("PINs do not match");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white shadow-md rounded-lg">
        {step === 1 && (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4 text-center">
              Enter Referral ID
            </h2>
            <div className="space-y-4">
              <div>
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="referralId"
                >
                  Referral ID
                </label>
                <input
                  id="referralId"
                  type="text"
                  value={referralId}
                  onChange={(e) => setReferralId(e.target.value)}
                  placeholder="Enter Referral ID"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <button
                onClick={handleReferralSubmit}
                className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {step === 2 && referrerDetails && (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4 text-center">
              Referrer Details
            </h2>
            <div className="flex flex-col items-center space-y-4">
              <img
                src={referrerDetails.photo}
                alt="Referrer"
                className="w-32 h-32 rounded-full object-cover"
              />
              <div className="text-center">
                <p>
                  <strong>Name:</strong> {referrerDetails.name}
                </p>
                <p>
                  <strong>Age:</strong> {referrerDetails.age}
                </p>
                <p>
                  <strong>Gender:</strong> {referrerDetails.gender}
                </p>
                <p>
                  <strong>Contact:</strong> {referrerDetails.contact}
                </p>
              </div>
              <button
                onClick={() => setStep(3)}
                className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Continue to Registration
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4 text-center">
              Registration Details
            </h2>
            <div className="space-y-4">
              <div>
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="userName"
                >
                  Full Name
                </label>
                <input
                  id="userName"
                  type="text"
                  value={formData.userName}
                  onChange={(e) =>
                    setFormData({ ...formData, userName: e.target.value })
                  }
                  placeholder="Enter your full name"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div>
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="mobile"
                >
                  Mobile Number
                </label>
                <input
                  id="mobile"
                  type="tel"
                  value={formData.mobile}
                  onChange={(e) =>
                    setFormData({ ...formData, mobile: e.target.value })
                  }
                  placeholder="Enter mobile number"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div>
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="email"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="Enter email"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div>
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="gender"
                >
                  Gender
                </label>
                <select
                  id="gender"
                  value={formData.gender}
                  onChange={(e) =>
                    setFormData({ ...formData, gender: e.target.value })
                  }
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="dob"
                >
                  Date of Birth
                </label>
                <input
                  id="dob"
                  type="date"
                  value={
                    formData.dob ? formData.dob.toISOString().split("T")[0] : ""
                  }
                  onChange={(e) =>
                    setFormData({ ...formData, dob: new Date(e.target.value) })
                  }
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <button
                onClick={handleRegistrationSubmit}
                className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Submit Registration Details
              </button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4 text-center">
              PIN Verification
            </h2>
            <div className="space-y-4">
              <div>
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="pin"
                >
                  Enter PIN
                </label>
                <input
                  id="pin"
                  type="password"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder="Enter PIN"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div>
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="confirmPin"
                >
                  Confirm PIN
                </label>
                <input
                  id="confirmPin"
                  type="password"
                  value={confirmPin}
                  onChange={(e) => setConfirmPin(e.target.value)}
                  placeholder="Confirm PIN"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <button
                onClick={handlePinSubmit}
                className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Verify PIN
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RegistrationPage;
