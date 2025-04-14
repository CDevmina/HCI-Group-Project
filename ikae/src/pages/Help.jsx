import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  MagnifyingGlassIcon,
  QuestionMarkCircleIcon,
  BookOpenIcon,
  AcademicCapIcon,
  VideoCameraIcon,
  ChatBubbleLeftRightIcon,
  UserGroupIcon,
  ArrowRightIcon,
  ChevronRightIcon,
  ChevronDownIcon,
  EnvelopeIcon,
  PhoneIcon,
  HomeIcon,
  RocketLaunchIcon,
  PuzzlePieceIcon,
  Cog6ToothIcon,
  LifebuoyIcon,
  DocumentTextIcon,
  StarIcon,
  ArrowPathIcon,
  ArrowTrendingUpIcon,
  ChevronLeftIcon,
  CheckCircleIcon,
  EllipsisHorizontalIcon,
  XMarkIcon,
  ArrowUpCircleIcon,
} from "@heroicons/react/24/outline";
import Navbar from "../components/UI/Navbar";
import Footer from "../components/UI/Footer";

// Mock data for help articles
const HELP_CATEGORIES = [
  {
    id: "getting-started",
    name: "Getting Started",
    icon: RocketLaunchIcon,
    description: "Learn the basics and get up and running quickly",
    articles: [
      {
        id: "gs-1",
        title: "Creating your first design",
        popular: true,
        timeToRead: "5 min",
      },
      {
        id: "gs-2",
        title: "Understanding the interface",
        popular: true,
        timeToRead: "8 min",
      },
      { id: "gs-3", title: "Navigating the workspace", timeToRead: "4 min" },
      {
        id: "gs-4",
        title: "Saving and exporting designs",
        timeToRead: "6 min",
      },
      {
        id: "gs-5",
        title: "Account setup and preferences",
        timeToRead: "3 min",
      },
    ],
  },
  {
    id: "design-tools",
    name: "Design Tools",
    icon: PuzzlePieceIcon,
    description: "Master the powerful design tools at your disposal",
    articles: [
      {
        id: "dt-1",
        title: "2D and 3D view modes",
        popular: true,
        timeToRead: "7 min",
      },
      {
        id: "dt-2",
        title: "Adding and arranging furniture",
        timeToRead: "10 min",
      },
      {
        id: "dt-3",
        title: "Working with materials and colors",
        timeToRead: "8 min",
      },
      {
        id: "dt-4",
        title: "Room measurements and scaling",
        timeToRead: "6 min",
      },
      { id: "dt-5", title: "Using the furniture catalog", timeToRead: "5 min" },
    ],
  },
  {
    id: "advanced-features",
    name: "Advanced Features",
    icon: Cog6ToothIcon,
    description: "Take your designs to the next level with advanced techniques",
    articles: [
      { id: "af-1", title: "Creating custom furniture", timeToRead: "12 min" },
      { id: "af-2", title: "Lighting and shadow effects", timeToRead: "9 min" },
      {
        id: "af-3",
        title: "AR visualization options",
        popular: true,
        timeToRead: "7 min",
      },
      {
        id: "af-4",
        title: "Design annotations and notes",
        timeToRead: "5 min",
      },
      { id: "af-5", title: "Collaboration and sharing", timeToRead: "8 min" },
    ],
  },
  {
    id: "troubleshooting",
    name: "Troubleshooting",
    icon: LifebuoyIcon,
    description: "Solve common issues and get back to designing",
    articles: [
      { id: "ts-1", title: "Connection problems", timeToRead: "4 min" },
      {
        id: "ts-2",
        title: "Loading and performance issues",
        timeToRead: "6 min",
      },
      {
        id: "ts-3",
        title: "Missing or corrupted designs",
        popular: true,
        timeToRead: "7 min",
      },
      { id: "ts-4", title: "Account access and recovery", timeToRead: "5 min" },
      { id: "ts-5", title: "Export and sharing troubles", timeToRead: "8 min" },
    ],
  },
];

// Frequently asked questions
const FAQS = [
  {
    question: "How do I create a new room design?",
    answer:
      "To create a new room design, click on the \"New Design\" button on your dashboard. You'll be prompted to select the room type and dimensions. After setting up the basic parameters, you'll be taken to the design studio where you can add furniture and customize your space.",
  },
  {
    question: "Can I import my own furniture models?",
    answer:
      'Yes, you can import custom furniture models in OBJ, FBX, or STL formats. Go to the furniture catalog, click on "Custom Furniture" and then "Import Model". Follow the instructions to upload and scale your model correctly.',
  },
  {
    question: "How do I share my designs with clients?",
    answer:
      'There are several ways to share your designs. You can generate a shareable link by clicking the "Share" button in the design preview page. You can also export as PDF or high-resolution images. For interactive viewing, you can invite clients via email which will give them view-only access to your design.',
  },
  {
    question: "Is there a limit to how many designs I can save?",
    answer:
      "Free accounts can save up to 5 designs. Professional accounts have unlimited design storage. You can view your current usage and limits in the Account Settings page.",
  },
  {
    question: "How accurate are the measurements in the app?",
    answer:
      "Our application uses precise scaling to ensure measurements are accurate. You can work in metric or imperial units. For professional use cases, measurements are accurate within 1cm/0.5in, which is suitable for most interior design planning purposes.",
  },
  {
    question: "Can I use the app offline?",
    answer:
      "The web application requires an internet connection, but we do offer a desktop version with offline capabilities. Any designs created offline will sync to your account once you reconnect to the internet.",
  },
  {
    question: "How do I view my design in AR (Augmented Reality)?",
    answer:
      'To view your design in AR, open the design and click the "AR View" button in the toolbar. You can then either scan the QR code with your mobile device or use the AR feature directly if you\'re on a compatible device. Our AR mode works on recent iOS and Android devices.',
  },
];

// Video tutorials
const VIDEO_TUTORIALS = [
  {
    id: "video-1",
    title: "Getting Started with IKAE",
    thumbnail:
      "https://placehold.co/600x400/e5e7eb/64748b?text=Getting+Started",
    duration: "12:34",
    description:
      "Learn the basics of using IKAE to create your first room layout.",
  },
  {
    id: "video-2",
    title: "Advanced Furniture Placement",
    thumbnail:
      "https://placehold.co/600x400/e5e7eb/64748b?text=Furniture+Placement",
    duration: "08:45",
    description:
      "Master the techniques for perfect furniture arrangement and spacing.",
  },
  {
    id: "video-3",
    title: "Working with Color Schemes",
    thumbnail: "https://placehold.co/600x400/e5e7eb/64748b?text=Color+Schemes",
    duration: "15:20",
    description:
      "Discover how to create harmonious color palettes for your designs.",
  },
  {
    id: "video-4",
    title: "3D Visualization Techniques",
    thumbnail:
      "https://placehold.co/600x400/e5e7eb/64748b?text=3D+Visualization",
    duration: "10:15",
    description:
      "Take your designs to the next level with advanced 3D visualization.",
  },
];

// Popular search terms
const POPULAR_SEARCHES = [
  "how to add furniture",
  "export designs",
  "change room dimensions",
  "share with client",
  "custom furniture",
  "color schemes",
  "ar view",
];

const HelpDocumentationPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [expandedFaqs, setExpandedFaqs] = useState({});
  const [activeCategory, setActiveCategory] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const searchRef = useRef(null);

  // Detect scroll position for scroll-to-top button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle search input
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.trim().length > 1) {
      // Simulate search results
      setIsSearching(true);
      setTimeout(() => {
        const results = performSearch(query);
        setSearchResults(results);
        setShowSearchResults(true);
        setIsSearching(false);
      }, 300);
    } else {
      setShowSearchResults(false);
    }
  };

  // Handle click outside search results to close them
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Simulated search function
  const performSearch = (query) => {
    query = query.toLowerCase();
    const results = [];

    // Search in articles
    HELP_CATEGORIES.forEach((category) => {
      category.articles.forEach((article) => {
        if (article.title.toLowerCase().includes(query)) {
          results.push({
            type: "article",
            category: category.name,
            item: article,
            categoryId: category.id,
          });
        }
      });
    });

    // Search in FAQs
    FAQS.forEach((faq, index) => {
      if (
        faq.question.toLowerCase().includes(query) ||
        faq.answer.toLowerCase().includes(query)
      ) {
        results.push({
          type: "faq",
          item: faq,
          index,
        });
      }
    });

    return results;
  };

  // Handle search submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // In a real app, this would navigate to search results page
      navigate(`/help/search?q=${encodeURIComponent(searchQuery)}`);
      setShowSearchResults(false);
    }
  };

  // Toggle FAQ expansion
  const toggleFaqExpansion = (index) => {
    setExpandedFaqs((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  // Set active category from URL or default to first category
  useEffect(() => {
    const categoryFromPath = location.pathname.split("/").pop();
    const category = HELP_CATEGORIES.find((cat) => cat.id === categoryFromPath);

    if (category) {
      setActiveCategory(category.id);
    } else if (!activeCategory && HELP_CATEGORIES.length > 0) {
      setActiveCategory(HELP_CATEGORIES[0].id);
    }
  }, [location, activeCategory]);

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navbar */}
      <Navbar />

      {/* Breadcrumbs */}
      <div className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex py-3 text-sm" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2">
              <li>
                <div className="flex items-center">
                  <Link
                    to="/"
                    className="text-gray-500 hover:text-blue-600 transition-colors"
                  >
                    <HomeIcon
                      className="h-5 w-5 flex-shrink-0"
                      aria-hidden="true"
                    />
                    <span className="sr-only">Home</span>
                  </Link>
                </div>
              </li>

              <li>
                <div className="flex items-center">
                  <ChevronRightIcon
                    className="h-5 w-5 text-gray-400 flex-shrink-0"
                    aria-hidden="true"
                  />
                  <Link
                    to="/help"
                    className="ml-2 text-gray-500 hover:text-blue-600 transition-colors"
                  >
                    Help Center
                  </Link>
                </div>
              </li>

              {activeCategory && (
                <li>
                  <div className="flex items-center">
                    <ChevronRightIcon
                      className="h-5 w-5 text-gray-400 flex-shrink-0"
                      aria-hidden="true"
                    />
                    <Link
                      to={`/help/${activeCategory}`}
                      className="ml-2 text-gray-700 hover:text-blue-600 font-medium transition-colors"
                      aria-current="page"
                    >
                      {
                        HELP_CATEGORIES.find((cat) => cat.id === activeCategory)
                          ?.name
                      }
                    </Link>
                  </div>
                </li>
              )}
            </ol>
          </nav>
        </div>
      </div>

      {/* Hero Section with Search */}
      <div className="bg-gradient-to-r from-blue-50 via-blue-100 to-blue-50 border-b border-blue-100 relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg
            className="h-full w-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <path d="M0,0 L100,0 L100,100 L0,100 Z" fill="url(#grid-pattern)" />
          </svg>
          <defs>
            <pattern
              id="grid-pattern"
              width="10"
              height="10"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 10 0 L 0 0 0 10"
                fill="none"
                stroke="white"
                strokeWidth="0.5"
              />
            </pattern>
          </defs>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 relative z-10">
          <div className="text-center">
            <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl md:text-5xl">
              How can we help you?
            </h1>
            <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
              Find answers to common questions, watch tutorials, and learn how
              to make the most of IKAE.
            </p>

            {/* Search Bar */}
            <div className="mt-8 max-w-2xl mx-auto relative" ref={searchRef}>
              <form onSubmit={handleSearchSubmit} className="relative z-10">
                <div className="flex rounded-xl shadow-lg overflow-hidden">
                  <div className="relative flex-grow focus-within:z-10 bg-white">
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
                      className="focus:ring-blue-500 focus:border-blue-500 block w-full rounded-none rounded-l-xl pl-10 py-3 text-base border-gray-300"
                      placeholder="Search for help articles, tutorials, and more..."
                      value={searchQuery}
                      onChange={handleSearchChange}
                      autoComplete="off"
                      aria-label="Search help center"
                    />
                  </div>
                  <button
                    type="submit"
                    className="relative inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-r-xl text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                  >
                    Search
                  </button>
                </div>

                {/* Popular searches */}
                <div className="mt-3 flex flex-wrap justify-center text-sm text-gray-600">
                  <span className="mr-2 font-medium">Popular:</span>
                  {POPULAR_SEARCHES.map((term, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => {
                        setSearchQuery(term);
                        // Trigger search with the selected term
                        const results = performSearch(term);
                        setSearchResults(results);
                        setShowSearchResults(true);
                      }}
                      className="mr-2 mb-2 hover:text-white hover:underline focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 rounded transition-colors px-1"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </form>

              {/* Search Results Dropdown */}
              {showSearchResults && (
                <div className="absolute z-20 mt-2 w-full bg-white rounded-xl shadow-2xl max-h-96 overflow-y-auto border border-gray-100">
                  <div className="py-1 divide-y divide-gray-100">
                    {isSearching ? (
                      <div className="px-4 py-3 text-sm text-gray-500 text-center">
                        <ArrowPathIcon className="h-5 w-5 animate-spin inline-block mr-2 text-blue-500" />
                        Searching...
                      </div>
                    ) : searchResults.length > 0 ? (
                      <>
                        <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider bg-gray-50 rounded-t-xl">
                          Search Results
                        </div>
                        {searchResults.map((result, index) => (
                          <button
                            key={index}
                            className="w-full text-left px-4 py-3 hover:bg-gray-50 focus:bg-gray-50 focus:outline-none transition-colors duration-150"
                            onClick={() => {
                              // Navigate to the appropriate page based on result type
                              if (result.type === "article") {
                                navigate(
                                  `/help/${result.categoryId}/${result.item.id}`
                                );
                              } else if (result.type === "faq") {
                                navigate(`/help/faq#faq-${result.index}`);
                                setExpandedFaqs({
                                  ...expandedFaqs,
                                  [result.index]: true,
                                });
                              }
                              setShowSearchResults(false);
                            }}
                          >
                            <div className="flex items-start">
                              {result.type === "article" ? (
                                <DocumentTextIcon className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
                              ) : (
                                <QuestionMarkCircleIcon className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
                              )}
                              <div className="ml-3">
                                <div className="text-sm font-medium text-gray-900">
                                  {result.type === "article"
                                    ? result.item.title
                                    : result.item.question}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {result.type === "article"
                                    ? `${result.category} • ${result.item.timeToRead} read`
                                    : "FAQ"}
                                </div>
                              </div>
                            </div>
                          </button>
                        ))}
                        <div className="px-4 py-2 bg-gray-50 rounded-b-xl">
                          <button
                            className="text-sm text-blue-600 hover:text-blue-800 font-medium focus:outline-none focus:underline transition-colors"
                            onClick={() =>
                              navigate(
                                `/help/search?q=${encodeURIComponent(
                                  searchQuery
                                )}`
                              )
                            }
                          >
                            View all results
                            <ArrowRightIcon className="ml-1 h-4 w-4 inline-block" />
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="px-4 py-3 text-sm text-gray-500">
                        No results found for "{searchQuery}". Try different
                        keywords or browse categories below.
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Quick Links Section */}
        <section aria-labelledby="quick-links-heading" className="mb-16">
          <h2
            id="quick-links-heading"
            className="text-2xl font-bold text-gray-900 mb-6"
          >
            Quick Help Resources
          </h2>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4">
            <Link
              to="/help/videos"
              className="group bg-white overflow-hidden rounded-xl shadow-sm hover:shadow-md transition-all duration-200 transform hover:-translate-y-1 border border-gray-100"
            >
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                    <VideoCameraIcon
                      className="h-6 w-6 text-white"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="ml-5">
                    <h3 className="text-lg font-medium text-gray-900">
                      Video Tutorials
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Watch step-by-step guides
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-5 py-3 border-t border-gray-100">
                <div className="text-sm text-blue-600 flex justify-between items-center">
                  <span>Watch tutorials</span>
                  <ArrowRightIcon className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>

            <Link
              to="/help/faq"
              className="group bg-white overflow-hidden rounded-xl shadow-sm hover:shadow-md transition-all duration-200 transform hover:-translate-y-1 border border-gray-100"
            >
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                    <QuestionMarkCircleIcon
                      className="h-6 w-6 text-white"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="ml-5">
                    <h3 className="text-lg font-medium text-gray-900">FAQ</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Find answers to common questions
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-5 py-3 border-t border-gray-100">
                <div className="text-sm text-indigo-600 flex justify-between items-center">
                  <span>Read FAQs</span>
                  <ArrowRightIcon className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>

            <Link
              to="/help/guides"
              className="group bg-white overflow-hidden rounded-xl shadow-sm hover:shadow-md transition-all duration-200 transform hover:-translate-y-1 border border-gray-100"
            >
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-purple-500 rounded-md p-3">
                    <BookOpenIcon
                      className="h-6 w-6 text-white"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="ml-5">
                    <h3 className="text-lg font-medium text-gray-900">
                      User Guides
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      In-depth documentation
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-5 py-3 border-t border-gray-100">
                <div className="text-sm text-indigo-600 flex justify-between items-center">
                  <span>Browse guides</span>
                  <ArrowRightIcon className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>

            <Link
              to="/help/contact"
              className="group bg-white overflow-hidden rounded-xl shadow-sm hover:shadow-md transition-all duration-200 transform hover:-translate-y-1 border border-gray-100"
            >
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-yellow-500 rounded-md p-3">
                    <ChatBubbleLeftRightIcon
                      className="h-6 w-6 text-white"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="ml-5">
                    <h3 className="text-lg font-medium text-gray-900">
                      Contact Support
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Get personalized help
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-5 py-3 border-t border-gray-100">
                <div className="text-sm text-indigo-600 flex justify-between items-center">
                  <span>Contact us</span>
                  <ArrowRightIcon className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          </div>
        </section>

        {/* Help Categories and Articles */}
        <section aria-labelledby="help-categories-heading" className="mb-16">
          <div className="flex flex-col md:flex-row md:justify-between md:items-baseline mb-6">
            <h2
              id="help-categories-heading"
              className="text-2xl font-bold text-gray-900"
            >
              Browse Help Topics
            </h2>

            {/* Mobile Category Selector */}
            <div className="md:hidden mt-4">
              <label htmlFor="mobile-category-selector" className="sr-only">
                Select category
              </label>
              <select
                id="mobile-category-selector"
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-lg"
                value={activeCategory || ""}
                onChange={(e) => {
                  setActiveCategory(e.target.value);
                  navigate(`/help/${e.target.value}`);
                }}
                aria-label="Select help category"
              >
                {HELP_CATEGORIES.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:space-x-8">
            {/* Category Sidebar (desktop) */}
            <div className="hidden md:block w-64 flex-shrink-0">
              <nav className="bg-white shadow-sm rounded-xl overflow-hidden border border-gray-100 sticky top-4">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Categories
                  </h3>
                  <div className="mt-3 space-y-1">
                    {HELP_CATEGORIES.map((category) => (
                      <button
                        key={category.id}
                        className={`group flex items-center px-3 py-2 text-sm font-medium rounded-lg w-full transition-colors duration-150 ${
                          activeCategory === category.id
                            ? "bg-blue-50 text-blue-700"
                            : "text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                        }`}
                        onClick={() => {
                          setActiveCategory(category.id);
                          navigate(`/help/${category.id}`);
                        }}
                        aria-label={`Select ${category.name} category`}
                        aria-current={
                          activeCategory === category.id ? "page" : undefined
                        }
                      >
                        <category.icon
                          className={`mr-3 flex-shrink-0 h-5 w-5 ${
                            activeCategory === category.id
                              ? "text-blue-500"
                              : "text-gray-400 group-hover:text-gray-500"
                          }`}
                        />
                        <span>{category.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </nav>
            </div>

            {/* Articles for Selected Category */}
            <div className="flex-1 mt-6 md:mt-0">
              {HELP_CATEGORIES.map((category) => (
                <div
                  key={category.id}
                  className={`${
                    activeCategory === category.id ? "block" : "hidden"
                  }`}
                >
                  <div className="bg-white shadow-sm rounded-xl overflow-hidden mb-6 border border-gray-100">
                    <div className="px-4 py-5 sm:p-6">
                      <div className="flex items-center">
                        <category.icon className="h-6 w-6 text-blue-500 mr-3" />
                        <h3 className="text-lg font-medium text-gray-900">
                          {category.name}
                        </h3>
                      </div>
                      <p className="mt-1 text-gray-500">
                        {category.description}
                      </p>
                    </div>
                  </div>

                  <div className="bg-white shadow-sm rounded-xl overflow-hidden border border-gray-100">
                    <ul className="divide-y divide-gray-100">
                      {category.articles.map((article) => (
                        <li key={article.id}>
                          <Link
                            to={`/help/${category.id}/${article.id}`}
                            className="block hover:bg-gray-50 transition-colors duration-150"
                          >
                            <div className="px-4 py-4 sm:px-6">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                  <DocumentTextIcon className="h-5 w-5 text-gray-400 mr-3" />
                                  <p className="text-sm font-medium text-gray-900 truncate">
                                    {article.title}
                                  </p>
                                  {article.popular && (
                                    <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                      Popular
                                    </span>
                                  )}
                                </div>
                                <div className="ml-2 flex-shrink-0 flex">
                                  <p className="px-2 inline-flex text-xs leading-5 font-medium text-gray-500">
                                    {article.timeToRead} read
                                  </p>
                                  <ChevronRightIcon className="h-5 w-5 text-gray-400" />
                                </div>
                              </div>
                            </div>
                          </Link>
                        </li>
                      ))}

                      <li>
                        <Link
                          to={`/help/${category.id}/all`}
                          className="block hover:bg-gray-50 transition-colors duration-150"
                        >
                          <div className="px-4 py-4 sm:px-6 text-center">
                            <span className="text-sm font-medium text-blue-600 hover:text-blue-800">
                              View all {category.name.toLowerCase()} articles
                            </span>
                          </div>
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Video Tutorials Section */}
        <section aria-labelledby="video-tutorials-heading" className="mb-16">
          <div className="flex justify-between items-baseline mb-6">
            <h2
              id="video-tutorials-heading"
              className="text-2xl font-bold text-gray-900"
            >
              Video Tutorials
            </h2>
            <Link
              to="/help/videos"
              className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
            >
              View all videos
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {VIDEO_TUTORIALS.map((video) => (
              <div
                key={video.id}
                className="group bg-white shadow-sm rounded-xl overflow-hidden hover:shadow-md transition-all duration-200 transform hover:-translate-y-1 border border-gray-100"
              >
                <div className="relative aspect-w-16 aspect-h-9">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center group-hover:bg-opacity-30 transition-opacity">
                    <div className="h-12 w-12 bg-white bg-opacity-75 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-blue-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                  </div>

                  {/* Duration badge */}
                  <div className="absolute bottom-2 right-2">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-black bg-opacity-70 text-white">
                      {video.duration}
                    </span>
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="text-sm font-medium text-gray-900">
                    {video.title}
                  </h3>
                  <p className="mt-1 text-xs text-gray-500 line-clamp-2">
                    {video.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        <section aria-labelledby="faq-heading" className="mb-16">
          <div className="flex justify-between items-baseline mb-6">
            <h2 id="faq-heading" className="text-2xl font-bold text-gray-900">
              Frequently Asked Questions
            </h2>
            <Link
              to="/help/faq"
              className="text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
            >
              View all FAQs
            </Link>
          </div>

          <div className="bg-white shadow-sm rounded-xl overflow-hidden border border-gray-100">
            <ul className="divide-y divide-gray-100">
              {FAQS.slice(0, 5).map((faq, index) => (
                <li key={index} id={`faq-${index}`}>
                  <button
                    className="w-full text-left hover:bg-gray-50 transition-colors duration-150 px-4 py-4 sm:px-6"
                    onClick={() => toggleFaqExpansion(index)}
                    aria-expanded={expandedFaqs[index]}
                    aria-controls={`faq-answer-${index}`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-center">
                        <QuestionMarkCircleIcon className="h-5 w-5 text-blue-500 mr-3 flex-shrink-0" />
                        <span className="text-sm font-medium text-gray-900">
                          {faq.question}
                        </span>
                      </div>
                      <div className="ml-2 flex-shrink-0 flex items-center">
                        <ChevronDownIcon
                          className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${
                            expandedFaqs[index] ? "transform rotate-180" : ""
                          }`}
                        />
                      </div>
                    </div>

                    {expandedFaqs[index] && (
                      <div
                        className="mt-3 text-sm text-gray-500 ml-8 pr-8"
                        id={`faq-answer-${index}`}
                      >
                        <p>{faq.answer}</p>

                        <div className="mt-4 flex">
                          <p className="text-xs text-gray-500 mr-4">
                            Was this helpful?
                          </p>
                          <button
                            className="text-xs flex items-center text-gray-500 hover:text-gray-700 mr-3 focus:outline-none focus:text-blue-600"
                            aria-label="This was helpful"
                          >
                            <CheckCircleIcon className="h-4 w-4 mr-1" />
                            Yes
                          </button>
                          <button
                            className="text-xs flex items-center text-gray-500 hover:text-gray-700 focus:outline-none focus:text-blue-600"
                            aria-label="This was not helpful"
                          >
                            <XMarkIcon className="h-4 w-4 mr-1" />
                            No
                          </button>
                        </div>
                      </div>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Contact Support Section */}
        <section aria-labelledby="contact-heading">
          <div className="bg-blue-700 rounded-lg shadow-lg overflow-hidden">
            <div className="px-4 py-6 sm:p-8">
              <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                <div className="md:col-span-2">
                  <h2
                    id="contact-heading"
                    className="text-2xl font-bold text-white mb-4"
                  >
                    Need more help?
                  </h2>
                  <p className="text-blue-100 mb-6">
                    Can't find what you're looking for? Our support team is here
                    to help you with any questions or issues.
                  </p>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <a
                      href="/help/contact?method=chat"
                      className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-blue-700 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-blue-700 transition-colors"
                    >
                      <ChatBubbleLeftRightIcon className="mr-3 h-5 w-5 text-blue-500" />
                      Chat with support
                    </a>

                    <a
                      href="/help/contact?method=email"
                      className="inline-flex items-center justify-center px-4 py-2 border border-white border-opacity-30 text-base font-medium rounded-md text-white bg-transparent hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-blue-700 transition-colors"
                    >
                      <EnvelopeIcon className="mr-3 h-5 w-5 text-blue-200" />
                      Email support
                    </a>
                  </div>
                </div>

                <div className="bg-blue-800 bg-opacity-50 rounded-lg p-6">
                  <h3 className="text-lg font-medium text-white mb-4">
                    Support hours
                  </h3>
                  <div className="space-y-3 text-blue-100">
                    <div className="flex justify-between">
                      <span>Monday - Friday</span>
                      <span className="font-medium">9:00 AM - 8:00 PM EST</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Saturday</span>
                      <span className="font-medium">
                        10:00 AM - 6:00 PM EST
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sunday</span>
                      <span className="font-medium">Closed</span>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t border-blue-500">
                    <h4 className="text-sm font-medium text-white mb-2">
                      Phone support (Premium plans)
                    </h4>
                    <div className="flex items-center">
                      <PhoneIcon className="h-5 w-5 text-blue-200 mr-2" />
                      <span className="text-blue-100 font-medium">
                        +94 761823473
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Community Banner */}
      <div className="bg-gray-100 border-t border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between rounded-xl bg-white p-8 shadow-sm border border-gray-100">
            <div className="text-center md:text-left mb-6 md:mb-0">
              <h2 className="text-xl font-bold text-gray-900">
                Join our community
              </h2>
              <p className="mt-1 text-gray-600">
                Connect with other designers, get tips, and share your own
                ideas.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
              <a
                href="/community/forum"
                className="inline-flex items-center px-5 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                <UserGroupIcon className="mr-2 h-5 w-5" />
                Forums
              </a>
              <a
                href="/community/gallery"
                className="inline-flex items-center px-5 py-2 border border-gray-300 text-base font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                Design Gallery
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />

      {/* Feedback Button (Fixed) */}
      <div className="fixed right-5 bottom-5 z-30 flex flex-col space-y-3">
        {showScrollTop && (
          <button
            className="bg-white p-2 rounded-full shadow-lg hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={scrollToTop}
            aria-label="Scroll to top"
          >
            <ArrowUpCircleIcon className="h-6 w-6 text-blue-600" />
          </button>
        )}
        <button
          className="bg-gray-800 text-white text-sm px-4 py-2 rounded-t-lg shadow-lg hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          onClick={() => alert("Feedback form would open here")}
          aria-label="Give feedback"
        >
          Give Feedback
        </button>
      </div>
    </div>
  );
};

export default HelpDocumentationPage;
