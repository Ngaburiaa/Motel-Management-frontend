import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ChevronDown, LogOut, Home } from "lucide-react";
import { toast } from "react-hot-toast";
import type { RootState } from "../../app/store";
import { clearCredentials } from "../../features/auth/authSlice";

export const HeaderCard: React.FC<{ title?: string }> = ({
  title = "Welcome To Your Room",
}) => {
  const { firstName, userType } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    toast.success("Logged out");
    dispatch(clearCredentials());
    navigate("/");
  };

  return (
    <div className="bg-white rounded-xl md:mt-5 shadow-md p-4 mx-5 flex flex-col md:flex-row justify-between items-center gap-4">
      <p className="text-lg font-semibold text-gray-800">{title}</p>

      {/* Profile dropdown */}
      <div className="hidden sm:block dropdown dropdown-end">
        <div
          tabIndex={0}
          role="button"
          className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 transition cursor-pointer"
        >
          <img
            src="https://i.pravatar.cc/100"
            alt="avatar"
            className="w-12 h-12 rounded-full object-cover border-2 border-blue-600"
          />
          <div className="text-left">
            <h2 className="text-base font-semibold text-gray-900">{firstName}</h2>
            <p className="text-sm text-blue-600 capitalize">{userType}</p>
          </div>
          <ChevronDown className="w-4 h-4 text-gray-500" />
        </div>

        <ul
          tabIndex={0}
          className="dropdown-content z-[1] menu p-2 shadow bg-white rounded-box w-40 mt-2"
        >
          <li>
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 text-gray-700 hover:text-blue-600"
            >
              <Home className="w-4 h-4" />
              Home
            </button>
          </li>
          <li>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-red-600 hover:text-red-700"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};
