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
import furnitureData from "../scenes/RoomEditor/data/furniture.json";

// --- CATEGORY CONSTANTS ---
const FURNITURE_CATEGORIES = [
  { id: "all", name: "All Items" },
  { id: "chairs", name: "Chairs & Seating" },
  { id: "tables", name: "Tables" },
  { id: "storage", name: "Storage" },
  { id: "beds", name: "Beds" },
  { id: "lighting", name: "Lighting" },
  { id: "decor", name: "Décor" },
];

// --- MATERIALS & COLORS ---
const FURNITURE_MATERIALS = [
  { id: "wood", name: "Wood", color: "#A47551" },
  { id: "metal", name: "Metal", color: "#B4B8BF" },
  { id: "fabric", name: "Fabric", color: "#9CB3BC" },
  { id: "leather", name: "Leather", color: "#8D5B4C" },
  { id: "glass", name: "Glass", color: "#A5CBCF" },
];
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

// --- VIEW MODES ---
const VIEW_MODES = [
  { id: "3d", name: "3D View", icon: <CubeSolidIcon className="h-5 w-5" /> },
  { id: "2d", name: "Floor Plan", icon: <Square3Stack3DIcon className="h-5 w-5" /> },
];

// --- MAIN STUDIO COMPONENT ---
const Studio = () => {
  // --- ROUTER & REFS ---
  const location = useLocation();
  const navigate = useNavigate();
  const canvasRef = useRef(null);

  // --- ROOM CONFIG ---
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

  // --- STATE: UI, Furniture, View, History ---
  const [selectedItem, setSelectedItem] = useState(null);
  const [gizmoMode, setGizmoMode] = useState('translate');
  const [isGizmoActive, setIsGizmoActive] = useState(true);
  const [color, setColor] = useState('#cccccc');
  const [savedDesigns, setSavedDesigns] = useState([]);
  const [loadError, setLoadError] = useState('');
  const [vertexes, setVertexes] = useState([]);
  const [designName, setDesignName] = useState(roomConfig.roomName || "New Design");
  const [isDesignNameEditing, setIsDesignNameEditing] = useState(false);
  const [savingStatus, setSavingStatus] = useState("idle");
  const [selectedViewMode, setSelectedViewMode] = useState("2d");
  const [isCatalogOpen, setIsCatalogOpen] = useState(true);
  const [isPropertiesPanelOpen, setIsPropertiesPanelOpen] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [toast, setToast] = useState(null);
  const [showHelpTour, setShowHelpTour] = useState(false);
  const [showInstructionsOverlay, setShowInstructionsOverlay] = useState(true);
  const [rightPanelTab, setRightPanelTab] = useState("room");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [hoveringItem, setHoveringItem] = useState(null);
  const [furnitureItems, setFurnitureItems] = useState([]);
  const [furniture, setFurniture] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [zoomLevel, setZoomLevel] = useState(70);
  const [viewPosition, setViewPosition] = useState({ x: 0, y: 0 });
  const [showGrid, setShowGrid] = useState(true);
  const [snapToGrid, setSnapToGrid] = useState(true);
  const [gridSize] = useState(10);
  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const [viewSettings, setViewSettings] = useState({
    showDimensions: true,
    showShadows: true,
    lightingPreset: "neutral",
  });

  // --- LOAD FURNITURE DATA ---
  useEffect(() => {
    setFurnitureItems(furnitureData);
  }, []);

  // --- FURNITURE ACTIONS ---
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
    addToHistory({ type: 'add', item: newItem });
    showToast(`Added ${model.name} to room`, "success");
  };
  const updateFurniture = (id, updates) => {
    setFurniture((prev) => prev.map((item) => item.id === id ? { ...item, ...updates } : item));
    addToHistory({ type: 'update', id, updates });
  };
  const deleteFurniture = (id) => {
    setFurniture((prev) => prev.filter((item) => item.id !== id));
    addToHistory({ type: 'delete', id });
    setSelectedItem(null);
    showToast('Furniture item deleted', 'success');
  };

  // --- HISTORY (UNDO/REDO) ---
  const addToHistory = (action) => {
    setUndoStack(prev => [...prev, action]);
    setRedoStack([]);
  };
  const undo = () => {
    if (undoStack.length === 0) return;
    const lastAction = undoStack[undoStack.length - 1];
    setUndoStack(prev => prev.slice(0, -1));
    setRedoStack(prev => [...prev, lastAction]);
    if (lastAction.type === 'add') {
      setFurniture(prev => prev.filter(item => item.id !== lastAction.item.id));
    }
    // ...other undo types...
  };
  const redo = () => {
    if (redoStack.length === 0) return;
    const nextAction = redoStack[redoStack.length - 1];
    setRedoStack(prev => prev.slice(0, -1));
    setUndoStack(prev => [...prev, nextAction]);
    if (nextAction.type === 'add') {
      setFurniture(prev => [...prev, nextAction.item]);
    }
    // ...other redo types...
  };

  // --- TOASTS & UI HELPERS ---
  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };
  const handleExit = () => navigate("/room");

  // --- RENDER ---
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
                    onChange={(e) => setDesignName(e.target.value)}
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
                onClick={() => showToast("Design saved successfully")}
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
                onClick={() => setIsFullscreen(!isFullscreen)}
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
                {furnitureItems.filter((item) => {
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
                    {furnitureItems.filter((item) => {
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
                        onAdd={addFurniture}
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
                onClick={undo}
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
                onClick={redo}
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
                  onClick={() => setZoomLevel((prev) => Math.max(20, prev - 10))}
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
                  onClick={() => setZoomLevel((prev) => Math.min(150, prev + 10))}
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
            selectedItem={selectedItem}
            setSelectedItem={setSelectedItem}
            gizmoMode={gizmoMode}
            setGizmoMode={setGizmoMode}
            isGizmoActive={isGizmoActive}
            setIsGizmoActive={setIsGizmoActive}
            vertexes={vertexes}
            setVertexes={setVertexes}
            color={color}
            setColor={setColor}
            gridSize={gridSize}
            viewPosition={viewPosition}
            savedDesigns={savedDesigns}
            loadError={loadError}
            snapToGrid={snapToGrid}
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
              {/* --- Tab Switch Buttons --- */}
              <div className="flex border-b border-gray-200 bg-gray-50">
                <button
                  className={`flex-1 py-2 text-sm font-medium transition-colors ${
                    rightPanelTab === "room"
                      ? "bg-white text-indigo-600 border-b-2 border-indigo-600"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                  onClick={() => setRightPanelTab("room")}
                >
                  Room Properties
                </button>
                <button
                  className={`flex-1 py-2 text-sm font-medium transition-colors ${
                    rightPanelTab === "furniture"
                      ? "bg-white text-indigo-600 border-b-2 border-indigo-600"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                  onClick={() => setRightPanelTab("furniture")}
                >
                  Furniture Properties
                </button>
              </div>
              {/* --- End Tab Switch Buttons --- */}

              <div className="flex-1 overflow-y-auto">
                {rightPanelTab === "room" ? (
                  <>
                    {/* --- Room Properties Panels --- */}
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
                            {furniture.length}
                          </span>
                        </div>

                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Total cost:</span>
                          <span className="text-sm font-medium text-indigo-600">
                            $
                            {furniture.reduce(
                              (sum, item) =>
                                sum +
                                (furnitureItems.find((f) => f.name === item.type)
                                  ?.price || 0),
                              0
                            )}
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
                  </>
                ) : (
                  <>
                    {/* --- Furniture Properties Panel --- */}
                    {selectedItem ? (
                      (() => {
                        const item = furniture.find((f) => f.id === selectedItem);
                        if (!item) return null;
                        return (
                          <div className="m-4 mb-2 p-4 bg-gray-50 rounded-lg shadow-sm">
                            <h3 className="text-lg font-semibold mb-2">Selected Item: {item.type}</h3>
                            {/* Gizmo Mode Selector */}
                            <div className="control-group" style={{ marginBottom: '15px' }}>
                              <label style={{fontWeight: 'bold', marginBottom: '5px', display: 'block'}}>Gizmo Mode:</label>
                              <div style={{display: 'flex', gap: '5px'}}>
                                <Button
                                  variant={gizmoMode === 'translate' ? 'selected' : 'secondary'}
                                  onClick={() => { setGizmoMode('translate'); setIsGizmoActive(true); }}
                                >
                                  Translate
                                </Button>
                                <Button
                                  variant={gizmoMode === 'rotate' ? 'selected' : 'secondary'}
                                  onClick={() => { setGizmoMode('rotate'); setIsGizmoActive(true); }}
                                >
                                  Rotate
                                </Button>
                                <Button
                                  variant={gizmoMode === 'scale' ? 'selected' : 'secondary'}
                                  onClick={() => { setGizmoMode('scale'); setIsGizmoActive(true); }}
                                >
                                  Scale
                                </Button>
                              </div>
                            </div>
                            <div className="mb-3">
                              <label className="block text-sm font-medium mb-1">Color</label>
                              <input
                                type="color"
                                value={item.color || '#cccccc'}
                                onChange={(e) => updateFurniture(item.id, { color: e.target.value })}
                                className="w-10 h-10 p-0 border-0 bg-transparent cursor-pointer"
                              />
                            </div>
                            <div className="mb-3 flex gap-4">
                              <div>
                                <label className="block text-sm font-medium mb-1">X Position</label>
                                <input
                                  type="number"
                                  value={item.position.x.toFixed(2)}
                                  step={0.1}
                                  onChange={(e) => updateFurniture(item.id, { position: { ...item.position, x: Number(e.target.value) } })}
                                  className="w-20 px-2 py-1 border rounded"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium mb-1">Z Position</label>
                                <input
                                  type="number"
                                  value={item.position.z.toFixed(2)}
                                  step={0.1}
                                  onChange={(e) => updateFurniture(item.id, { position: { ...item.position, z: Number(e.target.value) } })}
                                  className="w-20 px-2 py-1 border rounded"
                                />
                              </div>
                            </div>
                            <div className="mb-3">
                              <label className="block text-sm font-medium mb-1">Rotation (Y-axis): {Math.round(item.rotation * (180 / Math.PI))}°</label>
                              <input
                                type="range"
                                min="0"
                                max="360"
                                value={Math.round(item.rotation * (180/Math.PI))}
                                onChange={(e) => updateFurniture(item.id, { rotation: Number(e.target.value) * (Math.PI / 180) })}
                                step={1}
                                className="w-full"
                              />
                            </div>
                            <div className="mb-3 flex gap-4">
                              <div>
                                <label className="block text-sm font-medium mb-1">Scale X</label>
                                <input
                                  type="number"
                                  value={item.scale.x}
                                  step={0.01}
                                  min={0.01}
                                  onChange={(e) => updateFurniture(item.id, { scale: { ...item.scale, x: Number(e.target.value) } })}
                                  className="w-20 px-2 py-1 border rounded"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium mb-1">Scale Y</label>
                                <input
                                  type="number"
                                  value={item.scale.y}
                                  step={0.01}
                                  min={0.01}
                                  onChange={(e) => updateFurniture(item.id, { scale: { ...item.scale, y: Number(e.target.value) } })}
                                  className="w-20 px-2 py-1 border rounded"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium mb-1">Scale Z</label>
                                <input
                                  type="number"
                                  value={item.scale.z}
                                  step={0.01}
                                  min={0.01}
                                  onChange={(e) => updateFurniture(item.id, { scale: { ...item.scale, z: Number(e.target.value) } })}
                                  className="w-20 px-2 py-1 border rounded"
                                />
                              </div>
                            </div>
                            <button
                              className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                              onClick={() => deleteFurniture(item.id)}
                            >
                              Delete Item
                            </button>
                          </div>
                        );
                      })()
                    ) : (
                      <div className="m-4 text-gray-500 text-center">No furniture item selected.</div>
                    )}
                  </>
                )}
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

export default Studio;
