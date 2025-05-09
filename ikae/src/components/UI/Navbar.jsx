import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom"; // Added useNavigate
import { FiSun, FiMoon, FiUser, FiLogOut, FiMenu, FiX, FiChevronDown } from "react-icons/fi"; // Added FiChevronDown
import { useAuth } from "../Auth/useAuth"; // Import useAuth

/**
 * Responsive navigation bar with dark mode and authentication
 */
const Navbar = () => { // Removed user and onLogout props
  const { currentUser, logout } = useAuth(); // Get currentUser and logout from AuthContext
  const navigate = useNavigate(); // Initialize navigate

  const [isOpen, setIsOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false); // State for user dropdown
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

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false); // Close user menu on logout
    navigate('/'); // Redirect to home or login page after logout
  };

  // Navigation links for both desktop and mobile
  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/products", label: "Products" }, // Changed from /room-editor to /products
    { to: "/dashboard", label: "Dashboard" }, // Changed from /designs to /dashboard
    { to: "/room", label: "Room Editor" }, // Changed from /gallery to /room
  ];

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
              <span className="text-xl font-bold text-gray-800 ">IKAE</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-gray-700 hover:text-blue-600  px-3 py-2 text-sm font-medium transition duration-150 border-b-2 border-transparent hover:border-blue-600"
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
              className="p-2 rounded-full bg-white shadow-sm hover:bg-gray-100 "
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
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center bg-white shadow-sm rounded-full pl-1 pr-2 py-1 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
                >
                  <img
                    className="h-8 w-8 rounded-full object-cover mr-2"
                    src={currentUser.avatar || "https://via.placeholder.com/40"}
                    alt="User avatar"
                  />
                  <span>{currentUser.firstName}</span>
                  <FiChevronDown className="h-4 w-4 ml-1 text-gray-500" />
                </button>
                {isUserMenuOpen && (
                  <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="px-4 py-3 border-b border-gray-200 ">
                      <p className="text-sm font-medium text-gray-900  truncate">
                        {currentUser.firstName} {currentUser.lastName}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {currentUser.email}
                      </p>
                    </div>
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      Your Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Sign out
                    </button>
                  </div>
                )}
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
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600   transition duration-150"
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
                  className="h-10 w-10 rounded-full object-cover border border-gray-200 "
                  src={currentUser.avatar || "https://via.placeholder.com/40"}
                  alt="User avatar"
                />
                <div className="ml-3">
                  <div className="text-base font-medium text-gray-800 ">
                    {currentUser.firstName} {currentUser.lastName}
                  </div>
                  <div className="text-sm font-medium text-gray-500">
                    {currentUser.email}
                  </div>
                </div>
              </div>
              <div className="mt-3 px-2 space-y-1">
                 <Link
                    to="/profile"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 bg-blue-50 hover:bg-blue-100 transition duration-150"
                    onClick={() => {
                        setIsOpen(false);
                    }}
                    >
                    Your Profile
                </Link>
                <button
                  onClick={() => {
                    handleLogout(); // Use the new handleLogout
                    setIsOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 bg-blue-50 hover:bg-blue-100 transition duration-150"
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
