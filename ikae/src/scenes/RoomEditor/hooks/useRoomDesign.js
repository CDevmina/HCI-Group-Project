// hooks/useRoomDesign.js
import { useState, useCallback, useEffect } from "react";

const DEFAULT_ROOM_SIZE = {
  width: 400,
  depth: 400,
  height: 280,
};

const DEFAULT_COLORS = {
  wall: "#FFFFFF",
  floor: "#F5F5F5",
  ceiling: "#FFFFFF",
};

const DEFAULT_TEXTURES = {
  wall: null,
  floor: null,
  ceiling: null,
};

const DEFAULT_GRID_SIZE = 20;

export default function useRoomDesign() {
  // Room dimensions and properties
  const [roomSize, setRoomSize] = useState(DEFAULT_ROOM_SIZE);
  const [gridSize, setGridSize] = useState(DEFAULT_GRID_SIZE);
  const [showGrid, setShowGrid] = useState(true);
  const [showDimensions, setShowDimensions] = useState(true);
  const [colors, setColors] = useState(DEFAULT_COLORS);
  const [textures, setTextures] = useState(DEFAULT_TEXTURES);
  const [viewMode, setViewMode] = useState("2D"); // "2D" or "3D"
  const [cameraPosition, setCameraPosition] = useState({ x: 0, y: 100, z: 0 });
  const [editMode, setEditMode] = useState("default"); // default, vertex-edit, wall-edit

  // Custom room shape
  const [roomVertices, setRoomVertices] = useState([]);
  const [walls, setWalls] = useState([]);
  const [isCustomRoom, setIsCustomRoom] = useState(false);

  // Furniture management
  const [furniture, setFurniture] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [furnitureCategory, setFurnitureCategory] = useState("all");
  const [availableFurniture, setAvailableFurniture] = useState([]);

  // Initialize room vertices based on room size
  useEffect(() => {
    if (!isCustomRoom) {
      const halfWidth = roomSize.width / 2;
      const halfDepth = roomSize.depth / 2;

      // For basic rectangular room
      const vertices = [
        { id: "v1", position: { x: -halfWidth, z: -halfDepth } },
        { id: "v2", position: { x: halfWidth, z: -halfDepth } },
        { id: "v3", position: { x: halfWidth, z: halfDepth } },
        { id: "v4", position: { x: -halfWidth, z: halfDepth } },
      ];

      setRoomVertices(vertices);

      // Generate walls
      const newWalls = [
        { id: "wall-0", startVertexId: "v1", endVertexId: "v2", features: [] },
        { id: "wall-1", startVertexId: "v2", endVertexId: "v3", features: [] },
        { id: "wall-2", startVertexId: "v3", endVertexId: "v4", features: [] },
        { id: "wall-3", startVertexId: "v4", endVertexId: "v1", features: [] },
      ];

      setWalls(newWalls);
    }
  }, [roomSize, isCustomRoom]);

  // Toggle custom room editing
  const toggleCustomRoomShape = useCallback(() => {
    setIsCustomRoom((prev) => !prev);
    setEditMode((prev) => (prev === "vertex-edit" ? "default" : prev));
  }, []);

  // Handle room dimension changes
  const updateRoomDimension = useCallback(
    (dimension, value) => {
      setRoomSize((prev) => ({ ...prev, [dimension]: value }));

      if (isCustomRoom) {
        // When in custom room mode, changing dimensions doesn't reset the shape
        return;
      }

      // Recalculate vertices for rectangular rooms
      const halfWidth = dimension === "width" ? value / 2 : roomSize.width / 2;
      const halfDepth = dimension === "depth" ? value / 2 : roomSize.depth / 2;

      setRoomVertices([
        { id: "v1", position: { x: -halfWidth, z: -halfDepth } },
        { id: "v2", position: { x: halfWidth, z: -halfDepth } },
        { id: "v3", position: { x: halfWidth, z: halfDepth } },
        { id: "v4", position: { x: -halfWidth, z: halfDepth } },
      ]);
    },
    [roomSize, isCustomRoom]
  );

  // Toggle show grid
  const toggleShowGrid = useCallback(() => {
    setShowGrid((prev) => !prev);
  }, []);

  // Toggle show dimensions
  const toggleShowDimensions = useCallback(() => {
    setShowDimensions((prev) => !prev);
  }, []);

  // Update grid size
  const updateGridSize = useCallback((newSize) => {
    setGridSize(newSize);
  }, []);

  // Update room color
  const updateRoomColor = useCallback((part, color) => {
    setColors((prev) => ({ ...prev, [part]: color }));
  }, []);

  // Update room texture
  const updateRoomTexture = useCallback((part, textureUrl) => {
    setTextures((prev) => ({ ...prev, [part]: textureUrl }));
  }, []);

  // Toggle view mode (2D/3D)
  const toggleViewMode = useCallback(() => {
    setViewMode((prev) => (prev === "2D" ? "3D" : "2D"));
  }, []);

  // Update camera position
  const updateCameraPosition = useCallback((position) => {
    setCameraPosition(position);
  }, []);

  // Handle adding furniture
  const addFurniture = useCallback((furnitureItem) => {
    const newItem = {
      ...furnitureItem,
      id: `furniture-${Date.now()}`,
      position: { x: 0, y: 0, z: 0 },
      rotation: 0,
      scale: 1,
    };

    setFurniture((prev) => [...prev, newItem]);
    return newItem.id;
  }, []);

  // Handle removing furniture
  const removeFurniture = useCallback(
    (itemId) => {
      setFurniture((prev) => prev.filter((item) => item.id !== itemId));
      if (selectedItem === itemId) {
        setSelectedItem(null);
      }
    },
    [selectedItem]
  );

  // Update furniture position
  const updateFurniturePosition = useCallback((itemId, position) => {
    setFurniture((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, position } : item))
    );
  }, []);

  // Update furniture rotation
  const updateFurnitureRotation = useCallback((itemId, rotation) => {
    setFurniture((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, rotation } : item))
    );
  }, []);

  // Update furniture scale
  const updateFurnitureScale = useCallback((itemId, scale) => {
    setFurniture((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, scale } : item))
    );
  }, []);

  // Handle vertex editing mode
  const toggleVertexEditMode = useCallback(() => {
    setEditMode((prev) => (prev === "vertex-edit" ? "default" : "vertex-edit"));
    setIsCustomRoom(true);
  }, []);

  // Handle wall editing mode
  const toggleWallEditMode = useCallback(() => {
    setEditMode((prev) => (prev === "wall-edit" ? "default" : "wall-edit"));
  }, []);

  // Update vertex position
  const updateVertexPosition = useCallback((vertexId, position) => {
    setRoomVertices((prev) =>
      prev.map((vertex) =>
        vertex.id === vertexId ? { ...vertex, position } : vertex
      )
    );
    setIsCustomRoom(true);
  }, []);

  // Add a new vertex between two existing vertices
  const addVertex = useCallback(
    (wallId) => {
      const wall = walls.find((w) => w.id === wallId);
      if (!wall) return;

      const startVertex = roomVertices.find((v) => v.id === wall.startVertexId);
      const endVertex = roomVertices.find((v) => v.id === wall.endVertexId);

      if (!startVertex || !endVertex) return;

      // Create new vertex at midpoint
      const newVertexId = `v-${Date.now()}`;
      const newVertex = {
        id: newVertexId,
        position: {
          x: (startVertex.position.x + endVertex.position.x) / 2,
          z: (startVertex.position.z + endVertex.position.z) / 2,
        },
      };

      // Find index of end vertex
      const endVertexIndex = roomVertices.findIndex(
        (v) => v.id === endVertex.id
      );

      // Insert new vertex before end vertex
      const newVertices = [...roomVertices];
      newVertices.splice(endVertexIndex, 0, newVertex);
      setRoomVertices(newVertices);

      // Update walls to include the new vertex
      const updatedWalls = walls.map((w) => {
        if (w.id === wallId) {
          // Create two walls from the original one
          return {
            id: `wall-${Date.now()}-1`,
            startVertexId: wall.startVertexId,
            endVertexId: newVertexId,
            features: [], // Features will need to be reassigned based on position
          };
        }
        return w;
      });

      // Add the second segment of the split wall
      updatedWalls.push({
        id: `wall-${Date.now()}-2`,
        startVertexId: newVertexId,
        endVertexId: wall.endVertexId,
        features: [], // Features will need to be reassigned based on position
      });

      // Filter out the original wall
      const finalWalls = updatedWalls.filter((w) => w.id !== wallId);
      setWalls(finalWalls);

      setIsCustomRoom(true);
      return newVertexId;
    },
    [roomVertices, walls]
  );

  // Remove a vertex (and connect adjacent walls)
  const removeVertex = useCallback(
    (vertexId) => {
      // Find walls connected to this vertex
      const connectedWalls = walls.filter(
        (wall) =>
          wall.startVertexId === vertexId || wall.endVertexId === vertexId
      );

      if (connectedWalls.length !== 2) {
        // Can only remove vertices that connect exactly two walls
        return false;
      }

      // Find the two vertices that will remain connected after removal
      const wall1 = connectedWalls[0];
      const wall2 = connectedWalls[1];

      const remainingVertex1 =
        wall1.startVertexId === vertexId
          ? wall1.endVertexId
          : wall1.startVertexId;

      const remainingVertex2 =
        wall2.startVertexId === vertexId
          ? wall2.endVertexId
          : wall2.startVertexId;

      // Create new wall connecting the remaining vertices
      const newWall = {
        id: `wall-${Date.now()}`,
        startVertexId: remainingVertex1,
        endVertexId: remainingVertex2,
        features: [], // Features may need to be reassigned
      };

      // Remove the old walls and add the new one
      const updatedWalls = walls.filter(
        (wall) => wall.id !== wall1.id && wall.id !== wall2.id
      );
      updatedWalls.push(newWall);

      // Remove the vertex
      const updatedVertices = roomVertices.filter(
        (vertex) => vertex.id !== vertexId
      );

      setWalls(updatedWalls);
      setRoomVertices(updatedVertices);
      setIsCustomRoom(true);
      return true;
    },
    [roomVertices, walls]
  );

  // Add a wall feature (door or window)
  const addWallFeature = useCallback(
    (wallId, featureType) => {
      if (!wallId) return;

      const newFeature = {
        id: `${featureType}-${Date.now()}`,
        type: featureType,
        position: 0.5, // Center of the wall (0-1 represents position along wall)
        width: featureType === "door" ? 80 : 100, // Default width in cm
        height: featureType === "door" ? 200 : 120, // Default height in cm
      };

      const updatedWalls = walls.map((wall) => {
        if (wall.id === wallId) {
          return {
            ...wall,
            features: [...wall.features, newFeature],
          };
        }
        return wall;
      });

      setWalls(updatedWalls);
      return newFeature.id;
    },
    [walls]
  );

  // Update a wall feature's properties
  const updateWallFeature = useCallback(
    (wallId, featureId, updates) => {
      const updatedWalls = walls.map((wall) => {
        if (wall.id === wallId) {
          return {
            ...wall,
            features: wall.features.map((feature) =>
              feature.id === featureId ? { ...feature, ...updates } : feature
            ),
          };
        }
        return wall;
      });

      setWalls(updatedWalls);
    },
    [walls]
  );

  // Remove a wall feature
  const removeWallFeature = useCallback(
    (wallId, featureId) => {
      const updatedWalls = walls.map((wall) => {
        if (wall.id === wallId) {
          return {
            ...wall,
            features: wall.features.filter(
              (feature) => feature.id !== featureId
            ),
          };
        }
        return wall;
      });

      setWalls(updatedWalls);
    },
    [walls]
  );

  // Calculate the room area
  const calculateRoomArea = useCallback(() => {
    if (roomVertices.length < 3) return 0;

    // Shoelace formula to calculate area of polygon
    let area = 0;
    for (let i = 0; i < roomVertices.length; i++) {
      const j = (i + 1) % roomVertices.length;
      area += roomVertices[i].position.x * roomVertices[j].position.z;
      area -= roomVertices[j].position.x * roomVertices[i].position.z;
    }

    return Math.abs(area) / 2;
  }, [roomVertices]);

  // Save room design as JSON
  const saveDesign = useCallback(() => {
    const design = {
      roomSize,
      isCustomRoom,
      roomVertices,
      walls,
      colors,
      textures,
      furniture,
      viewMode,
      gridSize,
      showGrid,
      showDimensions,
      timestamp: new Date().toISOString(),
    };

    return design;
  }, [
    roomSize,
    isCustomRoom,
    roomVertices,
    walls,
    colors,
    textures,
    furniture,
    viewMode,
    gridSize,
    showGrid,
    showDimensions,
  ]);

  // Load room design from JSON
  const loadDesign = useCallback((design) => {
    if (!design) return false;

    try {
      setRoomSize(design.roomSize || DEFAULT_ROOM_SIZE);
      setIsCustomRoom(design.isCustomRoom || false);
      setRoomVertices(design.roomVertices || []);
      setWalls(design.walls || []);
      setColors(design.colors || DEFAULT_COLORS);
      setTextures(design.textures || DEFAULT_TEXTURES);
      setFurniture(design.furniture || []);
      setViewMode(design.viewMode || "2D");
      setGridSize(design.gridSize || DEFAULT_GRID_SIZE);
      setShowGrid(design.showGrid !== undefined ? design.showGrid : true);
      setShowDimensions(
        design.showDimensions !== undefined ? design.showDimensions : true
      );

      return true;
    } catch (error) {
      console.error("Failed to load design:", error);
      return false;
    }
  }, []);

  // Reset to default
  const resetDesign = useCallback(() => {
    setRoomSize(DEFAULT_ROOM_SIZE);
    setGridSize(DEFAULT_GRID_SIZE);
    setShowGrid(true);
    setShowDimensions(true);
    setColors(DEFAULT_COLORS);
    setTextures(DEFAULT_TEXTURES);
    setViewMode("2D");
    setCameraPosition({ x: 0, y: 100, z: 0 });
    setFurniture([]);
    setSelectedItem(null);
    setIsCustomRoom(false);
    setEditMode("default");
  }, []);

  return {
    roomSize,
    updateRoomDimension,
    gridSize,
    updateGridSize,
    showGrid,
    toggleShowGrid,
    showDimensions,
    toggleShowDimensions,
    colors,
    updateRoomColor,
    textures,
    updateRoomTexture,
    viewMode,
    toggleViewMode,
    cameraPosition,
    updateCameraPosition,
    furniture,
    addFurniture,
    removeFurniture,
    selectedItem,
    setSelectedItem,
    updateFurniturePosition,
    updateFurnitureRotation,
    updateFurnitureScale,
    furnitureCategory,
    setFurnitureCategory,
    availableFurniture,
    setAvailableFurniture,
    editMode,
    setEditMode,
    toggleVertexEditMode,
    toggleWallEditMode,
    roomVertices,
    setRoomVertices,
    updateVertexPosition,
    isCustomRoom,
    toggleCustomRoomShape,
    walls,
    setWalls,
    addVertex,
    removeVertex,
    addWallFeature,
    updateWallFeature,
    removeWallFeature,
    calculateRoomArea,
    saveDesign,
    loadDesign,
    resetDesign,
  };
}
