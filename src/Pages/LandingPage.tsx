 import firstImage from "../assets/ek.png";
import secondImage from "../assets/do.png";
import thirdImage from "../assets/teen.png";
import fourthImage from "../assets/char.png";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigation = useNavigate();
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header Section */}
      <header className="bg-blue-500 text-white p-4 flex flex-col md:flex-row items-center justify-between">
        <div className="text-center md:text-left">
          <h1 className="text-xl md:text-2xl font-bold">
            স্বনির্ভরশীল সামাজিক সহায়তা প্রকল্প
          </h1>
          <p className="text-sm mt-1">
            Organized by{" "}
            <span className="font-semibold">
              Accede Universal Rural Bengal Foundation
            </span>
          </p>
        </div>
        {/* Login Options in Header */}
        <div className="mt-4 md:mt-0 flex flex-col md:flex-row gap-2">
          <button
            onClick={() => navigation("/login")}
            className="bg-white text-blue-600 px-4 py-2 rounded-md shadow hover:bg-white"
          >
            Login
          </button>
        </div>
      </header>

      {/* Content Section */}
      <section className="max-w-4xl mx-auto p-4">
        {/* Images */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <div className="rounded-lg overflow-hidden shadow-md">
            <img
              src={firstImage}
              alt="Screenshot 1"
              className="w-full h-auto"
            />
          </div>
          <div className="rounded-lg overflow-hidden shadow-md">
            <img
              src={secondImage}
              alt="Screenshot 2"
              className="w-full h-auto"
            />
          </div>
          <div className="rounded-lg overflow-hidden shadow-md">
            <img
              src={thirdImage}
              alt="Screenshot 3"
              className="w-full h-auto"
            />
          </div>
          <div className="rounded-lg overflow-hidden shadow-md">
            <img
              src={fourthImage}
              alt="Screenshot 4"
              className="w-full h-auto"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
