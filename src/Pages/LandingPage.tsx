import firstImage from "../assets/ek.png";
import secondImage from "../assets/do.png";
import thirdImage from "../assets/teen.png";
import fourthImage from "../assets/char.png";
import logoImage from "../assets/logo.jpg";
import heroImage from "../assets/hero.jpg";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigation = useNavigate();
  return (
    <>
      {/* Header Section */}
      <header className="flex justify-between items-center p-4 bg-blue-600 text-white">
        {/* Logo and Organization Name Container */}
        <div className="flex items-center space-x-4">
          <img
            src={logoImage}
            alt="Organization Logo"
            className="h-12 w-12 rounded-full object-cover"
          />
          <div>
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
        </div>

        {/* Login Options in Header */}
        <button
          onClick={() => navigation("/login")}
          className="bg-white text-blue-600 px-4 py-2 rounded-md shadow hover:bg-gray-100"
        >
          Login
        </button>
      </header>

      {/* Marquee Section */}
      <div className="overflow-hidden bg-gray-100 py-2">
        <div className="animate-marquee whitespace-nowrap text-blue-600 font-semibold">
          Welcome to the স্বনির্ভরশীল সামাজিক সহায়তা প্রকল্প, organized by
          Accede Universal Rural Bengal Foundation!
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative">
        {/* Hero Image */}
        <img src={heroImage} alt="Hero" className="w-full h-64 object-cover" />
      </section>

      <section className="bg-blue-50 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8 text-blue-800">
            Our Platform Impact
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {/* Mobile Visits Statistic */}
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">
                12,456
              </div>
              <div className="text-gray-600 font-medium">Mobile Visits</div>
            </div>

            {/* Website Visits Statistic */}
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">
                24,789
              </div>
              <div className="text-gray-600 font-medium">Website Visits</div>
            </div>

            {/* Total Registrations Statistic */}
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">3,245</div>
              <div className="text-gray-600 font-medium">
                Total Registrations
              </div>
            </div>

            {/* Total Logins Statistic */}
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">2,876</div>
              <div className="text-gray-600 font-medium">Total Logins</div>
            </div>
          </div>
        </div>
      </section>

      {/* Content Section with Screenshots */}
      <section className="max-w-4xl mx-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <img
            src={firstImage}
            alt="Screenshot 1"
            className="rounded-lg shadow-md"
          />
          <img
            src={secondImage}
            alt="Screenshot 2"
            className="rounded-lg shadow-md"
          />
          <img
            src={thirdImage}
            alt="Screenshot 3"
            className="rounded-lg shadow-md"
          />
          <img
            src={fourthImage}
            alt="Screenshot 4"
            className="rounded-lg shadow-md"
          />
        </div>
      </section>

      {/* Footer Section */}
      <footer className="bg-blue-800 text-white py-6">
        {/* Main Footer Columns */}
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Column 1: Get Started */}
            <div className="text-center md:text-left">
              <h3 className="font-semibold mb-2">Get Started</h3>
              <ul className="space-y-1">
                <li className="hover:text-blue-200 transition-colors cursor-pointer">
                  Home
                </li>
              </ul>
            </div>

            {/* Column 2: About Us */}
            <div className="text-center md:text-left">
              <h3 className="font-semibold mb-2">About Us</h3>
              <ul className="space-y-1">
                <li
                  className="hover:text-blue-200 transition-colors cursor-pointer"
                  onClick={() => {
                    window.scrollTo(0, 0);
                    navigation("/about");
                  }}
                >
                  About Us
                </li>
              </ul>
            </div>

            {/* Column 3: Legal */}
            <div className="text-center md:text-left">
              <h3 className="font-semibold mb-2">Legal</h3>
              <ul className="space-y-1">
                <li className="hover:text-blue-200 transition-colors cursor-pointer">
                  Terms of Use
                </li>
                <li className="hover:text-blue-200 transition-colors cursor-pointer">
                  Privacy Policy
                </li>
              </ul>
            </div>

            {/* Column 4: Contact Address */}
            <div className="text-center md:text-left">
              <h3 className="font-semibold mb-2">Contact Address</h3>
              <div className="space-y-1 cursor-pointer">
                <p>📞 91-8653029696 / 91-9932152533</p>
                <p>✉ xxxxxx@gmail.com</p>
                <p>✉ xxxxxx@gmail.com</p>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="text-center text-sm mt-6 px-4">
          <div className="border-t border-blue-700 pt-4 space-y-2">
            <p>© 2024 Copyright Accede Universal Rural Bengal Foundation</p>
            <p className="text-xs">
              Contents Provided by Accede Universal Rural Bengal Foundation
            </p>
            <p className="text-xs">Site Designed and Developed by SKJ</p>
            <p className="text-xs">
              Site Last Updated on : 18/12/2024 04:30 AM
            </p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default LandingPage;
