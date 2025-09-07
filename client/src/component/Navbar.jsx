import { Link, useNavigate } from "react-router-dom";
import { User, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import * as authAPI from "../services/api";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await authAPI.me();
        if (res?.data?.user) {
          setIsLoggedIn(true);
          setUserName(res.data.user.name);
        } else {
          setIsLoggedIn(false);
        }
      } catch (err) {
        console.error("Fetch user failed:", err);
        setIsLoggedIn(false);
      }
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      await authAPI.logout();
      setIsLoggedIn(false);
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <nav className="fixed w-full z-50 bg-transparent backdrop-blur-md shadow-sm">
      <div className="max-w-7xl mx-auto px-6 sm:px-12 py-4 flex justify-between items-center">
        <Link
          to="/"
          className="text-2xl font-bold text-blue-700 hover:text-blue-900 transition-colors duration-300"
        >
          AuthApp
        </Link>

        <div className="flex items-center gap-4">
          {isLoggedIn ? (
            <>
              <div className="flex items-center gap-2 bg-white/70 px-3 py-1 rounded-lg shadow">
                <User className="w-5 h-5 text-blue-600" />
                <span className="text-gray-700 text-sm">
                  Welcome, {userName}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="px-4 flex gap-3 py-2 rounded-lg bg-gradient-to-r from-blue-500 cursor-pointer to-purple-600 text-white font-semibold shadow hover:scale-105 transition"
              >
                <LogOut className="w-5 h-5" />
                Logout
              </button>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login">
                <button className="px-4 py-2 rounded-lg border border-blue-500 text-blue-600 hover:bg-blue-100 transition font-semibold">
                  Login
                </button>
              </Link>
              <Link to="/register">
                <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold shadow hover:scale-105 transition">
                  Register
                </button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
