import { useNavigate, useLocation } from "react-router-dom";
import { X, LogOut } from "lucide-react";
import avatar from "../assets/avatar.jpg";
import logo from "../assets/logo.jpg";

const Sidebar = ({
  menuItems,
  profileDetails,
  setIsSidebarOpen,
  handleLogout,
}: {
  menuItems: { icon: any; label: string; route: string }[];
  profileDetails: any;
  setIsSidebarOpen?: (isOpen: boolean) => void;
  handleLogout: () => void;
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="flex flex-col h-full">
      {/* Profile Section */}
      <div className="p-2 border-b flex items-center justify-between">
        <div
          className="flex items-center cursor-pointer justify-center w-full"
          onClick={() => navigate("/profile")}
        >
          <img src={logo} alt="logo" className="w-16 h-16 rounded-full mr-3" />
        </div>
        {setIsSidebarOpen && (
          <button onClick={() => setIsSidebarOpen(false)} className="md:hidden">
            <X size={24} />
          </button>
        )}
      </div>

      {/* Navigation Section */}
      <nav className="flex-grow py-4">
        {menuItems.map((item, index) => {
          const isActive = location.pathname === item.route;
          return (
            <div
              key={index}
              onClick={() => navigate(item.route)}
              className={`px-6 py-3 cursor-pointer flex items-center transition-colors ${
                isActive
                  ? "bg-blue-100 text-blue-600"
                  : "hover:bg-blue-50 text-gray-700 hover:text-blue-600"
              }`}
            >
              <item.icon className="mr-3" size={20} />
              <span className="font-medium">{item.label}</span>
            </div>
          );
        })}
      </nav>

      {/* Logout Section */}
      <div className="p-4 border-t">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center p-3 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
        >
          <LogOut className="mr-2" size={20} />
          Logout
        </button>
      </div>

      <div className="p-4 border-t">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
            <img
              src={avatar}
              alt="Profile"
              className="w-12 h-12 rounded-full mr-3"
            />
          </div>
          <div>
            <p className="font-medium text-gray-800">
              {profileDetails?.user?.name}
            </p>
            <p className="text-sm text-gray-500">
              {profileDetails?.user?.email}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
