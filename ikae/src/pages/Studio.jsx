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

// ========== VIEW COMPONENTS ==========

// 3D Scene Component for 3D view
const ThreeDView = ({ roomConfig, placedFurniture, selectedFurniture }) => {
  return (
    <div className="w-full h-full bg-gradient-to-b from-gray-100 to-gray-200 flex items-center justify-center">
      <div
        className="transform-gpu shadow-xl rounded-md overflow-hidden relative"
        style={{
          width: `${roomConfig.dimensions.width}px`,
          height: `${roomConfig.dimensions.length}px`,
          backgroundColor: roomConfig.floorColor,
          perspective: "1000px",
        }}
      >
        {/* Walls */}
        <div
          className="absolute inset-0 border-2 border-gray-300"
          style={{ backgroundColor: roomConfig.wallColor }}
        ></div>

        {/* Placed Furniture in 3D */}
        {placedFurniture.map((item) => {
          const furnitureItem = FURNITURE_ITEMS.find((f) => f.id === item.id);
          const color = FURNITURE_COLORS.find((c) => c.id === item.colorId);
          const isSelected = selectedFurniture === item.instanceId;

          return (
            <div
              key={item.instanceId}
              className={`absolute cursor-move ${
                isSelected ? "ring-2 ring-indigo-500 z-10" : ""
              }`}
              style={{
                width: `${furnitureItem.dimensions.width * item.scale}px`,
                height: `${furnitureItem.dimensions.depth * item.scale}px`,
                left: `${item.position.x}px`,
                top: `${item.position.y}px`,
                backgroundColor: item.customColor || color.color,
                transform: `rotate(${item.rotation}deg) translateZ(${
                  (furnitureItem.dimensions.height * item.scale) / 2
                }px)`,
                transition: "all 0.3s ease",
                boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
              }}
            >
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-xs font-medium text-center p-1 truncate max-w-full">
                  {furnitureItem.name}
                </div>
              </div>
            </div>
          );
        })}

        {/* Room floor */}
        <div
          className="absolute inset-0 transform rotate-x-90deg"
          style={{
            backgroundColor: roomConfig.floorColor,
            transformOrigin: "bottom",
          }}
        ></div>
      </div>
    </div>
  );
};

// 2D Floor Plan View
const TwoDView = ({
  roomConfig,
  placedFurniture,
  selectedFurniture,
  showGrid,
  gridSize,
}) => {
  return (
    <div
      className="w-full h-full relative bg-white border-2 border-gray-300 rounded-md overflow-hidden"
      style={{
        backgroundColor: roomConfig.floorColor,
      }}
    >
      {/* Grid */}
      {showGrid && (
        <div className="absolute inset-0">
          <svg width="100%" height="100%">
            <defs>
              <pattern
                id="grid"
                width={gridSize}
                height={gridSize}
                patternUnits="userSpaceOnUse"
              >
                <path
                  d={`M ${gridSize} 0 L 0 0 0 ${gridSize}`}
                  fill="none"
                  stroke="rgba(0, 0, 0, 0.1)"
                  strokeWidth="0.5"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
      )}

      {/* Placed Furniture in 2D */}
      {placedFurniture.map((item) => {
        const furnitureItem = FURNITURE_ITEMS.find((f) => f.id === item.id);
        const color = FURNITURE_COLORS.find((c) => c.id === item.colorId);
        const isSelected = selectedFurniture === item.instanceId;

        return (
          <div
            key={item.instanceId}
            className={`absolute cursor-move flex items-center justify-center transform-gpu ${
              isSelected
                ? "ring-2 ring-indigo-500 z-10"
                : "hover:ring-2 hover:ring-gray-400 hover:z-10"
            }`}
            style={{
              width: `${furnitureItem.dimensions.width * item.scale}px`,
              height: `${furnitureItem.dimensions.depth * item.scale}px`,
              left: `${item.position.x}px`,
              top: `${item.position.y}px`,
              backgroundColor: item.customColor || color.color,
              transform: `rotate(${item.rotation}deg)`,
              transition: "transform 0.3s ease, left 0.3s ease, top 0.3s ease",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            }}
          >
            <div className="font-medium text-xs text-center p-1 truncate max-w-full">
              {furnitureItem.name}
            </div>
          </div>
        );
      })}
    </div>
  );
};

// First Person View Component
const FirstPersonView = () => {
  return (
    <div className="w-full h-full bg-gradient-to-b from-blue-100 to-gray-200 flex items-center justify-center">
      <div className="text-center text-lg text-gray-500">
        <div className="mx-auto bg-white rounded-full p-3 w-12 h-12 flex items-center justify-center mb-2">
          <EyeSolidIcon className="h-6 w-6 text-indigo-500" />
        </div>
        First Person Mode
        <p className="text-sm text-gray-400 mt-1">Navigate with arrow keys</p>
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
  const [selectedFurniture, setSelectedFurniture] = useState(null);
  const [placedFurniture, setPlacedFurniture] = useState([]);
  const [hoveringItem, setHoveringItem] = useState(null);

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

  // Action state
  const [_isDragging, setIsDragging] = useState(false);
  const [_currentAction, setCurrentAction] = useState(null); // null, 'moving', 'rotating', 'scaling'

  // View settings
  const [viewSettings, setViewSettings] = useState({
    showDimensions: true,
    showShadows: true,
    lightingPreset: "neutral",
  });

  // ========== COMPUTED VALUES ==========

  // Filtered furniture items based on search and category
  const filteredFurnitureItems = FURNITURE_ITEMS.filter((item) => {
    const matchesCategory =
      selectedCategory === "all" || item.category === selectedCategory;
    const matchesSearch = item.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

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

  // Furniture management
  const handleAddFurniture = (item) => {
    const newItem = {
      ...item,
      instanceId: `${item.id}-${Date.now()}`,
      position: { x: viewPosition.x, y: viewPosition.y, z: 0 },
      rotation: 0,
      scale: 1,
      materialId: FURNITURE_MATERIALS[0].id,
      colorId: FURNITURE_COLORS[0].id,
      customColor: null,
    };

    // Save current state to undo stack
    setUndoStack([...undoStack, { type: "add", items: [...placedFurniture] }]);
    setRedoStack([]);

    setPlacedFurniture([...placedFurniture, newItem]);
    setSelectedFurniture(newItem.instanceId);
    setIsPropertiesPanelOpen(true);
    showToast(`Added ${item.name} to room`);

    if (showInstructionsOverlay) {
      setShowInstructionsOverlay(false);
    }
  };

  const handleSelectFurniture = (instanceId) => {
    setSelectedFurniture(instanceId);
    setIsPropertiesPanelOpen(true);
  };

  const handleRemoveFurniture = (instanceId) => {
    const itemToRemove = placedFurniture.find(
      (item) => item.instanceId === instanceId
    );

    if (!itemToRemove) return;

    const furnitureDetails = FURNITURE_ITEMS.find(
      (item) => item.id === itemToRemove.id
    );

    // Save current state to undo stack
    setUndoStack([
      ...undoStack,
      { type: "remove", items: [...placedFurniture] },
    ]);
    setRedoStack([]);

    setPlacedFurniture(
      placedFurniture.filter((item) => item.instanceId !== instanceId)
    );

    if (selectedFurniture === instanceId) {
      setSelectedFurniture(null);
    }

    showToast(`Removed ${furnitureDetails.name}`, "info");
  };

  const handleDuplicateFurniture = (instanceId) => {
    const itemToDuplicate = placedFurniture.find(
      (item) => item.instanceId === instanceId
    );

    if (itemToDuplicate) {
      const duplicatedItem = {
        ...itemToDuplicate,
        instanceId: `${itemToDuplicate.id}-${Date.now()}`,
        position: {
          x: itemToDuplicate.position.x + 20,
          y: itemToDuplicate.position.y + 20,
          z: itemToDuplicate.position.z,
        },
      };

      // Save current state to undo stack
      setUndoStack([
        ...undoStack,
        { type: "duplicate", items: [...placedFurniture] },
      ]);
      setRedoStack([]);

      setPlacedFurniture([...placedFurniture, duplicatedItem]);
      setSelectedFurniture(duplicatedItem.instanceId);

      const furnitureDetails = FURNITURE_ITEMS.find(
        (item) => item.id === itemToDuplicate.id
      );
      showToast(`Duplicated ${furnitureDetails.name}`);
    }
  };

  const handleUpdateFurniture = (instanceId, updates) => {
    // Save current state to undo stack before making changes
    if (
      !undoStack.length ||
      undoStack[undoStack.length - 1].items !== placedFurniture
    ) {
      setUndoStack([
        ...undoStack,
        { type: "update", items: [...placedFurniture] },
      ]);
      setRedoStack([]);
    }

    const updatedFurniture = placedFurniture.map((item) =>
      item.instanceId === instanceId ? { ...item, ...updates } : item
    );

    setPlacedFurniture(updatedFurniture);

    // Simulate auto-save
    setSavingStatus("saving");
    setTimeout(() => {
      setSavingStatus("saved");
      setTimeout(() => {
        setSavingStatus("idle");
      }, 2000);
    }, 800);
  };

  // History management
  const handleUndo = () => {
    if (undoStack.length > 0) {
      const lastAction = undoStack[undoStack.length - 1];
      setRedoStack([
        ...redoStack,
        { type: lastAction.type, items: [...placedFurniture] },
      ]);
      setPlacedFurniture(lastAction.items);
      setUndoStack(undoStack.slice(0, -1));
      showToast("Undone last action", "info");
    }
  };

  const handleRedo = () => {
    if (redoStack.length > 0) {
      const nextAction = redoStack[redoStack.length - 1];
      setUndoStack([
        ...undoStack,
        { type: nextAction.type, items: [...placedFurniture] },
      ]);
      setPlacedFurniture(nextAction.items);
      setRedoStack(redoStack.slice(0, -1));
      showToast("Redone action", "info");
    }
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

  // Dragging functionality
  const startDragging = (e, instanceId, action = "moving") => {
    e.stopPropagation();
    e.preventDefault();
    setIsDragging(true);
    setCurrentAction(action);
    handleSelectFurniture(instanceId);

    const furniture = placedFurniture.find(
      (item) => item.instanceId === instanceId
    );

    if (!furniture) return;

    // Initial position for calculations
    const initialX = e.clientX;
    const initialY = e.clientY;
    const initialScale = furniture.scale;

    // Setup event listeners for drag
    const handleMouseMove = (moveEvent) => {
      if (action === "moving") {
        let newX = furniture.position.x + (moveEvent.clientX - initialX);
        let newY = furniture.position.y + (moveEvent.clientY - initialY);

        // Apply snap to grid if enabled
        if (snapToGrid) {
          newX = Math.round(newX / gridSize) * gridSize;
          newY = Math.round(newY / gridSize) * gridSize;
        }

        handleUpdateFurniture(instanceId, {
          position: {
            x: newX,
            y: newY,
            z: furniture.position.z,
          },
        });
      } else if (action === "rotating") {
        const rect = canvasRef.current.getBoundingClientRect();
        const centerX =
          furniture.position.x +
          rect.left +
          (furniture.dimensions?.width || 0) / 2;
        const centerY =
          furniture.position.y +
          rect.top +
          (furniture.dimensions?.height || 0) / 2;

        // Calculate angle between center and mouse position
        const angle =
          Math.atan2(moveEvent.clientY - centerY, moveEvent.clientX - centerX) *
          (180 / Math.PI);

        // Snap rotation to 15-degree increments if snap to grid is enabled
        let rotation = angle + 90; // Adjust to make 0 degrees point up

        if (snapToGrid) {
          rotation = Math.round(rotation / 15) * 15;
        }

        // Keep rotation between 0-360
        rotation = (rotation + 360) % 360;

        handleUpdateFurniture(instanceId, { rotation });
      } else if (action === "scaling") {
        // Calculate distance moved for scaling
        const distanceMoved = moveEvent.clientX - initialX;
        const scaleFactor = distanceMoved * 0.01;

        // Apply new scale with bounds
        const newScale = Math.max(0.5, Math.min(2, initialScale + scaleFactor));

        handleUpdateFurniture(instanceId, { scale: newScale });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setCurrentAction(null);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  // UI interaction
  const handleGetStarted = () => {
    setShowInstructionsOverlay(false);
  };

  // Helper functions
  const getSelectedFurnitureItem = () => {
    return placedFurniture.find(
      (item) => item.instanceId === selectedFurniture
    );
  };

  const getFurnitureMaterial = (materialId) => {
    return (
      FURNITURE_MATERIALS.find((material) => material.id === materialId) ||
      FURNITURE_MATERIALS[0]
    );
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
                {filteredFurnitureItems.length === 0 ? (
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
                    {filteredFurnitureItems.map((item) => (
                      <FurnitureCard
                        key={item.id}
                        item={item}
                        onAdd={handleAddFurniture}
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

        {/* Main Canvas Area */}
        <div className="flex-1 flex flex-col relative bg-gray-100 overflow-hidden">
          {/* Toolbar */}
          <div className="flex items-center justify-between px-4 py-2 bg-white border-b border-gray-200 shadow-sm">
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="icon"
                icon={<ArrowUturnLeftIcon className="h-5 w-5" />}
                onClick={handleUndo}
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
                onClick={handleRedo}
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

          {/* Main Canvas */}
          <div
            ref={canvasRef}
            className="flex-1 relative overflow-hidden bg-gray-50"
            style={{
              cursor: selectedFurniture ? "move" : "default",
            }}
          >
            {/* View Container with zoom and position applied */}
            <div
              className="absolute inset-0 flex items-center justify-center transform-gpu"
              style={{
                transform: `scale(${zoomLevel / 100}) translate(${
                  viewPosition.x
                }px, ${viewPosition.y}px)`,
                transformOrigin: "center center",
              }}
            >
              {/* Render different views based on selected view mode */}
              {selectedViewMode === "3d" && (
                <ThreeDView
                  roomConfig={roomConfig}
                  placedFurniture={placedFurniture}
                  selectedFurniture={selectedFurniture}
                />
              )}

              {selectedViewMode === "2d" && (
                <TwoDView
                  roomConfig={roomConfig}
                  placedFurniture={placedFurniture}
                  selectedFurniture={selectedFurniture}
                  showGrid={showGrid}
                  gridSize={gridSize}
                />
              )}

              {selectedViewMode === "first-person" && <FirstPersonView />}

              {/* Placed Furniture - shared controls across views */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  width: `${roomConfig.dimensions.width}px`,
                  height: `${roomConfig.dimensions.length}px`,
                }}
              >
                {placedFurniture.map((item) => {
                  const isSelected = selectedFurniture === item.instanceId;

                  return isSelected ? (
                    <div
                      key={`controls-${item.instanceId}`}
                      className="absolute pointer-events-auto"
                      style={{
                        left: `${item.position.x}px`,
                        top: `${item.position.y}px`,
                        width: `${
                          FURNITURE_ITEMS.find((f) => f.id === item.id)
                            .dimensions.width * item.scale
                        }px`,
                        height: `${
                          FURNITURE_ITEMS.find((f) => f.id === item.id)
                            .dimensions.depth * item.scale
                        }px`,
                        transform: `rotate(${item.rotation}deg)`,
                      }}
                    >
                      {/* Rotation handle */}
                      <div
                        className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-indigo-500 rounded-full cursor-move flex items-center justify-center text-white shadow-md hover:bg-indigo-600 transition-colors duration-150 z-20"
                        title="Rotate"
                        onMouseDown={(e) =>
                          startDragging(e, item.instanceId, "rotating")
                        }
                      >
                        <ArrowPathIcon className="h-3.5 w-3.5" />
                      </div>

                      {/* Delete handle */}
                      <div
                        className="absolute -top-6 -right-6 w-6 h-6 bg-red-500 rounded-full cursor-pointer flex items-center justify-center text-white shadow-md hover:bg-red-600 transition-colors duration-150 z-20"
                        title="Remove"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveFurniture(item.instanceId);
                        }}
                      >
                        <XMarkIcon className="h-3.5 w-3.5" />
                      </div>

                      {/* Duplicate handle */}
                      <div
                        className="absolute -top-6 -left-6 w-6 h-6 bg-emerald-500 rounded-full cursor-pointer flex items-center justify-center text-white shadow-md hover:bg-emerald-600 transition-colors duration-150 z-20"
                        title="Duplicate"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDuplicateFurniture(item.instanceId);
                        }}
                      >
                        <DocumentDuplicateIcon className="h-3.5 w-3.5" />
                      </div>

                      {/* Scale handle */}
                      <div
                        className="absolute -bottom-6 -right-6 w-6 h-6 bg-amber-500 rounded-full cursor-se-resize flex items-center justify-center text-white shadow-md hover:bg-amber-600 transition-colors duration-150 z-20"
                        title="Resize"
                        onMouseDown={(e) =>
                          startDragging(e, item.instanceId, "scaling")
                        }
                      >
                        <ArrowsPointingOutIcon className="h-3.5 w-3.5" />
                      </div>
                    </div>
                  ) : null;
                })}
              </div>
            </div>

            {/* Room dimensions */}
            {viewSettings.showDimensions && (
              <div className="absolute bottom-4 right-4 bg-white bg-opacity-90 px-3 py-2 rounded-lg shadow-sm border border-gray-200">
                <div className="text-sm font-medium text-gray-900">
                  {roomConfig.dimensions.width} × {roomConfig.dimensions.length}{" "}
                  cm
                </div>
              </div>
            )}

            {/* Instructions overlay when no furniture */}
            {placedFurniture.length === 0 && showInstructionsOverlay && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="bg-white bg-opacity-90 p-6 rounded-xl shadow-lg max-w-md text-center pointer-events-auto">
                  <div className="h-16 w-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CubeIcon className="h-8 w-8 text-indigo-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Start designing your room
                  </h3>
                  <p className="text-gray-600">
                    Select furniture from the catalog on the left and click to
                    add it to your room. You can drag, rotate, and customize
                    each piece to create your perfect space.
                  </p>
                  <div className="mt-4 flex justify-center">
                    <Button
                      variant="primary"
                      size="md"
                      onClick={handleGetStarted}
                    >
                      Get Started
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
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
              {selectedFurniture ? (
                // Furniture Properties
                <div className="flex flex-col h-full">
                  <div className="p-4 border-b border-gray-200 bg-gray-50">
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg font-medium text-gray-900">
                        Properties
                      </h2>
                      <button
                        className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
                        onClick={() => setSelectedFurniture(null)}
                      >
                        <XMarkIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>

                  {(() => {
                    const selectedItem = getSelectedFurnitureItem();
                    if (!selectedItem) return null;

                    const furnitureDetails = FURNITURE_ITEMS.find(
                      (item) => item.id === selectedItem.id
                    );

                    if (!furnitureDetails) return null;

                    return (
                      <div className="flex-1 overflow-y-auto">
                        <Panel className="m-4 mb-2">
                          <div className="flex items-start">
                            <img
                              src={furnitureDetails.image}
                              alt={furnitureDetails.name}
                              className="w-24 h-24 object-cover rounded-lg border border-gray-200 mr-3"
                            />
                            <div>
                              <h3 className="text-sm font-medium text-gray-900">
                                {furnitureDetails.name}
                              </h3>
                              <p className="text-sm text-indigo-600 font-semibold mt-1">
                                ${furnitureDetails.price}
                              </p>
                              <div className="flex mt-2 space-x-2">
                                <Button
                                  variant="secondary"
                                  size="sm"
                                  icon={
                                    <DocumentDuplicateIcon className="h-3.5 w-3.5" />
                                  }
                                  onClick={() =>
                                    handleDuplicateFurniture(
                                      selectedItem.instanceId
                                    )
                                  }
                                >
                                  Duplicate
                                </Button>
                                <Button
                                  variant="danger"
                                  size="sm"
                                  icon={<TrashIcon className="h-3.5 w-3.5" />}
                                  onClick={() =>
                                    handleRemoveFurniture(
                                      selectedItem.instanceId
                                    )
                                  }
                                >
                                  Remove
                                </Button>
                              </div>
                            </div>
                          </div>
                        </Panel>

                        {/* Position and Rotation */}
                        <Panel title="Position & Rotation" className="m-4 mb-2">
                          <div className="grid grid-cols-2 gap-3 mb-3">
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">
                                X Position
                              </label>
                              <input
                                type="number"
                                className="w-full border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow duration-150"
                                value={Math.round(selectedItem.position.x)}
                                onChange={(e) => {
                                  const newX = parseFloat(e.target.value) || 0;
                                  handleUpdateFurniture(
                                    selectedItem.instanceId,
                                    {
                                      position: {
                                        ...selectedItem.position,
                                        x: newX,
                                      },
                                    }
                                  );
                                }}
                              />
                            </div>
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">
                                Y Position
                              </label>
                              <input
                                type="number"
                                className="w-full border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow duration-150"
                                value={Math.round(selectedItem.position.y)}
                                onChange={(e) => {
                                  const newY = parseFloat(e.target.value) || 0;
                                  handleUpdateFurniture(
                                    selectedItem.instanceId,
                                    {
                                      position: {
                                        ...selectedItem.position,
                                        y: newY,
                                      },
                                    }
                                  );
                                }}
                              />
                            </div>
                          </div>

                          <Slider
                            label="Rotation (degrees)"
                            min={0}
                            max={360}
                            value={Math.round(selectedItem.rotation)}
                            onChange={(e) => {
                              const rotation = parseInt(e.target.value);
                              handleUpdateFurniture(selectedItem.instanceId, {
                                rotation,
                              });
                            }}
                            unit="°"
                          />
                        </Panel>

                        {/* Size and Scale */}
                        <Panel title="Size & Scale" className="m-4 mb-2">
                          <Slider
                            label="Scale"
                            min={0.5}
                            max={2}
                            step={0.1}
                            value={selectedItem.scale}
                            onChange={(e) => {
                              const scale = parseFloat(e.target.value);
                              handleUpdateFurniture(selectedItem.instanceId, {
                                scale,
                              });
                            }}
                            unit="x"
                          />

                          <div className="grid grid-cols-3 gap-3 mt-4 bg-gray-50 p-3 rounded-lg">
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">
                                Width
                              </label>
                              <div className="flex items-center text-sm font-medium text-gray-700">
                                {Math.round(
                                  furnitureDetails.dimensions.width *
                                    selectedItem.scale
                                )}{" "}
                                cm
                              </div>
                            </div>
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">
                                Depth
                              </label>
                              <div className="flex items-center text-sm font-medium text-gray-700">
                                {Math.round(
                                  furnitureDetails.dimensions.depth *
                                    selectedItem.scale
                                )}{" "}
                                cm
                              </div>
                            </div>
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">
                                Height
                              </label>
                              <div className="flex items-center text-sm font-medium text-gray-700">
                                {Math.round(
                                  furnitureDetails.dimensions.height *
                                    selectedItem.scale
                                )}{" "}
                                cm
                              </div>
                            </div>
                          </div>
                        </Panel>

                        {/* Material and Color */}
                        <Panel title="Material & Color" className="m-4 mb-2">
                          <ColorMaterialSelector
                            options={FURNITURE_MATERIALS}
                            selected={selectedItem.materialId}
                            onChange={(materialId) => {
                              handleUpdateFurniture(selectedItem.instanceId, {
                                materialId,
                              });
                            }}
                            label={`Material (${
                              getFurnitureMaterial(selectedItem.materialId).name
                            })`}
                          />

                          <div className="mt-4">
                            <ColorMaterialSelector
                              options={FURNITURE_COLORS}
                              selected={selectedItem.colorId}
                              onChange={(colorId) => {
                                handleUpdateFurniture(selectedItem.instanceId, {
                                  colorId,
                                  customColor: null,
                                });
                              }}
                              label="Color"
                            />
                          </div>

                          {selectedItem.colorId === "custom" && (
                            <div className="mt-3">
                              <label className="block text-xs text-gray-500 mb-1">
                                Custom Color
                              </label>
                              <div className="flex items-center">
                                <input
                                  type="color"
                                  className="h-10 w-14 border-0 p-0 mr-2 rounded cursor-pointer"
                                  value={selectedItem.customColor || "#FF5733"}
                                  onChange={(e) => {
                                    handleUpdateFurniture(
                                      selectedItem.instanceId,
                                      {
                                        customColor: e.target.value,
                                      }
                                    );
                                  }}
                                />
                                <input
                                  type="text"
                                  className="flex-1 border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow duration-150"
                                  value={selectedItem.customColor || "#FF5733"}
                                  onChange={(e) => {
                                    // Basic hex color validation
                                    if (
                                      /^#([0-9A-F]{3}){1,2}$/i.test(
                                        e.target.value
                                      )
                                    ) {
                                      handleUpdateFurniture(
                                        selectedItem.instanceId,
                                        {
                                          customColor: e.target.value,
                                        }
                                      );
                                    }
                                  }}
                                />
                              </div>
                            </div>
                          )}
                        </Panel>
                      </div>
                    );
                  })()}
                </div>
              ) : (
                // Room Properties (when no furniture is selected)
                <div className="flex flex-col h-full">
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
                            {placedFurniture.length}
                          </span>
                        </div>

                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">
                            Total cost:
                          </span>
                          <span className="text-sm font-medium text-indigo-600">
                            $
                            {placedFurniture.reduce((total, item) => {
                              const furnitureItem = FURNITURE_ITEMS.find(
                                (f) => f.id === item.id
                              );
                              return total + (furnitureItem?.price || 0);
                            }, 0)}
                          </span>
                        </div>

                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">
                            Floor area:
                          </span>
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

      {/* Custom CSS styles */}
      <style jsx>{`
        /* Hide scrollbar for Chrome, Safari and Opera */
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }

        /* Hide scrollbar for IE, Edge and Firefox */
        .hide-scrollbar {
          -ms-overflow-style: none; /* IE and Edge */
          scrollbar-width: none; /* Firefox */
        }

        /* Fade in animation */
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .animate-fade-in {
          animation: fadeIn 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default DesignStudioPage;
