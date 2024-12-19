import { ChevronLeft } from "lucide-react";

const ProfileNavigation = ({ onBack, activeSection }: any) => {
  return (
    <div className="p-4 bg-white border-b">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-blue-50 rounded-full transition-colors"
          >
            <ChevronLeft size={24} className="text-blue-600" />
          </button>

          <div className="text-sm text-gray-600">
            <span>Dashboard</span>
            <span className="mx-2">/</span>
            <span className={!activeSection ? "text-blue-600" : ""}>
              Profile
            </span>
            {activeSection && (
              <>
                <span className="mx-2">/</span>
                <span className="text-blue-600">
                  {activeSection === "profile"
                    ? "Update Profile"
                    : "Update Bank Details"}
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileNavigation;
