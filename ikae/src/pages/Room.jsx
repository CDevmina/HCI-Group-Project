import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeftIcon,
  InformationCircleIcon,
  PlusIcon,
  CheckIcon,
  XMarkIcon,
  ChevronRightIcon,
  ArrowsPointingOutIcon,
  ChevronDownIcon,
  QuestionMarkCircleIcon,
  ArrowPathIcon,
  Cog6ToothIcon,
  SunIcon,
  BeakerIcon,
  ChevronUpIcon,
} from "@heroicons/react/24/outline";
import { HomeIcon } from "@heroicons/react/24/solid";

// ========== DATA MODELS ==========

const ROOM_PRESETS = [
  {
    id: "living-room",
    name: "Living Room",
    dimensions: { width: 400, length: 500, height: 270 },
    shape: "rectangular",
    colorScheme: "neutral",
    image: "https://st.hzcdn.com/simgs/97910d6b0407c3d1_14-0485/_.jpg",
  },
  {
    id: "bedroom",
    name: "Bedroom",
    dimensions: { width: 350, length: 400, height: 260 },
    shape: "rectangular",
    colorScheme: "warm",
    image:
      "https://dminteriors.lk/wp-content/uploads/2019/10/Sri-Lanka-Bedroom-Design-Ideas.jpg",
  },
  {
    id: "dining-room",
    name: "Dining Room",
    dimensions: { width: 360, length: 450, height: 270 },
    shape: "rectangular",
    colorScheme: "natural",
    image:
      "https://www.thespruce.com/thmb/ZqfUoFjPOAqtJBpzjDw-sxRdiNQ=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/modern-dining-room-ideas-4147451-hero-d6333998f8b34620adfd4d99ac732586.jpg",
  },
  {
    id: "office",
    name: "Home Office",
    dimensions: { width: 300, length: 350, height: 260 },
    shape: "rectangular",
    colorScheme: "cool",
    image:
      "https://rnb.scene7.com/is/image/roomandboard/cato_777426_21e?size=2400,2400&scl=1&qlt=5",
  },
];

const ROOM_SHAPES = [
  {
    id: "rectangular",
    name: "Rectangular",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
        <rect x="2" y="2" width="20" height="20" rx="1" />
      </svg>
    ),
  },
  {
    id: "l-shaped",
    name: "L-Shaped",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
        <path d="M2 2H14V10H22V22H2V2Z" />
      </svg>
    ),
  },
  {
    id: "square",
    name: "Square",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
        <rect x="3" y="3" width="18" height="18" rx="1" />
      </svg>
    ),
  },
  {
    id: "custom",
    name: "Custom",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
        <path d="M3 3H11V11H3V3ZM13 3H21V11H13V3ZM3 13H11V21H3V13ZM17 17.5C17 19.5 13 19.5 13 17.5C13 15.5 17 15.5 17 17.5ZM21 13H13V15C11 15 11 20 13 20V21H21V13Z" />
      </svg>
    ),
  },
];

const COLOR_SCHEMES = [
  {
    id: "neutral",
    name: "Neutral",
    colors: ["#F9FAFB", "#F3F4F6", "#E5E7EB", "#D1D5DB", "#9CA3AF", "#6B7280"],
    description: "Versatile and timeless, works with any style",
  },
  {
    id: "warm",
    name: "Warm & Cozy",
    colors: ["#FEF2F2", "#FECACA", "#F87171", "#FFFBEB", "#FEF3C7", "#FCD34D"],
    description: "Creates an inviting and comfortable atmosphere",
  },
  {
    id: "custom",
    name: "Custom",
    colors: ["#FFFFFF", "#FFFFFF", "#FFFFFF", "#FFFFFF", "#FFFFFF", "#FFFFFF"],
    description: "Create your own color palette",
  },
];

const MATERIALS = [
  {
    id: "hardwood",
    name: "Hardwood",
    description: "Classic and durable natural material",
    emoji: "🪵",
    color: "#A47551",
  },
  {
    id: "carpet",
    name: "Carpet",
    description: "Soft, comfortable and warm underfoot",
    emoji: "🧶",
    color: "#9CB3BC",
  },
  {
    id: "tile",
    name: "Tile",
    description: "Easy to clean and maintain",
    emoji: "🧱",
    color: "#D1D5DB",
  },
  {
    id: "vinyl",
    name: "Vinyl",
    description: "Affordable and water-resistant",
    emoji: "📊",
    color: "#E5E7EB",
  },
  {
    id: "concrete",
    name: "Concrete",
    description: "Modern industrial look",
    emoji: "🏢",
    color: "#9CA3AF",
  },
];

// ========== REUSABLE COMPONENTS ==========

// Tooltip for contextual help
const Tooltip = ({ children, content, position = "top" }) => {
  const positionClasses =
    position === "top" ? "bottom-full mb-2" : "top-full mt-2";

  return (
    <div className="relative group">
      {children}
      <div
        className={`absolute ${positionClasses} left-1/2 transform -translate-x-1/2 z-10 
        px-3 py-2 text-sm bg-gray-900 text-white rounded-md shadow-lg w-48 
        opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200`}
      >
        {content}
        <div
          className={`absolute ${
            position === "top" ? "bottom" : "top"
          } -2 left-1/2 
          transform -translate-x-1/2 border-4 border-transparent 
          ${position === "top" ? "border-t-gray-900" : "border-b-gray-900"}`}
        ></div>
      </div>
    </div>
  );
};

// Card component with consistent styling
const Card = ({
  title,
  children,
  footer,
  variant = "default",
  className = "",
}) => {
  const bgColors = {
    default: "bg-white",
    accent: "bg-gradient-to-br from-indigo-50 to-white",
    secondary: "bg-gray-50",
  };

  return (
    <div
      className={`${bgColors[variant]} rounded-xl shadow-sm border border-gray-200 overflow-hidden ${className}`}
    >
      {title && (
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">{title}</h2>
        </div>
      )}
      <div className="p-6">{children}</div>
      {footer && (
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          {footer}
        </div>
      )}
    </div>
  );
};

// Button component with variants
const Button = ({
  children,
  onClick,
  variant = "primary",
  size = "md",
  icon,
  className = "",
  disabled = false,
}) => {
  const variants = {
    primary: "bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm",
    secondary:
      "bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 shadow-sm",
    outline:
      "bg-transparent hover:bg-indigo-50 text-indigo-600 border border-indigo-300",
    ghost: "bg-transparent hover:bg-gray-100 text-gray-600",
    danger: "bg-red-600 hover:bg-red-700 text-white",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
    icon: "p-2",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        inline-flex items-center justify-center font-medium rounded-lg
        transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
        ${variants[variant]} ${sizes[size]} ${className}
        ${disabled ? "opacity-60 cursor-not-allowed" : ""}
      `}
    >
      {icon && <span className={`${children ? "mr-2" : ""}`}>{icon}</span>}
      {children}
    </button>
  );
};

// Form input with label, help text, and error handling
const FormInput = ({
  id,
  label,
  value,
  type = "text",
  onChange,
  error,
  helpText,
  rightElement,
  leftElement,
  className = "",
}) => {
  return (
    <div className={className}>
      <div className="flex justify-between items-center">
        <label
          htmlFor={id}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
        </label>
        {helpText && (
          <Tooltip content={helpText}>
            <QuestionMarkCircleIcon className="h-4 w-4 text-gray-400 hover:text-gray-500" />
          </Tooltip>
        )}
      </div>
      <div className="relative rounded-md shadow-sm">
        {leftElement && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {leftElement}
          </div>
        )}
        <input
          type={type}
          id={id}
          value={value}
          onChange={onChange}
          className={`
            block w-full rounded-md ${leftElement ? "pl-10" : "pl-3"} ${
            rightElement ? "pr-12" : "pr-3"
          } py-2
            border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm
            transition-colors duration-200
            ${
              error
                ? "border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500"
                : ""
            }
          `}
        />
        {rightElement && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            {rightElement}
          </div>
        )}
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600 flex items-center">
          <XMarkIcon className="h-4 w-4 mr-1" /> {error}
        </p>
      )}
    </div>
  );
};

// Input field with unit display
const DimensionInput = ({
  id,
  label,
  value,
  onChange,
  unit,
  error,
  helpText,
}) => (
  <FormInput
    id={id}
    label={label}
    value={value}
    type="number"
    onChange={(e) => onChange(e.target.value)}
    error={error}
    helpText={helpText}
    rightElement={<span className="text-gray-500">{unit}</span>}
  />
);

// Color picker with preview
const ColorPicker = ({ id, label, color, onChange, onCustomize, helpText }) => (
  <div>
    <div className="flex justify-between items-center mb-1">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      {helpText && (
        <Tooltip content={helpText}>
          <QuestionMarkCircleIcon className="h-4 w-4 text-gray-400 hover:text-gray-500" />
        </Tooltip>
      )}
    </div>
    <div className="flex items-center bg-white rounded-md shadow-sm border border-gray-300 p-2">
      <div
        className="h-10 w-10 rounded-md shadow-sm mr-3 flex-shrink-0"
        style={{ backgroundColor: color }}
      ></div>
      <input
        type="color"
        id={id}
        value={color}
        onChange={(e) => {
          onChange(e.target.value);
          onCustomize();
        }}
        className="h-8 w-16 p-0 border-0 bg-transparent cursor-pointer"
      />
      <div className="ml-auto px-3 py-1 bg-gray-100 rounded text-sm text-gray-700 font-mono">
        {color.toUpperCase()}
      </div>
    </div>
  </div>
);

// Section container with collapsible option
const Section = ({
  title,
  children,
  collapsible = false,
  defaultOpen = true,
  rightElement,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="mb-6 border border-gray-200 rounded-xl overflow-hidden shadow-sm bg-white">
      <div
        className={`px-6 py-4 bg-gradient-to-r from-white to-gray-50 border-b border-gray-200 flex justify-between items-center ${
          collapsible ? "cursor-pointer" : ""
        }`}
        onClick={collapsible ? () => setIsOpen(!isOpen) : undefined}
      >
        <h2 className="text-lg font-medium text-gray-900">{title}</h2>
        <div className="flex items-center space-x-2">
          {rightElement}
          {collapsible && (
            <button className="text-gray-500 hover:text-gray-700">
              {isOpen ? (
                <ChevronUpIcon className="h-5 w-5" />
              ) : (
                <ChevronDownIcon className="h-5 w-5" />
              )}
            </button>
          )}
        </div>
      </div>
      {(!collapsible || isOpen) && <div className="p-6">{children}</div>}
    </div>
  );
};

// Room Preview component
const RoomPreview = ({
  roomConfig,
  selectedShape,
  wallColor,
  floorColor,
  floorMaterial,
}) => {
  // Get appropriate floor texture based on material
  const getFloorTexture = () => {
    switch (floorMaterial) {
      case "hardwood":
        return "bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')]";
      case "carpet":
        return "bg-[url('https://www.transparenttextures.com/patterns/fabric-plaid.png')]";
      case "tile":
        return "bg-[url('https://www.transparenttextures.com/patterns/diamond-eyes.png')]";
      case "vinyl":
        return "bg-[url('https://www.transparenttextures.com/patterns/white-diamond-dark.png')]";
      case "concrete":
        return "bg-[url('https://www.transparenttextures.com/patterns/concrete-wall.png')]";
      default:
        return "bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')]";
    }
  };

  // Get material accent color to blend with the floor color
  const getMaterialAccentColor = () => {
    const material = MATERIALS.find((m) => m.id === floorMaterial);
    return material ? material.color : "#E5E7EB";
  };

  return (
    <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden border border-gray-200 shadow-inner">
      <div className="absolute inset-0">
        {/* Sky/ceiling */}
        <div className="absolute inset-0 bg-gradient-to-b from-gray-100 to-white"></div>

        {/* Walls */}
        <div
          className="absolute inset-x-0 top-0 bottom-[20%] transition-colors duration-300"
          style={{ backgroundColor: wallColor }}
        >
          {/* Wall texture overlay */}
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/subtle-white-feathers.png')] opacity-10"></div>
        </div>

        {/* Floor */}
        <div
          className="absolute inset-x-0 bottom-0 h-[20%] transition-colors duration-300"
          style={{
            backgroundColor: floorColor,
            borderTop: `1px solid ${getMaterialAccentColor()}`,
          }}
        >
          {/* Floor texture overlay based on material */}
          <div
            className={`absolute inset-0 ${getFloorTexture()} opacity-20`}
          ></div>
        </div>

        {/* Room shape indicator */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-4/5 h-4/5 border border-white border-opacity-20 rounded">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="px-4 py-2 bg-black bg-opacity-30 backdrop-blur-sm rounded-lg text-white text-sm font-medium">
                {ROOM_SHAPES.find((shape) => shape.id === selectedShape)
                  ?.name || "Room"}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="absolute top-3 right-3 flex space-x-2">
        <button className="p-1.5 bg-white bg-opacity-90 rounded-md shadow-sm hover:bg-opacity-100 transition-all text-gray-700">
          <ArrowsPointingOutIcon className="h-5 w-5" />
        </button>
        <button className="p-1.5 bg-white bg-opacity-90 rounded-md shadow-sm hover:bg-opacity-100 transition-all text-gray-700">
          <ArrowPathIcon className="h-5 w-5" />
        </button>
      </div>

      {/* Dimensions indicator */}
      <div className="absolute bottom-3 right-3 px-3 py-1.5 bg-white bg-opacity-90 rounded-md shadow-sm text-xs font-medium text-gray-700">
        {roomConfig.dimensions.width} × {roomConfig.dimensions.length} ×{" "}
        {roomConfig.dimensions.height} cm
      </div>
    </div>
  );
};

// ========== MAIN COMPONENT ==========

const RoomConfigurationPage = () => {
  const navigate = useNavigate();
  const contentTopRef = useRef(null);

  // ========== STATE MANAGEMENT ==========
  const [roomName, setRoomName] = useState("My Living Room");
  const [dimensions, setDimensions] = useState({
    width: 400,
    length: 500,
    height: 270,
  });
  const [selectedShape, setSelectedShape] = useState("rectangular");
  const [selectedColorScheme, setSelectedColorScheme] = useState("neutral");
  const [selectedFloorMaterial, setSelectedFloorMaterial] =
    useState("hardwood");
  const [wallColor, setWallColor] = useState("#F9FAFB");
  const [floorColor, setFloorColor] = useState("#E5E7EB");
  const [customColors, setCustomColors] = useState([
    "#FFFFFF",
    "#F3F4F6",
    "#E5E7EB",
    "#D1D5DB",
    "#9CA3AF",
    "#6B7280",
  ]);

  // UI state
  const [activePresetId, setActivePresetId] = useState(null);
  const [isUnitMetric, setIsUnitMetric] = useState(true);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(true);
  const [errors, setErrors] = useState({});
  const [roomChanged, setRoomChanged] = useState(false);
  const [activeStep, setActiveStep] = useState(1);
  const [configComplete, setConfigComplete] = useState(false);
  const totalSteps = 4;

  // ========== EVENT HANDLERS ==========

  // Apply a room preset
  const handlePresetSelect = (preset) => {
    setRoomName(preset.name);
    setDimensions(preset.dimensions);
    setSelectedShape(preset.shape);
    setSelectedColorScheme(preset.colorScheme);
    setActivePresetId(preset.id);

    // Set colors from the color scheme
    const colorScheme = COLOR_SCHEMES.find(
      (cs) => cs.id === preset.colorScheme
    );
    if (colorScheme) {
      setWallColor(colorScheme.colors[0]);
      setFloorColor(colorScheme.colors[2]);
    }

    setRoomChanged(true);
    setErrors({});
    checkCompletionStatus();
  };

  // Handle dimension input changes with unit conversion
  const handleDimensionChange = (dimension, value) => {
    let numValue = parseFloat(value);
    if (isNaN(numValue)) numValue = 0;
    if (numValue < 0) numValue = 0;

    // Convert if units are in feet
    if (!isUnitMetric) {
      numValue = Math.round(numValue * 30.48);
    }

    setDimensions((prev) => ({ ...prev, [dimension]: numValue }));
    setActivePresetId(null);
    setRoomChanged(true);

    // Clear error for this field if exists
    if (errors[dimension]) {
      setErrors((prev) => ({ ...prev, [dimension]: null }));
    }

    checkCompletionStatus();
  };

  // Toggle between metric and imperial units
  const handleUnitToggle = () => {
    setIsUnitMetric((prev) => {
      // Convert existing dimensions based on current unit setting
      if (prev) {
        // Convert cm to feet (divide by 30.48)
        setDimensions({
          width: Math.round((dimensions.width / 30.48) * 10) / 10,
          length: Math.round((dimensions.length / 30.48) * 10) / 10,
          height: Math.round((dimensions.height / 30.48) * 10) / 10,
        });
      } else {
        // Convert feet to cm (multiply by 30.48)
        setDimensions({
          width: Math.round(dimensions.width * 30.48),
          length: Math.round(dimensions.length * 30.48),
          height: Math.round(dimensions.height * 30.48),
        });
      }
      return !prev;
    });
  };

  // Apply a color scheme
  const handleColorSchemeSelect = (schemeId) => {
    setSelectedColorScheme(schemeId);

    const colorScheme = COLOR_SCHEMES.find((cs) => cs.id === schemeId);
    if (colorScheme && schemeId !== "custom") {
      setWallColor(colorScheme.colors[0]);
      setFloorColor(colorScheme.colors[2]);
      setCustomColors(colorScheme.colors);
    }

    setActivePresetId(null);
    setRoomChanged(true);
    checkCompletionStatus();
  };

  // Update wall color and handle custom scheme
  const handleWallColorChange = (color) => {
    setWallColor(color);
    setRoomChanged(true);

    // If we're on custom color scheme, update the custom colors
    if (selectedColorScheme === "custom") {
      setCustomColors([color, ...customColors.slice(1)]);
    } else {
      // Switch to custom color scheme
      setSelectedColorScheme("custom");
    }

    checkCompletionStatus();
  };

  // Update floor color and handle custom scheme
  const handleFloorColorChange = (color) => {
    setFloorColor(color);
    setRoomChanged(true);

    // If we're on custom color scheme, update the custom colors
    if (selectedColorScheme === "custom") {
      setCustomColors([
        ...customColors.slice(0, 2),
        color,
        ...customColors.slice(3),
      ]);
    } else {
      // Switch to custom color scheme
      setSelectedColorScheme("custom");
    }

    checkCompletionStatus();
  };

  // Navigate between configuration steps
  const handleStepChange = (step) => {
    if (step > 0 && step <= totalSteps) {
      setActiveStep(step);

      // Scroll to the top of the content
      setTimeout(() => {
        if (contentTopRef.current) {
          contentTopRef.current.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }, 10);
    }
  };

  // Check if the configuration is complete and valid
  const checkCompletionStatus = useCallback(() => {
    const isValid =
      roomName.trim().length > 0 &&
      dimensions.width >= 50 &&
      dimensions.length >= 50 &&
      dimensions.height >= 200 &&
      selectedShape &&
      selectedColorScheme &&
      selectedFloorMaterial;

    setConfigComplete(isValid);
    return isValid;
  }, [
    roomName,
    dimensions.width,
    dimensions.length,
    dimensions.height,
    selectedShape,
    selectedColorScheme,
    selectedFloorMaterial,
  ]);

  // Validate form before proceeding
  const validateForm = () => {
    const newErrors = {};

    // Check if dimensions are valid
    if (!dimensions.width || dimensions.width < 50) {
      newErrors.width = isUnitMetric
        ? "Width must be at least 50 cm"
        : "Width must be at least 1.7 ft";
    }

    if (!dimensions.length || dimensions.length < 50) {
      newErrors.length = isUnitMetric
        ? "Length must be at least 50 cm"
        : "Length must be at least 1.7 ft";
    }

    if (!dimensions.height || dimensions.height < 200) {
      newErrors.height = isUnitMetric
        ? "Height must be at least 200 cm"
        : "Height must be at least 6.5 ft";
    }

    if (!roomName.trim()) {
      newErrors.roomName = "Room name is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = () => {
    if (validateForm()) {
      // Navigate to design studio with the room configuration
      navigate("/studio", {
        state: {
          roomConfig: {
            roomName,
            dimensions,
            shape: selectedShape,
            colorScheme: selectedColorScheme,
            floorMaterial: selectedFloorMaterial,
            wallColor,
            floorColor,
          },
        },
      });
    } else {
      // If validation fails, go to the step with errors
      if (errors.roomName || errors.width || errors.length || errors.height) {
        setActiveStep(2); // Changed from 1 to 2 since Basic Settings is now step 2

        // Scroll to top when validation fails
        setTimeout(() => {
          if (contentTopRef.current) {
            contentTopRef.current.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
          }
        }, 10);
      }
    }
  };

  // ========== EFFECTS ==========

  // Monitor room changes to update preset selection
  useEffect(() => {
    if (roomChanged) {
      // Check if current configuration matches any preset
      const matchingPreset = ROOM_PRESETS.find(
        (preset) =>
          preset.dimensions.width === dimensions.width &&
          preset.dimensions.length === dimensions.length &&
          preset.dimensions.height === dimensions.height &&
          preset.shape === selectedShape &&
          preset.colorScheme === selectedColorScheme
      );

      setActivePresetId(matchingPreset ? matchingPreset.id : null);
    }

    checkCompletionStatus();
  }, [
    dimensions,
    selectedShape,
    selectedColorScheme,
    roomChanged,
    checkCompletionStatus,
  ]);

  // ========== HELPER METHODS ==========

  // Get dimension display value based on current unit
  const getDisplayDimension = (value) => {
    if (isUnitMetric) return value;
    return Math.round((value / 30.48) * 10) / 10;
  };

  // ========== RENDER METHODS ==========

  // Render step indicator
  const renderStepIndicator = (step) => {
    return (
      <div className="flex items-center">
        <div
          className={`
          w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium
          ${
            activeStep === step
              ? "bg-indigo-600 text-white"
              : step < activeStep
              ? "bg-green-100 text-green-800 border border-green-200"
              : "bg-gray-100 text-gray-500 border border-gray-200"
          }
        `}
        >
          {step < activeStep ? <CheckIcon className="h-3 w-3" /> : step}
        </div>
      </div>
    );
  };

  // Render basic settings form
  const renderBasicSettings = () => (
    <Section title="Basic Settings" rightElement={renderStepIndicator(2)}>
      <div className="space-y-6">
        {/* Room Name */}
        <FormInput
          id="room-name"
          label="Room Name"
          value={roomName}
          onChange={(e) => {
            setRoomName(e.target.value);
            setRoomChanged(true);
            if (errors.roomName) {
              setErrors({ ...errors, roomName: null });
            }
            checkCompletionStatus();
          }}
          error={errors.roomName}
          helpText="Enter a name to identify your room design"
        />

        {/* Measurement Units Toggle */}
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-700">
              Measurement Units
            </label>
            <Tooltip content="Choose your preferred unit system for measurements">
              <QuestionMarkCircleIcon className="h-4 w-4 text-gray-400" />
            </Tooltip>
          </div>
          <div className="inline-flex rounded-md shadow-sm" role="group">
            <button
              type="button"
              className={`px-4 py-2 text-sm font-medium rounded-l-lg border ${
                isUnitMetric
                  ? "bg-indigo-50 text-indigo-700 border-indigo-300 z-10"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
              }`}
              onClick={() => isUnitMetric || handleUnitToggle()}
            >
              Metric (cm)
            </button>
            <button
              type="button"
              className={`px-4 py-2 text-sm font-medium rounded-r-lg border-t border-b border-r ${
                !isUnitMetric
                  ? "bg-indigo-50 text-indigo-700 border-indigo-300 z-10"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
              }`}
              onClick={() => !isUnitMetric || handleUnitToggle()}
            >
              Imperial (ft)
            </button>
          </div>
        </div>

        {/* Room Dimensions */}
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-900">
              Room Dimensions
            </h3>
            <Tooltip content="Specify the width, length, and height of your room">
              <QuestionMarkCircleIcon className="h-4 w-4 text-gray-400" />
            </Tooltip>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <DimensionInput
              id="room-width"
              label="Width"
              value={getDisplayDimension(dimensions.width)}
              onChange={(val) => handleDimensionChange("width", val)}
              unit={isUnitMetric ? "cm" : "ft"}
              error={errors.width}
              helpText={`Minimum ${isUnitMetric ? "50 cm" : "1.7 ft"}`}
            />
            <DimensionInput
              id="room-length"
              label="Length"
              value={getDisplayDimension(dimensions.length)}
              onChange={(val) => handleDimensionChange("length", val)}
              unit={isUnitMetric ? "cm" : "ft"}
              error={errors.length}
              helpText={`Minimum ${isUnitMetric ? "50 cm" : "1.7 ft"}`}
            />
            <DimensionInput
              id="room-height"
              label="Height"
              value={getDisplayDimension(dimensions.height)}
              onChange={(val) => handleDimensionChange("height", val)}
              unit={isUnitMetric ? "cm" : "ft"}
              error={errors.height}
              helpText={`Minimum ${isUnitMetric ? "200 cm" : "6.5 ft"}`}
            />
          </div>
        </div>
      </div>
    </Section>
  );

  // Render room shape selection
  const renderRoomShape = () => (
    <Section title="Room Shape" rightElement={renderStepIndicator(1)}>
      <div className="space-y-4">
        <p className="text-sm text-gray-600 mb-4">
          Select the shape that best matches your room layout. For complex
          shapes, choose 'Custom' and you'll be able to define the precise
          layout in the design studio.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {ROOM_SHAPES.map((shape) => (
            <div
              key={shape.id}
              className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                selectedShape === shape.id
                  ? "border-indigo-500 bg-indigo-50 ring-2 ring-indigo-200 transform scale-[1.02]"
                  : "border-gray-300 hover:border-indigo-300 hover:bg-indigo-50/30"
              }`}
              onClick={() => {
                setSelectedShape(shape.id);
                setRoomChanged(true);
                checkCompletionStatus();
              }}
            >
              <div className="h-16 w-16 mx-auto mb-3 text-gray-700">
                {shape.icon}
              </div>
              <div className="text-center">
                <h3 className="text-sm font-medium text-gray-900">
                  {shape.name}
                </h3>
              </div>
            </div>
          ))}
        </div>

        {selectedShape === "custom" && (
          <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex">
              <InformationCircleIcon className="h-5 w-5 text-amber-500 mr-2 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-amber-800">
                For custom room shapes, you'll be able to define the exact
                layout in the design studio after proceeding.
              </p>
            </div>
          </div>
        )}
      </div>
    </Section>
  );

  // Render color scheme selection
  const renderColorScheme = () => (
    <Section title="Color Scheme" rightElement={renderStepIndicator(3)}>
      <div className="space-y-6">
        <p className="text-sm text-gray-600 mb-2">
          Choose a color scheme that matches your style or create your own
          custom palette.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {COLOR_SCHEMES.map((scheme) => (
            <div
              key={scheme.id}
              className={`border rounded-lg overflow-hidden cursor-pointer transition-all duration-200 ${
                selectedColorScheme === scheme.id
                  ? "border-indigo-500 ring-2 ring-indigo-200 transform scale-[1.02]"
                  : "border-gray-300 hover:border-indigo-300"
              }`}
              onClick={() => handleColorSchemeSelect(scheme.id)}
            >
              <div className="h-12 flex">
                {scheme.colors.map((color, index) => (
                  <div
                    key={index}
                    className="flex-1"
                    style={{ backgroundColor: color }}
                  ></div>
                ))}
              </div>
              <div className="p-4">
                <h3 className="text-sm font-medium text-gray-900 flex items-center">
                  {scheme.name}
                  {selectedColorScheme === scheme.id && (
                    <CheckIcon className="h-4 w-4 ml-2 text-indigo-500" />
                  )}
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  {scheme.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <h3 className="text-sm font-medium text-gray-900 mb-4">
            Customize Colors
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <ColorPicker
              id="wall-color"
              label="Wall Color"
              color={wallColor}
              onChange={handleWallColorChange}
              onCustomize={() => {
                if (selectedColorScheme !== "custom") {
                  setSelectedColorScheme("custom");
                }
              }}
              helpText="Select a color for your room walls"
            />
            <ColorPicker
              id="floor-color"
              label="Floor Color"
              color={floorColor}
              onChange={handleFloorColorChange}
              onCustomize={() => {
                if (selectedColorScheme !== "custom") {
                  setSelectedColorScheme("custom");
                }
              }}
              helpText="Select a color for your room floor"
            />
          </div>
        </div>
      </div>
    </Section>
  );

  // Render floor material selection
  const renderFloorMaterial = () => (
    <Section title="Floor Material" rightElement={renderStepIndicator(4)}>
      <div className="space-y-4">
        <p className="text-sm text-gray-600 mb-4">
          Choose the material for your floor. This affects both appearance and
          properties in your design.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {MATERIALS.map((material) => (
            <div
              key={material.id}
              className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 text-center ${
                selectedFloorMaterial === material.id
                  ? "border-indigo-500 bg-indigo-50 ring-2 ring-indigo-200 transform scale-[1.02]"
                  : "border-gray-300 hover:border-indigo-300 hover:bg-indigo-50/30"
              }`}
              onClick={() => {
                setSelectedFloorMaterial(material.id);
                setRoomChanged(true);
                checkCompletionStatus();
              }}
            >
              <div className="h-12 w-12 mx-auto mb-3 flex items-center justify-center rounded-full bg-white shadow-sm border border-gray-200">
                <span className="text-2xl">{material.emoji}</span>
              </div>
              <h3 className="text-sm font-medium text-gray-900">
                {material.name}
              </h3>
              <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                {material.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );

  // Render advanced options section
  const renderAdvancedOptions = () => (
    <Section title="Advanced Options" collapsible={true} defaultOpen={true}>
      <div className="space-y-6">
        {/* Windows and Doors */}
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
            <BeakerIcon className="h-5 w-5 mr-2 text-indigo-500" />
            Windows and Doors
          </h3>
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
            <p className="text-sm text-gray-600">
              You'll be able to add and position windows and doors in the design
              studio after proceeding.
            </p>
          </div>
          <Button
            variant="outline"
            size="md"
            icon={<PlusIcon className="h-4 w-4" />}
          >
            Add Window/Door Preset
          </Button>
        </div>

        {/* Lighting Settings */}
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
            <SunIcon className="h-5 w-5 mr-2 text-indigo-500" />
            Lighting Settings
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="lighting-type"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Lighting Type
              </label>
              <select
                id="lighting-type"
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                defaultValue="natural"
              >
                <option value="natural">Natural Light</option>
                <option value="warm">Warm Lighting</option>
                <option value="cool">Cool Lighting</option>
                <option value="evening">Evening Mode</option>
              </select>
            </div>
            <div>
              <label
                htmlFor="light-intensity"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Light Intensity
              </label>
              <div className="mt-1 flex items-center">
                <input
                  type="range"
                  id="light-intensity"
                  min="0"
                  max="100"
                  defaultValue="70"
                  className="w-full h-2 bg-gray-200 rounded-full appearance-none"
                />
                <span className="ml-3 text-sm text-gray-500">70%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Environment Settings */}
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
            <Cog6ToothIcon className="h-5 w-5 mr-2 text-indigo-500" />
            Environment
          </h3>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="space-y-3">
              <div className="flex items-center">
                <input
                  id="ceiling-molding"
                  type="checkbox"
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="ceiling-molding"
                  className="ml-3 text-sm text-gray-700"
                >
                  Add ceiling molding
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="floor-skirting"
                  type="checkbox"
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  defaultChecked
                />
                <label
                  htmlFor="floor-skirting"
                  className="ml-3 text-sm text-gray-700"
                >
                  Add floor skirting
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="realistic-shadows"
                  type="checkbox"
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  defaultChecked
                />
                <label
                  htmlFor="realistic-shadows"
                  className="ml-3 text-sm text-gray-700"
                >
                  Enable realistic shadows
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );

  // Render room presets
  const renderRoomPresets = () => (
    <Card title="Room Presets" variant="accent" className="mb-6">
      <div className="grid grid-cols-2 gap-3">
        {ROOM_PRESETS.map((preset) => (
          <div
            key={preset.id}
            className={`group cursor-pointer rounded-lg overflow-hidden transition-all duration-200 ${
              activePresetId === preset.id
                ? "ring-2 ring-indigo-500 shadow-md transform scale-[1.02]"
                : "border border-gray-200 hover:border-indigo-300 hover:shadow-sm"
            }`}
            onClick={() => handlePresetSelect(preset)}
          >
            <div className="aspect-w-4 aspect-h-3 bg-gray-100 relative">
              <img
                src={preset.image}
                alt={preset.name}
                className="w-full h-full object-cover"
              />
              {activePresetId === preset.id && (
                <div className="absolute top-2 right-2 bg-indigo-500 rounded-full p-1">
                  <CheckIcon className="h-4 w-4 text-white" />
                </div>
              )}
            </div>
            <div className="p-3">
              <h3 className="text-sm font-medium text-gray-900">
                {preset.name}
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                {isUnitMetric
                  ? `${preset.dimensions.width} × ${preset.dimensions.length} cm`
                  : `${
                      Math.round((preset.dimensions.width / 30.48) * 10) / 10
                    } × ${
                      Math.round((preset.dimensions.length / 30.48) * 10) / 10
                    } ft`}
              </p>
            </div>
          </div>
        ))}

        {/* Create New Preset */}
        <button className="group cursor-pointer rounded-lg overflow-hidden border-2 border-dashed border-gray-300 hover:border-indigo-300 transition-all duration-200 hover:bg-indigo-50/30">
          <div className="aspect-w-4 aspect-h-3 bg-gray-50 flex items-center justify-center">
            <PlusIcon className="h-8 w-8 text-gray-400 group-hover:text-indigo-500" />
          </div>
          <div className="p-3 text-center">
            <h3 className="text-sm font-medium text-gray-900">Create New</h3>
            <p className="text-xs text-gray-500 mt-1">
              Save your custom preset
            </p>
          </div>
        </button>
      </div>
    </Card>
  );

  // Render room summary
  const renderRoomSummary = () => (
    <Card title="Room Summary" className="mb-6">
      <div className="space-y-4">
        <RoomPreview
          roomConfig={{ dimensions }}
          selectedShape={selectedShape}
          wallColor={wallColor}
          floorColor={floorColor}
          floorMaterial={selectedFloorMaterial}
        />

        <div className="mt-4 space-y-3 bg-gray-50 p-4 rounded-lg border border-gray-200">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-500">
              Room Name:
            </span>
            <span className="text-sm font-medium text-gray-900">
              {roomName}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-500">
              Dimensions:
            </span>
            <span className="text-sm font-medium text-gray-900">
              {getDisplayDimension(dimensions.width)} ×{" "}
              {getDisplayDimension(dimensions.length)} ×{" "}
              {getDisplayDimension(dimensions.height)}{" "}
              {isUnitMetric ? "cm" : "ft"}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-500">Shape:</span>
            <span className="text-sm font-medium text-gray-900">
              {ROOM_SHAPES.find((shape) => shape.id === selectedShape)?.name}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-500">
              Color Scheme:
            </span>
            <span className="text-sm font-medium text-gray-900">
              {
                COLOR_SCHEMES.find(
                  (scheme) => scheme.id === selectedColorScheme
                )?.name
              }
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-500">
              Floor Material:
            </span>
            <span className="text-sm font-medium text-gray-900">
              {
                MATERIALS.find(
                  (material) => material.id === selectedFloorMaterial
                )?.name
              }
            </span>
          </div>
        </div>

        <div className="flex flex-col mt-4">
          <Button
            variant="primary"
            size="lg"
            className="w-full"
            onClick={handleSubmit}
            disabled={!configComplete}
            icon={<ChevronRightIcon className="h-5 w-5" />}
          >
            Proceed to Design Studio
          </Button>

          {!configComplete && (
            <p className="text-sm text-amber-600 mt-2 text-center">
              Please complete all required settings
            </p>
          )}
        </div>
      </div>
    </Card>
  );

  // Render progress steps
  const renderProgressSteps = () => {
    const steps = [
      { number: 1, name: "Room Shape" },
      { number: 2, name: "Basic Settings" },
      { number: 3, name: "Color Scheme" },
      { number: 4, name: "Floor Material" },
    ];

    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
        <div className="py-6 px-4">
          <nav aria-label="Progress">
            <ol className="flex items-center">
              {steps.map((step, index) => (
                <li
                  key={step.number}
                  className="relative flex-1 flex flex-col items-center"
                >
                  {/* Step circle and text container */}
                  <div className="flex flex-col items-center">
                    {/* Step circle */}
                    <button
                      onClick={() => handleStepChange(step.number)}
                      className={`w-10 h-10 flex items-center justify-center rounded-full focus:outline-none ${
                        step.number < activeStep
                          ? "bg-indigo-600 text-white"
                          : step.number === activeStep
                          ? "bg-indigo-600 text-white"
                          : "bg-white border-2 border-gray-300 text-gray-500"
                      }`}
                    >
                      {step.number < activeStep ? (
                        <CheckIcon className="w-5 h-5 text-white" />
                      ) : (
                        <span
                          className={
                            step.number === activeStep
                              ? "text-white"
                              : "text-gray-500"
                          }
                        >
                          {step.number}
                        </span>
                      )}
                    </button>

                    {/* Step name - positioned below circle */}
                    <span
                      className={`mt-3 text-sm font-medium ${
                        step.number === activeStep
                          ? "text-indigo-600"
                          : step.number < activeStep
                          ? "text-gray-900"
                          : "text-gray-500"
                      }`}
                    >
                      {step.name}
                    </span>
                  </div>

                  {/* Connector line to the right */}
                  {index < steps.length - 1 && (
                    <div
                      className="absolute top-5 left-1/2 w-1/2 h-0.5"
                      style={{
                        background:
                          step.number < activeStep ? "#4F46E5" : "#E5E7EB",
                      }}
                      aria-hidden="true"
                    />
                  )}

                  {/* Connector line to the left */}
                  {index > 0 && (
                    <div
                      className="absolute top-5 right-1/2 w-1/2 h-0.5"
                      style={{
                        background:
                          step.number <= activeStep ? "#4F46E5" : "#E5E7EB",
                      }}
                      aria-hidden="true"
                    />
                  )}
                </li>
              ))}
            </ol>
          </nav>
        </div>
      </div>
    );
  };

  // ========== COMPONENT RENDER ==========

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <button
                onClick={() => navigate(-1)}
                className="text-gray-500 hover:text-gray-700 mr-4 rounded-full hover:bg-gray-100 p-1.5 transition-all"
                aria-label="Go back"
              >
                <ArrowLeftIcon className="h-5 w-5" />
              </button>
              <h1 className="text-xl font-semibold text-gray-900">
                Room Configuration
              </h1>
            </div>
            <div className="flex items-center space-x-3">
              {/* Only show toggle button on step 2 now (previously step 1) */}
              {activeStep === 2 && (
                <button
                  onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
                  className="px-3 py-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-700 rounded-md hover:bg-indigo-50 transition-all duration-200"
                >
                  {showAdvancedOptions ? "Hide" : "Show"} Advanced Options
                </button>
              )}
              <Button
                variant="primary"
                onClick={handleSubmit}
                disabled={!configComplete}
                icon={<ChevronRightIcon className="h-5 w-5" />}
              >
                Proceed to Design
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left section - Room Preview and Presets */}
          <div className="lg:col-span-1">
            {renderRoomSummary()}
            {renderRoomPresets()}
          </div>

          {/* Right section - Configuration Forms */}
          <div className="lg:col-span-2" ref={contentTopRef}>
            {renderProgressSteps()}

            {/* Configuration sections - only render the active step */}
            <div>
              {activeStep === 1 && renderRoomShape()}
              {activeStep === 2 && renderBasicSettings()}
              {activeStep === 3 && renderColorScheme()}
              {activeStep === 4 && renderFloorMaterial()}

              {/* Advanced options are only visible on step 2 now (previously step 1) */}
              {activeStep === 2 &&
                showAdvancedOptions &&
                renderAdvancedOptions()}
            </div>

            {/* Navigation buttons */}
            <div className="flex justify-between mt-6">
              <Button
                variant="secondary"
                onClick={() => handleStepChange(activeStep - 1)}
                disabled={activeStep === 1}
              >
                Previous Step
              </Button>

              {activeStep < totalSteps ? (
                <Button
                  variant="primary"
                  onClick={() => handleStepChange(activeStep + 1)}
                >
                  Next Step
                </Button>
              ) : (
                <Button
                  variant="primary"
                  onClick={handleSubmit}
                  disabled={!configComplete}
                  icon={<ChevronRightIcon className="h-5 w-5" />}
                >
                  Proceed to Design
                </Button>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default RoomConfigurationPage;
