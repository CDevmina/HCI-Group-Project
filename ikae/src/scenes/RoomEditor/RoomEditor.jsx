// App.jsx
import { useState, useRef, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import Room2D from "./components/Room2D";
import Room3D from "./components/Room3D";
import ViewToggle from "./components/ViewToggle";
import "./styles.css";
import { MOUSE } from "three";
import {
  CubeIcon,
  ViewColumnsIcon,
  MagnifyingGlassIcon,
  ArrowPathIcon,
  ArrowsPointingOutIcon,
  Square2StackIcon,
  TrashIcon,
  ArrowsPointingInIcon,
  PhotoIcon,
} from "@heroicons/react/24/outline";

// Mock furniture data with images from placeholders
const FURNITURE_CATALOG = [
  // Living Room
  {
    id: "sofa-1",
    name: "Modern Sofa",
    type: "sofa",
    category: "living",
    dimensions: { width: 220, depth: 95, height: 85 },
    image: "https://placehold.co/300x300/e6e6e6/4f46e5?text=Sofa",
    defaultColor: "#d4c8be",
    description: "A comfortable modern sofa with clean lines",
    price: 899,
  },
  {
    id: "chair-1",
    name: "Accent Chair",
    type: "chair",
    category: "living",
    dimensions: { width: 70, depth: 75, height: 85 },
    image: "https://placehold.co/300x300/e6e6e6/4f46e5?text=Chair",
    defaultColor: "#79869c",
    description: "Stylish accent chair perfect for any living room",
    price: 349,
  },
  {
    id: "coffee-table-1",
    name: "Coffee Table",
    type: "table",
    category: "living",
    dimensions: { width: 120, depth: 60, height: 45 },
    image: "https://placehold.co/300x300/e6e6e6/4f46e5?text=Coffee+Table",
    defaultColor: "#a47551",
    description: "Mid-century modern coffee table with storage",
    price: 299,
  },

  // Dining Room
  {
    id: "dining-table-1",
    name: "Dining Table",
    type: "table",
    category: "dining",
    dimensions: { width: 180, depth: 90, height: 75 },
    image: "https://placehold.co/300x300/e6e6e6/4f46e5?text=Dining+Table",
    defaultColor: "#a47551",
    description: "Large dining table for family gatherings",
    price: 599,
  },
  {
    id: "dining-chair-1",
    name: "Dining Chair",
    type: "chair",
    category: "dining",
    dimensions: { width: 45, depth: 50, height: 90 },
    image: "https://placehold.co/300x300/e6e6e6/4f46e5?text=Dining+Chair",
    defaultColor: "#79869c",
    description: "Comfortable dining chair with ergonomic design",
    price: 149,
  },
  {
    id: "sideboard-1",
    name: "Sideboard",
    type: "storage",
    category: "dining",
    dimensions: { width: 160, depth: 40, height: 80 },
    image: "https://placehold.co/300x300/e6e6e6/4f46e5?text=Sideboard",
    defaultColor: "#a47551",
    description: "Elegant sideboard with ample storage space",
    price: 749,
  },

  // Bedroom
  {
    id: "bed-1",
    name: "Queen Bed",
    type: "bed",
    category: "bedroom",
    dimensions: { width: 160, depth: 200, height: 110 },
    image: "https://placehold.co/300x300/e6e6e6/4f46e5?text=Queen+Bed",
    defaultColor: "#d4c8be",
    description: "Comfortable queen-sized bed frame",
    price: 899,
  },
  {
    id: "nightstand-1",
    name: "Nightstand",
    type: "storage",
    category: "bedroom",
    dimensions: { width: 50, depth: 40, height: 60 },
    image: "https://placehold.co/300x300/e6e6e6/4f46e5?text=Nightstand",
    defaultColor: "#a47551",
    description: "Bedside table with drawer and shelf",
    price: 249,
  },
  {
    id: "dresser-1",
    name: "Dresser",
    type: "storage",
    category: "bedroom",
    dimensions: { width: 120, depth: 45, height: 80 },
    image: "https://placehold.co/300x300/e6e6e6/4f46e5?text=Dresser",
    defaultColor: "#a47551",
    description: "Six-drawer dresser for your bedroom",
    price: 699,
  },
];

// Furniture categories
const FURNITURE_CATEGORIES = [
  { id: "all", name: "All" },
  { id: "living", name: "Living Room" },
  { id: "dining", name: "Dining Room" },
  { id: "bedroom", name: "Bedroom" },
];

// Default room presets
const ROOM_PRESETS = [
  {
    id: "living-room",
    name: "Living Room",
    dimensions: { width: 400, depth: 500, height: 270 },
    wallColor: "#f5f5f5",
    floorColor: "#e0d5c7",
  },
  {
    id: "dining-room",
    name: "Dining Room",
    dimensions: { width: 360, depth: 450, height: 270 },
    wallColor: "#f8f9fa",
    floorColor: "#d4c8be",
  },
  {
    id: "bedroom",
    name: "Bedroom",
    dimensions: { width: 350, depth: 400, height: 260 },
    wallColor: "#f0f4f8",
    floorColor: "#d9d2e9",
  },
];

// RoomEditor Component
const RoomEditor = () => {
  // Core state
  const [is3DView, setIs3DView] = useState(false);
  const [roomSize, setRoomSize] = useState(ROOM_PRESETS[0].dimensions);
  const [wallColor, setWallColor] = useState(ROOM_PRESETS[0].wallColor);
  const [floorColor, setFloorColor] = useState(ROOM_PRESETS[0].floorColor);
  const [furniture, setFurniture] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const canvasRef = useRef(null);

  // UI state
  const [showDimensions, setShowDimensions] = useState(true);
  const [showGrid, setShowGrid] = useState(true);
  const [gridSize, setGridSize] = useState(20); // Grid size in cm
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [menuTab, setMenuTab] = useState("room"); // 'room', 'furniture', 'styles'
  const [snapToGrid, setSnapToGrid] = useState(true);
  const [selectedPreset, setSelectedPreset] = useState(ROOM_PRESETS[0].id);

  // Filter furniture based on selected category
  const filteredFurniture =
    selectedCategory === "all"
      ? FURNITURE_CATALOG
      : FURNITURE_CATALOG.filter((item) => item.category === selectedCategory);

  // Handle room size changes
  const handleRoomSizeChange = (dimension, value) => {
    const newValue = parseFloat(value);
    if (!isNaN(newValue) && newValue > 0) {
      setRoomSize({
        ...roomSize,
        [dimension]: Math.round(newValue), // Round to integer for simplicity
      });
    }
  };

  // Apply room preset
  const applyRoomPreset = (presetId) => {
    const preset = ROOM_PRESETS.find((p) => p.id === presetId);
    if (preset) {
      setRoomSize(preset.dimensions);
      setWallColor(preset.wallColor);
      setFloorColor(preset.floorColor);
      setSelectedPreset(preset.id);
    }
  };

  // Add furniture to the room
  const addFurniture = (catalogItem) => {
    // Place it in the center of the room
    const newItem = {
      id: `${catalogItem.id}-${Date.now()}`,
      type: catalogItem.type,
      catalogId: catalogItem.id,
      name: catalogItem.name,
      position: {
        x: roomSize.width / 2 - catalogItem.dimensions.width / 2,
        y: 0,
        z: roomSize.depth / 2 - catalogItem.dimensions.depth / 2,
      },
      dimensions: { ...catalogItem.dimensions },
      color: catalogItem.defaultColor,
      rotation: 0,
      scale: 1,
    };

    // Add to furniture list and select it
    setFurniture([...furniture, newItem]);
    setSelectedItem(newItem.id);

    // Switch to furniture tab
    setMenuTab("furniture");
  };

  // Update furniture properties
  const updateFurniture = (id, updates) => {
    const updatedFurniture = furniture.map((item) =>
      item.id === id ? { ...item, ...updates } : item
    );
    setFurniture(updatedFurniture);
  };

  // Delete furniture
  const deleteFurniture = (id) => {
    setFurniture(furniture.filter((item) => item.id !== id));
    if (selectedItem === id) setSelectedItem(null);
  };

  // Get selected furniture item
  const getSelectedFurnitureItem = () => {
    return furniture.find((item) => item.id === selectedItem);
  };

  // Get catalog details for a furniture item
  const getCatalogDetails = (catalogId) => {
    return FURNITURE_CATALOG.find((item) => item.id === catalogId);
  };

  // Handle furniture drag and position update
  const handleFurniturePosition = (id, position) => {
    // Apply grid snapping if enabled
    if (snapToGrid) {
      position = {
        x: Math.round(position.x / gridSize) * gridSize,
        y: position.y,
        z: Math.round(position.z / gridSize) * gridSize,
      };
    }

    updateFurniture(id, { position });
  };

  // Reset the view
  const resetView = () => {
    // Reset 3D camera position
  };

  // Duplicate selected furniture
  const duplicateSelected = () => {
    const selected = getSelectedFurnitureItem();
    if (selected) {
      const duplicate = {
        ...selected,
        id: `${selected.catalogId}-${Date.now()}`,
        position: {
          x: selected.position.x + 20,
          y: selected.position.y,
          z: selected.position.z + 20,
        },
      };
      setFurniture([...furniture, duplicate]);
      setSelectedItem(duplicate.id);
    }
  };

  // Save the design (would connect to backend)
  const saveDesign = () => {
    // This would save to backend in a real application
    alert("Design saved! (This would save to backend in a real application)");
  };

  // Export the design as image
  const exportDesign = () => {
    alert("This would export your design as an image in the real application");
  };

  // Room controls panel component
  const RoomControlsPanel = () => (
    <div>
      <h2 className="section-title">Room Properties</h2>

      <div className="control-group">
        <label>Room Presets</label>
        <div className="furniture-category">
          {ROOM_PRESETS.map((preset) => (
            <button
              key={preset.id}
              className={selectedPreset === preset.id ? "active" : ""}
              onClick={() => applyRoomPreset(preset.id)}
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      <div className="control-group">
        <label>Width (cm)</label>
        <input
          type="number"
          value={roomSize.width}
          onChange={(e) => handleRoomSizeChange("width", e.target.value)}
          min="200"
          max="1000"
          step="10"
        />
      </div>

      <div className="control-group">
        <label>Depth (cm)</label>
        <input
          type="number"
          value={roomSize.depth}
          onChange={(e) => handleRoomSizeChange("depth", e.target.value)}
          min="200"
          max="1000"
          step="10"
        />
      </div>

      <div className="control-group">
        <label>Height (cm)</label>
        <input
          type="number"
          value={roomSize.height}
          onChange={(e) => handleRoomSizeChange("height", e.target.value)}
          min="200"
          max="400"
          step="10"
        />
      </div>

      <div className="control-group">
        <label>Wall Color</label>
        <input
          type="color"
          value={wallColor}
          onChange={(e) => setWallColor(e.target.value)}
        />
      </div>

      <div className="control-group">
        <label>Floor Color</label>
        <input
          type="color"
          value={floorColor}
          onChange={(e) => setFloorColor(e.target.value)}
        />
      </div>

      <div className="control-group">
        <label
          className="flex items-center"
          style={{ display: "flex", alignItems: "center" }}
        >
          <input
            type="checkbox"
            checked={showGrid}
            onChange={() => setShowGrid(!showGrid)}
            style={{ marginRight: "8px" }}
          />
          Show Grid
        </label>
      </div>

      <div className="control-group">
        <label
          className="flex items-center"
          style={{ display: "flex", alignItems: "center" }}
        >
          <input
            type="checkbox"
            checked={snapToGrid}
            onChange={() => setSnapToGrid(!snapToGrid)}
            style={{ marginRight: "8px" }}
          />
          Snap to Grid
        </label>
      </div>

      <div className="control-group">
        <label>Grid Size (cm)</label>
        <input
          type="range"
          min="10"
          max="50"
          step="5"
          value={gridSize}
          onChange={(e) => setGridSize(parseInt(e.target.value))}
        />
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "5px",
          }}
        >
          <span>10cm</span>
          <span>{gridSize}cm</span>
          <span>50cm</span>
        </div>
      </div>

      <div className="control-group">
        <label
          className="flex items-center"
          style={{ display: "flex", alignItems: "center" }}
        >
          <input
            type="checkbox"
            checked={showDimensions}
            onChange={() => setShowDimensions(!showDimensions)}
            style={{ marginRight: "8px" }}
          />
          Show Dimensions
        </label>
      </div>
    </div>
  );

  // Furniture catalog panel component
  const FurnitureCatalogPanel = () => (
    <div className="furniture-library">
      <h2 className="section-title">Furniture Catalog</h2>

      <div className="furniture-category">
        {FURNITURE_CATEGORIES.map((category) => (
          <button
            key={category.id}
            className={selectedCategory === category.id ? "active" : ""}
            onClick={() => setSelectedCategory(category.id)}
          >
            {category.name}
          </button>
        ))}
      </div>

      <div className="furniture-grid">
        {filteredFurniture.map((item) => (
          <div
            key={item.id}
            className="furniture-item"
            onClick={() => addFurniture(item)}
          >
            <img src={item.image} alt={item.name} />
            <div className="furniture-item-name">{item.name}</div>
            <div className="furniture-item-dim">
              {item.dimensions.width}×{item.dimensions.depth}cm
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Selected furniture properties panel
  const SelectedFurniturePanel = () => {
    const item = getSelectedFurnitureItem();
    if (!item) return null;

    const catalogDetails = getCatalogDetails(item.catalogId);

    return (
      <div className="selected-item-controls">
        <h3>
          {item.name}
          <span style={{ fontSize: "12px", color: "#6b7280" }}>
            ${catalogDetails.price}
          </span>
        </h3>

        <div className="control-group">
          <label>Color</label>
          <input
            type="color"
            value={item.color}
            onChange={(e) =>
              updateFurniture(item.id, { color: e.target.value })
            }
          />
        </div>

        <div className="control-group">
          <label>Rotation (degrees)</label>
          <input
            type="range"
            min="0"
            max="360"
            value={item.rotation}
            onChange={(e) =>
              updateFurniture(item.id, { rotation: parseInt(e.target.value) })
            }
          />
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>0°</span>
            <span>{item.rotation}°</span>
            <span>360°</span>
          </div>
        </div>

        <div className="control-group">
          <label>Position</label>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "8px",
            }}
          >
            <div>
              <label style={{ fontSize: "12px" }}>X</label>
              <input
                type="number"
                value={Math.round(item.position.x)}
                onChange={(e) =>
                  updateFurniture(item.id, {
                    position: {
                      ...item.position,
                      x: parseFloat(e.target.value) || 0,
                    },
                  })
                }
              />
            </div>
            <div>
              <label style={{ fontSize: "12px" }}>Z</label>
              <input
                type="number"
                value={Math.round(item.position.z)}
                onChange={(e) =>
                  updateFurniture(item.id, {
                    position: {
                      ...item.position,
                      z: parseFloat(e.target.value) || 0,
                    },
                  })
                }
              />
            </div>
          </div>
        </div>

        <div className="control-group">
          <label>Scale</label>
          <input
            type="range"
            min="0.5"
            max="1.5"
            step="0.1"
            value={item.scale}
            onChange={(e) =>
              updateFurniture(item.id, { scale: parseFloat(e.target.value) })
            }
          />
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>0.5×</span>
            <span>{item.scale}×</span>
            <span>1.5×</span>
          </div>
        </div>

        <div className="control-group">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "8px",
            }}
          >
            <button
              className="action-button"
              onClick={duplicateSelected}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "4px",
              }}
            >
              <Square2StackIcon style={{ width: "16px", height: "16px" }} />
              Duplicate
            </button>
            <button
              className="danger-button"
              onClick={() => deleteFurniture(item.id)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "4px",
              }}
            >
              <TrashIcon style={{ width: "16px", height: "16px" }} />
              Delete
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="app-container">
      {/* Left Panel */}
      <div className="controls-panel">
        <h1
          style={{
            fontSize: "24px",
            fontWeight: "600",
            marginBottom: "20px",
            color: "#4f46e5",
          }}
        >
          3D Room Designer
        </h1>

        <div className="tabs">
          <div
            className={`tab ${menuTab === "room" ? "active" : ""}`}
            onClick={() => setMenuTab("room")}
          >
            Room
          </div>
          <div
            className={`tab ${menuTab === "furniture" ? "active" : ""}`}
            onClick={() => setMenuTab("furniture")}
          >
            Furniture
          </div>
          <div
            className={`tab ${menuTab === "design" ? "active" : ""}`}
            onClick={() => setMenuTab("design")}
          >
            Design
          </div>
        </div>

        {menuTab === "room" && <RoomControlsPanel />}
        {menuTab === "furniture" && <FurnitureCatalogPanel />}
        {menuTab === "design" && (
          <div>
            <h2 className="section-title">Design Tools</h2>
            <p
              style={{
                marginBottom: "20px",
                fontSize: "14px",
                lineHeight: "1.5",
                color: "#6b7280",
              }}
            >
              Save your design or take a screenshot to share with others.
            </p>
            <div className="button-group">
              <button
                className="action-button"
                onClick={saveDesign}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "4px",
                }}
              >
                Save Design
              </button>
              <button
                className="secondary-button"
                onClick={exportDesign}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "4px",
                }}
              >
                <PhotoIcon style={{ width: "16px", height: "16px" }} />
                Screenshot
              </button>
            </div>

            {selectedItem && <SelectedFurniturePanel />}
          </div>
        )}

        {/* Selected furniture details */}
        {(menuTab === "room" || menuTab === "furniture") && selectedItem && (
          <SelectedFurniturePanel />
        )}
      </div>

      {/* 3D Visualization Area */}
      <div className="canvas-container" ref={canvasRef}>
        <ViewToggle is3DView={is3DView} setIs3DView={setIs3DView} />

        <Canvas
          camera={{ position: is3DView ? [15, 15, 15] : [0, 15, 0], fov: 50 }}
        >
          {is3DView ? (
            <Room3D
              roomSize={roomSize}
              furniture={furniture}
              selectedItem={selectedItem}
              setSelectedItem={setSelectedItem}
              wallColor={wallColor}
              floorColor={floorColor}
              showGrid={showGrid}
              gridSize={gridSize}
              handleFurniturePosition={handleFurniturePosition}
            />
          ) : (
            <Room2D
              roomSize={roomSize}
              furniture={furniture}
              selectedItem={selectedItem}
              setSelectedItem={setSelectedItem}
              wallColor={wallColor}
              floorColor={floorColor}
              showDimensions={showDimensions}
              showGrid={showGrid}
              gridSize={gridSize}
              handleFurniturePosition={handleFurniturePosition}
            />
          )}
          <OrbitControls
            enabled={is3DView}
            enableRotate={is3DView}
            enablePan={true}
            mouseButtons={{
              LEFT: null, // Disable left click for orbit
              MIDDLE: MOUSE.ROTATE,
              RIGHT: null,
            }}
          />
          <ambientLight intensity={0.6} />
          <pointLight position={[10, 10, 10]} />
        </Canvas>

        {/* Toolbar */}
        <div className="toolbar">
          <button title="Reset View" onClick={resetView}>
            <ArrowPathIcon />
          </button>
          <button
            title="Toggle Grid"
            onClick={() => setShowGrid(!showGrid)}
            className={showGrid ? "active" : ""}
          >
            <ViewColumnsIcon />
          </button>
          <button
            title="Toggle Snap to Grid"
            onClick={() => setSnapToGrid(!snapToGrid)}
            className={snapToGrid ? "active" : ""}
          >
            <CubeIcon />
          </button>
          <button
            title="Toggle Dimensions"
            onClick={() => setShowDimensions(!showDimensions)}
            className={showDimensions ? "active" : ""}
          >
            <MagnifyingGlassIcon />
          </button>
          <button
            title="Fullscreen"
            onClick={() => document.documentElement.requestFullscreen()}
          >
            <ArrowsPointingOutIcon />
          </button>
        </div>

        {/* Dimension display */}
        {showDimensions && (
          <div className="dimension-display">
            {roomSize.width} × {roomSize.depth} cm
          </div>
        )}

        {/* Grid size indicator */}
        {showGrid && (
          <div className="grid-size-control">
            <label
              style={{
                fontSize: "12px",
                marginBottom: "4px",
                display: "block",
              }}
            >
              Grid Size: {gridSize}cm
            </label>
            <input
              type="range"
              min="10"
              max="50"
              step="5"
              value={gridSize}
              onChange={(e) => setGridSize(parseInt(e.target.value))}
              style={{ width: "100%" }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomEditor;
