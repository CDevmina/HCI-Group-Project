import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  ArrowLeftIcon,
  ArrowsPointingOutIcon,
  ArrowsPointingInIcon,
  CheckIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CubeIcon,
  ViewColumnsIcon,
  XMarkIcon,
  PlusIcon,
  MinusIcon,
  DocumentDuplicateIcon,
  TrashIcon,
  PhotoIcon,
  ArrowUturnLeftIcon,
  ArrowUturnRightIcon,
  CogIcon,
  ArrowPathIcon,
  LightBulbIcon,
  DocumentTextIcon,
  ShareIcon,
  InformationCircleIcon,
  PencilIcon,
  EyeIcon,
  Square3Stack3DIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";
import {
  HomeIcon,
  CubeIcon as CubeSolidIcon,
  CheckCircleIcon,
  EyeIcon as EyeSolidIcon,
} from "@heroicons/react/24/solid";
import RoomEditor from "../scenes/RoomEditor/RoomEditor";

// ========== MOCK DATA ==========

// Mock data for furniture categories
const FURNITURE_CATEGORIES = [
  { id: "all", name: "All Items" },
  { id: "chairs", name: "Chairs & Seating" },
  { id: "tables", name: "Tables" },
  { id: "storage", name: "Storage" },
  { id: "beds", name: "Beds" },
  { id: "lighting", name: "Lighting" },
  { id: "decor", name: "Décor" },
];

// Mock data for furniture items
const FURNITURE_ITEMS = [
  {
    id: "chair-1",
    name: "Modern Armchair",
    category: "chairs",
    price: 299,
    dimensions: { width: 70, depth: 75, height: 85 },
    image:
      "https://cdn.shopify.com/s/files/1/2270/8601/files/green-chair-folk-interiors2.jpg?v=1716056259",
    popular: true,
  },
  {
    id: "chair-2",
    name: "Dining Chair",
    category: "chairs",
    price: 149,
    dimensions: { width: 45, depth: 50, height: 90 },
    image:
      "https://media.homecentre.com/i/homecentre/165928791-165928791-HC17122023_01-2100.jpg?fmt=auto&$quality-standard$&sm=c&$prodimg-m-sqr-pdp-2x$",
    popular: false,
  },
  {
    id: "chair-3",
    name: "Office Chair",
    category: "chairs",
    price: 249,
    dimensions: { width: 65, depth: 65, height: 110 },
    image:
      "https://s3-eu-west-1.amazonaws.com/backcslimages/newsite/product-images/1500-1500/BC-100-Angle.jpg",
    popular: true,
  },
  {
    id: "sofa-1",
    name: "3-Seater Sofa",
    category: "chairs",
    price: 899,
    dimensions: { width: 220, depth: 95, height: 85 },
    image:
      "https://www.housingunits.co.uk/media/catalog/product/cache/6988f987dc3394f24496d57c2f3e330c/d/5/d5dd93a23faea479e580adea9e352ddd.jpg",
    popular: true,
  },
  {
    id: "table-1",
    name: "Dining Table",
    category: "tables",
    price: 599,
    dimensions: { width: 180, depth: 90, height: 75 },
    image:
      "https://images-cdn.ubuy.co.in/66802aaaf3a57a0c564a6b5f-79-39-39-modern-dining-table-set-for.jpg",
    popular: true,
  },
  {
    id: "table-2",
    name: "Coffee Table",
    category: "tables",
    price: 349,
    dimensions: { width: 120, depth: 60, height: 45 },
    image: "https://m.media-amazon.com/images/I/A11vNaMYXSL.jpg",
    popular: false,
  },
  {
    id: "table-3",
    name: "Side Table",
    category: "tables",
    price: 149,
    dimensions: { width: 50, depth: 50, height: 55 },
    image: "https://placehold.co/300x300/e5e7eb/64748b?text=Side+Table",
    popular: true,
  },
  {
    id: "storage-1",
    name: "Bookshelf",
    category: "storage",
    price: 299,
    dimensions: { width: 80, depth: 30, height: 180 },
    image: "https://placehold.co/300x300/e5e7eb/64748b?text=Bookshelf",
    popular: false,
  },
  {
    id: "storage-2",
    name: "TV Stand",
    category: "storage",
    price: 249,
    dimensions: { width: 150, depth: 40, height: 50 },
    image: "https://placehold.co/300x300/e5e7eb/64748b?text=TV+Stand",
    popular: true,
  },
  {
    id: "lamp-1",
    name: "Floor Lamp",
    category: "lighting",
    price: 129,
    dimensions: { width: 35, depth: 35, height: 150 },
    image: "https://placehold.co/300x300/e5e7eb/64748b?text=Floor+Lamp",
    popular: false,
  },
  {
    id: "lamp-2",
    name: "Table Lamp",
    category: "lighting",
    price: 79,
    dimensions: { width: 30, depth: 30, height: 45 },
    image: "https://placehold.co/300x300/e5e7eb/64748b?text=Table+Lamp",
    popular: true,
  },
  {
    id: "decor-1",
    name: "Decorative Vase",
    category: "decor",
    price: 59,
    dimensions: { width: 20, depth: 20, height: 30 },
    image: "https://placehold.co/300x300/e5e7eb/64748b?text=Vase",
    popular: false,
  },
];

// Material options for furniture
const FURNITURE_MATERIALS = [
  { id: "wood", name: "Wood", color: "#A47551" },
  { id: "metal", name: "Metal", color: "#B4B8BF" },
  { id: "fabric", name: "Fabric", color: "#9CB3BC" },
  { id: "leather", name: "Leather", color: "#8D5B4C" },
  { id: "glass", name: "Glass", color: "#A5CBCF" },
];

// Color options for furniture
const FURNITURE_COLORS = [
  { id: "natural", name: "Natural", color: "#D4B995" },
  { id: "walnut", name: "Walnut", color: "#5E4A3B" },
  { id: "white", name: "White", color: "#FFFFFF" },
  { id: "black", name: "Black", color: "#333333" },
  { id: "gray", name: "Gray", color: "#AAAAAA" },
  { id: "blue", name: "Blue", color: "#7FA1D1" },
  { id: "green", name: "Green", color: "#7FB58B" },
  { id: "red", name: "Red", color: "#E27D60" },
  { id: "yellow", name: "Yellow", color: "#E8C547" },
  { id: "custom", name: "Custom", color: "#FF5733" },
];

// View modes for the design
const VIEW_MODES = [
  { id: "3d", name: "3D View", icon: <CubeSolidIcon className="h-5 w-5" /> },
  {
    id: "2d",
    name: "Floor Plan",
    icon: <Square3Stack3DIcon className="h-5 w-5" />,
  },
  {
    id: "first-person",
    name: "First Person",
    icon: <EyeSolidIcon className="h-5 w-5" />,
  },
];

// ========== REUSABLE COMPONENTS ==========

// Custom button component for consistent styling
const Button = ({
  children,
  variant = "default",
  size = "md",
  icon = null,
  className = "",
  tooltipText = "",
  ...props
}) => {
  const variants = {
    primary: "bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm",
    secondary:
      "bg-white hover:bg-gray-50 text-gray-800 border border-gray-300 shadow-sm",
    tertiary: "bg-gray-100 hover:bg-gray-200 text-gray-700",
    danger: "bg-red-50 hover:bg-red-100 text-red-700",
    ghost: "hover:bg-gray-100 text-gray-700",
    selected: "bg-indigo-50 text-indigo-700 border border-indigo-200",
  };

  const sizes = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1.5 text-sm",
    lg: "px-4 py-2 text-base",
    icon: "p-1.5",
  };

  const baseClass =
    "inline-flex items-center justify-center font-medium rounded-md transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-25";

  return (
    <div className="relative group">
      <button
        className={`${baseClass} ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      >
        {icon && <span className={`${children ? "mr-1.5" : ""}`}>{icon}</span>}
        {children}
      </button>
      {tooltipText && (
        <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity duration-200 z-50">
          {tooltipText}
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 bg-gray-900"></div>
        </div>
      )}
    </div>
  );
};

// Panel component for consistent styling
const Panel = ({
  title,
  children,
  className = "",
  onClose = null,
  footer = null,
  collapsible = false,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div
      className={`bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200 ${className}`}
    >
      {title && (
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-gray-50">
          <h3 className="font-medium text-gray-800">{title}</h3>
          <div className="flex space-x-1">
            {collapsible && (
              <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="text-gray-500 hover:text-gray-700 p-1 rounded-md hover:bg-gray-100"
              >
                {isCollapsed ? (
                  <ChevronDownIcon className="h-4 w-4" />
                ) : (
                  <ChevronUpIcon className="h-4 w-4" />
                )}
              </button>
            )}
            {onClose && (
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 p-1 rounded-md hover:bg-gray-100"
              >
                <XMarkIcon className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      )}
      {!isCollapsed && (
        <>
          <div className="p-4">{children}</div>
          {footer && (
            <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
              {footer}
            </div>
          )}
        </>
      )}
    </div>
  );
};

// Custom slider component
const Slider = ({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  label,
  showValue = true,
  unit = "",
}) => {
  return (
    <div className="space-y-1">
      {label && <label className="block text-xs text-gray-500">{label}</label>}
      <div className="flex items-center space-x-2">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={onChange}
          className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer accent-indigo-600"
        />
        {showValue && (
          <span className="text-sm text-gray-700 min-w-[40px] text-right">
            {value}
            {unit}
          </span>
        )}
      </div>
    </div>
  );
};

// Toast notification component
const Toast = ({ message, type = "success", onClose }) => {
  const icons = {
    success: <CheckCircleIcon className="h-5 w-5 text-green-500" />,
    error: <XMarkIcon className="h-5 w-5 text-red-500" />,
    info: <InformationCircleIcon className="h-5 w-5 text-blue-500" />,
    warning: <InformationCircleIcon className="h-5 w-5 text-yellow-500" />,
  };

  const bgColors = {
    success: "bg-green-50 border-green-200",
    error: "bg-red-50 border-red-200",
    info: "bg-blue-50 border-blue-200",
    warning: "bg-yellow-50 border-yellow-200",
  };

  return (
    <div
      className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-md border ${bgColors[type]} flex items-center animate-fade-in`}
    >
      {icons[type]}
      <span className="ml-2 text-sm font-medium text-gray-800">{message}</span>
      <button
        className="ml-3 text-gray-500 hover:text-gray-700"
        onClick={onClose}
      >
        <XMarkIcon className="h-4 w-4" />
      </button>
    </div>
  );
};

// Color and material selector component
const ColorMaterialSelector = ({
  options,
  selected,
  onChange,
  itemSize = "md",
  label,
}) => {
  const sizes = {
    sm: "h-6",
    md: "h-8",
    lg: "h-10",
  };

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-xs text-gray-500 mb-1">{label}</label>
      )}
      <div className="grid grid-cols-5 gap-2">
        {options.map((option) => (
          <div
            key={option.id}
            className={`border cursor-pointer rounded-lg transition-all duration-150 p-1 ${
              selected === option.id
                ? "border-indigo-500 bg-indigo-50 ring-1 ring-indigo-500"
                : "border-gray-200 hover:border-indigo-300"
            }`}
            onClick={() => onChange(option.id)}
          >
            <div
              className={`w-full ${
                sizes[itemSize]
              } rounded-md transition-transform duration-200 ${
                selected === option.id ? "scale-105" : ""
              }`}
              style={{ backgroundColor: option.color }}
            ></div>
            <div className="text-center text-xs mt-1 truncate">
              {option.name}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Modern FurnitureCard component
const FurnitureCard = ({
  item,
  onAdd,
  isHovering,
  onMouseEnter,
  onMouseLeave,
}) => {
  return (
    <div
      className="group bg-white border border-gray-200 rounded-xl overflow-hidden hover:border-indigo-300 hover:shadow-md transition duration-200 cursor-pointer"
      onClick={() => onAdd(item)}
      onMouseEnter={() => onMouseEnter(item.id)}
      onMouseLeave={onMouseLeave}
    >
      <div className="aspect-w-1 aspect-h-1 relative overflow-hidden">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
        />
        {item.popular && (
          <div className="absolute top-2 left-2 bg-indigo-100 text-indigo-800 text-xs px-2 py-0.5 rounded-full font-medium">
            Popular
          </div>
        )}
        {isHovering && (
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button className="bg-indigo-600 text-white text-sm font-medium px-3 py-1.5 rounded-md hover:bg-indigo-700 transform scale-90 group-hover:scale-100 transition-transform duration-200">
              Add to Room
            </button>
          </div>
        )}
      </div>
      <div className="p-3">
        <h3 className="text-sm font-medium text-gray-900 truncate">
          {item.name}
        </h3>
        <div className="flex justify-between items-center mt-1">
          <p className="text-sm font-semibold text-indigo-600">${item.price}</p>
          <p className="text-xs text-gray-500">
            {item.dimensions.width}x{item.dimensions.depth} cm
          </p>
        </div>
      </div>
    </div>
  );
};

// ========== MAIN COMPONENT ==========

const DesignStudioPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const canvasRef = useRef(null);

  // Get room configuration from previous page or use defaults
  const { roomConfig } = location.state || {
    roomConfig: {
      roomName: "My Living Room",
      dimensions: { width: 400, length: 500, height: 270 },
      shape: "rectangular",
      colorScheme: "neutral",
      floorMaterial: "hardwood",
      wallColor: "#F9FAFB",
      floorColor: "#E5E7EB",
    },
  };

  // ========== STATE MANAGEMENT ==========

  // Design metadata
  const [designName, setDesignName] = useState(
    roomConfig.roomName || "New Design"
  );
  const [isDesignNameEditing, setIsDesignNameEditing] = useState(false);
  const [savingStatus, setSavingStatus] = useState("idle"); // idle, saving, saved, error

  // UI state
  const [selectedViewMode, setSelectedViewMode] = useState("2d"); // Changed to "2d" as default
  const [isCatalogOpen, setIsCatalogOpen] = useState(true);
  const [isPropertiesPanelOpen, setIsPropertiesPanelOpen] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [toast, setToast] = useState(null);
  const [showHelpTour, setShowHelpTour] = useState(false);
  const [showInstructionsOverlay, setShowInstructionsOverlay] = useState(true);

  // Furniture state
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [hoveringItem, setHoveringItem] = useState(null);
  const [furniture, setFurniture] = useState([]);

  // Search state
  const [searchQuery, setSearchQuery] = useState("");

  // View state
  const [zoomLevel, setZoomLevel] = useState(70);
  const [viewPosition, setViewPosition] = useState({ x: 0, y: 0 });
  const [showGrid, setShowGrid] = useState(true);
  const [snapToGrid, setSnapToGrid] = useState(true);
  const [gridSize] = useState(10);

  // History state
  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);

  // View settings
  const [viewSettings, setViewSettings] = useState({
    showDimensions: true,
    showShadows: true,
    lightingPreset: "neutral",
  });

  // Add furniture function
  const addFurniture = (model) => {
    const newItem = {
      id: `${model.name}-${Math.random().toString(36).substr(2, 9)}`,
      type: model.name,
      position: { x: 0, y: 0, z: 0 },
      dimensions: model.dimensions || { width: 1, depth: 1, height: 1 },
      color: '#cccccc',
      rotation: 0,
      scale: { x: 1, y: 1, z: 1 },
      glb: model.glb,
      image: model.image,
    };
    setFurniture((prev) => [...prev, newItem]);
  };

  // ========== EFFECTS ==========

  // Handle canvas resize and fullscreen changes
  useEffect(() => {
    const updateCanvasSize = () => {
      if (canvasRef.current) {
        canvasRef.current.getBoundingClientRect();
      }
    };

    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    updateCanvasSize();
    window.addEventListener("resize", updateCanvasSize);
    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      window.removeEventListener("resize", updateCanvasSize);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  // ========== EVENT HANDLERS ==========

  // Toast management
  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // View management
  const toggleFullscreen = () => {
    if (!isFullscreen) {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  const handleZoom = (direction) => {
    setZoomLevel((prevZoom) => {
      const newZoom = prevZoom + (direction === "in" ? 10 : -10);
      return Math.max(20, Math.min(newZoom, 150)); // Limit between 20% and 150%
    });
  };

  // Design management
  const handleDesignNameChange = (e) => {
    setDesignName(e.target.value);
  };

  const handleSaveDesign = () => {
    setSavingStatus("saving");

    setTimeout(() => {
      setSavingStatus("saved");
      showToast("Design saved successfully");

      setTimeout(() => {
        setSavingStatus("idle");
      }, 2000);
    }, 800);
  };

  const handleExit = () => {
    navigate("/room");
  };

  // UI interaction
  const handleGetStarted = () => {
    setShowInstructionsOverlay(false);
  };

  // ========== RENDER ==========
  return (
    <div className="flex flex-col h-screen bg-gray-100 overflow-hidden">
      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Header */}
      <header className="bg-white shadow-sm z-10 border-b border-gray-200">
        <div className="max-w-full mx-auto px-4">
          <div className="flex justify-between items-center py-3">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="icon"
                icon={<ArrowLeftIcon className="h-5 w-5" />}
                className="mr-3"
                onClick={handleExit}
                tooltipText="Return to Dashboard"
              />

              {isDesignNameEditing ? (
                <div className="flex items-center">
                  <input
                    type="text"
                    value={designName}
                    onChange={handleDesignNameChange}
                    className="text-lg font-semibold text-gray-900 border-b-2 border-indigo-500 focus:outline-none focus:border-indigo-600 bg-transparent px-1"
                    autoFocus
                    onBlur={() => setIsDesignNameEditing(false)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        setIsDesignNameEditing(false);
                        showToast("Design name updated");
                      }
                    }}
                  />
                  <button
                    className="p-1 ml-1 text-indigo-600 hover:text-indigo-700 rounded-full hover:bg-indigo-50"
                    onClick={() => {
                      setIsDesignNameEditing(false);
                      showToast("Design name updated");
                    }}
                  >
                    <CheckIcon className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center">
                  <h1 className="text-lg font-semibold text-gray-900">
                    {designName}
                  </h1>
                  <button
                    onClick={() => setIsDesignNameEditing(true)}
                    className="text-gray-400 hover:text-gray-600 ml-2 p-1 rounded-full hover:bg-gray-100"
                  >
                    <PencilIcon className="h-4 w-4" />
                  </button>
                </div>
              )}

              {/* Saving status indicator with animation */}
              <div className="ml-4">
                {savingStatus === "saving" && (
                  <div className="flex items-center text-gray-500 text-sm bg-gray-50 px-2 py-1 rounded-full">
                    <ArrowPathIcon className="h-3.5 w-3.5 mr-1 animate-spin" />
                    Saving...
                  </div>
                )}
                {savingStatus === "saved" && (
                  <div className="flex items-center text-green-600 text-sm bg-green-50 px-2 py-1 rounded-full animate-fade-in">
                    <CheckCircleIcon className="h-3.5 w-3.5 mr-1" />
                    Saved
                  </div>
                )}
                {savingStatus === "error" && (
                  <div className="flex items-center text-red-600 text-sm bg-red-50 px-2 py-1 rounded-full">
                    <XMarkIcon className="h-3.5 w-3.5 mr-1" />
                    Error saving
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {/* View Mode Selector */}
              <div className="flex mr-4 bg-gray-100 rounded-lg shadow-sm overflow-hidden">
                {VIEW_MODES.map((mode) => (
                  <button
                    key={mode.id}
                    className={`flex items-center px-3 py-1.5 text-sm font-medium transition-colors duration-150 ${
                      selectedViewMode === mode.id
                        ? "bg-white text-indigo-600 shadow-sm"
                        : "text-gray-700 hover:bg-gray-200"
                    }`}
                    onClick={() => setSelectedViewMode(mode.id)}
                  >
                    <span className="mr-1.5">{mode.icon}</span>
                    {mode.name}
                  </button>
                ))}
              </div>

              {/* Edit and View toggle */}
              <div className="flex bg-gray-100 rounded-lg overflow-hidden mr-2">
                <button className="flex items-center px-3 py-1.5 text-sm font-medium bg-white text-indigo-600 shadow-sm">
                  <PencilIcon className="h-4 w-4 mr-1.5" />
                  Edit
                </button>
                <button className="flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors duration-150">
                  <EyeIcon className="h-4 w-4 mr-1.5" />
                  Preview
                </button>
              </div>

              {/* Action Buttons */}
              <Button
                variant="primary"
                icon={<DocumentTextIcon className="h-4 w-4" />}
                onClick={handleSaveDesign}
              >
                Save
              </Button>

              <Button
                variant="secondary"
                icon={<ShareIcon className="h-4 w-4" />}
              >
                Share
              </Button>

              <Button
                variant="ghost"
                size="icon"
                icon={<InformationCircleIcon className="h-5 w-5" />}
                onClick={() => setShowHelpTour(true)}
                tooltipText="Help & Tour"
              />

              <Button
                variant="ghost"
                size="icon"
                icon={
                  isFullscreen ? (
                    <ArrowsPointingInIcon className="h-5 w-5" />
                  ) : (
                    <ArrowsPointingOutIcon className="h-5 w-5" />
                  )
                }
                onClick={toggleFullscreen}
                tooltipText={
                  isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"
                }
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Furniture Catalog */}
        <div
          className={`flex flex-col bg-white shadow-sm z-10 transition-all duration-300 ${
            isCatalogOpen ? "w-80" : "w-12"
          } border-r border-gray-200`}
        >
          {/* Toggle button */}
          <button
            className="flex items-center justify-center h-8 bg-gray-50 hover:bg-gray-100 text-gray-500 transition-colors duration-150"
            onClick={() => setIsCatalogOpen(!isCatalogOpen)}
          >
            {isCatalogOpen ? (
              <ChevronLeftIcon className="h-5 w-5" />
            ) : (
              <ChevronRightIcon className="h-5 w-5" />
            )}
          </button>

          {isCatalogOpen && (
            <div className="flex flex-col flex-1 overflow-hidden">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900 mb-3">
                  Furniture Catalog
                </h2>

                {/* Search bar */}
                <div className="relative">
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-lg pl-10 pr-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow duration-150"
                    placeholder="Search furniture..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <div className="absolute left-3 top-2.5 text-gray-400">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                  {searchQuery && (
                    <button
                      className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                      onClick={() => setSearchQuery("")}
                    >
                      <XMarkIcon className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Category tabs - horizontal scrollable */}
              <div className="flex overflow-x-auto py-2 px-4 border-b border-gray-200 whitespace-nowrap hide-scrollbar">
                {FURNITURE_CATEGORIES.map((category) => (
                  <button
                    key={category.id}
                    className={`px-3 py-1.5 text-sm font-medium rounded-lg mr-2 whitespace-nowrap transition-colors duration-150 ${
                      selectedCategory === category.id
                        ? "bg-indigo-50 text-indigo-700"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    {category.name}
                  </button>
                ))}
              </div>

              {/* Furniture items grid */}
              <div className="flex-1 overflow-y-auto p-4">
                {FURNITURE_ITEMS.filter((item) => {
                  const matchesCategory =
                    selectedCategory === "all" ||
                    item.category === selectedCategory;
                  const matchesSearch = item.name
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase());
                  return matchesCategory && matchesSearch;
                }).length === 0 ? (
                  <div className="text-center py-12">
                    <div className="mx-auto h-12 w-12 text-gray-400 flex items-center justify-center bg-gray-100 rounded-lg">
                      <CubeIcon className="h-6 w-6" />
                    </div>
                    <h3 className="mt-3 text-sm font-medium text-gray-900">
                      No items found
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Try changing your search or category filters.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    {FURNITURE_ITEMS.filter((item) => {
                      const matchesCategory =
                        selectedCategory === "all" ||
                        item.category === selectedCategory;
                      const matchesSearch = item.name
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase());
                      return matchesCategory && matchesSearch;
                    }).map((item) => (
                      <FurnitureCard
                        key={item.id}
                        item={item}
                        onAdd={() => {}}
                        isHovering={hoveringItem === item.id}
                        onMouseEnter={setHoveringItem}
                        onMouseLeave={() => setHoveringItem(null)}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Main Room Editor */}
        <div className="flex-1 flex flex-col relative bg-gray-100 overflow-hidden">
          {/* Toolbar */}
          <div className="flex items-center justify-between px-4 py-2 bg-white border-b border-gray-200 shadow-sm">
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="icon"
                icon={<ArrowUturnLeftIcon className="h-5 w-5" />}
                disabled={undoStack.length === 0}
                className={
                  undoStack.length === 0 ? "opacity-50 cursor-not-allowed" : ""
                }
                tooltipText="Undo"
              />
              <Button
                variant="ghost"
                size="icon"
                icon={<ArrowUturnRightIcon className="h-5 w-5" />}
                disabled={redoStack.length === 0}
                className={
                  redoStack.length === 0 ? "opacity-50 cursor-not-allowed" : ""
                }
                tooltipText="Redo"
              />
              <div className="h-6 border-l border-gray-300 mx-1"></div>
              <Button
                variant={showGrid ? "selected" : "ghost"}
                size="icon"
                icon={<ViewColumnsIcon className="h-5 w-5" />}
                onClick={() => setShowGrid(!showGrid)}
                tooltipText={showGrid ? "Hide Grid" : "Show Grid"}
              />
              <Button
                variant={snapToGrid ? "selected" : "ghost"}
                size="icon"
                icon={<Cog6ToothIcon className="h-5 w-5" />}
                onClick={() => setSnapToGrid(!snapToGrid)}
                tooltipText={
                  snapToGrid ? "Disable Snap to Grid" : "Enable Snap to Grid"
                }
              />
              <div className="h-6 border-l border-gray-300 mx-1"></div>
              <Button
                variant="ghost"
                size="icon"
                icon={<LightBulbIcon className="h-5 w-5" />}
                tooltipText="Lighting Settings"
              />
              <Button
                variant="ghost"
                size="icon"
                icon={<PhotoIcon className="h-5 w-5" />}
                tooltipText="Take Screenshot"
              />
            </div>

            <div className="flex items-center space-x-3">
              {/* Zoom Controls */}
              <div className="flex items-center bg-gray-100 rounded-lg overflow-hidden">
                <button
                  className="p-1.5 text-gray-700 hover:bg-gray-200 transition-colors duration-150"
                  onClick={() => handleZoom("out")}
                  disabled={zoomLevel <= 20}
                  title="Zoom Out"
                >
                  <MinusIcon className="h-4 w-4" />
                </button>
                <div className="px-2 py-1 text-sm font-medium text-gray-700 min-w-[40px] text-center">
                  {zoomLevel}%
                </div>
                <button
                  className="p-1.5 text-gray-700 hover:bg-gray-200 transition-colors duration-150"
                  onClick={() => handleZoom("in")}
                  disabled={zoomLevel >= 150}
                  title="Zoom In"
                >
                  <PlusIcon className="h-4 w-4" />
                </button>
              </div>

              <Button
                variant="ghost"
                size="icon"
                icon={<HomeIcon className="h-5 w-5" />}
                onClick={() => {
                  setZoomLevel(70);
                  setViewPosition({ x: 0, y: 0 });
                }}
                tooltipText="Reset View"
              />
            </div>
          </div>

          <RoomEditor
            is3DView={selectedViewMode === "3d"}
            setIs3DView={(v) => setSelectedViewMode(v ? "3d" : "2d")}
            showDimensions={viewSettings.showDimensions}
            setShowDimensions={(val) =>
              setViewSettings((v) => ({ ...v, showDimensions: val }))
            }
            furniture={furniture}
            setFurniture={setFurniture}
            addFurniture={addFurniture}
          />
        </div>

        {/* Right Sidebar - Properties Panel */}
        <div
          className={`bg-white shadow-sm z-10 transition-all duration-300 border-l border-gray-200 ${
            isPropertiesPanelOpen ? "w-80" : "w-12"
          }`}
        >
          {/* Toggle button */}
          <button
            className="flex items-center justify-center h-8 w-full bg-gray-50 hover:bg-gray-100 text-gray-500 transition-colors duration-150"
            onClick={() => setIsPropertiesPanelOpen(!isPropertiesPanelOpen)}
          >
            {isPropertiesPanelOpen ? (
              <ChevronRightIcon className="h-5 w-5" />
            ) : (
              <ChevronLeftIcon className="h-5 w-5" />
            )}
          </button>

          {isPropertiesPanelOpen && (
            <div className="flex flex-col h-full overflow-hidden">
              <div className="p-4 border-b border-gray-200 bg-gray-50">
                <h2 className="text-lg font-medium text-gray-900">
                  Room Properties
                </h2>
              </div>

              <div className="flex-1 overflow-y-auto">
                <Panel title="Room Details" className="m-4 mb-2">
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">
                        Name
                      </label>
                      <div className="text-sm font-medium text-gray-900">
                        {roomConfig.roomName}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs text-gray-500 mb-1">
                        Dimensions
                      </label>
                      <div className="text-sm font-medium text-gray-900">
                        {roomConfig.dimensions.width} ×{" "}
                        {roomConfig.dimensions.length} ×{" "}
                        {roomConfig.dimensions.height} cm
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs text-gray-500 mb-1">
                        Shape
                      </label>
                      <div className="text-sm font-medium text-gray-900 capitalize">
                        {roomConfig.shape}
                      </div>
                    </div>
                  </div>
                </Panel>

                <Panel title="Colors & Materials" className="m-4 mb-2">
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">
                        Wall Color
                      </label>
                      <div className="flex items-center">
                        <div
                          className="h-6 w-6 rounded-md border border-gray-300 mr-2"
                          style={{ backgroundColor: roomConfig.wallColor }}
                        ></div>
                        <div className="text-sm font-medium text-gray-900">
                          {roomConfig.wallColor}
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs text-gray-500 mb-1">
                        Floor Color
                      </label>
                      <div className="flex items-center">
                        <div
                          className="h-6 w-6 rounded-md border border-gray-300 mr-2"
                          style={{ backgroundColor: roomConfig.floorColor }}
                        ></div>
                        <div className="text-sm font-medium text-gray-900">
                          {roomConfig.floorColor}
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs text-gray-500 mb-1">
                        Floor Material
                      </label>
                      <div className="text-sm font-medium text-gray-900 capitalize">
                        {roomConfig.floorMaterial}
                      </div>
                    </div>
                  </div>
                </Panel>

                <Panel title="View Settings" className="m-4 mb-2">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-sm text-gray-700">
                        Show Dimensions
                      </label>
                      <div>
                        <button
                          className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                            viewSettings.showDimensions
                              ? "bg-indigo-600"
                              : "bg-gray-200"
                          }`}
                          onClick={() => {
                            setViewSettings({
                              ...viewSettings,
                              showDimensions: !viewSettings.showDimensions,
                            });
                          }}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                              viewSettings.showDimensions
                                ? "translate-x-6"
                                : "translate-x-1"
                            }`}
                          />
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <label className="text-sm text-gray-700">
                        Show Shadows
                      </label>
                      <div>
                        <button
                          className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                            viewSettings.showShadows
                              ? "bg-indigo-600"
                              : "bg-gray-200"
                          }`}
                          onClick={() => {
                            setViewSettings({
                              ...viewSettings,
                              showShadows: !viewSettings.showShadows,
                            });
                          }}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                              viewSettings.showShadows
                                ? "translate-x-6"
                                : "translate-x-1"
                            }`}
                          />
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs text-gray-500 mb-1">
                        Lighting Preset
                      </label>
                      <select
                        className="w-full border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow duration-150"
                        value={viewSettings.lightingPreset}
                        onChange={(e) => {
                          setViewSettings({
                            ...viewSettings,
                            lightingPreset: e.target.value,
                          });
                        }}
                      >
                        <option value="neutral">Neutral</option>
                        <option value="warm">Warm</option>
                        <option value="cool">Cool</option>
                        <option value="evening">Evening</option>
                        <option value="bright">Bright</option>
                      </select>
                    </div>
                  </div>
                </Panel>

                <Panel title="Design Statistics" className="m-4 mb-2">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">
                        Items placed:
                      </span>
                      <span className="text-sm font-medium text-gray-900">
                        0
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Total cost:</span>
                      <span className="text-sm font-medium text-indigo-600">
                        $0
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Floor area:</span>
                      <span className="text-sm font-medium text-gray-900">
                        {(roomConfig.dimensions.width *
                          roomConfig.dimensions.length) /
                          10000}{" "}
                        m²
                      </span>
                    </div>
                  </div>
                </Panel>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Help tour overlay */}
      {showHelpTour && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">
                Design Studio Tour
              </h2>
              <button
                className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
                onClick={() => setShowHelpTour(false)}
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="bg-indigo-50 p-3 rounded-lg flex">
                <InformationCircleIcon className="h-5 w-5 text-indigo-500 flex-shrink-0 mt-0.5 mr-2" />
                <p className="text-gray-600">
                  This interactive tour will guide you through all the features
                  and capabilities of the design studio. Click "Start Tour" to
                  begin.
                </p>
              </div>
              <div className="flex justify-end space-x-3">
                <Button
                  variant="secondary"
                  onClick={() => setShowHelpTour(false)}
                >
                  Skip
                </Button>
                <Button
                  variant="primary"
                  onClick={() => setShowHelpTour(false)}
                >
                  Start Tour
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DesignStudioPage;
