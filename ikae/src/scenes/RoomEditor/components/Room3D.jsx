import { useRef, useState, useEffect, useEffect } from 'react';
import * as THREE from 'three';
import FurnitureItem from './FurnitureItem';
import { floorColor, wallColor, floorRoughness, floorMetalness, wallRoughness, wallMetalness, lights, useFloorMaterialProps, useWallMaterialProps } from './RoomTheme';
import { TransformControls } from '@react-three/drei'; // Keep this import
import { useThree } from '@react-three/fiber';

// Import GizmoHelper/Viewport if you want the orientation aid in the corner (Optional but recommended)
import { GizmoHelper, GizmoViewport } from '@react-three/drei';

export default function Room3D({ roomSize, furniture, selectedItem, setSelectedItem, vertexes, skirtingHeight = 0.2, updateFurniture, isGizmoActive, gizmoMode  }) {
  const groupRef = useRef();
  const height = -1; // This 'height' is passed to the 'lights' function from RoomTheme
  const tiling = 0.5; // Change this value to control tiling
  const floorMaterialProps = useFloorMaterialProps(tiling);
  const wallMaterialProps = useWallMaterialProps(2); // Adjust tiling as needed

  const floorGeometryRef = useRef();

  const { scene, controls } = useThree(); // Get scene and orbit controls

  const [selectedObject, setSelectedObject] = useState(null);
  const transformControlsRef = useRef();

  // Find the selected object using userData.itemId
  useEffect(() => {
    let foundObject = null;
    if (selectedItem !== null) {
      const currentItem = furniture.find(f => f.id === selectedItem); // Get current item details
      scene.traverse((object) => {
        // Attempt to match by userData.itemId first
        if (object.userData.itemId === selectedItem) {
          foundObject = object;
        } 
        // Fallback: if no userData match and currentItem exists, try finding by generated name
        // This is less reliable if names are not perfectly unique or if userData.itemId is always set
        else if (!foundObject && currentItem && object.name === `Furniture-${currentItem.type}-${selectedItem}`) {
            // foundObject = object; // Be cautious with this fallback
        }
      });
      setSelectedObject(foundObject);
    } else {
      setSelectedObject(null);
    }
    if (floorGeometryRef.current) {
      floorGeometryRef.current.computeVertexNormals();
    }
  }, [vertexes, selectedItem, scene, furniture]);


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
      return (
        <mesh
          key={i}
          position={[(v1a[0] + v2a[0] + v1b[0] + v2b[0]) / 4, roomSize.height / 2, (v1a[2] + v2a[2] + v1b[2] + v2b[2]) / 4]}
          rotation={[0, -angle, 0]}
        >
          <boxGeometry args={[length, roomSize.height, WALL_THICKNESS]} />
          <meshStandardMaterial {...wallMaterialProps} />
        </mesh>
      );
    });
  };

  // Skirting meshes along the bottom of each wall
  const SkirtingMeshes = ({ vertexes, skirtingHeight = 0.1 }) => {
    const normals = getEdgeNormals(vertexes);
    return vertexes.map((v, i) => {
      const v1 = v;
      const v2 = vertexes[(i + 1) % vertexes.length];
      const n = normals[i];
      // Offset both sides for skirting
      const v1a = offsetPoint(v1, n, WALL_THICKNESS / 2);
      const v2a = offsetPoint(v2, n, WALL_THICKNESS / 2);
      const cx = (v1[0] + v2[0]) / 2;
      const cz = (v1[2] + v2[2]) / 2;
      const length = Math.sqrt((v2[0] - v1[0]) ** 2 + (v2[2] - v1[2]) ** 2);
      const angle = Math.atan2(v2[2] - v1[2], v2[0] - v1[0]);
      if (length === 0) return null;
      const wallVertexes = [v1a, v2a, v2b, v1b];
      return (
        <mesh
          key={i}
          position={[
            (v1a[0] + v2a[0]) / 2,
            skirtingHeight / 2, // Place at bottom, just above floor
            (v1a[2] + v2a[2]) / 2
          ]}
          rotation={[0, -angle, 0]}
        >
          <boxGeometry args={[length, skirtingHeight, WALL_THICKNESS]} />
          <meshStandardMaterial color="#ffe4c4" metalness={0.1} roughness={0.6} />
        </mesh>
      );
    });
  };
  // --- END Wall Generation Code ---


  return (
    <>
      <group ref={groupRef}>
        {/* This 'lights' call is from RoomTheme.jsx. 
            The main scene shadows are primarily handled by the light in RoomEditor.jsx.
            Ensure floorColor is a light color and intensities here are balanced.
        */}
        {lights(height)}

      {/* Floor polygon */}
      <mesh position={[0, 0, 0]} receiveShadow>
        <bufferGeometry ref={floorGeometryRef} attach="geometry">
          <float32BufferAttribute attach="attributes-position" args={[new Float32Array(vertexes.flat()), 3]} />
          <float32BufferAttribute
            attach="attributes-uv"
            args={[
              new Float32Array(getWorldUVs(vertexes, tiling)),
              2,
            ]}
          />
          <float32BufferAttribute
            attach="attributes-uv2"
            args={[
              new Float32Array(getWorldUVs(vertexes, tiling)),
              2,
            ]}
          />
          <bufferAttribute attach="index" count={6} array={new Uint16Array([0, 1, 2, 0, 2, 3])} itemSize={1} />
        </bufferGeometry>
        <meshStandardMaterial {...floorMaterialProps} />
      </mesh>

        {/* Walls */}
        <WallMeshes vertexes={vertexes} />

      {/* Skirting */}
      <SkirtingMeshes vertexes={vertexes} skirtingHeight={skirtingHeight} />

        {/* Furniture items */}
        {furniture.map(item => (
          <FurnitureItem
            key={item.id}
            id={item.id} 
            item={item}
            is2D={false}
            isSelected={selectedItem === item.id}
            onClick={() => setSelectedItem(item.id)} 
          />
        ))}

        {/* Gizmo */}
        {selectedObject && (
          <TransformControls
            ref={transformControlsRef}
            object={selectedObject}
            mode={gizmoMode}
            space="local" 
            depthTest={false} 
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