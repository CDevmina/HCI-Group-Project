import React, { useState, useEffect, useRef, useCallback } from "react";
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

// Import Room2D and Room3D components from RoomEditor
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import Room2D from "../scenes/RoomEditor/components/Room2D";
import Room3D from "../scenes/RoomEditor/components/Room3D";
import { MOUSE, TOUCH, Vector3, Euler } from "three";

// WASD Movement Hook from RoomEditor
const useWASDControls = (
  cameraRef,
  orbitControlsRef,
  moveSpeed = 5,
  enabled = true
) => {
  const [movement, setMovement] = useState({
    forward: false,
    backward: false,
    left: false,
    right: false,
    up: false,
    down: false,
  });

  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (event) => {
      if (
        document.activeElement.tagName === "INPUT" ||
        document.activeElement.tagName === "TEXTAREA"
      ) {
        return;
      }
      switch (event.key.toLowerCase()) {
        case "w":
          setMovement((m) => ({ ...m, forward: true }));
          break;
        case "s":
          setMovement((m) => ({ ...m, backward: true }));
          break;
        case "a":
          setMovement((m) => ({ ...m, left: true }));
          break;
        case "d":
          setMovement((m) => ({ ...m, right: true }));
          break;
        case "e":
          setMovement((m) => ({ ...m, up: true }));
          break;
        case "q":
          setMovement((m) => ({ ...m, down: true }));
          break;
      }
    };

    const handleKeyUp = (event) => {
      switch (event.key.toLowerCase()) {
        case "w":
          setMovement((m) => ({ ...m, forward: false }));
          break;
        case "s":
          setMovement((m) => ({ ...m, backward: false }));
          break;
        case "a":
          setMovement((m) => ({ ...m, left: false }));
          break;
        case "d":
          setMovement((m) => ({ ...m, right: false }));
          break;
        case "e":
          setMovement((m) => ({ ...m, up: false }));
          break;
        case "q":
          setMovement((m) => ({ ...m, down: false }));
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [enabled]);

  useFrame((state, delta) => {
    if (!enabled || !cameraRef.current || !orbitControlsRef.current) return;

    const cam = cameraRef.current;
    const controls = orbitControlsRef.current;
    const speed = moveSpeed * delta;

    const moveDirection = new Vector3();
    const rightDirection = new Vector3();

    cam.getWorldDirection(moveDirection);
    rightDirection.setFromMatrixColumn(cam.matrix, 0);
    rightDirection.normalize();

    let didMove = false;

    if (movement.forward) {
      cam.position.addScaledVector(moveDirection, speed);
      controls.target.addScaledVector(moveDirection, speed);
      didMove = true;
    }
    if (movement.backward) {
      cam.position.addScaledVector(moveDirection, -speed);
      controls.target.addScaledVector(moveDirection, -speed);
      didMove = true;
    }
    if (movement.left) {
      cam.position.addScaledVector(rightDirection, -speed);
      controls.target.addScaledVector(rightDirection, -speed);
      didMove = true;
    }
    if (movement.right) {
      cam.position.addScaledVector(rightDirection, speed);
      controls.target.addScaledVector(rightDirection, speed);
      didMove = true;
    }
    if (movement.up) {
      cam.position.y += speed;
      controls.target.y += speed;
      didMove = true;
    }
    if (movement.down) {
      cam.position.y -= speed;
      controls.target.y -= speed;
      didMove = true;
    }

    if (didMove) {
      controls.update();
    }
  });
};

// Helper component to conditionally apply WASD controls
const WASDNavigationController = ({ cameraRef, orbitControlsRef, enabled }) => {
  useWASDControls(cameraRef, orbitControlsRef, 5, enabled);
  return null;
};

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

// Sample furniture items for the sidebar
const SAMPLE_FURNITURE = [
  {
    id: "sofa",
    name: "Sofa",
    category: "seating",
    image: "https://via.placeholder.com/100x60?text=Sofa",
    dimensions: { width: 2.2, length: 0.9, height: 0.8 },
  },
  {
    id: "chair",
    name: "Chair",
    category: "seating",
    image: "https://via.placeholder.com/100x60?text=Chair",
    dimensions: { width: 0.6, length: 0.6, height: 0.9 },
  },
  {
    id: "coffee-table",
    name: "Coffee Table",
    category: "tables",
    image: "https://via.placeholder.com/100x60?text=Coffee+Table",
    dimensions: { width: 1.2, length: 0.6, height: 0.4 },
  },
  {
    id: "dining-table",
    name: "Dining Table",
    category: "tables",
    image: "https://via.placeholder.com/100x60?text=Dining+Table",
    dimensions: { width: 1.8, length: 0.9, height: 0.75 },
  },
  {
    id: "bed",
    name: "Bed",
    category: "bedroom",
    image: "https://via.placeholder.com/100x60?text=Bed",
    dimensions: { width: 1.6, length: 2, height: 0.5 },
  },
  {
    id: "wardrobe",
    name: "Wardrobe",
    category: "storage",
    image: "https://via.placeholder.com/100x60?text=Wardrobe",
    dimensions: { width: 1.2, length: 0.6, height: 2 },
  },
  {
    id: "bookshelf",
    name: "Bookshelf",
    category: "storage",
    image: "https://via.placeholder.com/100x60?text=Bookshelf",
    dimensions: { width: 0.8, length: 0.3, height: 1.8 },
  },
  {
    id: "lamp",
    name: "Floor Lamp",
    category: "lighting",
    image: "https://via.placeholder.com/100x60?text=Floor+Lamp",
    dimensions: { width: 0.3, length: 0.3, height: 1.5 },
  },
];

// Furniture color options
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

// Furniture Item Component for Sidebar
const FurnitureItem = ({ item, onClick }) => {
  return (
    <div
      onClick={() => onClick(item)}
      className="bg-white border border-gray-200 rounded-md p-2 cursor-pointer hover:border-indigo-300 hover:shadow-sm transition-all"
    >
      <div className="w-full h-16 mb-2 bg-gray-100 rounded flex items-center justify-center overflow-hidden">
        <img
          src={item.image}
          alt={item.name}
          className="max-w-full max-h-full object-cover"
        />
      </div>
      <div className="text-sm font-medium text-gray-800">{item.name}</div>
      <div className="text-xs text-gray-500">{item.category}</div>
    </div>
  );
};

// Sidebar Panel Component
const SidebarPanel = ({
  onAddFurniture,
  selectedFurniture,
  placedFurniture,
  updateFurniture,
  onSelectFurniture,
  onDeleteFurniture,
  showGrid,
  setShowGrid,
  snapToGrid,
  setSnapToGrid,
  isOpen,
  onToggle,
}) => {
  const [activeTab, setActiveTab] = useState("add");
  const [categories] = useState([
    "All",
    ...new Set(SAMPLE_FURNITURE.map((item) => item.category)),
  ]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  // Filter furniture items based on category and search term
  const filteredFurniture = SAMPLE_FURNITURE.filter(
    (item) =>
      (selectedCategory === "All" || item.category === selectedCategory) &&
      (item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Get the currently selected furniture item if any
  const selectedItem = selectedFurniture
    ? placedFurniture.find((item) => item.instanceId === selectedFurniture)
    : null;

  return (
    <div
      className={`fixed top-0 bottom-0 right-0 bg-white border-l border-gray-200 transition-all duration-300 ease-in-out w-80 shadow-lg z-10 ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="absolute -left-10 top-1/2 transform -translate-y-1/2">
        <button
          onClick={onToggle}
          className="bg-white border border-gray-200 border-r-0 rounded-l-md p-2 shadow-md"
        >
          {isOpen ? (
            <ChevronRightIcon className="h-5 w-5" />
          ) : (
            <ChevronLeftIcon className="h-5 w-5" />
          )}
        </button>
      </div>

      <div className="flex flex-col h-full">
        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            className={`flex-1 py-3 text-center text-sm font-medium ${
              activeTab === "add"
                ? "text-indigo-600 border-b-2 border-indigo-500"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("add")}
          >
            Add Furniture
          </button>
          <button
            className={`flex-1 py-3 text-center text-sm font-medium ${
              activeTab === "edit"
                ? "text-indigo-600 border-b-2 border-indigo-500"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("edit")}
          >
            Edit Properties
          </button>
          <button
            className={`flex-1 py-3 text-center text-sm font-medium ${
              activeTab === "settings"
                ? "text-indigo-600 border-b-2 border-indigo-500"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("settings")}
          >
            Settings
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {activeTab === "add" && (
            <div className="space-y-4">
              {/* Search */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search furniture..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full border border-gray-300 rounded-md py-2 px-4 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300"
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <svg
                    className="w-4 h-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    ></path>
                  </svg>
                </div>
              </div>

              {/* Categories */}
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-3 py-1 text-xs rounded-full ${
                      selectedCategory === category
                        ? "bg-indigo-100 text-indigo-700 font-medium"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>

              {/* Furniture grid */}
              <div className="grid grid-cols-2 gap-3 mt-3">
                {filteredFurniture.map((item) => (
                  <FurnitureItem
                    key={item.id}
                    item={item}
                    onClick={onAddFurniture}
                  />
                ))}
              </div>
            </div>
          )}

          {activeTab === "edit" && (
            <div className="space-y-4">
              {selectedItem ? (
                <>
                  <h3 className="text-lg font-medium text-gray-800">
                    {selectedItem.name}
                  </h3>

                  {/* Position controls */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                      Position
                    </h4>
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="text-xs text-gray-500 block">X</label>
                        <input
                          type="number"
                          value={selectedItem.position.x.toFixed(2)}
                          onChange={(e) =>
                            updateFurniture(selectedItem.instanceId, {
                              position: {
                                ...selectedItem.position,
                                x: parseFloat(e.target.value),
                              },
                            })
                          }
                          step={0.1}
                          className="w-full border border-gray-300 rounded p-1 text-sm"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-500 block">Y</label>
                        <input
                          type="number"
                          value={selectedItem.position.y?.toFixed(2) || 0}
                          onChange={(e) =>
                            updateFurniture(selectedItem.instanceId, {
                              position: {
                                ...selectedItem.position,
                                y: parseFloat(e.target.value),
                              },
                            })
                          }
                          step={0.1}
                          className="w-full border border-gray-300 rounded p-1 text-sm"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-500 block">Z</label>
                        <input
                          type="number"
                          value={selectedItem.position.z?.toFixed(2) || 0}
                          onChange={(e) =>
                            updateFurniture(selectedItem.instanceId, {
                              position: {
                                ...selectedItem.position,
                                z: parseFloat(e.target.value),
                              },
                            })
                          }
                          step={0.1}
                          className="w-full border border-gray-300 rounded p-1 text-sm"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Rotation control */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                      Rotation (degrees)
                    </h4>
                    <div className="flex gap-2">
                      <input
                        type="range"
                        min="0"
                        max="359"
                        value={selectedItem.rotation}
                        onChange={(e) =>
                          updateFurniture(selectedItem.instanceId, {
                            rotation: parseFloat(e.target.value),
                          })
                        }
                        className="flex-1"
                      />
                      <input
                        type="number"
                        value={Math.round(selectedItem.rotation)}
                        onChange={(e) =>
                          updateFurniture(selectedItem.instanceId, {
                            rotation: parseFloat(e.target.value),
                          })
                        }
                        className="w-16 border border-gray-300 rounded p-1 text-sm"
                      />
                    </div>
                  </div>

                  {/* Scale control */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                      Scale
                    </h4>
                    <div className="flex gap-2">
                      <input
                        type="range"
                        min="0.5"
                        max="2"
                        step="0.1"
                        value={selectedItem.scale}
                        onChange={(e) =>
                          updateFurniture(selectedItem.instanceId, {
                            scale: parseFloat(e.target.value),
                          })
                        }
                        className="flex-1"
                      />
                      <input
                        type="number"
                        value={selectedItem.scale}
                        onChange={(e) =>
                          updateFurniture(selectedItem.instanceId, {
                            scale: parseFloat(e.target.value),
                          })
                        }
                        step={0.1}
                        min={0.5}
                        max={2}
                        className="w-16 border border-gray-300 rounded p-1 text-sm"
                      />
                    </div>
                  </div>

                  {/* Color selector */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                      Color
                    </h4>
                    <div className="grid grid-cols-5 gap-2">
                      {FURNITURE_COLORS.map((colorOption) => (
                        <div
                          key={colorOption.id}
                          className={`w-full aspect-square rounded-full cursor-pointer border-2 ${
                            selectedItem.colorId === colorOption.id
                              ? "border-indigo-500"
                              : "border-transparent"
                          }`}
                          style={{ backgroundColor: colorOption.color }}
                          onClick={() =>
                            updateFurniture(selectedItem.instanceId, {
                              colorId: colorOption.id,
                              customColor: null,
                            })
                          }
                          title={colorOption.name}
                        />
                      ))}
                    </div>

                    {/* Custom color input */}
                    <div className="mt-2 flex items-center">
                      <input
                        type="color"
                        value={selectedItem.customColor || "#cccccc"}
                        onChange={(e) =>
                          updateFurniture(selectedItem.instanceId, {
                            colorId: "custom",
                            customColor: e.target.value,
                          })
                        }
                        className="w-8 h-8 rounded-full overflow-hidden mr-2"
                      />
                      <span className="text-xs text-gray-500">
                        Custom Color
                      </span>
                    </div>
                  </div>

                  {/* Delete button */}
                  <div className="pt-4 mt-2 border-t border-gray-200">
                    <button
                      onClick={() => onDeleteFurniture(selectedItem.instanceId)}
                      className="w-full flex items-center justify-center gap-1 py-2 bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition-colors"
                    >
                      <TrashIcon className="h-4 w-4" />
                      <span>Delete Item</span>
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-center py-10">
                  <CubeIcon className="h-12 w-12 mx-auto text-gray-300" />
                  <p className="mt-2 text-sm text-gray-500">
                    Select an item to edit its properties
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === "settings" && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-800">
                Editor Settings
              </h3>

              <div className="space-y-3">
                {/* Grid settings */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      Show Grid
                    </p>
                    <p className="text-xs text-gray-500">
                      Display a grid on the floor
                    </p>
                  </div>
                  <div className="relative inline-block w-10 align-middle select-none">
                    <input
                      type="checkbox"
                      id="toggle-grid"
                      checked={showGrid}
                      onChange={() => setShowGrid(!showGrid)}
                      className="sr-only"
                    />
                    <label
                      htmlFor="toggle-grid"
                      className={`block h-6 rounded-full cursor-pointer transition-colors ${
                        showGrid ? "bg-indigo-400" : "bg-gray-300"
                      }`}
                    >
                      <span
                        className={`block h-6 w-6 rounded-full bg-white shadow transform transition-transform ${
                          showGrid ? "translate-x-4" : "translate-x-0"
                        }`}
                      ></span>
                    </label>
                  </div>
                </div>

                {/* Snap to grid setting */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      Snap to Grid
                    </p>
                    <p className="text-xs text-gray-500">
                      Automatically align items to the grid
                    </p>
                  </div>
                  <div className="relative inline-block w-10 align-middle select-none">
                    <input
                      type="checkbox"
                      id="toggle-snap"
                      checked={snapToGrid}
                      onChange={() => setSnapToGrid(!snapToGrid)}
                      className="sr-only"
                    />
                    <label
                      htmlFor="toggle-snap"
                      className={`block h-6 rounded-full cursor-pointer transition-colors ${
                        snapToGrid ? "bg-indigo-400" : "bg-gray-300"
                      }`}
                    >
                      <span
                        className={`block h-6 w-6 rounded-full bg-white shadow transform transition-transform ${
                          snapToGrid ? "translate-x-4" : "translate-x-0"
                        }`}
                      ></span>
                    </label>
                  </div>
                </div>

                {/* View mode help */}
                <div className="mt-6 p-3 bg-indigo-50 rounded-md">
                  <h4 className="text-sm font-medium text-indigo-700 flex items-center gap-1 mb-2">
                    <LightBulbIcon className="h-4 w-4" />
                    Quick Navigation Tips
                  </h4>
                  <ul className="text-xs text-indigo-700 space-y-1 ml-5 list-disc">
                    <li>
                      Use <strong>WASD</strong> keys to move in First Person
                      view
                    </li>
                    <li>
                      Press <strong>Q/E</strong> to move up/down
                    </li>
                    <li>Right-click and drag to rotate the view in 3D mode</li>
                    <li>Use mouse wheel to zoom in/out</li>
                    <li>
                      Select an item and use transform tools to move, rotate or
                      scale it
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Integrated Room Component
const IntegratedRoomView = ({
  selectedViewMode,
  roomConfig,
  placedFurniture,
  selectedFurniture,
  updateFurniture,
  gridSize,
  showGrid,
  snapToGrid,
  setSelectedFurniture,
  className = "",
}) => {
  const cameraRef = useRef();
  const orbitControlsRef = useRef();
  const [is3DView, setIs3DView] = useState(
    selectedViewMode === "3d" || selectedViewMode === "first-person"
  );
  const [isFirstPerson, setIsFirstPerson] = useState(
    selectedViewMode === "first-person"
  );
  const [isGizmoActive, setIsGizmoActive] = useState(
    selectedFurniture !== null
  );
  const [gizmoMode, setGizmoMode] = useState("translate");

  // RoomEditor states
  const [vertexes, setVertexes] = useState([
    [roomConfig.dimensions.width / 2, 0, roomConfig.dimensions.length / 2],
    [-roomConfig.dimensions.width / 2, 0, roomConfig.dimensions.length / 2],
    [-roomConfig.dimensions.width / 2, 0, -roomConfig.dimensions.length / 2],
    [roomConfig.dimensions.width / 2, 0, -roomConfig.dimensions.length / 2],
  ]);
  const [showDimensions, setShowDimensions] = useState(true);
  const [savedCam, setSavedCam] = useState(null);

  // Convert placedFurniture to format compatible with Room2D/Room3D
  const convertedFurniture = placedFurniture.map((item) => ({
    id: item.instanceId,
    type: item.name || item.id.split("-")[0],
    position: {
      x: item.position.x,
      y: item.position.y || 0,
      z: item.position.z || 0,
    },
    rotation: item.rotation * (Math.PI / 180), // Convert to radians for RoomEditor
    color:
      item.customColor ||
      (item.colorId
        ? FURNITURE_COLORS.find((c) => c.id === item.colorId)?.color
        : "#cccccc"),
    scale: { x: item.scale, y: item.scale, z: item.scale },
    dimensions: item.dimensions || { width: 1, depth: 1, height: 1 },
  }));

  // Handle view mode changes
  useEffect(() => {
    if (selectedViewMode === "3d") {
      setIs3DView(true);
      setIsFirstPerson(false);
    } else if (selectedViewMode === "2d") {
      setIs3DView(false);
      setIsFirstPerson(false);
    } else if (selectedViewMode === "first-person") {
      setIs3DView(true);
      setIsFirstPerson(true);
    }
  }, [selectedViewMode]);

  // Handle gizmo state based on selection
  useEffect(() => {
    setIsGizmoActive(selectedFurniture !== null);
  }, [selectedFurniture]);

  // Handle furniture updates from RoomEditor
  const handleRoomEditorFurnitureUpdate = (id, updates) => {
    // Convert back from RoomEditor format
    const originalItem = placedFurniture.find((item) => item.instanceId === id);
    if (!originalItem) return;

    const updatedItem = {
      ...originalItem,
      position: {
        x:
          updates.position?.x !== undefined
            ? updates.position.x
            : originalItem.position.x,
        y:
          updates.position?.y !== undefined
            ? updates.position.y
            : originalItem.position.y,
        z:
          updates.position?.z !== undefined
            ? updates.position.z
            : originalItem.position.z,
      },
    };

    // Convert rotation back to degrees if it was updated
    if (updates.rotation !== undefined) {
      updatedItem.rotation = updates.rotation * (180 / Math.PI);
    }

    // Convert scale if it was updated
    if (updates.scale) {
      updatedItem.scale =
        (updates.scale.x + updates.scale.y + updates.scale.z) / 3; // Average scale
    }

    // Update furniture through parent component
    updateFurniture(id, updatedItem);
  };

  return (
    <div className={`w-full h-full ${className}`}>
      <Canvas
        shadows
        key={is3DView ? "3d-canvas-key" : "2d-canvas-key"}
        camera={
          is3DView
            ? { fov: 50, near: 0.1, far: 1000 }
            : { position: [0, 20, 0], fov: 50, near: 0.1, far: 1000 }
        }
      >
        <ambientLight intensity={0.7} />
        <directionalLight
          castShadow
          position={[15, 25, 15]}
          intensity={1.2}
          color={"#fff0dd"}
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-left={-roomConfig.dimensions.width / 2 - 3}
          shadow-camera-right={roomConfig.dimensions.width / 2 + 3}
          shadow-camera-top={roomConfig.dimensions.length / 2 + 3}
          shadow-camera-bottom={-roomConfig.dimensions.length / 2 - 3}
          shadow-camera-near={1}
          shadow-camera-far={40}
          shadow-bias={-0.003}
        />
        <directionalLight
          position={[-10, 10, -10]}
          intensity={0.3}
          color={"#ddeeff"}
        />

        {is3DView ? (
          <>
            <PerspectiveCamera
              makeDefault
              ref={cameraRef}
              fov={50}
              near={0.1}
              far={1000}
              position={[0, 10, 15]}
            />
            <Room3D
              roomSize={{
                width: roomConfig.dimensions.width,
                depth: roomConfig.dimensions.length,
                height: roomConfig.dimensions.height,
              }}
              furniture={convertedFurniture}
              selectedItem={selectedFurniture}
              setSelectedItem={setSelectedFurniture}
              vertexes={vertexes}
              updateFurniture={handleRoomEditorFurnitureUpdate}
              isGizmoActive={isGizmoActive}
              gizmoMode={gizmoMode}
            />
            <OrbitControls
              ref={orbitControlsRef}
              enabled={is3DView && !isFirstPerson}
              enableRotate={true}
              enablePan={true}
              minPolarAngle={0}
              maxPolarAngle={Math.PI / 2}
              mouseButtons={{
                LEFT: MOUSE.ROTATE,
                MIDDLE: MOUSE.ROTATE,
                RIGHT: MOUSE.PAN,
              }}
              touches={{
                ONE: TOUCH.ROTATE,
                TWO: TOUCH.DOLLY_PAN,
              }}
            />
            <WASDNavigationController
              cameraRef={cameraRef}
              orbitControlsRef={orbitControlsRef}
              enabled={is3DView && isFirstPerson}
            />
          </>
        ) : (
          <Room2D
            roomSize={{
              width: roomConfig.dimensions.width,
              depth: roomConfig.dimensions.length,
              height: roomConfig.dimensions.height,
            }}
            furniture={convertedFurniture}
            selectedItem={selectedFurniture}
            setSelectedItem={setSelectedFurniture}
            showDimensions={showDimensions}
            vertexes={vertexes}
            isGizmoActive={isGizmoActive}
            gizmoMode={gizmoMode}
            updateFurniture={handleRoomEditorFurnitureUpdate}
          />
        )}
      </Canvas>
    </div>
  );
};

const Studio = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const canvasRef = useRef(null);

  // Get room configuration from previous page or use defaults
  const { roomConfig } = location.state || {
    roomConfig: {
      roomName: "My Living Room",
      dimensions: { width: 4, length: 5, height: 2.7 },
      shape: "rectangular",
      colorScheme: "neutral",
      floorMaterial: "hardwood",
      wallColor: "#F9FAFB",
      floorColor: "#E5E7EB",
    },
  };

  // State for view modes
  const [selectedViewMode, setSelectedViewMode] = useState("3d");
  const [showGrid, setShowGrid] = useState(true);
  const [snapToGrid, setSnapToGrid] = useState(true);
  const [gridSize] = useState(0.5);
  const [zoomLevel, setZoomLevel] = useState(70);

  // Furniture state
  const [placedFurniture, setPlacedFurniture] = useState([]);
  const [selectedFurniture, setSelectedFurniture] = useState(null);

  // Sidebar state
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Handle furniture updates
  const updateFurniture = (instanceId, updates) => {
    setPlacedFurniture((prevFurniture) =>
      prevFurniture.map((item) =>
        item.instanceId === instanceId ? { ...item, ...updates } : item
      )
    );
  };

  // Add furniture to the room
  const handleAddFurniture = (item) => {
    const newItem = {
      ...item,
      instanceId: `${item.id}-${Date.now()}`,
      position: { x: 0, y: 0, z: 0 },
      rotation: 0,
      scale: 1,
      colorId: FURNITURE_COLORS[0].id,
      customColor: null,
    };

    setPlacedFurniture([...placedFurniture, newItem]);
    setSelectedFurniture(newItem.instanceId);
  };

  // Delete furniture from the room
  const handleDeleteFurniture = (instanceId) => {
    setPlacedFurniture((prevFurniture) =>
      prevFurniture.filter((item) => item.instanceId !== instanceId)
    );
    setSelectedFurniture(null);
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Top navigation bar */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="flex items-center justify-between px-4 py-2">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate(-1)}
              className="text-gray-500 hover:text-gray-700 p-1"
            >
              <ArrowLeftIcon className="h-5 w-5" />
            </button>
            <h1 className="text-xl font-semibold text-gray-800">
              {roomConfig.roomName || "Studio"}
            </h1>
          </div>
          <div className="flex items-center space-x-2">
            {/* View mode toggles */}
            <div className="bg-gray-100 p-1 rounded-lg flex">
              {VIEW_MODES.map((mode) => (
                <button
                  key={mode.id}
                  className={`flex items-center px-3 py-1 rounded-md ${
                    selectedViewMode === mode.id
                      ? "bg-white shadow text-indigo-600"
                      : "text-gray-500 hover:text-gray-700"
                  } transition-colors duration-150`}
                  onClick={() => setSelectedViewMode(mode.id)}
                  aria-label={mode.name}
                >
                  {mode.icon}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Main content area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Main canvas area */}
        <div className="flex-1 bg-gray-50 overflow-hidden" ref={canvasRef}>
          <IntegratedRoomView
            selectedViewMode={selectedViewMode}
            roomConfig={roomConfig}
            placedFurniture={placedFurniture}
            selectedFurniture={selectedFurniture}
            setSelectedFurniture={setSelectedFurniture}
            updateFurniture={updateFurniture}
            gridSize={gridSize}
            showGrid={showGrid}
            snapToGrid={snapToGrid}
            className="w-full h-full"
          />
        </div>

        {/* Sidebar panel */}
        <SidebarPanel
          onAddFurniture={handleAddFurniture}
          selectedFurniture={selectedFurniture}
          placedFurniture={placedFurniture}
          updateFurniture={updateFurniture}
          onSelectFurniture={setSelectedFurniture}
          onDeleteFurniture={handleDeleteFurniture}
          showGrid={showGrid}
          setShowGrid={setShowGrid}
          snapToGrid={snapToGrid}
          setSnapToGrid={setSnapToGrid}
          isOpen={isSidebarOpen}
          onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        />
      </div>
    </div>
  );
};

export default Studio;
