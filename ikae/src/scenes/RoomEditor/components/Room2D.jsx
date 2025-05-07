// src/scenes/RoomEditor/components/Room2D.jsx
import { useRef, useEffect, useState } from 'react';
import { useThree } from '@react-three/fiber';
import { OrbitControls, Text, TransformControls } from '@react-three/drei';
import FurnitureItem from './FurnitureItem';
import * as THREE from 'three';
import { floorColor, borderColor, floorRoughness, floorMetalness, lights } from './RoomTheme';

export default function Room2D({
  roomSize, // roomSize might not be directly used if vertexes define the room
  furniture,
  selectedItem,
  setSelectedItem,
  showDimensions,
  // setRoomSize, // Kept if room dimensions are directly editable here, otherwise vertexes control size
  vertexes,
  setVertexes,
  isGizmoActive,
  gizmoMode,
  updateFurniture,
}) {
  const [isDraggingVertex, setIsDraggingVertex] = useState(false);
  const [draggedHandle, setDraggedHandle] = useState(null);
  const dragStartRef = useRef({ vertexes: [], index: null }); // For vertex dragging
  const groupRef = useRef();
  const orbitControlsRef = useRef(); // Renamed from controlsRef to be specific
  const transformControlsRef = useRef();
  const { camera, gl, scene } = useThree();

  const [selectedObject, setSelectedObject] = useState(null);

  // Setup camera for 2D top-down view
  useEffect(() => {
    camera.position.set(0, 20, 0); // Position camera above the scene
    camera.lookAt(0, 0, 0);      // Look at the center of the scene
    camera.up.set(0, 0, -1);     // Orient Z as "up" on the screen for XZ plane
    camera.updateProjectionMatrix();
    if (orbitControlsRef.current) {
      orbitControlsRef.current.target.set(0, 0, 0);
      orbitControlsRef.current.enableRotate = false; // Disable rotation
      orbitControlsRef.current.mouseButtons = { // Customize mouse buttons for 2D panning/zooming
        LEFT: null, // Free left mouse for selection/gizmo
        MIDDLE: THREE.MOUSE.DOLLY, // Middle mouse for zoom
        RIGHT: THREE.MOUSE.PAN     // Right mouse for pan
      };
      orbitControlsRef.current.touches = { // Customize touch controls
        ONE: THREE.TOUCH.PAN,
        TWO: THREE.TOUCH.DOLLY_PAN
      };
      orbitControlsRef.current.update();
    }
  }, [camera]);

  // Find the selected 3D object in the scene based on selectedItem (ID)
  useEffect(() => {
    let foundObject = null;
    if (selectedItem !== null && furniture.length > 0) {
      scene.traverse((object) => {
        if (object.userData && object.userData.itemId === selectedItem) {
          foundObject = object;
        }
      });
      setSelectedObject(foundObject);
    } else {
      setSelectedObject(null);
    }
  }, [selectedItem, scene, furniture]);

  // Handle gizmo transformation end
  const handleTransformEnd = () => {
    if (selectedObject && updateFurniture && selectedItem !== null) {
      const newPosition = { x: selectedObject.position.x, y: 0, z: selectedObject.position.z };
      const newRotation = selectedObject.rotation.y; // Rotation around Y-axis for 2D
      // --- START: Handle scale if gizmoMode is 'scale' ---
      let newUpdates = { position: newPosition, rotation: newRotation };
      if (gizmoMode === 'scale') {
        // Assuming uniform scaling or specific 2D scaling logic might be needed
        // For simple box geometry, scale directly affects dimensions
        // For GLB, it's more complex. This example assumes direct scale update.
        const newScale = { x: selectedObject.scale.x, y: selectedObject.scale.y, z: selectedObject.scale.z };
        // You might want to update a 'scale' property in your furniture item's data
        // And then FurnitureItem should apply this scale
        newUpdates.scale = newScale; // Add this if your item data supports scale
      }
      // --- END: Handle scale ---
      updateFurniture(selectedItem, newUpdates);
    }
  };

  // Disable orbit controls when gizmo is being dragged
  useEffect(() => {
    if (transformControlsRef.current && orbitControlsRef.current) {
      const controls = transformControlsRef.current;
      const callback = (event) => {
        orbitControlsRef.current.enabled = !event.value;
      };
      controls.addEventListener('dragging-changed', callback);
      return () => controls.removeEventListener('dragging-changed', callback);
    }
  }, [selectedObject]); // Re-run if selectedObject changes, ensuring listener is on current gizmo

  const DimensionLine = ({ start, end, value, isVertical }) => {
    const position = [
      (start[0] + end[0]) / 2,
      0.1, // Slightly above the floor
      (start[2] + end[2]) / 2
    ];

    return (
      <group>
        <line>
          <bufferGeometry attach="geometry">
            <float32BufferAttribute attach="attributes-position" args={[new Float32Array([...start, ...end]), 3]} />
          </bufferGeometry>
          <lineBasicMaterial attach="material" color="black" />
        </line>
        <Text
          position={position}
          rotation={[isVertical ? Math.PI / 2 : -Math.PI / 2, isVertical ? Math.PI : 0, isVertical ? Math.PI / 2 : 0]}
          fontSize={0.3}
          color="black"
          anchorX="center"
          anchorY="bottom"
        >
          {`${value}m`}
        </Text>
      </group>
    );
  };

  const CornerHandle = ({ position, index }) => {
    const handlePointerDown = (e) => {
      e.stopPropagation(); // Prevent interference with furniture selection or gizmo
      setIsDraggingVertex(true);
      setDraggedHandle(index);
      dragStartRef.current = {
        vertexes: vertexes.map(v => [...v]), // Create a deep copy for dragging
        index,
      };

      const handleMove = (moveEvent) => {
        const rect = gl.domElement.getBoundingClientRect();
        const x = ((moveEvent.clientX - rect.left) / rect.width) * 2 - 1;
        const y = -((moveEvent.clientY - rect.top) / rect.height) * 2 + 1;

        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera({ x, y }, camera);
        const floorPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0); // Assuming floor is at Y=0
        const intersection = new THREE.Vector3();
        raycaster.ray.intersectPlane(floorPlane, intersection);

        const newVertexes = dragStartRef.current.vertexes.map((v, i) =>
          i === dragStartRef.current.index ? [intersection.x, 0, intersection.z] : v
        );
        setVertexes(newVertexes);
      };

      const handleUp = () => {
        setIsDraggingVertex(false);
        setDraggedHandle(null);
        window.removeEventListener('mousemove', handleMove);
        window.removeEventListener('mouseup', handleUp);
      };

      window.addEventListener('mousemove', handleMove);
      window.addEventListener('mouseup', handleUp);
    };

    return (
      <mesh position={position} onPointerDown={handlePointerDown}>
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <meshBasicMaterial color={draggedHandle === index ? '#4a9eff' : '#aa2222'} opacity={0.8} transparent />
      </mesh>
    );
  };

  const BorderedFloor = () => (
    <group>
      <lineLoop>
        <bufferGeometry attach="geometry">
          <float32BufferAttribute attach="attributes-position" args={[new Float32Array(vertexes.flat()), 3]} />
        </bufferGeometry>
        <lineBasicMaterial attach="material" color={borderColor} linewidth={2} />
      </lineLoop>
      <mesh>
        <bufferGeometry attach="geometry">
          <float32BufferAttribute attach="attributes-position" args={[new Float32Array(vertexes.flat()), 3]} />
          <bufferAttribute attach="index" count={6} array={new Uint16Array([0, 1, 2, 0, 2, 3])} itemSize={1} />
        </bufferGeometry>
        <meshStandardMaterial
          color={floorColor}
          roughness={floorRoughness}
          metalness={floorMetalness}
          side={THREE.DoubleSide}
        />
      </mesh>
      {vertexes.map((v, i) => (
        <CornerHandle key={i} position={v} index={i} />
      ))}
    </group>
  );

  return (
    <group ref={groupRef}>
      {lights(20)} {/* Adjust light height if needed for 2D */}
      <BorderedFloor />

      {furniture.map(item => (
        <FurnitureItem
          key={item.id}
          id={item.id} // Critical for identifying the object
          item={item}
          is2D={true} // For 2D specific rendering if any
          isSelected={selectedItem === item.id}
          onClick={() => setSelectedItem(item.id)} // Calls handleSelectItem in RoomEditor
        />
      ))}

      {selectedObject && isGizmoActive && (
        <TransformControls
          ref={transformControlsRef}
          object={selectedObject}
          mode={gizmoMode}
          // Constrain gizmo for 2D view
          showX={gizmoMode === 'translate' || gizmoMode === 'scale'}
          showY={false} // Typically no Y-axis movement/rotation in 2D floor plan
          showZ={gizmoMode === 'translate' || gizmoMode === 'scale'}
          // For rotation, it will rotate around the object's Y-axis
          size={0.75}
          onMouseUp={handleTransformEnd}
          // Optional: disable depth test for better visibility in ortho view
          depthTest={false}
        />
      )}

      {showDimensions && vertexes.length === 4 && ( // Ensure vertexes exist and is a quad
        <>
          <DimensionLine start={vertexes[1]} end={vertexes[0]} value={Math.abs(vertexes[0][0] - vertexes[1][0]).toFixed(2)} isVertical={false} />
          <DimensionLine start={vertexes[0]} end={vertexes[3]} value={Math.abs(vertexes[0][2] - vertexes[3][2]).toFixed(2)} isVertical={true} />
        </>
      )}

      <OrbitControls
        ref={orbitControlsRef}
        enabled={!isGizmoActive && !isDraggingVertex} // Disable when gizmo or vertex is active
        enableRotate={false}
        enableZoom={true}
        enablePan={true}
        zoomSpeed={0.5}
        panSpeed={0.5}
        screenSpacePanning={true}
        // Mouse buttons already configured in useEffect
      />
    </group>
  );
}