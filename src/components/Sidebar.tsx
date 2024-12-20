import { useNavigate, useLocation } from "react-router-dom";
import { X, LogOut } from "lucide-react";
import avatar from "../assets/avatar.jpg";
import logo from "../assets/logo.jpg";
import { useRef, useEffect } from "react";

const Sidebar = ({
  menuItems,
  profileDetails,
  setIsSidebarOpen,
  isSidebarOpen,
  handleLogout,
}: {
  menuItems: { icon: any; label: string; route: string }[];
  profileDetails: any;
  setIsSidebarOpen?: (isOpen: boolean) => void;
  handleLogout: () => void;
  isSidebarOpen: boolean;
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const sidebarRef = useRef<HTMLDivElement>(null);

  const handleNavigation = (route: string) => {
    navigate(route);
    if (setIsSidebarOpen && window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  };

  // Close sidebar on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node) &&
        isSidebarOpen &&
        setIsSidebarOpen
      ) {
        setIsSidebarOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSidebarOpen, setIsSidebarOpen]);

  return (
    <div
      ref={sidebarRef}
      className={`fixed md:static z-50 inset-y-0 left-0 
      w-64 bg-white shadow-2xl 
      transform transition-transform duration-300
      ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
      md:translate-x-0 ${
        location.pathname === "/pin-management" ? "h-full" : ""
      }`}
    >
      <div className="flex flex-col h-full">
        {/* Profile Section */}
        <div className="p-2 border-b flex items-center justify-between">
          <div
            className="flex items-center cursor-pointer justify-center w-full"
            onClick={() => handleNavigation("/profile")}
          >
            <img
              src={logo}
              alt="logo"
              className="w-16 h-16 rounded-full mr-3"
            />
          </div>
        </div>

        {/* Navigation Section */}
        <nav className="flex-grow py-4">
          {menuItems.map((item, index) => {
            const isActive = location.pathname === item.route;
            return (
              <div
                key={index}
                onClick={() => handleNavigation(item.route)}
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

        {/* Profile Info Section */}
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
    </div>
  );
};

export default Sidebar;
