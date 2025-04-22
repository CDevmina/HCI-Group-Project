// components/Room2D.jsx
import { useRef, useEffect, useState } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import { OrbitControls, Html, Text } from "@react-three/drei";
import * as THREE from "three";
import FurnitureItem from "./FurnitureItem";

const Room2D = ({
  roomSize,
  furniture,
  selectedItem,
  setSelectedItem,
  showDimensions,
  showGrid,
  gridSize,
  floorColor,
  wallColor,
  handleFurniturePosition,
}) => {
  const { width, depth, height } = roomSize;
  const groupRef = useRef();
  const controlsRef = useRef();
  const { camera, gl, scene } = useThree();
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeDirection, setResizeDirection] = useState(null);
  const [draggedItem, setDraggedItem] = useState(null);
  const [roomVertices, setRoomVertices] = useState([]);
  const [selectedVertex, setSelectedVertex] = useState(null);
  const [editMode, setEditMode] = useState("default"); // 'default', 'vertex-edit', 'add-wall'
  const startPosRef = useRef({ x: 0, z: 0 });
  const startSizeRef = useRef({ width: 0, depth: 0 });

  // Initialize room vertices based on room size
  useEffect(() => {
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
  }, [width, depth]);

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
    const halfWidth = width / 2;
    const halfDepth = depth / 2;

    // Create grid lines along width
    for (let i = -halfWidth; i <= halfWidth; i += gridSize) {
      const isMainLine = Math.abs(i) % (gridSize * 5) < 0.001;
      gridLines.push(
        <line key={`width-${i}`}>
          <bufferGeometry attach="geometry">
            <float32BufferAttribute
              attach="attributes-position"
              args={[
                new Float32Array([i, 0.01, -halfDepth, i, 0.01, halfDepth]),
                3,
              ]}
            />
          </bufferGeometry>
          <lineBasicMaterial
            attach="material"
            color={isMainLine ? "#888888" : "#aaaaaa"}
            opacity={isMainLine ? 0.8 : 0.4}
            transparent
            linewidth={isMainLine ? 2 : 1}
          />
        </line>
      );
    }

    // Create grid lines along depth
    for (let i = -halfDepth; i <= halfDepth; i += gridSize) {
      const isMainLine = Math.abs(i) % (gridSize * 5) < 0.001;
      gridLines.push(
        <line key={`depth-${i}`}>
          <bufferGeometry attach="geometry">
            <float32BufferAttribute
              attach="attributes-position"
              args={[
                new Float32Array([-halfWidth, 0.01, i, halfWidth, 0.01, i]),
                3,
              ]}
            />
          </bufferGeometry>
          <lineBasicMaterial
            attach="material"
            color={isMainLine ? "#888888" : "#aaaaaa"}
            opacity={isMainLine ? 0.8 : 0.4}
            transparent
            linewidth={isMainLine ? 2 : 1}
          />
        </line>
      );
    }

    return gridLines;
  };

  // Handle room resize
  const startResize = (e, direction) => {
    e.stopPropagation();
    setIsResizing(true);
    setResizeDirection(direction);
    startPosRef.current = { x: e.point.x, z: e.point.z };
    startSizeRef.current = { width, depth };
  };

  // Start dragging vertex
  const startVertexDrag = (e, vertexId) => {
    e.stopPropagation();
    setIsDragging(true);
    setSelectedVertex(vertexId);
    startPosRef.current = { x: e.point.x, z: e.point.z };

    // Set edit mode to vertex-edit
    setEditMode("vertex-edit");
  };

  // Start dragging furniture
  const startDraggingFurniture = (e, item) => {
    e.stopPropagation();
    setIsDragging(true);
    setDraggedItem(item);
    setSelectedItem(item);
    startPosRef.current = { x: e.point.x, z: e.point.z };
  };

  // Create HTML overlays for room dimensions
  const DimensionOverlay = ({ position, value, isWidth }) => {
    return (
      <Html position={position}>
        <div
          className="dimensions-label"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            padding: "2px 8px",
            borderRadius: "4px",
            fontSize: "12px",
            fontWeight: "500",
            color: "#374151",
            whiteSpace: "nowrap",
            textAlign: "center",
            boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
            pointerEvents: "none",
          }}
        >
          {value} cm
        </div>
      </Html>
    );
  };

  // Update the room vertices position
  const updateRoomVertices = () => {
    const halfWidth = width / 2;
    const halfDepth = depth / 2;

    // Update vertices positions based on the rectangular room
    const updatedVertices = [
      { id: "v1", position: { x: -halfWidth, z: -halfDepth } },
      { id: "v2", position: { x: halfWidth, z: -halfDepth } },
      { id: "v3", position: { x: halfWidth, z: halfDepth } },
      { id: "v4", position: { x: -halfWidth, z: halfDepth } },
    ];

    setRoomVertices(updatedVertices);
  };

  // Handle mouse move during resize or drag
  useFrame(() => {
    if (isResizing && resizeDirection) {
      const raycaster = new THREE.Raycaster();
      const mouse = new THREE.Vector2();

      mouse.x = (gl.domElement.width / 2 / gl.domElement.width) * 2 - 1;
      mouse.y = (-(gl.domElement.height / 2) / gl.domElement.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);

      const floorPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
      const intersection = new THREE.Vector3();
      raycaster.ray.intersectPlane(floorPlane, intersection);

      // Update room dimensions based on resize direction and grid size
      let newWidth = width;
      let newDepth = depth;

      if (resizeDirection.includes("right")) {
        newWidth = Math.max(
          200,
          startSizeRef.current.width +
            (intersection.x - startPosRef.current.x) * 2
        );
        newWidth = Math.round(newWidth / gridSize) * gridSize; // Snap to grid
      }
      if (resizeDirection.includes("left")) {
        newWidth = Math.max(
          200,
          startSizeRef.current.width -
            (intersection.x - startPosRef.current.x) * 2
        );
        newWidth = Math.round(newWidth / gridSize) * gridSize; // Snap to grid
      }
      if (resizeDirection.includes("top")) {
        newDepth = Math.max(
          200,
          startSizeRef.current.depth -
            (intersection.z - startPosRef.current.z) * 2
        );
        newDepth = Math.round(newDepth / gridSize) * gridSize; // Snap to grid
      }
      if (resizeDirection.includes("bottom")) {
        newDepth = Math.max(
          200,
          startSizeRef.current.depth +
            (intersection.z - startPosRef.current.z) * 2
        );
        newDepth = Math.round(newDepth / gridSize) * gridSize; // Snap to grid
      }

      // Update room size
      if (newWidth !== width || newDepth !== depth) {
        roomSize.width = newWidth;
        roomSize.depth = newDepth;

        // Update room vertices
        updateRoomVertices();
      }
    }

    // Handle vertex dragging to create custom room shapes
    if (isDragging && selectedVertex && editMode === "vertex-edit") {
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
        startPosRef.current = { x: intersection.x, z: intersection.z };

        // Update furniture position
        handleFurniturePosition(draggedItem, {
          x: newX,
          y: furnitureItem.position.y,
          z: newZ,
        });
      }
    }
  });

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
        setEditMode("default");
      }
    };

    document.addEventListener("mouseup", handleMouseUp);
  };

  // Function to render the room shape based on vertices
  const renderRoomShape = () => {
    if (roomVertices.length < 3) return null;

    // Create a path for the room outline
    const points = roomVertices.map(
      (vertex) => new THREE.Vector3(vertex.position.x, 0.01, vertex.position.z)
    );
    points.push(points[0].clone()); // Close the loop

    const geometry = new THREE.BufferGeometry().setFromPoints(points);

    return (
      <line>
        <bufferGeometry attach="geometry" {...geometry} />
        <lineBasicMaterial attach="material" color="#444" linewidth={2} />
      </line>
    );
  };

  // Toggle vertex editing mode
  const toggleVertexEditMode = () => {
    setEditMode(editMode === "vertex-edit" ? "default" : "vertex-edit");
    setSelectedVertex(null);
  };

  // Add a new vertex between two existing vertices
  const addVertex = (index) => {
    const nextIndex = (index + 1) % roomVertices.length;
    const v1 = roomVertices[index];
    const v2 = roomVertices[nextIndex];

    // Calculate the midpoint position
    const midX = (v1.position.x + v2.position.x) / 2;
    const midZ = (v1.position.z + v2.position.z) / 2;

    // Create a new vertex
    const newVertex = {
      id: `v${roomVertices.length + 1}`,
      position: { x: midX, z: midZ },
    };

    // Insert the new vertex into the array
    const updatedVertices = [...roomVertices];
    updatedVertices.splice(nextIndex, 0, newVertex);

    setRoomVertices(updatedVertices);
    setSelectedVertex(newVertex.id);
    setEditMode("vertex-edit");
  };

  // Render room floor with grid
  return (
    <group ref={groupRef}>
      {/* Room floor */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0, 0]}
        onClick={() => setSelectedItem(null)}
      >
        <planeGeometry args={[width, depth]} />
        <meshStandardMaterial color={floorColor || "#f5f5f5"} />
      </mesh>

      {/* Room outline based on vertices */}
      {renderRoomShape()}

      {/* Grid */}
      {renderGrid()}

      {/* Dimension lines */}
      {showDimensions && (
        <>
          <DimensionOverlay
            position={[0, 0, -depth / 2 - 20]}
            value={width}
            isWidth={true}
          />
          <DimensionOverlay
            position={[width / 2 + 20, 0, 0]}
            value={depth}
            isWidth={false}
          />
        </>
      )}

      {/* Room vertices */}
      {roomVertices.map((vertex, index) => (
        <group
          key={vertex.id}
          position={[vertex.position.x, 0.1, vertex.position.z]}
        >
          {/* Vertex point */}
          <mesh
            scale={selectedVertex === vertex.id ? [1, 1, 1] : [0.7, 0.7, 0.7]}
            onPointerDown={(e) => {
              startVertexDrag(e, vertex.id);
              registerEventHandlers();
            }}
          >
            <sphereGeometry args={[5]} />
            <meshBasicMaterial
              color={selectedVertex === vertex.id ? "#ff4500" : "#4f46e5"}
            />
            <Html>
              <div
                className="room-vertex"
                style={{
                  cursor: "move",
                  position: "absolute",
                  width: "16px",
                  height: "16px",
                  transform: "translate(-50%, -50%)",
                }}
              />
            </Html>
          </mesh>

          {/* Add vertex button (midpoint between vertices) */}
          {editMode === "vertex-edit" && (
            <group
              position={[
                (roomVertices[(index + 1) % roomVertices.length].position.x -
                  vertex.position.x) /
                  2,
                0,
                (roomVertices[(index + 1) % roomVertices.length].position.z -
                  vertex.position.z) /
                  2,
              ]}
              onClick={(e) => {
                e.stopPropagation();
                addVertex(index);
              }}
            >
              <mesh scale={[0.5, 0.5, 0.5]}>
                <sphereGeometry args={[5]} />
                <meshBasicMaterial color="#22cc88" />
              </mesh>
              <Html>
                <div
                  className="add-vertex-button"
                  style={{
                    cursor: "pointer",
                    position: "absolute",
                    width: "16px",
                    height: "16px",
                    transform: "translate(-50%, -50%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    fontSize: "12px",
                    fontWeight: "bold",
                  }}
                >
                  +
                </div>
              </Html>
            </group>
          )}
        </group>
      ))}

      {/* Room resize handles */}
      {editMode !== "vertex-edit" && (
        <group>
          <mesh
            position={[width / 2, 0.1, depth / 2]}
            scale={[0.7, 0.7, 0.7]}
            onPointerDown={(e) => {
              startResize(e, "right-bottom");
              registerEventHandlers();
            }}
          >
            <sphereGeometry args={[5]} />
            <meshBasicMaterial color="#4f46e5" />
            <Html>
              <div
                className="room-handle bottom-right"
                style={{
                  cursor: "se-resize",
                  position: "absolute",
                  width: "16px",
                  height: "16px",
                  transform: "translate(-50%, -50%)",
                }}
              />
            </Html>
          </mesh>

          <mesh
            position={[-width / 2, 0.1, depth / 2]}
            scale={[0.7, 0.7, 0.7]}
            onPointerDown={(e) => {
              startResize(e, "left-bottom");
              registerEventHandlers();
            }}
          >
            <sphereGeometry args={[5]} />
            <meshBasicMaterial color="#4f46e5" />
            <Html>
              <div
                className="room-handle bottom-left"
                style={{
                  cursor: "sw-resize",
                  position: "absolute",
                  width: "16px",
                  height: "16px",
                  transform: "translate(-50%, -50%)",
                }}
              />
            </Html>
          </mesh>

          <mesh
            position={[width / 2, 0.1, -depth / 2]}
            scale={[0.7, 0.7, 0.7]}
            onPointerDown={(e) => {
              startResize(e, "right-top");
              registerEventHandlers();
            }}
          >
            <sphereGeometry args={[5]} />
            <meshBasicMaterial color="#4f46e5" />
            <Html>
              <div
                className="room-handle top-right"
                style={{
                  cursor: "ne-resize",
                  position: "absolute",
                  width: "16px",
                  height: "16px",
                  transform: "translate(-50%, -50%)",
                }}
              />
            </Html>
          </mesh>

          <mesh
            position={[-width / 2, 0.1, -depth / 2]}
            scale={[0.7, 0.7, 0.7]}
            onPointerDown={(e) => {
              startResize(e, "left-top");
              registerEventHandlers();
            }}
          >
            <sphereGeometry args={[5]} />
            <meshBasicMaterial color="#4f46e5" />
            <Html>
              <div
                className="room-handle top-left"
                style={{
                  cursor: "nw-resize",
                  position: "absolute",
                  width: "16px",
                  height: "16px",
                  transform: "translate(-50%, -50%)",
                }}
              />
            </Html>
          </mesh>

          {/* Mid-point resize handles */}
          <mesh
            position={[0, 0.1, depth / 2]}
            scale={[0.7, 0.7, 0.7]}
            onPointerDown={(e) => {
              startResize(e, "bottom");
              registerEventHandlers();
            }}
          >
            <sphereGeometry args={[5]} />
            <meshBasicMaterial color="#4f46e5" />
            <Html>
              <div
                className="room-handle bottom"
                style={{
                  cursor: "s-resize",
                  position: "absolute",
                  width: "16px",
                  height: "16px",
                  transform: "translate(-50%, -50%)",
                }}
              />
            </Html>
          </mesh>

          <mesh
            position={[width / 2, 0.1, 0]}
            scale={[0.7, 0.7, 0.7]}
            onPointerDown={(e) => {
              startResize(e, "right");
              registerEventHandlers();
            }}
          >
            <sphereGeometry args={[5]} />
            <meshBasicMaterial color="#4f46e5" />
            <Html>
              <div
                className="room-handle right"
                style={{
                  cursor: "e-resize",
                  position: "absolute",
                  width: "16px",
                  height: "16px",
                  transform: "translate(-50%, -50%)",
                }}
              />
            </Html>
          </mesh>

          <mesh
            position={[0, 0.1, -depth / 2]}
            scale={[0.7, 0.7, 0.7]}
            onPointerDown={(e) => {
              startResize(e, "top");
              registerEventHandlers();
            }}
          >
            <sphereGeometry args={[5]} />
            <meshBasicMaterial color="#4f46e5" />
            <Html>
              <div
                className="room-handle top"
                style={{
                  cursor: "n-resize",
                  position: "absolute",
                  width: "16px",
                  height: "16px",
                  transform: "translate(-50%, -50%)",
                }}
              />
            </Html>
          </mesh>

          <mesh
            position={[-width / 2, 0.1, 0]}
            scale={[0.7, 0.7, 0.7]}
            onPointerDown={(e) => {
              startResize(e, "left");
              registerEventHandlers();
            }}
          >
            <sphereGeometry args={[5]} />
            <meshBasicMaterial color="#4f46e5" />
            <Html>
              <div
                className="room-handle left"
                style={{
                  cursor: "w-resize",
                  position: "absolute",
                  width: "16px",
                  height: "16px",
                  transform: "translate(-50%, -50%)",
                }}
              />
            </Html>
          </mesh>
        </group>
      )}

      {/* Vertex Edit Mode Toggle Button */}
      <Html position={[width / 2 - 30, 0.1, -depth / 2 - 30]}>
        <div
          onClick={toggleVertexEditMode}
          style={{
            cursor: "pointer",
            backgroundColor: editMode === "vertex-edit" ? "#4f46e5" : "#ffffff",
            color: editMode === "vertex-edit" ? "#ffffff" : "#4f46e5",
            border: "2px solid #4f46e5",
            padding: "4px 8px",
            borderRadius: "4px",
            fontSize: "12px",
            fontWeight: "600",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          }}
        >
          {editMode === "vertex-edit" ? "Exit Vertex Edit" : "Edit Room Shape"}
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
              color={item.color}
              opacity={selectedItem === item.id ? 0.9 : 0.7}
              transparent
            />
          </mesh>

          {/* Selection outline for selected item */}
          {selectedItem === item.id && (
            <lineSegments>
              <edgesGeometry attach="geometry">
                <boxGeometry
                  args={[
                    item.dimensions.width * (item.scale || 1) + 1,
                    item.dimensions.height * (item.scale || 1) * 0.2 + 1,
                    item.dimensions.depth * (item.scale || 1) + 1,
                  ]}
                />
              </edgesGeometry>
              <lineBasicMaterial
                attach="material"
                color="#4f46e5"
                linewidth={2}
              />
            </lineSegments>
          )}

          {/* Item name label */}
          <Html
            position={[
              0,
              item.dimensions.height * (item.scale || 1) * 0.1 + 5,
              0,
            ]}
          >
            <div
              style={{
                backgroundColor:
                  selectedItem === item.id ? "#4f46e5" : "rgba(0, 0, 0, 0.5)",
                color: "white",
                padding: "2px 6px",
                borderRadius: "4px",
                fontSize: "10px",
                fontWeight: "500",
                whiteSpace: "nowrap",
                transform: "translate(-50%, -50%)",
                pointerEvents: "none",
              }}
            >
              {item.name}
            </div>
          </Html>
        </group>
      ))}

      {/* Grid cell measurements when hovering near grid lines */}
      {showGrid && showDimensions && (
        <Html position={[0, 0.1, 0]} center>
          <div
            style={{
              position: "absolute",
              bottom: "10px",
              left: "10px",
              backgroundColor: "rgba(255, 255, 255, 0.8)",
              padding: "4px 8px",
              borderRadius: "4px",
              fontSize: "12px",
              fontWeight: "500",
            }}
          >
            Grid: {gridSize}cm × {gridSize}cm
          </div>
        </Html>
      )}

      <OrbitControls
        ref={controlsRef}
        enableRotate={false}
        enableZoom={true}
        enablePan={true}
        zoomSpeed={0.5}
        panSpeed={0.5}
        screenSpacePanning={true}
        minDistance={10}
        maxDistance={1000}
      />
    </group>
  );
};

export default Room2D;
