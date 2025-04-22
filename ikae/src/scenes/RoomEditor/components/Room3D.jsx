// components/Room3D.jsx
import { useRef, useEffect, useState } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import { Html, PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";

const Room3D = ({
  roomSize,
  furniture,
  selectedItem,
  setSelectedItem,
  wallColor,
  floorColor,
  showGrid,
  gridSize,
  handleFurniturePosition,
}) => {
  const { width, depth, height } = roomSize;
  const groupRef = useRef();
  const { camera, gl } = useThree();
  const raycasterRef = useRef(new THREE.Raycaster());
  const mouseRef = useRef(new THREE.Vector2());
  const isDraggingRef = useRef(false);
  const draggedItemRef = useRef(null);
  const dragStartPosRef = useRef({ x: 0, z: 0 });
  const planeRef = useRef(new THREE.Plane(new THREE.Vector3(0, 1, 0), 0));
  const [roomVertices, setRoomVertices] = useState([]);

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

  // Set up camera on mount
  useEffect(() => {
    // Position camera to see the entire room at an angle
    camera.position.set(width * 0.8, height * 1.2, depth * 1.2);
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
  }, []);

  // Update camera when room dimensions change
  useEffect(() => {
    camera.position.set(width * 0.8, height * 1.2, depth * 1.2);
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
  }, [width, depth, height, camera]);

  // Handle furniture drag
  const startDragging = (e, itemId) => {
    e.stopPropagation();

    isDraggingRef.current = true;
    draggedItemRef.current = itemId;

    // Get world position where user clicked
    const rect = gl.domElement.getBoundingClientRect();
    mouseRef.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    mouseRef.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    raycasterRef.current.setFromCamera(mouseRef.current, camera);

    const dragPoint = new THREE.Vector3();
    raycasterRef.current.ray.intersectPlane(planeRef.current, dragPoint);
    dragStartPosRef.current = { x: dragPoint.x, z: dragPoint.z };
  };

  // Create grid for the floor
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
            opacity={isMainLine ? 0.5 : 0.3}
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
            opacity={isMainLine ? 0.5 : 0.3}
            transparent
            linewidth={isMainLine ? 2 : 1}
          />
        </line>
      );
    }

    return gridLines;
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

  // Generate 3D walls based on room vertices
  const renderRoomWalls = () => {
    if (roomVertices.length < 3) return null;

    // Create walls between each pair of vertices
    const walls = [];

    for (let i = 0; i < roomVertices.length; i++) {
      const v1 = roomVertices[i];
      const v2 = roomVertices[(i + 1) % roomVertices.length];

      // Calculate wall center position
      const centerX = (v1.position.x + v2.position.x) / 2;
      const centerZ = (v1.position.z + v2.position.z) / 2;

      // Calculate wall dimensions
      const dx = v2.position.x - v1.position.x;
      const dz = v2.position.z - v1.position.z;
      const wallLength = Math.sqrt(dx * dx + dz * dz);

      // Calculate wall rotation angle
      const angle = Math.atan2(dz, dx);

      walls.push(
        <mesh
          key={`wall-${i}`}
          position={[centerX, height / 2, centerZ]}
          rotation={[0, angle + Math.PI / 2, 0]}
        >
          <boxGeometry args={[wallLength, height, 0.1]} />
          <meshStandardMaterial
            color={wallColor || "#ffffff"}
            side={THREE.DoubleSide}
          />
        </mesh>
      );
    }

    return walls;
  };

  // Create a floor shape using a custom geometry
  const renderCustomFloor = () => {
    if (roomVertices.length < 3) return null;

    // Create a shape for the floor
    const shape = new THREE.Shape();

    // Start at the first vertex
    shape.moveTo(roomVertices[0].position.x, roomVertices[0].position.z);

    // Draw lines to each subsequent vertex
    for (let i = 1; i < roomVertices.length; i++) {
      shape.lineTo(roomVertices[i].position.x, roomVertices[i].position.z);
    }

    // Close the shape
    shape.lineTo(roomVertices[0].position.x, roomVertices[0].position.z);

    // Create a geometry from the shape
    const shapeGeometry = new THREE.ShapeGeometry(shape);

    // Rotate to make it horizontal
    shapeGeometry.rotateX(-Math.PI / 2);

    return (
      <mesh>
        <primitive object={shapeGeometry} attach="geometry" />
        <meshStandardMaterial
          color={floorColor || "#f5f5f5"}
          side={THREE.DoubleSide}
        />
      </mesh>
    );
  };

  // Handle dragging on every frame
  useFrame(() => {
    if (isDraggingRef.current && draggedItemRef.current) {
      const rect = gl.domElement.getBoundingClientRect();
      mouseRef.current.x =
        ((gl.domElement.width / 2 - rect.left) / rect.width) * 2 - 1;
      mouseRef.current.y =
        -((gl.domElement.height / 2 - rect.top) / rect.height) * 2 + 1;

      raycasterRef.current.setFromCamera(mouseRef.current, camera);

      const dragPoint = new THREE.Vector3();
      raycasterRef.current.ray.intersectPlane(planeRef.current, dragPoint);

      const item = furniture.find((f) => f.id === draggedItemRef.current);

      if (item) {
        const newX =
          item.position.x + (dragPoint.x - dragStartPosRef.current.x);
        const newZ =
          item.position.z + (dragPoint.z - dragStartPosRef.current.z);

        // Apply grid snapping if enabled
        let gridSnappedX = newX;
        let gridSnappedZ = newZ;

        if (showGrid) {
          gridSnappedX = Math.round(newX / gridSize) * gridSize;
          gridSnappedZ = Math.round(newZ / gridSize) * gridSize;
        }

        dragStartPosRef.current = { x: dragPoint.x, z: dragPoint.z };

        handleFurniturePosition(draggedItemRef.current, {
          x: gridSnappedX,
          y: item.position.y,
          z: gridSnappedZ,
        });
      }
    }
  });

  // Utility function for event handler registration
  const registerEventHandlers = () => {
    const handleMouseUp = () => {
      isDraggingRef.current = false;
      draggedItemRef.current = null;
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mouseup", handleMouseUp);
  };

  // Create a basic furniture model based on type
  const renderFurnitureModel = (item) => {
    const { type, dimensions, scale = 1 } = item;

    switch (type) {
      case "sofa":
        return (
          <group>
            {/* Main sofa body */}
            <mesh position={[0, dimensions.height * scale * 0.3, 0]}>
              <boxGeometry
                args={[
                  dimensions.width * scale,
                  dimensions.height * scale * 0.6,
                  dimensions.depth * scale,
                ]}
              />
              <meshStandardMaterial color={item.color} />
            </mesh>
            {/* Sofa base */}
            <mesh position={[0, dimensions.height * scale * 0.15, 0]}>
              <boxGeometry
                args={[
                  dimensions.width * scale,
                  dimensions.height * scale * 0.3,
                  dimensions.depth * scale,
                ]}
              />
              <meshStandardMaterial color={shade(item.color, -20)} />
            </mesh>
            {/* Sofa back */}
            <mesh
              position={[
                0,
                dimensions.height * scale * 0.6,
                -dimensions.depth * scale * 0.35,
              ]}
            >
              <boxGeometry
                args={[
                  dimensions.width * scale,
                  dimensions.height * scale * 0.4,
                  dimensions.depth * scale * 0.3,
                ]}
              />
              <meshStandardMaterial color={item.color} />
            </mesh>
            {/* Sofa armrests */}
            <mesh
              position={[
                dimensions.width * scale * 0.4,
                dimensions.height * scale * 0.4,
                0,
              ]}
            >
              <boxGeometry
                args={[
                  dimensions.width * scale * 0.1,
                  dimensions.height * scale * 0.3,
                  dimensions.depth * scale * 0.8,
                ]}
              />
              <meshStandardMaterial color={item.color} />
            </mesh>
            <mesh
              position={[
                -dimensions.width * scale * 0.4,
                dimensions.height * scale * 0.4,
                0,
              ]}
            >
              <boxGeometry
                args={[
                  dimensions.width * scale * 0.1,
                  dimensions.height * scale * 0.3,
                  dimensions.depth * scale * 0.8,
                ]}
              />
              <meshStandardMaterial color={item.color} />
            </mesh>
          </group>
        );

      case "chair":
        return (
          <group>
            {/* Chair seat */}
            <mesh position={[0, dimensions.height * scale * 0.3, 0]}>
              <boxGeometry
                args={[
                  dimensions.width * scale,
                  dimensions.height * scale * 0.1,
                  dimensions.depth * scale,
                ]}
              />
              <meshStandardMaterial color={item.color} />
            </mesh>
            {/* Chair back */}
            <mesh
              position={[
                0,
                dimensions.height * scale * 0.6,
                -dimensions.depth * scale * 0.4,
              ]}
            >
              <boxGeometry
                args={[
                  dimensions.width * scale * 0.8,
                  dimensions.height * scale * 0.5,
                  dimensions.depth * scale * 0.1,
                ]}
              />
              <meshStandardMaterial color={item.color} />
            </mesh>
            {/* Chair legs */}
            <mesh
              position={[
                dimensions.width * scale * 0.3,
                dimensions.height * scale * 0.15,
                dimensions.depth * scale * 0.3,
              ]}
            >
              <cylinderGeometry
                args={[
                  dimensions.width * scale * 0.05,
                  dimensions.width * scale * 0.05,
                  dimensions.height * scale * 0.3,
                  8,
                ]}
              />
              <meshStandardMaterial color={shade(item.color, -50)} />
            </mesh>
            <mesh
              position={[
                -dimensions.width * scale * 0.3,
                dimensions.height * scale * 0.15,
                dimensions.depth * scale * 0.3,
              ]}
            >
              <cylinderGeometry
                args={[
                  dimensions.width * scale * 0.05,
                  dimensions.width * scale * 0.05,
                  dimensions.height * scale * 0.3,
                  8,
                ]}
              />
              <meshStandardMaterial color={shade(item.color, -50)} />
            </mesh>
            <mesh
              position={[
                dimensions.width * scale * 0.3,
                dimensions.height * scale * 0.15,
                -dimensions.depth * scale * 0.3,
              ]}
            >
              <cylinderGeometry
                args={[
                  dimensions.width * scale * 0.05,
                  dimensions.width * scale * 0.05,
                  dimensions.height * scale * 0.3,
                  8,
                ]}
              />
              <meshStandardMaterial color={shade(item.color, -50)} />
            </mesh>
            <mesh
              position={[
                -dimensions.width * scale * 0.3,
                dimensions.height * scale * 0.15,
                -dimensions.depth * scale * 0.3,
              ]}
            >
              <cylinderGeometry
                args={[
                  dimensions.width * scale * 0.05,
                  dimensions.width * scale * 0.05,
                  dimensions.height * scale * 0.3,
                  8,
                ]}
              />
              <meshStandardMaterial color={shade(item.color, -50)} />
            </mesh>
          </group>
        );

      case "table":
        return (
          <group>
            {/* Table top */}
            <mesh position={[0, dimensions.height * scale * 0.9, 0]}>
              <boxGeometry
                args={[
                  dimensions.width * scale,
                  dimensions.height * scale * 0.05,
                  dimensions.depth * scale,
                ]}
              />
              <meshStandardMaterial color={item.color} />
            </mesh>
            {/* Table legs */}
            <mesh
              position={[
                dimensions.width * scale * 0.4,
                dimensions.height * scale * 0.45,
                dimensions.depth * scale * 0.4,
              ]}
            >
              <cylinderGeometry
                args={[
                  dimensions.width * scale * 0.03,
                  dimensions.width * scale * 0.03,
                  dimensions.height * scale * 0.85,
                  8,
                ]}
              />
              <meshStandardMaterial color={shade(item.color, -30)} />
            </mesh>
            <mesh
              position={[
                -dimensions.width * scale * 0.4,
                dimensions.height * scale * 0.45,
                dimensions.depth * scale * 0.4,
              ]}
            >
              <cylinderGeometry
                args={[
                  dimensions.width * scale * 0.03,
                  dimensions.width * scale * 0.03,
                  dimensions.height * scale * 0.85,
                  8,
                ]}
              />
              <meshStandardMaterial color={shade(item.color, -30)} />
            </mesh>
            <mesh
              position={[
                dimensions.width * scale * 0.4,
                dimensions.height * scale * 0.45,
                -dimensions.depth * scale * 0.4,
              ]}
            >
              <cylinderGeometry
                args={[
                  dimensions.width * scale * 0.03,
                  dimensions.width * scale * 0.03,
                  dimensions.height * scale * 0.85,
                  8,
                ]}
              />
              <meshStandardMaterial color={shade(item.color, -30)} />
            </mesh>
            <mesh
              position={[
                -dimensions.width * scale * 0.4,
                dimensions.height * scale * 0.45,
                -dimensions.depth * scale * 0.4,
              ]}
            >
              <cylinderGeometry
                args={[
                  dimensions.width * scale * 0.03,
                  dimensions.width * scale * 0.03,
                  dimensions.height * scale * 0.85,
                  8,
                ]}
              />
              <meshStandardMaterial color={shade(item.color, -30)} />
            </mesh>
          </group>
        );

      case "bed":
        return (
          <group>
            {/* Bed base */}
            <mesh position={[0, dimensions.height * scale * 0.15, 0]}>
              <boxGeometry
                args={[
                  dimensions.width * scale,
                  dimensions.height * scale * 0.3,
                  dimensions.depth * scale,
                ]}
              />
              <meshStandardMaterial color={shade(item.color, -20)} />
            </mesh>
            {/* Mattress */}
            <mesh position={[0, dimensions.height * scale * 0.35, 0]}>
              <boxGeometry
                args={[
                  dimensions.width * scale * 0.95,
                  dimensions.height * scale * 0.2,
                  dimensions.depth * scale * 0.95,
                ]}
              />
              <meshStandardMaterial color="#f8f8f8" />
            </mesh>
            {/* Pillow */}
            <mesh
              position={[
                0,
                dimensions.height * scale * 0.45,
                -dimensions.depth * scale * 0.35,
              ]}
            >
              <boxGeometry
                args={[
                  dimensions.width * scale * 0.8,
                  dimensions.height * scale * 0.1,
                  dimensions.depth * scale * 0.2,
                ]}
              />
              <meshStandardMaterial color="#ffffff" />
            </mesh>
            {/* Headboard */}
            <mesh
              position={[
                0,
                dimensions.height * scale * 0.7,
                -dimensions.depth * scale * 0.48,
              ]}
            >
              <boxGeometry
                args={[
                  dimensions.width * scale,
                  dimensions.height * scale * 0.5,
                  dimensions.depth * scale * 0.05,
                ]}
              />
              <meshStandardMaterial color={item.color} />
            </mesh>
          </group>
        );

      case "storage":
        return (
          <group>
            {/* Main cabinet */}
            <mesh position={[0, dimensions.height * scale * 0.5, 0]}>
              <boxGeometry
                args={[
                  dimensions.width * scale,
                  dimensions.height * scale,
                  dimensions.depth * scale,
                ]}
              />
              <meshStandardMaterial color={item.color} />
            </mesh>
            {/* Drawer/door details */}
            <mesh
              position={[
                0,
                dimensions.height * scale * 0.7,
                dimensions.depth * scale * 0.501,
              ]}
            >
              <boxGeometry
                args={[
                  dimensions.width * scale * 0.8,
                  dimensions.height * scale * 0.15,
                  0.1,
                ]}
              />
              <meshStandardMaterial color={shade(item.color, 10)} />
            </mesh>
            <mesh
              position={[
                0,
                dimensions.height * scale * 0.5,
                dimensions.depth * scale * 0.501,
              ]}
            >
              <boxGeometry
                args={[
                  dimensions.width * scale * 0.8,
                  dimensions.height * scale * 0.15,
                  0.1,
                ]}
              />
              <meshStandardMaterial color={shade(item.color, 10)} />
            </mesh>
            <mesh
              position={[
                0,
                dimensions.height * scale * 0.3,
                dimensions.depth * scale * 0.501,
              ]}
            >
              <boxGeometry
                args={[
                  dimensions.width * scale * 0.8,
                  dimensions.height * scale * 0.15,
                  0.1,
                ]}
              />
              <meshStandardMaterial color={shade(item.color, 10)} />
            </mesh>
            {/* Handles */}
            <mesh
              position={[
                0,
                dimensions.height * scale * 0.7,
                dimensions.depth * scale * 0.552,
              ]}
            >
              <boxGeometry
                args={[
                  dimensions.width * scale * 0.2,
                  dimensions.height * scale * 0.03,
                  0.1,
                ]}
              />
              <meshStandardMaterial color={shade(item.color, -30)} />
            </mesh>
            <mesh
              position={[
                0,
                dimensions.height * scale * 0.5,
                dimensions.depth * scale * 0.552,
              ]}
            >
              <boxGeometry
                args={[
                  dimensions.width * scale * 0.2,
                  dimensions.height * scale * 0.03,
                  0.1,
                ]}
              />
              <meshStandardMaterial color={shade(item.color, -30)} />
            </mesh>
            <mesh
              position={[
                0,
                dimensions.height * scale * 0.3,
                dimensions.depth * scale * 0.552,
              ]}
            >
              <boxGeometry
                args={[
                  dimensions.width * scale * 0.2,
                  dimensions.height * scale * 0.03,
                  0.1,
                ]}
              />
              <meshStandardMaterial color={shade(item.color, -30)} />
            </mesh>
          </group>
        );

      default:
        return (
          <mesh>
            <boxGeometry
              args={[
                dimensions.width * scale,
                dimensions.height * scale,
                dimensions.depth * scale,
              ]}
            />
            <meshStandardMaterial color={item.color} />
          </mesh>
        );
    }
  };

  // Utility function to shade colors
  const shade = (hex, percent) => {
    // Convert hex to RGB
    let r = parseInt(hex.substring(1, 3), 16);
    let g = parseInt(hex.substring(3, 5), 16);
    let b = parseInt(hex.substring(5, 7), 16);

    // Adjust brightness
    r = Math.max(0, Math.min(255, r + percent));
    g = Math.max(0, Math.min(255, g + percent));
    b = Math.max(0, Math.min(255, b + percent));

    // Convert back to hex
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
  };

  // Display grid cell size
  const GridSizeDisplay = () => {
    if (!showGrid) return null;

    return (
      <Html position={[-width / 2 + 20, 0.1, -depth / 2 + 20]}>
        <div
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            padding: "2px 8px",
            borderRadius: "4px",
            fontSize: "10px",
            fontWeight: "500",
            color: "#444",
            boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
          }}
        >
          Grid: {gridSize}cm × {gridSize}cm
        </div>
      </Html>
    );
  };

  return (
    <group ref={groupRef}>
      {/* Room floor */}
      {renderCustomFloor()}

      {/* Grid */}
      {renderGrid()}

      {/* Room outline */}
      {renderRoomShape()}

      {/* Room walls */}
      {renderRoomWalls()}

      {/* Ceiling (semi-transparent) */}
      <mesh position={[0, height, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[width, depth]} />
        <meshStandardMaterial
          color={wallColor || "#ffffff"}
          opacity={0.2}
          transparent
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Grid size display */}
      <GridSizeDisplay />

      {/* Furniture items */}
      {furniture.map((item) => {
        const isSelected = item.id === selectedItem;

        return (
          <group
            key={item.id}
            position={[
              -width / 2 + item.position.x,
              item.position.y,
              -depth / 2 + item.position.z,
            ]}
            rotation={[0, THREE.MathUtils.degToRad(item.rotation || 0), 0]}
            onClick={(e) => {
              e.stopPropagation();
              setSelectedItem(item.id);
            }}
            onPointerDown={(e) => {
              startDragging(e, item.id);
              registerEventHandlers();
            }}
          >
            {renderFurnitureModel(item)}

            {/* Selection outline */}
            {isSelected && (
              <lineSegments>
                <edgesGeometry attach="geometry">
                  <boxGeometry
                    args={[
                      item.dimensions.width * (item.scale || 1) + 0.5,
                      item.dimensions.height * (item.scale || 1) + 0.5,
                      item.dimensions.depth * (item.scale || 1) + 0.5,
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
              position={[0, item.dimensions.height * (item.scale || 1) + 10, 0]}
            >
              <div
                style={{
                  backgroundColor: isSelected
                    ? "#4f46e5"
                    : "rgba(0, 0, 0, 0.5)",
                  color: "white",
                  padding: "3px 8px",
                  borderRadius: "4px",
                  fontSize: "12px",
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
        );
      })}
    </group>
  );
};

export default Room3D;
