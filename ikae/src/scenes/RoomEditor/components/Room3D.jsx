import { useRef, useState, useEffect } from 'react';
import * as THREE from 'three';
import FurnitureItem from './FurnitureItem';
import { floorColor, wallColor, floorRoughness, floorMetalness, wallRoughness, wallMetalness, lights } from './RoomTheme';
import { TransformControls } from '@react-three/drei'; // Keep this import
import { useThree } from '@react-three/fiber';

// Import GizmoHelper/Viewport if you want the orientation aid in the corner (Optional but recommended)
import { GizmoHelper, GizmoViewport } from '@react-three/drei';

export default function Room3D({
  roomSize,
  furniture,
  selectedItem,
  setSelectedItem, // Use the central handler passed from RoomEditor
  vertexes,
  updateFurniture,   // Receive central update function
  isGizmoActive,     // Receive gizmo active state
  gizmoMode          // Receive current gizmo mode
}) {
  const groupRef = useRef();
  const height = -1;
  const { scene, controls } = useThree(); // Get scene and orbit controls

  const [selectedObject, setSelectedObject] = useState(null);
  const transformControlsRef = useRef();

  // Find the selected object using userData.itemId
  useEffect(() => {
    let foundObject = null;
    if (selectedItem !== null) {
      scene.traverse((object) => {
        if (object.userData.itemId === selectedItem) {
          foundObject = object;
        }
      });
      setSelectedObject(foundObject);
    } else {
      setSelectedObject(null);
    }
  }, [selectedItem, scene, furniture]);


  // Handler to update state when transform ends
  const handleTransformEnd = () => {
    if (selectedObject && updateFurniture && selectedItem !== null) {
        const newPosition = { x: selectedObject.position.x, y: selectedObject.position.y, z: selectedObject.position.z };
        const newRotation = selectedObject.rotation.y;
        const furnitureItemData = furniture.find(f => f.id === selectedItem);
        if (furnitureItemData?.glb) { newPosition.y = 0; }
        updateFurniture(selectedItem, { position: newPosition, rotation: newRotation });
    }
  };

  // --- Wall Generation Code (Ensure it's inside component scope) ---
  function offsetPoint([x, y, z], normal, distance) { return [x + normal.x * distance, y, z + normal.z * distance]; }
  function getEdgeNormals(vertexes) { const normals = []; for (let i = 0; i < vertexes.length; i++) { const v1 = vertexes[i]; const v2 = vertexes[(i + 1) % vertexes.length]; const dx = v2[0] - v1[0]; const dz = v2[2] - v1[2]; const len = Math.sqrt(dx * dx + dz * dz); if (len > 0) { normals.push({ x: -dz / len, z: dx / len }); } else { normals.push({ x: 0, z: 0 }); } } return normals; }
  const WALL_THICKNESS = 0.1;
  const WallMeshes = ({ vertexes }) => {
    const normals = getEdgeNormals(vertexes);
    return vertexes.map((v, i) => {
      const v1 = v; const v2 = vertexes[(i + 1) % vertexes.length]; const n = normals[i];
      const v1a = offsetPoint(v1, n, WALL_THICKNESS / 2); const v1b = offsetPoint(v1, n, -WALL_THICKNESS / 2);
      const v2a = offsetPoint(v2, n, WALL_THICKNESS / 2); const v2b = offsetPoint(v2, n, -WALL_THICKNESS / 2);
      const length = Math.sqrt((v2[0] - v1[0]) ** 2 + (v2[2] - v1[2]) ** 2);
      const angle = Math.atan2(v2[2] - v1[2], v2[0] - v1[0]);
      if (length === 0) return null;
      return (
        <mesh key={i} position={[(v1a[0] + v2a[0] + v1b[0] + v2b[0]) / 4, roomSize.height / 2, (v1a[2] + v2a[2] + v1b[2] + v2b[2]) / 4]} rotation={[0, -angle, 0]} castShadow receiveShadow >
          <boxGeometry args={[length, roomSize.height, WALL_THICKNESS]} />
          <meshStandardMaterial color={wallColor} roughness={wallRoughness} metalness={wallMetalness} />
        </mesh>
      );
    });
  };
  // --- END Wall Generation Code ---


  return (
    <>
      <group ref={groupRef}>
        {lights(height)}

        {/* Floor polygon */}
        <mesh position={[0, 0, 0]} receiveShadow>
          <bufferGeometry attach="geometry">
            <float32BufferAttribute attach="attributes-position" args={[new Float32Array(vertexes.flat()), 3]} />
            <bufferAttribute attach="index" count={6} array={new Uint16Array([0, 1, 2, 0, 2, 3])} itemSize={1} />
          </bufferGeometry>
          <meshStandardMaterial color={floorColor} roughness={floorRoughness} metalness={floorMetalness} transparent={false} side={THREE.DoubleSide} />
        </mesh>

        {/* Walls */}
        <WallMeshes vertexes={vertexes} />

        {/* Furniture items */}
        {furniture.map(item => (
          <FurnitureItem
            key={item.id}
            id={item.id} // Pass id for userData assignment
            item={item}
            is2D={false}
            isSelected={selectedItem === item.id}
            onClick={() => setSelectedItem(item.id)} // Use central handler
          />
        ))}

        {/* Gizmo */}
        {selectedObject && (
          <TransformControls
            ref={transformControlsRef}
            object={selectedObject}
            mode={gizmoMode}
            // --- START: Force Local Space ---
            space="local" // Force gizmo to always use object's local space
            // --- END: Force Local Space ---
            depthTest={false} // Keep this for visibility
            enabled={isGizmoActive}
            showX={isGizmoActive}
            showY={isGizmoActive}
            showZ={isGizmoActive}
            onMouseUp={handleTransformEnd}
            onDraggingChanged={(event) => {
              if (controls) controls.enabled = !event.value;
            }}
          />
        )}
      </group>

       {/* Keep GizmoHelper for world orientation reference */}
       <GizmoHelper alignment="bottom-right" margin={[80, 80]}>
           <GizmoViewport axisColors={['#ff3030', '#30ff30', '#3030ff']} labelColor="black" />
       </GizmoHelper>
    </>
  );
}