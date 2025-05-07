// ikae/src/scenes/RoomEditor/components/Room2D.jsx
import { useRef, useEffect, useState } from 'react';
import { useThree } from '@react-three/fiber';
import { OrbitControls, Text, TransformControls } from '@react-three/drei';
import FurnitureItem from './FurnitureItem';
import * as THREE from 'three';
import {
  floorColor,
  borderColor,
  floorRoughness,
  floorMetalness,
  lights
} from './RoomTheme';

export default function Room2D({
  roomSize,             // Object defining room dimensions (currently unused in 2D directly for floor/wall generation but might be for context)
  furniture,            // Array of furniture items to render
  selectedItem,         // ID of the currently selected furniture item
  setSelectedItem,      // Function to update the selected item
  showDimensions,       // Boolean to control visibility of dimension lines
  vertexes,             // Array of [x, y, z] points defining the floor polygon corners
  setVertexes,          // Function to update the vertexes (e.g., when resizing)
  isGizmoActive,        // Boolean indicating if the transform gizmo is active
  gizmoMode,            // Current mode of the gizmo ('translate', 'rotate', 'scale')
  updateFurniture,      // Function to update furniture properties (position, rotation, scale)
}) {
  const [isDraggingVertex, setIsDraggingVertex] = useState(false);
  const [draggedHandle, setDraggedHandle] = useState(null);
  const dragStartRef = useRef({ vertexes: [], index: null });
  const groupRef = useRef();
  const orbitControlsRef = useRef();
  const transformControlsRef = useRef();
  const { camera, gl, scene } = useThree();
  const [selectedObject, setSelectedObject] = useState(null);

  // --- 2D camera setup ---
  useEffect(() => {
    camera.position.set(0, 20, 0);
    camera.lookAt(0, 0, 0);
    camera.up.set(0, 0, -1); // Ensure Z is up for 2D top-down view
    camera.updateProjectionMatrix();

    if (orbitControlsRef.current) {
      orbitControlsRef.current.target.set(0, 0, 0);
      orbitControlsRef.current.enableRotate = false; // Disable rotation for 2D
      orbitControlsRef.current.mouseButtons = {
        LEFT: null, // Disable default left-click drag for orbit
        MIDDLE: THREE.MOUSE.DOLLY, // Middle mouse for zoom
        RIGHT: THREE.MOUSE.PAN    // Right mouse for pan
      };
      orbitControlsRef.current.touches = {
        ONE: THREE.TOUCH.PAN,      // One-finger touch for pan
        TWO: THREE.TOUCH.DOLLY_PAN // Two-finger touch for zoom/pan
      };
      orbitControlsRef.current.update();
    }
  }, [camera]);

  // --- track which mesh is selected ---
  useEffect(() => {
    let foundObject = null;
    if (selectedItem !== null && furniture.length > 0) {
      scene.traverse((object) => {
        // Assuming FurnitureItem sets userData.itemId
        if (object.userData?.itemId === selectedItem) {
          foundObject = object;
        }
      });
      setSelectedObject(foundObject);
    } else {
      setSelectedObject(null);
    }
  }, [selectedItem, scene, furniture]);

  // --- after any transform, push updates back to your store ---
  const handleTransformEnd = () => {
    if (!selectedObject || !updateFurniture || selectedItem === null) return;

    const newPosition = {
      x: selectedObject.position.x,
      y: 0, // Keep y at 0 for 2D plane
      z: selectedObject.position.z
    };
    const newRotation = selectedObject.rotation.y; // Rotation around Y-axis
    const newUpdates = {
      position: newPosition,
      rotation: newRotation
    };

    // Scale case
    if (gizmoMode === 'scale') {
      newUpdates.scale = {
        x: selectedObject.scale.x,
        y: selectedObject.scale.y,
        z: selectedObject.scale.z
      };
    }

    updateFurniture(selectedItem, newUpdates);
  };

  // --- disable orbit while gizmo dragging ---
  useEffect(() => {
    const tcInstance = transformControlsRef.current; // Capture the instance when the effect runs
    const ocInstance = orbitControlsRef.current;   // Capture the instance

    if (tcInstance && ocInstance) { // Only proceed if both refs are valid
      const draggingChangedCallback = (event) => {
        // event.value is true if dragging, false otherwise
        ocInstance.enabled = !event.value;
      };

      tcInstance.addEventListener('dragging-changed', draggingChangedCallback);

      // Cleanup function:
      return () => {
        // Use the captured tcInstance to remove the listener.
        tcInstance.removeEventListener('dragging-changed', draggingChangedCallback);
      };
    }
    // If tcInstance or ocInstance is null (e.g., TransformControls unmounted), 
    // this effect does nothing for the current render, and no cleanup is registered for this specific run.
    // The cleanup from a *previous* run (where tcInstance was valid) will still execute correctly.
  }, [selectedObject]); // Re-run this effect if selectedObject changes.

  // --- Corner-resize handles & dimension lines ---
  const DimensionLine = ({ start, end, value, isVertical }) => (
    <group>
      <line>
        <bufferGeometry attach="geometry">
          <float32BufferAttribute
            attach="attributes-position"
            args={[new Float32Array([...start, ...end]), 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial attach="material" color="black" />
      </line>
      <Text
        position={[
          (start[0] + end[0]) / 2,
          0.1, // Slightly above the floor
          (start[2] + end[2]) / 2
        ]}
        rotation={[
          isVertical ? Math.PI / 2 : -Math.PI / 2, // Orient text based on line direction
          isVertical ? Math.PI : 0,
          isVertical ? Math.PI / 2 : 0
        ]}
        fontSize={0.3}
        color="black"
        anchorX="center"
        anchorY="bottom"
      >
        {`${value}m`}
      </Text>
    </group>
  );

  const CornerHandle = ({ position, index }) => {
    const onDown = (e) => {
      e.stopPropagation(); // Prevent other click events
      setIsDraggingVertex(true);
      setDraggedHandle(index);
      // Store initial vertexes state at drag start to avoid mutation issues
      dragStartRef.current = {
        vertexes: vertexes.map(v => [...v]), // Deep copy
        index
      };

      const move = (mv) => {
        const rect = gl.domElement.getBoundingClientRect();
        // Convert mouse position to normalized device coordinates
        const x = ((mv.clientX - rect.left) / rect.width) * 2 - 1;
        const y = -((mv.clientY - rect.top) / rect.height) * 2 + 1;

        // Raycast to find intersection with the XZ plane (y=0)
        const ray = new THREE.Raycaster().setFromCamera({ x, y }, camera);
        const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0); // XZ plane
        const inter = new THREE.Vector3();
        ray.ray.intersectPlane(plane, inter);

        // Update only the dragged vertex based on its initial state
        const updated = dragStartRef.current.vertexes.map((v, i) =>
          i === dragStartRef.current.index
            ? [inter.x, 0, inter.z] // Keep y at 0
            : v
        );
        setVertexes(updated);
      };

      const up = () => {
        setIsDraggingVertex(false);
        setDraggedHandle(null);
        window.removeEventListener('mousemove', move);
        window.removeEventListener('mouseup', up);
      };

      window.addEventListener('mousemove', move);
      window.addEventListener('mouseup', up);
    };

    return (
      <mesh position={position} onPointerDown={onDown}>
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <meshBasicMaterial
          color={draggedHandle === index ? '#4a9eff' : '#aa2222'} // Highlight color when dragged
          opacity={0.8}
          transparent
        />
      </mesh>
    );
  };

  const BorderedFloor = () => (
    <group>
      {/* Floor Border */}
      <lineLoop>
        <bufferGeometry attach="geometry">
          <float32BufferAttribute
            attach="attributes-position"
            args={[new Float32Array(vertexes.flat()), 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial attach="material" color={borderColor} linewidth={2} />
      </lineLoop>
      {/* Floor Mesh */}
      <mesh>
        <bufferGeometry attach="geometry">
          <float32BufferAttribute
            attach="attributes-position"
            args={[new Float32Array(vertexes.flat()), 3]}
          />
          {/* Define indices for a quad (assuming 4 vertices) */}
          <bufferAttribute
            attach="index"
            count={6}
            array={new Uint16Array([0, 1, 2, 0, 2, 3])}
            itemSize={1}
          />
        </bufferGeometry>
        <meshStandardMaterial
          color={floorColor}
          roughness={floorRoughness}
          metalness={floorMetalness}
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* Corner Handles for resizing */}
      {vertexes.map((v, i) => (
        <CornerHandle key={i} position={v} index={i} />
      ))}
    </group>
  );

  return (
    <group ref={groupRef}>
      {/* Lights */}
      {lights(20)} {/* Assuming lights function provides appropriate lighting */}

      {/* Floor */}
      <BorderedFloor />

      {/* Furniture items */}
      {furniture.map(item => (
        <FurnitureItem
          key={item.id}
          id={item.id} // Pass id for selection tracking via userData
          item={item}
          is2D // Prop to tell FurnitureItem to render its 2D representation
          isSelected={selectedItem === item.id}
          onClick={() => setSelectedItem(item.id)}
        />
      ))}

      {/* Transform Gizmo for selected item */}
      {selectedObject && isGizmoActive && (
        <TransformControls
          ref={transformControlsRef}
          object={selectedObject}
          mode={gizmoMode}
          showX={gizmoMode === 'translate' || gizmoMode === 'scale'}
          showY={gizmoMode === 'rotate'}
          showZ={gizmoMode === 'translate' || gizmoMode === 'scale'}
          size={0.75}
          onMouseUp={handleTransformEnd} 
          depthTest={false} 
        />
      )}

      {/* Dimension Lines */}
      {showDimensions && vertexes.length === 4 && ( 
        <>
          <DimensionLine
            start={vertexes[1]}
            end={vertexes[0]}
            value={Math.abs(vertexes[0][0] - vertexes[1][0]).toFixed(2)}
            isVertical={false}
          />
          <DimensionLine
            start={vertexes[0]}
            end={vertexes[3]}
            value={Math.abs(vertexes[0][2] - vertexes[3][2]).toFixed(2)}
            isVertical={true}
          />
        </>
      )}

      {/* Orbit Controls for camera manipulation */}
      <OrbitControls
        ref={orbitControlsRef}
        enabled={!isGizmoActive && !isDraggingVertex} 
        enableRotate={false} 
        enableZoom
        enablePan
        zoomSpeed={0.5}
        panSpeed={0.5}
        screenSpacePanning 
      />
    </group>
  );
}