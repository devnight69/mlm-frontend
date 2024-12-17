import { useNavigate } from "react-router-dom";
import logoImage from "../assets/logo.jpg";
import { useState } from "react";
import companyPdf from "../assets/company_details.pdf";

const AboutUs = () => {
  const navigation = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const openPDFDetails = () => {
    // Replace 'YOUR_PDF_PATH' with the actual path to your PDF file
    window.open(companyPdf, "_blank");
  };

  return (
    <>
      {/* Header Section */}
      <header className="relative flex justify-between items-center p-4 bg-blue-600 text-white">
        {/* Logo and Organization Name Container */}
        <div className="flex items-center space-x-4">
          <img
            src={logoImage}
            alt="Organization Logo"
            className="h-12 w-12 rounded-full object-cover"
          />
          <div className="hidden md:block">
            <h1 className="text-xl md:text-2xl font-bold">
              Accede Universal Rural Bengal Foundation
            </h1>
            <p className="text-sm mt-1">Empowering Rural Communities</p>
          </div>
          <div className="md:hidden">
            <h1 className="text-xl font-bold">AURB Foundation</h1>
          </div>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-4">
          <button
            onClick={() => navigation("/home")}
            className="bg-white text-blue-600 px-4 py-2 rounded-md shadow hover:bg-gray-100"
          >
            Home
          </button>
          <button
            onClick={() => navigation("/login")}
            className="bg-white text-blue-600 px-4 py-2 rounded-md shadow hover:bg-gray-100"
          >
            Login
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden">
          <button onClick={toggleMobileMenu} className="focus:outline-none">
            {isMobileMenuOpen ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 md:hidden">
            <div className="bg-blue-700 px-4 pt-2 pb-4 shadow-lg">
              <div className="space-y-2">
                <button
                  onClick={() => {
                    navigation("/home");
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full text-left py-2 hover:bg-blue-600 rounded"
                >
                  Home
                </button>
                <button
                  onClick={() => {
                    navigation("/login");
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full text-left py-2 hover:bg-blue-600 rounded"
                >
                  Login
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* About Us Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-blue-800 mb-6 text-center">
          About Accede Universal Rural Bengal Foundation
        </h2>

        <section className="bg-blue-50 rounded-lg p-8 mb-8">
          <h3 className="text-2xl font-semibold text-blue-700 mb-4">
            Our Mission
          </h3>
          <p className="text-gray-700 leading-relaxed">
            The Accede Universal Rural Bengal Foundation is dedicated to
            empowering rural communities in Bengal through innovative social
            support initiatives. We aim to create sustainable development
            programs that enhance economic opportunities, education, and social
            welfare for underserved populations.
          </p>
        </section>

        <section className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-2xl font-semibold text-blue-700 mb-4">
              Our Vision
            </h3>
            <p className="text-gray-700 leading-relaxed">
              To transform rural Bengal by creating self-reliant communities
              with improved economic conditions, enhanced educational
              opportunities, and a strong social support network that enables
              holistic development and sustainable progress.
            </p>
          </div>

          <div>
            <h3 className="text-2xl font-semibold text-blue-700 mb-4">
              Core Values
            </h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-center">
                <svg
                  className="w-5 h-5 text-blue-600 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                Community Empowerment
              </li>
              <li className="flex items-center">
                <svg
                  className="w-5 h-5 text-blue-600 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                Sustainable Development
              </li>
              <li className="flex items-center">
                <svg
                  className="w-5 h-5 text-blue-600 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                Social Inclusion
              </li>
              <li className="flex items-center">
                <svg
                  className="w-5 h-5 text-blue-600 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                Transparent Governance
              </li>
            </ul>
          </div>
        </section>

        <section className="mt-12 bg-blue-100 rounded-lg p-8">
          <h3 className="text-2xl font-semibold text-blue-700 mb-4">
            Our Key Focus Areas
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-blue-600 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.204l4-1.714a1 1 0 11.788 1.838L10 9.647l4.606 1.977a1 1 0 11-.788 1.838l-4-1.714a1 1 0 01-.356-.204l-5.643-2.12a1 1 0 010-1.838l7-3a1 1 0 01.788 0l7 3a1 1 0 010 1.838L14.75 11.949a1 1 0 01-.356.204l-4 1.714a1 1 0 11-.788-1.838L14 10.353l-4.606-1.977a1 1 0 01.788-1.838l4 1.714a1 1 0 01.356.204l5.643 2.12a1 1 0 010 1.838l-7 3a1 1 0 01-.788 0l-7-3a1 1 0 010-1.838L5.25 11.051a1 1 0 01.356-.204l4-1.714a1 1 0 11.788 1.838L10 10.647l4.606-1.977a1 1 0 01-.788-1.838l-4 1.714a1 1 0 01-.356.204l-5.643 2.12a1 1 0 010-1.838l7-3a1 1 0 01.788 0z" />
                </svg>
              </div>
              <h4 className="font-semibold text-blue-800 mb-2">Education</h4>
              <p className="text-gray-700 text-sm">
                Providing quality educational resources and skill development
                programs.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-blue-600 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 001 1h10a1 1 0 001-1v-1.5a1 1 0 012 0V16a3 3 0 01-3 3H6a3 3 0 01-3-3V6z" />
                </svg>
              </div>
              <h4 className="font-semibold text-blue-800 mb-2">
                Economic Empowerment
              </h4>
              <p className="text-gray-700 text-sm">
                Creating sustainable livelihood opportunities and financial
                support.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-blue-600 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <h4 className="font-semibold text-blue-800 mb-2">
                Social Welfare
              </h4>
              <p className="text-gray-700 text-sm">
                Implementing community-driven social support and healthcare
                initiatives.
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* New PDF Details Button */}
      <div className="text-center mt-0 mb-10">
        <button
          onClick={openPDFDetails}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center mx-auto space-x-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"
            />
          </svg>
          <span>View Detailed Foundation Information</span>
        </button>
      </div>

      {/* Footer Section (Similar to Landing Page) */}
      <footer className="bg-blue-800 text-white py-6">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Footer Columns */}
            <div className="text-center md:text-left">
              <h3 className="font-semibold mb-2">Get Started</h3>
              <ul className="space-y-1">
                <li
                  onClick={() => navigation("/")}
                  className="hover:text-blue-200 transition-colors cursor-pointer"
                >
                  Home
                </li>
                <li
                  onClick={() => navigation("/about")}
                  className="hover:text-blue-200 transition-colors cursor-pointer"
                >
                  About Us
                </li>
              </ul>
            </div>

            <div className="text-center md:text-left">
              <h3 className="font-semibold mb-2">Our Work</h3>
              <ul className="space-y-1">
                <li className="hover:text-blue-200 transition-colors cursor-pointer">
                  Programs
                </li>
                <li className="hover:text-blue-200 transition-colors cursor-pointer">
                  Impact
                </li>
              </ul>
            </div>

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

            <div className="text-center md:text-left">
              <h3 className="font-semibold mb-2">Contact Address</h3>
              <div className="space-y-1">
                <p>📞 91-8653029696 / 91-9932152533</p>
                <p>✉ xxxxxx@gmail.com</p>
              </div>
            </div>
          </div>

          <div className="text-center text-sm mt-6 px-4">
            <div className="border-t border-blue-700 pt-4 space-y-2">
              <p>© 2024 Copyright Accede Universal Rural Bengal Foundation</p>
              <p className="text-xs">Site Developed by SKJ</p>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default AboutUs;
