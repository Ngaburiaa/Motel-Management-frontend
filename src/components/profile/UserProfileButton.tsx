import React from "react";
import { User, Settings } from "lucide-react";
import { useNavigate } from "react-router";

interface ProfileFooterProps {
  collapsed?: boolean;
}

export const UserProfileButton: React.FC<ProfileFooterProps> = ({
  collapsed = false,
}) => {
  const navigate = useNavigate();

  return (
    <div className="mt-auto">
      <div className="h-px bg-gray-700/50 my-4" />

      {/* Quick Actions */}
      {!collapsed && (
        <div className="mt-2 mx-3 flex gap-2">
          <button
            onClick={() => navigate("/admin/profile")}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-1.5 text-xs text-gray-300 bg-gray-700 hover:bg-gray-600 rounded-lg"
          >
            <User className="w-4 h-4" />
            Profile
          </button>
          <button
            onClick={() => navigate("/admin/settings")}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-1.5 text-xs text-gray-300 bg-gray-700 hover:bg-gray-600 rounded-lg"
          >
            <Settings className="w-4 h-4" />
            Settings
          </button>
        </div>
      )}
    </div>
  );
};
