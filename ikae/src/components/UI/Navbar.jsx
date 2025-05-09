import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiSun, FiMoon, FiUser, FiLogOut, FiMenu, FiX } from "react-icons/fi";
import { useAuth } from "../Auth/useAuth"; // Import useAuth hook

/**
 * Responsive navigation bar with dark mode and authentication
 */
const Navbar = () => {
  const { currentUser, logout } = useAuth(); // Get auth data from context
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(
    localStorage.getItem("darkMode") === "true"
  );
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Initialize dark mode
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    }
  }, [isDarkMode]);

  // Toggle dark mode
  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    document.documentElement.classList.toggle("dark");
    localStorage.setItem("darkMode", String(newDarkMode));
  };

  // Handle logout
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Navigation links for both desktop and mobile
  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/products", label: "Products" },
    { to: "/dashboard", label: "Designer" },
    { to: "/gallery", label: "Gallery" },
  ];

  // Get display name from user object
  const getDisplayName = () => {
    if (!currentUser) return "";

    if (currentUser.firstName) {
      return `${currentUser.firstName} ${currentUser.lastName || ""}`.trim();
    }

    if (currentUser.name) {
      return currentUser.name;
    }

    if (currentUser.fullName) {
      return currentUser.fullName;
    }

    return currentUser.email.split("@")[0];
  };

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 border-b ${
        isScrolled
          ? "bg-blue-50 shadow-md border-blue-100"
          : "bg-blue-50 border-blue-100 shadow-sm"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <div className="h-8 w-8 bg-blue-600 rounded flex items-center justify-center mr-2">
                <span className="text-white font-bold">I</span>
              </div>
              <span className="text-xl font-bold text-gray-800">IKAE</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition duration-150 border-b-2 border-transparent hover:border-blue-600"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side actions - Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Dark/Light Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full bg-white shadow-sm hover:bg-gray-100 transition-colors"
              aria-label={
                isDarkMode ? "Switch to light mode" : "Switch to dark mode"
              }
            >
              {isDarkMode ? (
                <FiSun className="h-5 w-5 text-gray-700" />
              ) : (
                <FiMoon className="h-5 w-5 text-gray-700" />
              )}
            </button>

            {/* User Menu */}
            {currentUser ? (
              <div className="flex items-center">
                <button className="flex items-center bg-white shadow-sm rounded-full pl-3 pr-2 py-1 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none">
                  <span className="mr-2">{getDisplayName()}</span>
                  <img
                    className="h-8 w-8 rounded-full object-cover"
                    src={currentUser.avatar || "https://via.placeholder.com/40"}
                    alt="User avatar"
                  />
                </button>
                <button
                  onClick={handleLogout}
                  className="ml-3 p-2 rounded-full bg-white shadow-sm hover:bg-gray-100 transition-colors"
                  aria-label="Log out"
                >
                  <FiLogOut className="h-5 w-5 text-gray-700" />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition duration-150 shadow-sm"
              >
                <FiUser className="mr-2 h-4 w-4" />
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={toggleDarkMode}
              className="p-2 mr-2 rounded-full bg-white shadow-sm hover:bg-gray-100 transition-colors"
              aria-label={
                isDarkMode ? "Switch to light mode" : "Switch to dark mode"
              }
            >
              {isDarkMode ? (
                <FiSun className="h-5 w-5 text-gray-700" />
              ) : (
                <FiMoon className="h-5 w-5 text-gray-700" />
              )}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md bg-white shadow-sm text-gray-700 hover:bg-gray-100 transition-colors"
              aria-expanded={isOpen}
              aria-label="Main menu"
            >
              {isOpen ? (
                <FiX className="h-6 w-6" />
              ) : (
                <FiMenu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden transition-all duration-300 ease-in-out bg-white ${
          isOpen
            ? "max-h-96 border-t border-gray-200 shadow-lg"
            : "max-h-0 overflow-hidden"
        }`}
      >
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition duration-150"
              onClick={() => setIsOpen(false)}
            >
              {link.label}
            </Link>
          ))}

          {/* User section for mobile */}
          {currentUser ? (
            <div className="pt-4 pb-2 border-t border-gray-200">
              <div className="flex items-center px-3">
                <img
                  className="h-10 w-10 rounded-full object-cover border border-gray-200"
                  src={currentUser.avatar || "https://via.placeholder.com/40"}
                  alt="User avatar"
                />
                <div className="ml-3">
                  <div className="text-base font-medium text-gray-800">
                    {getDisplayName()}
                  </div>
                  <div className="text-sm font-medium text-gray-500">
                    {currentUser.email}
                  </div>
                </div>
              </div>
              <div className="mt-3 px-2">
                <button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="block w-full px-3 py-2 rounded-md text-base font-medium text-gray-700 bg-blue-50 hover:bg-blue-100 transition duration-150"
                >
                  Sign Out
                </button>
              </div>
            </div>
          ) : (
            <Link
              to="/login"
              className="block mt-4 px-3 py-2 rounded-md text-base font-medium bg-blue-600 text-white hover:bg-blue-700 transition duration-150 shadow-sm"
              onClick={() => setIsOpen(false)}
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
