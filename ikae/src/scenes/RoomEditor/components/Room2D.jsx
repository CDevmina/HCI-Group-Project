// components/Room2D.jsx
import { useRef, useEffect, useState } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import { Html, OrthographicCamera } from "@react-three/drei";
import * as THREE from "three";

const Room2D = ({
  roomSize,
  furniture,
  selectedItem,
  setSelectedItem,
  wallColor,
  floorColor,
  showDimensions,
  showGrid,
  gridSize,
  handleFurniturePosition,
}) => {
  const { width, depth, height } = roomSize;
  const { camera, gl } = useThree();
  const controlsRef = useRef();

  // State for room editing
  const [roomVertices, setRoomVertices] = useState([]);
  const [walls, setWalls] = useState([]);
  const [isResizing, setIsResizing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [draggedItem, setDraggedItem] = useState(null);
  const [resizeDirection, setResizeDirection] = useState(null);
  const [startPosRef, setStartPosRef] = useState({ x: 0, z: 0 });
  const [editMode, setEditMode] = useState("default"); // default, vertex-edit, wall-edit
  const [selectedVertex, setSelectedVertex] = useState(null);
  const [selectedWall, setSelectedWall] = useState(null);
  const [newWallFeature, setNewWallFeature] = useState(null); // door, window

  // Initialize room vertices based on room size
  useEffect(() => {
    if (editMode !== "vertex-edit") {
      const halfWidth = width / 2;
      const halfDepth = depth / 2;

      // For basic rectangular room
      const vertices = [
        { id: "v1", position: { x: -halfWidth, z: -halfDepth } },
        { id: "v2", position: { x: halfWidth, z: -halfDepth } },
        { id: "v3", position: { x: halfWidth, z: halfDepth } },
        { id: "v4", position: { x: -halfWidth, z: halfDepth } },
      ];

      setRoomVertices(vertices);
    }
  }, [width, depth, editMode]);

  // Generate walls when vertices change
  useEffect(() => {
    if (roomVertices.length > 2) {
      const newWalls = [];

      for (let i = 0; i < roomVertices.length; i++) {
        const startVertex = roomVertices[i];
        const endVertex = roomVertices[(i + 1) % roomVertices.length]; // Wrap around to first vertex

        newWalls.push({
          id: `wall-${i}`,
          startVertexId: startVertex.id,
          endVertexId: endVertex.id,
          features: [], // Will contain doors, windows
        });
      }

      setWalls(newWalls);
    }
  }, [roomVertices]);

  // Initialize camera position to view the entire room
  useEffect(() => {
    camera.position.set(0, Math.max(width, depth) * 0.75, 0);
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
    if (controlsRef.current) {
      controlsRef.current.target.set(0, 0, 0);
      controlsRef.current.update();
    }
  }, [camera, width, depth]);

  // Adjust view when room size changes
  useEffect(() => {
    const maxDim = Math.max(width, depth);
    camera.position.y = maxDim * 0.75;
    camera.updateProjectionMatrix();
  }, [width, depth, camera]);

  // Create the grid for the floor
  const renderGrid = () => {
    if (!showGrid) return null;

    const gridLines = [];
    const gridExtent = Math.max(width, depth) * 1.5;
    const halfGridExtent = gridExtent / 2;

    // Create horizontal and vertical grid lines
    for (let i = -halfGridExtent; i <= halfGridExtent; i += gridSize) {
      // Horizontal lines (along X axis)
      gridLines.push(
        <line key={`h-${i}`}>
          <bufferGeometry
            attach="geometry"
            {...new THREE.BufferGeometry().setFromPoints([
              new THREE.Vector3(-halfGridExtent, 0.02, i),
              new THREE.Vector3(halfGridExtent, 0.02, i),
            ])}
          />
          <lineBasicMaterial
            attach="material"
            color="#cccccc"
            opacity={0.5}
            transparent
          />
        </line>
      );

      // Vertical lines (along Z axis)
      gridLines.push(
        <line key={`v-${i}`}>
          <bufferGeometry
            attach="geometry"
            {...new THREE.BufferGeometry().setFromPoints([
              new THREE.Vector3(i, 0.02, -halfGridExtent),
              new THREE.Vector3(i, 0.02, halfGridExtent),
            ])}
          />
          <lineBasicMaterial
            attach="material"
            color="#cccccc"
            opacity={0.5}
            transparent
          />
        </line>
      );
    }

    return gridLines;
  };

  // Start dragging a vertex
  const startDraggingVertex = (e, vertexId) => {
    e.stopPropagation();
    setSelectedVertex(vertexId);
    setEditMode("vertex-edit");

    const rect = gl.domElement.getBoundingClientRect();
    const mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const mouseY = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(new THREE.Vector2(mouseX, mouseY), camera);

    const floorPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    const intersection = new THREE.Vector3();
    raycaster.ray.intersectPlane(floorPlane, intersection);

    setStartPosRef({ x: intersection.x, z: intersection.z });
    registerEventHandlers();
  };

  // Add a new vertex between two existing vertices
  const addVertex = (wallId) => {
    const wall = walls.find((w) => w.id === wallId);
    if (!wall) return;

    const startVertex = roomVertices.find((v) => v.id === wall.startVertexId);
    const endVertex = roomVertices.find((v) => v.id === wall.endVertexId);

    if (!startVertex || !endVertex) return;

    // Create new vertex at midpoint
    const newVertex = {
      id: `v-${Date.now()}`,
      position: {
        x: (startVertex.position.x + endVertex.position.x) / 2,
        z: (startVertex.position.z + endVertex.position.z) / 2,
      },
    };

    // Find index of end vertex
    const endVertexIndex = roomVertices.findIndex((v) => v.id === endVertex.id);

    // Insert new vertex before end vertex
    const newVertices = [...roomVertices];
    newVertices.splice(endVertexIndex, 0, newVertex);

    setRoomVertices(newVertices);
  };

  // Add a door or window to a wall
  const addWallFeature = (wallId, featureType) => {
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
  };

  // Handle vertex drag - update room shape
  useFrame(() => {
    if (editMode === "vertex-edit" && selectedVertex) {
      const raycaster = new THREE.Raycaster();
      const mouse = new THREE.Vector2();

      mouse.x = (gl.domElement.width / 2 / gl.domElement.width) * 2 - 1;
      mouse.y = (-(gl.domElement.height / 2) / gl.domElement.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);

      const floorPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
      const intersection = new THREE.Vector3();
      raycaster.ray.intersectPlane(floorPlane, intersection);

      // Get the selected vertex
      const vertexIndex = roomVertices.findIndex(
        (v) => v.id === selectedVertex
      );
      if (vertexIndex !== -1) {
        // Calculate the new position with grid snapping
        const newX = Math.round(intersection.x / gridSize) * gridSize;
        const newZ = Math.round(intersection.z / gridSize) * gridSize;

        // Update the vertex position
        const updatedVertices = [...roomVertices];
        updatedVertices[vertexIndex] = {
          ...updatedVertices[vertexIndex],
          position: { x: newX, z: newZ },
        };

        setRoomVertices(updatedVertices);
      }
    }

    if (isDragging && draggedItem) {
      const raycaster = new THREE.Raycaster();
      const mouse = new THREE.Vector2();

      mouse.x = (gl.domElement.width / 2 / gl.domElement.width) * 2 - 1;
      mouse.y = (-(gl.domElement.height / 2) / gl.domElement.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);

      const floorPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
      const intersection = new THREE.Vector3();
      raycaster.ray.intersectPlane(floorPlane, intersection);

      // Calculate the new position based on mouse movement
      const furnitureItem = furniture.find((item) => item.id === draggedItem);

      if (furnitureItem) {
        const newX =
          furnitureItem.position.x + (intersection.x - startPosRef.current.x);
        const newZ =
          furnitureItem.position.z + (intersection.z - startPosRef.current.z);

        // Update the reference position for the next frame
        setStartPosRef({ x: intersection.x, z: intersection.z });

        // Update furniture position
        handleFurniturePosition(draggedItem, {
          x: newX,
          y: furnitureItem.position.y,
          z: newZ,
        });
      }
    }
  });

  // Start dragging furniture
  const startDraggingFurniture = (e, itemId) => {
    e.stopPropagation();
    setIsDragging(true);
    setDraggedItem(itemId);

    const rect = gl.domElement.getBoundingClientRect();
    const mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const mouseY = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(new THREE.Vector2(mouseX, mouseY), camera);

    const floorPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    const intersection = new THREE.Vector3();
    raycaster.ray.intersectPlane(floorPlane, intersection);

    setStartPosRef({ x: intersection.x, z: intersection.z });
    registerEventHandlers();
  };

  // Utility function for handler registration
  const registerEventHandlers = () => {
    const handleMouseUp = () => {
      setIsResizing(false);
      setIsDragging(false);
      setDraggedItem(null);
      document.removeEventListener("mouseup", handleMouseUp);

      if (editMode === "vertex-edit") {
        // Exit vertex edit mode when mouse is released
        setSelectedVertex(null);
      }
    };

    document.addEventListener("mouseup", handleMouseUp);
  };

  // Function to render the room shape based on vertices
  const renderRoomShape = () => {
    if (roomVertices.length < 3) return null;

    // Create an array of 3D vector points from the vertices
    const points = roomVertices.map(
      (v) => new THREE.Vector3(v.position.x, 0, v.position.z)
    );

    // Create a shape for the floor
    const shape = new THREE.Shape();
    shape.moveTo(points[0].x, points[0].z);
    for (let i = 1; i < points.length; i++) {
      shape.lineTo(points[i].x, points[i].z);
    }
    shape.closePath();

    // Create edges for the room outline
    const edges = [];
    for (let i = 0; i < points.length; i++) {
      const start = points[i];
      const end = points[(i + 1) % points.length];

      edges.push(
        <line key={`edge-${i}`}>
          <bufferGeometry
            attach="geometry"
            {...new THREE.BufferGeometry().setFromPoints([
              new THREE.Vector3(start.x, 0.05, start.z),
              new THREE.Vector3(end.x, 0.05, end.z),
            ])}
          />
          <lineBasicMaterial attach="material" color="#000000" linewidth={2} />
        </line>
      );
    }

    return (
      <>
        {/* Floor */}
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <shapeGeometry args={[shape]} />
          <meshStandardMaterial color={floorColor} side={THREE.DoubleSide} />
        </mesh>

        {/* Room edges */}
        {edges}

        {/* Wall features (doors, windows) */}
        {walls.map((wall) => {
          // Find vertices
          const startVertex = roomVertices.find(
            (v) => v.id === wall.startVertexId
          );
          const endVertex = roomVertices.find((v) => v.id === wall.endVertexId);

          if (!startVertex || !endVertex) return null;

          return wall.features.map((feature) => {
            // Calculate position along the wall
            const featurePos = {
              x:
                startVertex.position.x +
                (endVertex.position.x - startVertex.position.x) *
                  feature.position,
              z:
                startVertex.position.z +
                (endVertex.position.z - startVertex.position.z) *
                  feature.position,
            };

            // Calculate wall angle
            const angle = Math.atan2(
              endVertex.position.z - startVertex.position.z,
              endVertex.position.x - startVertex.position.x
            );

            return (
              <group
                key={feature.id}
                position={[
                  featurePos.x,
                  feature.type === "door" ? 0 : 60,
                  featurePos.z,
                ]}
                rotation={[0, angle, 0]}
              >
                <mesh>
                  <boxGeometry args={[feature.width, feature.height, 10]} />
                  <meshStandardMaterial
                    color={feature.type === "door" ? "#8B4513" : "#87CEEB"}
                    opacity={0.7}
                    transparent
                  />
                </mesh>
              </group>
            );
          });
        })}

        {/* Vertex handles for editing */}
        {editMode === "vertex-edit" &&
          roomVertices.map((vertex) => (
            <group
              key={`handle-${vertex.id}`}
              position={[vertex.position.x, 0.1, vertex.position.z]}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedVertex(vertex.id);
              }}
              onPointerDown={(e) => startDraggingVertex(e, vertex.id)}
            >
              <mesh>
                <boxGeometry args={[10, 10, 10]} />
                <meshStandardMaterial
                  color={selectedVertex === vertex.id ? "#ff0000" : "#4f46e5"}
                />
              </mesh>
            </group>
          ))}
      </>
    );
  };

  // Toggle vertex edit mode
  const toggleVertexEditMode = () => {
    if (editMode === "vertex-edit") {
      setEditMode("default");
      setSelectedVertex(null);
    } else {
      setEditMode("vertex-edit");
    }
  };

  // Toggle wall edit mode
  const toggleWallEditMode = () => {
    if (editMode === "wall-edit") {
      setEditMode("default");
      setSelectedWall(null);
    } else {
      setEditMode("wall-edit");
    }
  };

  return (
    <>
      <OrthographicCamera
        makeDefault
        position={[0, 100, 0]}
        zoom={2}
        far={5000}
      />

      {/* Grid */}
      {showGrid && renderGrid()}

      {/* Room shape */}
      {renderRoomShape()}

      {/* Room edit controls */}
      <Html position={[0, 10, -depth / 2 - 50]}>
        <div className="edit-mode-controls">
          <div
            className={`edit-button ${
              editMode === "vertex-edit" ? "active" : ""
            }`}
            onClick={toggleVertexEditMode}
          >
            {editMode === "vertex-edit"
              ? "Exit Vertex Edit"
              : "Edit Room Shape"}
          </div>
          <div
            className={`edit-button ${
              editMode === "wall-edit" ? "active" : ""
            }`}
            onClick={toggleWallEditMode}
          >
            {editMode === "wall-edit"
              ? "Exit Wall Edit"
              : "Add Doors & Windows"}
          </div>
          {editMode === "wall-edit" && (
            <div className="wall-features-controls">
              <button onClick={() => setNewWallFeature("door")}>
                Add Door
              </button>
              <button onClick={() => setNewWallFeature("window")}>
                Add Window
              </button>
            </div>
          )}
        </div>
      </Html>

      {/* Furniture items */}
      {furniture.map((item) => (
        <group
          key={item.id}
          position={[
            item.position.x - width / 2,
            item.position.y + 0.1,
            item.position.z - depth / 2,
          ]}
          onClick={(e) => {
            e.stopPropagation();
            setSelectedItem(item.id);
          }}
          onPointerDown={(e) => {
            startDraggingFurniture(e, item.id);
            registerEventHandlers();
          }}
          rotation={[0, THREE.MathUtils.degToRad(item.rotation || 0), 0]}
        >
          <mesh>
            <boxGeometry
              args={[
                item.dimensions.width * (item.scale || 1),
                item.dimensions.height * (item.scale || 1) * 0.2,
                item.dimensions.depth * (item.scale || 1),
              ]}
            />
            <meshStandardMaterial
              color={item.id === selectedItem ? "#4f46e5" : item.color}
              opacity={0.8}
              transparent
            />
          </mesh>
          {item.id === selectedItem && (
            <Html>
              <div className="selected-indicator"></div>
            </Html>
          )}
        </group>
      ))}

      {/* Click handler for room floor */}
      <mesh
        position={[0, -0.1, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        onClick={() => setSelectedItem(null)}
      >
        <planeGeometry args={[width * 2, depth * 2]} />
        <meshBasicMaterial visible={false} />
      </mesh>
    </>
  );
};

export default Room2D;
