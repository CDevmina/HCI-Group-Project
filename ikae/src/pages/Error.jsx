import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  ExclamationTriangleIcon,
  ArrowLeftIcon,
  HomeIcon,
  MagnifyingGlassIcon,
  EnvelopeIcon,
  ChatBubbleLeftRightIcon,
  ArrowPathIcon,
  QuestionMarkCircleIcon,
  XCircleIcon,
  ShieldExclamationIcon,
  WifiIcon,
  AdjustmentsHorizontalIcon,
  RocketLaunchIcon,
  BookOpenIcon,
} from "@heroicons/react/24/outline";

/**
 * ERROR_TYPES - Configurations for different error scenarios
 * Each error type contains styling information, messages, and visual elements
 */
const ERROR_TYPES = {
  404: {
    title: "Page not found",
    message: "We couldn't find the page you're looking for.",
    icon: XCircleIcon,
    color: "text-blue-500",
    bgColor: "bg-blue-100",
    lightColor: "text-blue-400",
    darkColor: "text-blue-600",
    suggestions: [
      "Check the URL for typos",
      "The page might have been moved or deleted",
      "You might not have access to this page",
    ],
    illustration: (
      <div className="relative">
        <div className="absolute inset-0 bg-blue-500/5 animate-pulse rounded-full"></div>
        <svg
          className="w-full h-full"
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M32 32L68 68M68 32L32 68"
            stroke="currentColor"
            strokeWidth="5"
            strokeLinecap="round"
            className="text-blue-500"
          />
          <circle
            cx="50"
            cy="50"
            r="35"
            stroke="currentColor"
            strokeWidth="5"
            className="text-blue-300"
          />
        </svg>
      </div>
    ),
  },
  500: {
    title: "Server error",
    message: "Sorry, our server encountered an unexpected error.",
    icon: ExclamationTriangleIcon,
    color: "text-red-500",
    bgColor: "bg-red-100",
    lightColor: "text-red-400",
    darkColor: "text-red-600",
    suggestions: [
      "Try refreshing the page",
      "Try again later as we might be experiencing technical difficulties",
      "Our team has been notified of this issue",
    ],
    illustration: (
      <div className="relative">
        <div className="absolute inset-0 bg-red-500/5 animate-pulse rounded-full"></div>
        <svg
          className="w-full h-full"
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M50 25V60"
            stroke="currentColor"
            strokeWidth="5"
            strokeLinecap="round"
            className="text-red-500"
          />
          <circle
            cx="50"
            cy="70"
            r="4"
            fill="currentColor"
            className="text-red-500"
          />
          <circle
            cx="50"
            cy="50"
            r="35"
            stroke="currentColor"
            strokeWidth="5"
            className="text-red-300"
          />
        </svg>
      </div>
    ),
  },
  403: {
    title: "Access denied",
    message: "You don't have permission to access this page.",
    icon: ShieldExclamationIcon,
    color: "text-yellow-500",
    bgColor: "bg-yellow-100",
    lightColor: "text-yellow-400",
    darkColor: "text-yellow-600",
    suggestions: [
      "Check if you're signed in with the correct account",
      "Contact your administrator if you need access",
      "Return to the homepage",
    ],
    illustration: (
      <div className="relative">
        <div className="absolute inset-0 bg-yellow-500/5 animate-pulse rounded-full"></div>
        <svg
          className="w-full h-full"
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M50 40V60"
            stroke="currentColor"
            strokeWidth="5"
            strokeLinecap="round"
            className="text-yellow-500"
          />
          <circle
            cx="50"
            cy="70"
            r="4"
            fill="currentColor"
            className="text-yellow-500"
          />
          <path
            d="M30 35C30 35 38 25 50 25C62 25 70 35 70 35V50C70 64 60 75 50 75C40 75 30 64 30 50V35Z"
            stroke="currentColor"
            strokeWidth="5"
            className="text-yellow-300"
          />
        </svg>
      </div>
    ),
  },
  network: {
    title: "Network error",
    message:
      "Unable to connect to our servers. Check your internet connection.",
    icon: WifiIcon,
    color: "text-purple-500",
    bgColor: "bg-purple-100",
    lightColor: "text-purple-400",
    darkColor: "text-purple-600",
    suggestions: [
      "Check your internet connection",
      "Try refreshing the page",
      "Your firewall or security software might be blocking access",
    ],
    illustration: (
      <div className="relative">
        <div className="absolute inset-0 bg-purple-500/5 animate-pulse rounded-full"></div>
        <svg
          className="w-full h-full"
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M30 50C36.667 43.333 43.333 40 50 40C56.667 40 63.333 43.333 70 50"
            stroke="currentColor"
            strokeWidth="5"
            strokeLinecap="round"
            className="text-purple-300"
          />
          <path
            d="M25 40C35 30 42.5 25 50 25C57.5 25 65 30 75 40"
            stroke="currentColor"
            strokeWidth="5"
            strokeLinecap="round"
            className="text-purple-200"
          />
          <circle
            cx="50"
            cy="65"
            r="5"
            fill="currentColor"
            className="text-purple-500"
          />
        </svg>
      </div>
    ),
  },
  unknown: {
    title: "Something went wrong",
    message: "An unexpected error occurred.",
    icon: QuestionMarkCircleIcon,
    color: "text-gray-500",
    bgColor: "bg-gray-100",
    lightColor: "text-gray-400",
    darkColor: "text-gray-600",
    suggestions: [
      "Try refreshing the page",
      "Try again later",
      "Contact support if the problem persists",
    ],
    illustration: (
      <div className="relative">
        <div className="absolute inset-0 bg-gray-500/5 animate-pulse rounded-full"></div>
        <svg
          className="w-full h-full"
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M50 35V50"
            stroke="currentColor"
            strokeWidth="5"
            strokeLinecap="round"
            className="text-gray-500"
          />
          <circle
            cx="50"
            cy="65"
            r="4"
            fill="currentColor"
            className="text-gray-500"
          />
          <circle
            cx="50"
            cy="50"
            r="35"
            stroke="currentColor"
            strokeWidth="5"
            className="text-gray-300"
          />
        </svg>
      </div>
    ),
  },
};

/**
 * Quick links for navigation options
 */
const RECOMMENDED_PAGES = [
  {
    name: "Dashboard",
    path: "/dashboard",
    description: "View your dashboard",
    icon: AdjustmentsHorizontalIcon,
  },
  {
    name: "Design Studio",
    path: "/design-studio",
    description: "Create a new design",
    icon: RocketLaunchIcon,
  },
  {
    name: "Saved Designs",
    path: "/saved-designs",
    description: "Browse your saved designs",
    icon: BookOpenIcon,
  },
  {
    name: "Help Center",
    path: "/help",
    description: "Find guides and tutorials",
    icon: QuestionMarkCircleIcon,
  },
];

/**
 * ErrorPage Component
 * A responsive, user-friendly error page that provides context, suggestions,
 * and navigation options based on the type of error encountered
 */
const ErrorPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [errorType, setErrorType] = useState("unknown");
  const [searchQuery, setSearchQuery] = useState("");
  const [isRetrying, setIsRetrying] = useState(false);
  const [countdown, setCountdown] = useState(null);
  const [errorDetails, setErrorDetails] = useState(null);

  // Determine error type from URL parameters or location state
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const code = params.get("code") || (location.state && location.state.code);
    const details =
      params.get("details") || (location.state && location.state.details);

    if (code && ERROR_TYPES[code]) {
      setErrorType(code);
    } else if (location.pathname.includes("404")) {
      setErrorType("404");
    } else if (details && details.includes("network")) {
      setErrorType("network");
    }

    if (details) {
      setErrorDetails(details);
    }
  }, [location]);

  // Get error configuration based on current error type
  const errorInfo = ERROR_TYPES[errorType] || ERROR_TYPES.unknown;
  const ErrorIcon = errorInfo.icon;

  // Handle search form submission
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  // Handle retry action with countdown
  const handleRetry = () => {
    setIsRetrying(true);
    setCountdown(3);

    const interval = setInterval(() => {
      setCountdown((prevCount) => {
        if (prevCount <= 1) {
          clearInterval(interval);

          // Navigate back or reload based on error type
          if (errorType === "404") {
            navigate(-1);
          } else {
            window.location.reload();
          }
          return 0;
        }
        return prevCount - 1;
      });
    }, 1000);
  };

  // Navigate back intelligently based on history
  const handleGoBack = () => {
    if (window.history.length > 2) {
      navigate(-1);
    } else {
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <main className="flex-grow flex items-center justify-center p-4 sm:p-6 md:p-8">
        <div className="w-full max-w-4xl mx-auto">
          <div className="grid md:grid-cols-5 gap-8">
            {/* Left Column: Error Information */}
            <div className="md:col-span-3 space-y-8">
              <div className="bg-white shadow-lg rounded-2xl overflow-hidden border border-gray-100 transition-all duration-300 hover:shadow-xl">
                <div className="p-6 sm:p-8">
                  {/* Error Illustration */}
                  <div className="w-32 h-32 mx-auto mb-6">
                    {errorInfo.illustration}
                  </div>

                  {/* Error Code */}
                  <div className="text-center mb-6">
                    <div className="inline-block px-4 py-2 rounded-full bg-gray-100 text-gray-800 font-mono text-sm">
                      {errorType !== "unknown" ? errorType : "Error"}
                    </div>
                  </div>

                  {/* Error Message */}
                  <div className="text-center mb-8">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                      {errorInfo.title}
                    </h1>
                    <p className="text-gray-600 text-lg">{errorInfo.message}</p>
                  </div>

                  {/* Error Details (if available) */}
                  {errorDetails && (
                    <div className="mt-6 p-4 bg-gray-50 rounded-xl text-sm text-gray-700 font-mono overflow-x-auto">
                      <div className="font-medium mb-1 text-gray-900">
                        Error details:
                      </div>
                      <div className="whitespace-pre-wrap break-words">
                        {errorDetails}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="mt-8 flex flex-wrap justify-center gap-4">
                    <button
                      onClick={handleGoBack}
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 hover:shadow-md"
                    >
                      <ArrowLeftIcon className="mr-2 h-5 w-5" />
                      Go Back
                    </button>
                    <Link
                      to="/"
                      className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 hover:shadow-md"
                    >
                      <HomeIcon className="mr-2 h-5 w-5" />
                      Go to Home
                    </Link>
                    <button
                      onClick={handleRetry}
                      disabled={isRetrying}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ArrowPathIcon
                        className={`mr-2 h-5 w-5 ${
                          isRetrying ? "animate-spin" : ""
                        }`}
                      />
                      {isRetrying ? `Retrying (${countdown})...` : "Try Again"}
                    </button>
                  </div>
                </div>
              </div>

              {/* Suggestions */}
              <div className="bg-white shadow-lg rounded-2xl overflow-hidden border border-gray-100">
                <div className="p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <span className={`mr-2 ${errorInfo.color}`}>
                      <ErrorIcon className="h-5 w-5" />
                    </span>
                    Suggestions
                  </h2>
                  <ul className="space-y-3">
                    {errorInfo.suggestions.map((suggestion, i) => (
                      <li
                        key={i}
                        className="flex items-start py-2 px-3 rounded-lg transition-colors hover:bg-gray-50"
                      >
                        <span
                          className={`flex-shrink-0 h-5 w-5 ${errorInfo.color} mr-2`}
                        >
                          •
                        </span>
                        <span className="text-gray-700">{suggestion}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Search */}
              <div className="bg-white shadow-lg rounded-2xl overflow-hidden border border-gray-100">
                <div className="p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Looking for something specific?
                  </h2>
                  <form
                    onSubmit={handleSearch}
                    className="flex rounded-lg shadow-sm overflow-hidden border border-gray-300 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all duration-200"
                  >
                    <div className="relative flex-grow">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <MagnifyingGlassIcon
                          className="h-5 w-5 text-gray-400"
                          aria-hidden="true"
                        />
                      </div>
                      <input
                        type="text"
                        name="search"
                        id="search"
                        className="block w-full pl-10 py-3 border-0 focus:ring-0 text-gray-900 placeholder-gray-500 sm:text-sm"
                        placeholder="Search designs, tutorials, etc."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 focus:outline-none transition-colors duration-200"
                    >
                      Search
                    </button>
                  </form>
                </div>
              </div>
            </div>

            {/* Right Column: Help Resources */}
            <div className="md:col-span-2 space-y-6">
              {/* Recommended Pages */}
              <div className="bg-white shadow-lg rounded-2xl overflow-hidden border border-gray-100">
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Recommended Pages
                  </h3>
                  <div className="space-y-3">
                    {RECOMMENDED_PAGES.map((page) => (
                      <Link
                        key={page.path}
                        to={page.path}
                        className="flex items-center p-3 rounded-xl transition-all duration-200 hover:bg-gray-50 group"
                      >
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 group-hover:bg-blue-200 transition-colors">
                          <page.icon className="h-5 w-5" />
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                            {page.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {page.description}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              {/* Need Help Card */}
              <div className="bg-white shadow-lg rounded-2xl overflow-hidden border border-gray-100">
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Need Help?
                  </h3>
                  <div className="space-y-3">
                    <Link
                      to="/help"
                      className="flex items-center p-3 rounded-xl transition-all duration-200 hover:bg-gray-50 group"
                    >
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-200 transition-colors">
                        <QuestionMarkCircleIcon className="h-5 w-5" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900 group-hover:text-indigo-600 transition-colors">
                          Help Center
                        </p>
                        <p className="text-xs text-gray-500">
                          Find answers to common questions
                        </p>
                      </div>
                    </Link>

                    <Link
                      to="/support/chat"
                      className="flex items-center p-3 rounded-xl transition-all duration-200 hover:bg-gray-50 group"
                    >
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 group-hover:bg-green-200 transition-colors">
                        <ChatBubbleLeftRightIcon className="h-5 w-5" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900 group-hover:text-green-600 transition-colors">
                          Live Chat
                        </p>
                        <p className="text-xs text-gray-500">
                          Chat with our support team
                        </p>
                      </div>
                    </Link>

                    <Link
                      to="/contact"
                      className="flex items-center p-3 rounded-xl transition-all duration-200 hover:bg-gray-50 group"
                    >
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 group-hover:bg-amber-200 transition-colors">
                        <EnvelopeIcon className="h-5 w-5" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900 group-hover:text-amber-600 transition-colors">
                          Email Support
                        </p>
                        <p className="text-xs text-gray-500">
                          Send us a message
                        </p>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>

              {/* System Status */}
              <div className="bg-white shadow-lg rounded-2xl overflow-hidden border border-gray-100">
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    System Status
                  </h3>
                  <div className="flex items-center justify-between bg-green-50 p-3 rounded-lg">
                    <div className="flex items-center">
                      <div className="h-3 w-3 rounded-full bg-green-500 mr-2"></div>
                      <span className="text-sm text-green-800 font-medium">
                        All systems operational
                      </span>
                    </div>
                    <Link
                      to="/status"
                      className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                    >
                      View status
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ErrorPage;
