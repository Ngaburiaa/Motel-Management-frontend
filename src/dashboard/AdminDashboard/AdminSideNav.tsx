import {
  LayoutDashboard,
  Users,
  ClipboardList,
  MessageSquare,
  LogOut,
  X,
  Hotel,
  ChevronLeft,
  ChevronRight,
  Home,
  CardSim,
  House,
} from "lucide-react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { clearCredentials } from "../../features/auth/authSlice";
import type { RootState } from "../../app/store";
import { useGetUserByIdQuery } from "../../features/api/usersApi";
import { UserProfileButton } from "../../components/profile/UserProfileButton";

interface SideNavProps {
  isOpen: boolean;
  onClose: () => void;
}

const navLinks = [
  { id: "analytics", label: "Analytics", icon: LayoutDashboard },
  { id: "users", label: "Users", icon: Users },
  { id: "booking-details", label: "Booking Details", icon: ClipboardList },
  { id: "hotels", label: "Hotels", icon: Hotel },
  { id: "rooms", label: "Rooms", icon: House },
  { id: "payments", label: "Payments", icon: CardSim },
  { id: "ticket", label: "Customer Support", icon: MessageSquare },
  {
    id: "utils",
    label: "Manage Utils",
    icon: ClipboardList,
    children: [
      { id: "amenities", label: "Amenities" },
      { id: "roomtypes", label: "Room Types" },
    ],
  },
];

const AdminSideNav: React.FC<SideNavProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const current = pathname.split("/")[2];
  const [collapsed, setCollapsed] = useState(false);
  const dispatch = useDispatch();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const { userId } = useSelector((state: RootState) => state.auth);
  const id = Number(userId);

  const { data: userData, isLoading, isError, error } = useGetUserByIdQuery(id);

  useEffect(() => {
    if (isError) {
      toast.error("Failed to fetch user data. Please try again.");
      console.error("User data error:", error);
    }
  }, [isError, error]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  const handleLogOut = () => {
    toast.custom((t) => (
      <div className={`bg-white dark:bg-slate-900 p-6 rounded-xl shadow-lg border border-slate-300 dark:border-slate-700 w-[340px] ${
        t.visible ? "animate-enter" : "animate-leave"
      }`}>
        <div className="text-base font-semibold text-slate-900 dark:text-white">Confirm Logout</div>
        <div className="text-sm text-slate-600 dark:text-slate-300">
          Are you sure you want to logout? You’ll need to sign in again.
        </div>
        <div className="flex justify-end gap-3 pt-4">
          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-4 py-2 text-sm font-medium rounded-lg border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              dispatch(clearCredentials());
              toast.dismiss(t.id);
              toast.success("Logged out successfully.");
              navigate("/login");
            }}
            className="px-4 py-2 text-sm font-semibold rounded-lg bg-red-600 text-white hover:bg-red-700 shadow"
          >
            Logout
          </button>
        </div>
      </div>
    ));
  };

  return (
    <>
      <div
        className={`fixed inset-0 z-30 bg-black/60 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={onClose}
      />
      <aside
        className={`fixed top-0 left-0 h-full z-40 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white shadow-2xl transition-all duration-300 ease-in-out border-r border-slate-700/50 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 lg:static ${collapsed ? "w-20" : "w-72"}`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-6 border-b border-slate-700/50">
            {!collapsed && (
              <Link to="/" className="text-xl font-bold tracking-tight font-playfair">
                <span className="text-gold-400">Stay</span>
                <span className="text-white">Cloud</span>
              </Link>
            )}
            <div className="flex gap-2 items-center">
              <button
                onClick={() => setCollapsed((prev) => !prev)}
                className="hidden lg:flex p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700/50"
              >
                {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
              </button>
              <button
                onClick={onClose}
                className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700/50"
              >
                <X size={18} />
              </button>
            </div>
          </div>
          <nav className="flex-1 px-3 py-6 space-y-2 overflow-y-auto custom-scrollbar">
            {navLinks.map(({ id, label, icon: Icon, children }) => {
              const isActive = current === id || children?.some((child) => current === child.id);
              const isDropdownOpen = openDropdown === id;

              return (
                <div key={id} className="relative group">
                  <button
                    onClick={() => {
                      if (children) {
                        setOpenDropdown((prev) => (prev === id ? null : id));
                      } else {
                        navigate(`/admin/${id}`);
                        onClose();
                      }
                    }}
                    className={`flex items-center w-full px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? "bg-blue-600 text-white shadow-lg"
                        : "text-slate-300 hover:text-white hover:bg-slate-700/50"
                    } ${collapsed ? "justify-center" : "gap-3"}`}
                  >
                    <Icon className={`w-5 h-5 ${isActive ? "text-white" : "text-slate-400 group-hover:text-blue-300"}`} />
                    {!collapsed && <>
                      <span className="flex-1 text-left">{label}</span>
                      {children && (
                        <ChevronRight
                          className={`w-4 h-4 transition-transform ${isDropdownOpen ? "rotate-90" : ""}`}
                        />
                      )}
                    </>}
                  </button>
                  {children && isDropdownOpen && !collapsed && (
                    <div className="mt-2 ml-4 space-y-1 border-l-2 border-slate-600 pl-4">
                      {children.map((child) => (
                        <button
                          key={child.id}
                          onClick={() => {
                            navigate(`/admin/${child.id}`);
                            onClose();
                          }}
                          className={`block w-full text-left text-sm px-3 py-2 rounded-lg ${
                            current === child.id
                              ? "bg-blue-600/20 text-blue-300 border-l-2 border-blue-400"
                              : "text-slate-400 hover:text-white hover:bg-slate-700/30"
                          }`}
                        >
                          {child.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
          <div className="p-4 border-t border-slate-700/50 space-y-2">
            <button
              onClick={() => {
                navigate("/");
                onClose();
              }}
              className={`flex items-center w-full px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                pathname === "/"
                  ? "bg-emerald-600 text-white shadow-lg"
                  : "text-slate-300 hover:text-white hover:bg-slate-700/50"
              } ${collapsed ? "justify-center" : "gap-3"}`}
            >
              <Home className={`w-5 h-5 ${pathname === "/" ? "text-white" : "text-slate-400"}`} />
              {!collapsed && <span>Home</span>}
            </button>

            {isLoading ? (
              <div className="flex items-center justify-center py-4">
                <div className="w-6 h-6 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                {!collapsed && <span className="ml-3 text-sm text-slate-400">Loading profile...</span>}
              </div>
            ) : !isError && userData ? (
              <UserProfileButton collapsed={collapsed} />
            ) : (
              <div className="flex items-center justify-center py-3 text-sm text-red-400 bg-red-900/20 rounded-lg">
                {!collapsed && "Failed to load profile"}
                {collapsed && "!"}
              </div>
            )}

            <button
              onClick={handleLogOut}
              className={`flex items-center w-full px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:bg-red-900/20 hover:text-red-300 ${
                collapsed ? "justify-center" : "gap-3"
              }`}
            >
              <LogOut className="w-5 h-5" />
              {!collapsed && <span>Logout</span>}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default AdminSideNav;
