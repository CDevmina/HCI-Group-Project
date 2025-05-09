import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../components/Auth/useAuth";
import {
  MagnifyingGlassIcon,
  PlusIcon,
  BellIcon,
  Cog6ToothIcon,
  ChevronDownIcon,
  ArrowUpOnSquareIcon,
  ArrowPathIcon,
  CalendarIcon,
  ClockIcon,
  XMarkIcon,
  Bars3Icon,
  PencilIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";
import {
  CheckCircleIcon,
  HomeIcon,
  CubeIcon,
  UsersIcon,
  FolderIcon,
} from "@heroicons/react/24/solid";

const DashboardPage = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [designs, setDesigns] = useState([]);

  // Load designs from localStorage
  useEffect(() => {
    const loadDesigns = () => {
      const keys = Object.keys(localStorage).filter((k) =>
        k.startsWith("roomDesign:")
      );
      const loaded = keys
        .map((key) => {
          try {
            const data = JSON.parse(localStorage.getItem(key));
            return {
              id: key.replace("roomDesign:", ""),
              name: key.replace("roomDesign:", ""),
              thumbnail:
                data.thumbnail ||
                "https://placehold.co/400x225?text=No+Preview", // fallback
              lastModified: data.timestamp
                ? new Date(data.timestamp).toLocaleString()
                : "-",
              isComplete: false, // You can update this logic if you have a flag
              ...data,
            };
          } catch {
            return null;
          }
        })
        .filter(Boolean);
      setDesigns(loaded);
    };
    loadDesigns();
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        (isNotificationsOpen || isUserMenuOpen) &&
        !event.target.closest(".notification-menu") &&
        !event.target.closest(".user-menu")
      ) {
        setIsNotificationsOpen(false);
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, [isNotificationsOpen, isUserMenuOpen]);

  // Close mobile sidebar on window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Filter designs based on search query
  const filteredDesigns = designs.filter((design) =>
    design.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // UI toggle handlers
  const toggleNotifications = () => {
    setIsNotificationsOpen(!isNotificationsOpen);
    if (isUserMenuOpen) setIsUserMenuOpen(false);
  };

  const toggleUserMenu = () => setIsUserMenuOpen(!isUserMenuOpen);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  const handleLogout = () => {
    logout(); // Perform the logout action from AuthContext
    setIsUserMenuOpen(false); // Close the user menu if it's open
    navigate('/'); // Redirect to the home page
  };

  // Filter designs based on active tab
  const getFilteredDesigns = () => {
    if (activeTab === "all") return filteredDesigns;
    if (activeTab === "completed")
      return filteredDesigns.filter((d) => d.isComplete);
    return filteredDesigns.filter((d) => !d.isComplete); // drafts
  };

  // Delete design handler
  const handleDeleteDesign = (id) => {
    localStorage.removeItem(`roomDesign:${id}`);
    setDesigns((prev) => prev.filter((d) => d.id !== id));
  };

  // Sidebar content for both desktop and mobile
  const renderSidebarContent = () => (
    <>
      {/* Logo and branding - Updated with Link component */}
      <div className="flex items-center justify-between px-4 h-16 border-b border-blue-700">
        <Link
          to="/"
          className="flex items-center group transition-opacity hover:opacity-90"
        >
          <CubeIcon className="h-8 w-8 text-white" />
          {!isSidebarCollapsed && (
            <span className="ml-2 text-xl font-bold text-white">IKAE</span>
          )}
        </Link>
        {isMobileSidebarOpen && (
          <button
            onClick={toggleMobileSidebar}
            className="text-white md:hidden p-1 rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-white"
            aria-label="Close sidebar"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        )}
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto py-6 px-3">
        <ul className="space-y-2">
          <li>
            <Link
              to="/dashboard"
              className="flex items-center p-3 text-white bg-blue-700 rounded-xl hover:bg-blue-600 transition-colors duration-200"
            >
              <HomeIcon className="h-5 w-5" />
              {!isSidebarCollapsed && <span className="ml-3">Dashboard</span>}
            </Link>
          </li>
          <li>
            <Link
              to="/designs"
              className="flex items-center p-3 text-blue-100 rounded-xl hover:bg-blue-700 transition-colors duration-200"
            >
              <FolderIcon className="h-5 w-5" />
              {!isSidebarCollapsed && <span className="ml-3">My Designs</span>}
            </Link>
          </li>
          <li>
            <Link
              to="/templates"
              className="flex items-center p-3 text-blue-100 rounded-xl hover:bg-blue-700 transition-colors duration-200"
            >
              <UsersIcon className="h-5 w-5" />
              {!isSidebarCollapsed && <span className="ml-3">Templates</span>}
            </Link>
          </li>
          <li>
            <Link
              to="/settings"
              className="flex items-center p-3 text-blue-100 rounded-xl hover:bg-blue-700 transition-colors duration-200"
            >
              <Cog6ToothIcon className="h-5 w-5" />
              {!isSidebarCollapsed && <span className="ml-3">Settings</span>}
            </Link>
          </li>
        </ul>
      </nav>

      {/* Collapse Button - desktop only */}
      {!isMobileSidebarOpen && (
        <div className="p-4 border-t border-blue-700">
          <button
            onClick={toggleSidebar}
            className="flex items-center justify-center w-full p-2 text-sm text-white bg-blue-700 rounded-lg hover:bg-blue-600 transition-colors duration-200"
            aria-label={
              isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"
            }
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className={`w-5 h-5 ${
                isSidebarCollapsed ? "rotate-180" : ""
              } transition-transform duration-300`}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M18.75 19.5l-7.5-7.5 7.5-7.5m-6 15L5.25 12l7.5-7.5"
              />
            </svg>
          </button>

          {/* Exit Button - added below collapse button */}
          <Link
            to="/"
            className="flex items-center justify-center w-full p-2 mt-2 text-sm text-white bg-white-500 rounded-lg hover:bg-red-700 transition-colors duration-200"
            aria-label="Exit application"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5 mr-1"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.5 0 002.25-2.25V15"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M18.75 12l-7.5 7.5m0-15l7.5 7.5"
              />
            </svg>
            {!isSidebarCollapsed && <span>Exit</span>}
          </Link>
        </div>
      )}
    </>
  );

  const renderDashboardHeaderUserMenu = () => {
    if (!currentUser) {
      // Optionally, handle the case where currentUser is null, though PrivateRoute should prevent this
      return null;
    }

    return (
      <div className="relative user-menu"> {/* Add 'user-menu' class here */}
        <button
          onClick={toggleUserMenu}
          className="flex items-center p-1 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {currentUser.avatar ? (
            <img
              className="h-8 w-8 rounded-full object-cover"
              src={currentUser.avatar}
              alt="User avatar"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = ""; /* Fallback handled by UserCircleIcon below */
              }}
            />
          ) : (
            <UserCircleIcon className="h-8 w-8 text-gray-500" />
          )}
          <span className="ml-2 hidden md:block text-sm font-medium text-gray-700">
            {currentUser.firstName}
          </span>
          <ChevronDownIcon className="ml-1 h-4 w-4 text-gray-400 hidden md:block" />
        </button>
        {isUserMenuOpen && (
          <div className="absolute right-0 mt-2 w-56 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="py-1">
              <div className="px-4 py-3 border-b border-gray-100">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {currentUser.firstName} {currentUser.lastName}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {currentUser.email}
                </p>
              </div>
              <Link
                to="/profile" // This 'to' prop is still useful for context (e.g., right-click open in new tab)
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={(e) => {
                  e.preventDefault(); // Crucial: Prevent Link's default navigation
                  setIsUserMenuOpen(false); // Close the menu
                  navigate('/profile'); // Programmatically navigate
                }}
              >
                <UserCircleIcon className="mr-2 h-5 w-5 text-gray-400" />
                Your Profile
              </Link>
              {/* Add other dashboard-specific menu items if needed */}
              <button
                onClick={handleLogout}
                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600"
              >
                <ArrowRightOnRectangleIcon className="mr-2 h-5 w-5 text-gray-400 group-hover:text-red-500" />
                Sign Out
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Desktop Sidebar */}
      <div
        className={`${
          isSidebarCollapsed ? "w-20" : "w-64"
        } bg-blue-800 text-white transition-all duration-300 ease-in-out h-full hidden md:flex flex-col`}
      >
        {renderSidebarContent()}
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileSidebarOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity"
            onClick={toggleMobileSidebar}
          />
          <div className="fixed inset-y-0 left-0 flex flex-col w-64 bg-blue-800 text-white shadow-xl">
            {renderSidebarContent()}
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation Bar */}
        <header className="bg-white shadow-sm z-10">
          <div className="flex items-center justify-between h-16 px-4 md:px-6">
            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 rounded-md text-gray-500 hover:text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={toggleMobileSidebar}
              aria-label="Open sidebar"
            >
              <Bars3Icon className="h-6 w-6" />
            </button>

            {/* Search Bar */}
            <div className="relative w-full max-w-md mx-auto md:mx-0">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Search designs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Right side icons */}
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <div className="relative notification-menu">
                <button
                  onClick={toggleNotifications}
                  className="p-2 text-gray-500 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label="Notifications"
                  aria-expanded={isNotificationsOpen}
                >
                  <BellIcon className="h-6 w-6" />
                  <span className="absolute top-0 right-0 block h-2.5 w-2.5 rounded-full bg-red-500 border-2 border-white"></span>
                </button>

                {/* Notifications Dropdown */}
                {isNotificationsOpen && (
                  <div className="origin-top-right absolute right-0 mt-2 w-80 rounded-xl shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none overflow-hidden">
                    <div className="py-2">
                      <div className="px-4 py-2 border-b border-gray-200">
                        <h3 className="text-sm font-semibold text-gray-800">
                          Notifications
                        </h3>
                      </div>
                      <div className="max-h-72 overflow-y-auto">
                        <div className="px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer">
                          <p className="text-sm font-medium text-gray-800">
                            Design approved
                          </p>
                          <p className="text-xs text-gray-600 mt-1">
                            Your "Modern Living Room" design was approved.
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            1 hour ago
                          </p>
                        </div>
                        <div className="px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer">
                          <p className="text-sm font-medium text-gray-800">
                            New comment
                          </p>
                          <p className="text-xs text-gray-600 mt-1">
                            Alex commented on your "Kitchen Redesign".
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            Yesterday
                          </p>
                        </div>
                      </div>
                      <div className="px-4 py-2 border-t border-gray-200">
                        <button className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors">
                          View all notifications
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* User Menu */}
              {renderDashboardHeaderUserMenu()}
            </div>
          </div>
        </header>

        {/* Main Dashboard Content */}
        <main className="flex-1 overflow-y-auto bg-slate-50 p-4 md:p-6">
          <div className="max-w-7xl mx-auto">
            {/* Welcome Header and Create Button */}
            <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0 mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Welcome back, Gagana
                </h1>
                <p className="text-gray-600 mt-1">
                  Here's an overview of your recent designs and activity
                </p>
              </div>
              <div>
                <Link
                  to="/room"
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                >
                  <PlusIcon className="h-5 w-5 mr-2" />
                  Create New Design
                </Link>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6">
              {/* Total Designs */}
              <div className="bg-white overflow-hidden shadow-sm rounded-xl p-6 transition-all duration-200 hover:shadow-md">
                <div className="flex items-center">
                  <div className="flex-shrink-0 p-3 rounded-xl bg-blue-100 text-blue-600">
                    <FolderIcon className="h-6 w-6" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Total Designs
                      </dt>
                      <dd>
                        <div className="text-xl font-semibold text-gray-900">
                          12
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>

              {/* Completed Projects */}
              <div className="bg-white overflow-hidden shadow-sm rounded-xl p-6 transition-all duration-200 hover:shadow-md">
                <div className="flex items-center">
                  <div className="flex-shrink-0 p-3 rounded-xl bg-blue-100 text-blue-600">
                    <CheckCircleIcon className="h-6 w-6" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Completed Projects
                      </dt>
                      <dd>
                        <div className="text-xl font-semibold text-gray-900">
                          8
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>

              {/* Active This Month */}
              <div className="bg-white overflow-hidden shadow-sm rounded-xl p-6 transition-all duration-200 hover:shadow-md">
                <div className="flex items-center">
                  <div className="flex-shrink-0 p-3 rounded-xl bg-blue-100 text-blue-600">
                    <CalendarIcon className="h-6 w-6" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Active This Month
                      </dt>
                      <dd>
                        <div className="text-xl font-semibold text-gray-900">
                          5
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Designs Section */}
            <div className="bg-white shadow-sm rounded-xl overflow-hidden mb-8 transition-all duration-200 hover:shadow-md">
              {/* Section Header and Tabs */}
              <div className="px-6 py-5 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-medium text-gray-900">
                    Recent Designs
                  </h2>
                  <Link
                    to="/designs"
                    className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors duration-200"
                  >
                    View all
                  </Link>
                </div>
                <div className="mt-4 border-b border-gray-200">
                  <nav className="-mb-px flex space-x-8 overflow-x-auto hide-scrollbar">
                    <button
                      onClick={() => setActiveTab("all")}
                      className={`${
                        activeTab === "all"
                          ? "border-blue-500 text-blue-600"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                      } whitespace-nowrap pb-3 px-1 border-b-2 font-medium text-sm transition-colors duration-200`}
                    >
                      All Designs
                    </button>
                    <button
                      onClick={() => setActiveTab("completed")}
                      className={`${
                        activeTab === "completed"
                          ? "border-blue-500 text-blue-600"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                      } whitespace-nowrap pb-3 px-1 border-b-2 font-medium text-sm transition-colors duration-200`}
                    >
                      Completed
                    </button>
                    <button
                      onClick={() => setActiveTab("drafts")}
                      className={`${
                        activeTab === "drafts"
                          ? "border-blue-500 text-blue-600"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                      } whitespace-nowrap pb-3 px-1 border-b-2 font-medium text-sm transition-colors duration-200`}
                    >
                      Drafts
                    </button>
                  </nav>
                </div>
              </div>

              {/* Design Grid or Empty State */}
              <div className="p-6">
                {getFilteredDesigns().length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                    {getFilteredDesigns().map((design) => (
                      <div
                        key={design.id}
                        className="group relative bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-1"
                      >
                        <div>
                          <div className="aspect-w-16 aspect-h-9 bg-gray-200 group-hover:opacity-90 transition-opacity duration-200">
                            <img
                              src={design.thumbnail}
                              alt={design.name}
                              className="w-full h-full object-cover"
                            />
                            {design.isComplete && (
                              <div className="absolute top-2 right-2">
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                                  <CheckCircleIcon className="h-3 w-3 mr-1" />
                                  Complete
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="p-4">
                            <h3 className="text-sm font-medium text-gray-900 mb-1">
                              {design.name}
                            </h3>
                            <div className="flex items-center text-xs text-gray-500">
                              <ClockIcon className="h-3 w-3 mr-1" />
                              <span>Modified {design.lastModified}</span>
                            </div>
                          </div>
                        </div>
                        {/* Hover Actions */}
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200">
                          <div className="flex space-x-2">
                            <button
                              className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors duration-200"
                              title="Edit design"
                              aria-label={`Edit ${design.name}`}
                              onClick={() =>
                                navigate("/studio", {
                                  state: { loadedDesign: design },
                                })
                              }
                            >
                              <PencilIcon className="h-5 w-5 text-gray-600" />
                            </button>
                            <button
                              className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors duration-200"
                              title="Delete design"
                              aria-label={`Delete ${design.name}`}
                              onClick={() => handleDeleteDesign(design.id)}
                            >
                              <XMarkIcon className="h-5 w-5 text-red-600" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  // Empty state when no designs found
                  <div className="text-center py-12">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
                      />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">
                      No designs found
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Get started by creating a new design.
                    </p>
                    <div className="mt-6">
                      <Link
                        to="/room"
                        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        <PlusIcon
                          className="-ml-1 mr-2 h-5 w-5"
                          aria-hidden="true"
                        />
                        New Design
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions Section */}
            <div className="bg-white shadow-sm rounded-xl overflow-hidden transition-all duration-200 hover:shadow-md">
              <div className="px-6 py-5 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">
                  Quick Actions
                </h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Import Design Action */}
                  <button className="flex items-center p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-200 hover:border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <div className="flex-shrink-0 p-2 rounded-xl bg-sky-100 text-sky-600">
                      <ArrowUpOnSquareIcon className="h-5 w-5" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-sm font-medium text-gray-900">
                        Import Design
                      </h3>
                      <p className="text-xs text-gray-500 mt-1">
                        Upload existing designs
                      </p>
                    </div>
                  </button>

                  {/* Sync Projects Action */}
                  <button className="flex items-center p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-200 hover:border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <div className="flex-shrink-0 p-2 rounded-xl bg-blue-100 text-blue-600">
                      <ArrowPathIcon className="h-5 w-5" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-sm font-medium text-gray-900">
                        Sync Projects
                      </h3>
                      <p className="text-xs text-gray-500 mt-1">
                        Update from cloud storage
                      </p>
                    </div>
                  </button>

                  {/* Get Support Action */}
                  <button className="flex items-center p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-200 hover:border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <div className="flex-shrink-0 p-2 rounded-xl bg-blue-100 text-blue-600">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
                        />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-sm font-medium text-gray-900">
                        Get Support
                      </h3>
                      <p className="text-xs text-gray-500 mt-1">
                        Contact our design experts
                      </p>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;
