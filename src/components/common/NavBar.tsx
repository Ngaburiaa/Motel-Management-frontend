import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { BedDouble, Building2, Home, Info, LayoutDashboard, LogOut, Menu, Phone, X } from "lucide-react";
import { clearCredentials } from "../../features/auth/authSlice";
import type { RootState } from "../../app/store";
import { cn } from "../../lib/utils";
import { useGetUserByIdQuery } from "../../features/api";
import { Avatar } from "../ui/Avatar";
import type { AppDispatch } from "../../app/store";

const NAV_LINKS = ["Home", "Hotels", "Rooms", "About", "Contact"];

const Navbar: React.FC = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);

  const { pathname } = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const ICON_MAP: Record<string, React.JSX.Element> = {
  Home: <Home className="w-4 h-4" />,
  Hotels: <Building2 className="w-4 h-4" />,
  Rooms: <BedDouble className="w-4 h-4" />,
  About: <Info className="w-4 h-4" />,
  Contact: <Phone className="w-4 h-4" />,
};

  const { isAuthenticated, userId, userType } = useSelector(
    (state: RootState) => state.auth
  );

  const id = Number(userId);
  const { data: user } = useGetUserByIdQuery(id, { skip: !userId });

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!profileRef.current?.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
      if (
        drawerOpen &&
        drawerRef.current &&
        !drawerRef.current.contains(e.target as Node)
      ) {
        setDrawerOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [drawerOpen]);

  const handleLogout = async () => {
    await dispatch(clearCredentials());
    navigate("/login");
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 w-full z-50 transition-all duration-300 animate-fade-down",
        scrolled
          ? "bg-base-100 shadow-sm border-b border-border text-base-content"
          : "bg-transparent text-white"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-xl md:text-2xl font-bold tracking-tight">
          <span className="text-primary">Vil</span>las
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map((item) => {
            const path = item === "Home" ? "/" : `/${item.toLowerCase()}`;
            const isActive = pathname === path;
            return (
              <Link
                key={item}
                to={path}
                className={cn(
                  "group relative text-sm font-medium px-2 py-1",
                  isActive ? "text-primary" : "text-muted hover:text-primary"
                )}
              >
                {item}
                <span
                  className={cn(
                    "absolute left-0 -bottom-1 h-[2px] w-full bg-primary origin-left scale-x-0 group-hover:scale-x-100 transition-transform",
                    isActive && "scale-x-100"
                  )}
                />
              </Link>
            );
          })}

          {isAuthenticated ? (
            <div ref={profileRef} className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-md font-medium hover:opacity-90"
              >
                <Avatar
                  src={user?.profileImage ?? undefined}
                  fallback={
                    user?.firstName && user?.lastName
                      ? user.firstName[0] + user.lastName[0]
                      : "U"
                  }
                  size="sm"
                />
                <span>{user?.firstName}</span>
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white text-slate-800 shadow-xl border border-slate-200 rounded-2xl z-50 animate-fade-in">
                  <div className="py-2">
                    <Link
                      to={
                        userType === "admin"
                          ? "/admin/analytics"
                          : "/user/analytics"
                      }
                      className="flex items-center gap-2 px-4 py-2 text-sm font-medium hover:bg-slate-100 hover:text-primary transition"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      Dashboard
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full gap-2 px-4 py-2 text-sm font-medium text-red-500 hover:bg-red-500/10 transition"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="px-6 py-2 bg-primary text-white rounded-md font-medium hover:opacity-90"
            >
              Login
            </Link>
          )}
        </nav>

        {/* Mobile Button */}
        <button
          className="md:hidden text-primary focus:outline-none"
          onClick={() => setDrawerOpen(true)}
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Backdrop */}
      {drawerOpen && (
        <div
          onClick={() => setDrawerOpen(false)}
          className="fixed inset-0 bg-black/40 z-40 transition-opacity"
        />
      )}

      {/* Mobile Drawer */}
      <div
        ref={drawerRef}
        className={cn(
          "fixed top-0 right-0 h-full w-72 bg-[#0f172a] text-white z-50 shadow-2xl transition-transform duration-300 transform rounded-l-2xl",
          drawerOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-700">
          <span className="text-xl font-semibold text-white tracking-tight">
            Menu
          </span>
          <button
            onClick={() => setDrawerOpen(false)}
            className="text-white hover:text-primary transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4">
  {NAV_LINKS.map((item) => {
    const path = item === "Home" ? "/" : `/${item.toLowerCase()}`;
    return (
      <Link
        key={item}
        to={path}
        onClick={() => setDrawerOpen(false)}
        className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-slate-800 font-medium transition"
      >
        {ICON_MAP[item]}
        {item}
      </Link>
    );
  })}

  {isAuthenticated ? (
    <>
      <Link
        to={userType === "admin" ? "/admin/analytics" : "/user/analytics"}
        onClick={() => setDrawerOpen(false)}
        className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-slate-800 font-medium transition"
      >
        <LayoutDashboard className="w-4 h-4" />
        Dashboard
      </Link>
      <button
        onClick={() => {
          handleLogout();
          setDrawerOpen(false);
        }}
        className="flex items-center gap-2 w-full text-left px-3 py-2 rounded-xl text-red-400 hover:bg-red-500/10 font-medium transition"
      >
        <LogOut className="w-4 h-4" />
        Logout
      </button>
    </>
  ) : (
    <Link
      to="/login"
      onClick={() => setDrawerOpen(false)}
      className="block text-center w-full py-2 bg-primary text-white rounded-xl font-semibold hover:opacity-90 transition"
    >
      Login
    </Link>
  )}
</div>
      </div>
    </header>
  );
};

export default Navbar;
