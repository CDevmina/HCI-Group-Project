import { useRef, useEffect, useState } from 'react';
import { useThree } from '@react-three/fiber';
import { OrbitControls, Text, TransformControls } from '@react-three/drei';
import FurnitureItem from './FurnitureItem';
import * as THREE from 'three';
import {
  lights, 
  floorColor,
  borderColor,
  floorRoughness,
  floorMetalness,
} from './RoomTheme';

export default function Room2D({
  roomSize,
  furniture,
  selectedItem,
  setSelectedItem,
  showDimensions,
  vertexes,      
  setVertexes,   
  isGizmoActive,
  gizmoMode,
  updateFurniture,
}) {
  // States and Refs from legacy code for vertex dragging
  const [isDraggingVertex, setIsDraggingVertex] = useState(false); // Renamed from isDragging for clarity
  const [draggedHandle, setDraggedHandle] = useState(null);
  const dragStartRef = useRef({ vertexes: [], index: null });
  
  const groupRef = useRef();
  const orbitControlsRef = useRef(); // Use this ref for OrbitControls
  const controlsRef = useRef();
  const transformControlsRef = useRef();
  const { camera, gl, scene } = useThree();
  const [selectedObject, setSelectedObject] = useState(null);

  // --- 2D camera setup ---
  useEffect(() => {
    camera.position.set(0, 20, 0);
    camera.lookAt(0, 0, 0);
    camera.up.set(0, 0, -1); 
    camera.updateProjectionMatrix();

    if (controlsRef.current) {
      controlsRef.current.target.set(0, 0, 0);
      controlsRef.current.update();
    }
  }, [camera]);

  // --- track which mesh is selected for gizmo ---
  useEffect(() => {
    let foundObject = null;
    if (selectedItem !== null && furniture.length > 0) {
      scene.traverse((object) => {
        if (object.userData?.itemId === selectedItem) {
          foundObject = object;
        }
      });
      setSelectedObject(foundObject);
    } else {
      setSelectedObject(null);
    }
  }, [selectedItem, scene, furniture]);

  // --- after any furniture transform, push updates back to your store ---
  const handleTransformEnd = () => {
    if (!selectedObject || !updateFurniture || selectedItem === null) return;
    const newPosition = {
      x: selectedObject.position.x,
      y: 0, 
      z: selectedObject.position.z
    };
    const newRotation = selectedObject.rotation.y; 
    const newUpdates = { position: newPosition, rotation: newRotation };
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
    const tcInstance = transformControlsRef.current;
    const ocInstance = orbitControlsRef.current;

    if (tcInstance && ocInstance) {
      const draggingChangedCallback = (event) => {
        ocInstance.enabled = !event.value;
      };
      tcInstance.addEventListener('dragging-changed', draggingChangedCallback);
      return () => {
        tcInstance.removeEventListener('dragging-changed', draggingChangedCallback);
      };
    }
  }, [selectedObject]);


  // --- DimensionLine Component (from legacy, adapted) ---
  const DimensionLine = ({ start, end, value, isVertical }) => {
    const textPosition = [
      (start[0] + end[0]) / 2,
      0.1, // Position text slightly above the floor
      (start[2] + end[2]) / 2
    ];
    const textRotation = [
        -Math.PI / 2, // Rotate text to be flat on XZ plane for top-down view
        0,
        isVertical ? Math.PI / 2 : 0 // Further rotation for vertical/horizontal lines
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
            position={textPosition}
            rotation={textRotation}
            fontSize={0.3}
            color="black"
            anchorX="center"
            anchorY="middle" // Changed from 'bottom' for better centering
        >
            {`${value}m`}
        </Text>
        </group>
    );
  };

  // --- CornerHandle Component (from legacy, adapted) ---
  const CornerHandle = ({ position, index }) => {
    const handlePointerDown = (e) => {
      e.stopPropagation(); // Prevent OrbitControls from activating
      setIsDraggingVertex(true);
      setDraggedHandle(index);
      // Store a copy of vertexes at the start of the drag
      dragStartRef.current = {
        vertexes: vertexes.map(v => [...v]), 
        index,
      };

      const handlePointerMove = (moveEvent) => {
        const rect = gl.domElement.getBoundingClientRect();
        // Calculate mouse position in normalized device coordinates (-1 to +1)
        const x = ((moveEvent.clientX - rect.left) / rect.width) * 2 - 1;
        const y = -((moveEvent.clientY - rect.top) / rect.height) * 2 + 1;

        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera({ x, y }, camera);
        
        // Intersect with the XZ plane (y=0)
        const floorPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0); 
        const intersection = new THREE.Vector3();
        
        if (raycaster.ray.intersectPlane(floorPlane, intersection)) {
            // Create new vertexes array based on the original drag start state
            const newVertexes = dragStartRef.current.vertexes.map((v, i) =>
                i === dragStartRef.current.index ? [intersection.x, 0, intersection.z] : v
            );
            setVertexes(newVertexes); // Update state
        }
      };

      const handlePointerUp = () => {
        setIsDraggingVertex(false);
        setDraggedHandle(null);
        window.removeEventListener('pointermove', handlePointerMove);
        window.removeEventListener('pointerup', handlePointerUp);
        // Re-enable OrbitControls if no gizmo is active
        if (orbitControlsRef.current && !isGizmoActive) {
            orbitControlsRef.current.enabled = true;
        }
      };

      // Disable orbit controls while dragging a vertex
      if (orbitControlsRef.current) {
        orbitControlsRef.current.enabled = false;
      }

      window.addEventListener('pointermove', handlePointerMove);
      window.addEventListener('pointerup', handlePointerUp);
    };

    // Ensure handle is slightly elevated for better visibility/interaction
    const handlePosition = [position[0], 0.1, position[2]]; 

    return (
      <mesh position={handlePosition} onPointerDown={handlePointerDown}>
        <boxGeometry args={[0.5, 0.2, 0.5]} /> {/* Slightly flatter handle */}
        <meshBasicMaterial 
            color={draggedHandle === index ? '#4a9eff' : '#aa2222'} // Red points
            opacity={0.9} 
            transparent 
            depthTest={false} // Render on top
        />
      </mesh>
    );
  };

  // --- BorderedFloor Component (integrates CornerHandle) ---
  const BorderedFloor = () => (
    <group>
      {/* Border outline */}
      <lineLoop>
        <bufferGeometry attach="geometry">
          <float32BufferAttribute attach="attributes-position" args={[new Float32Array(vertexes.flat()), 3]} />
        </bufferGeometry>
        <lineBasicMaterial attach="material" color={borderColor} linewidth={2} />
      </lineLoop>
      {/* Main floor polygon */}
      <mesh receiveShadow>
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
      {/* Render corner handles */}
      {vertexes.map((v, i) => (
        <CornerHandle key={i} position={v} index={i} />
      ))}
    </group>
  );

  return (
    <group ref={groupRef}>
      {lights(20)} {/* Using the imported lights function */}
      <BorderedFloor />
      {furniture.map(item => (
        <FurnitureItem
          key={item.id}
          id={item.id}
          item={item}
          is2D
          isSelected={selectedItem === item.id}
          onClick={() => setSelectedItem(item.id)}
        />
      ))}

      {selectedObject && isGizmoActive && (
        <TransformControls
          ref={transformControlsRef}
          object={selectedObject}
          mode={gizmoMode}
          space="local" 
          showX={gizmoMode === 'translate' || gizmoMode === 'scale'}
          showY={gizmoMode === 'rotate'}
          showZ={gizmoMode === 'translate' || gizmoMode === 'scale'}
          size={0.75}
          onMouseUp={handleTransformEnd}
          depthTest={false}
        />
      )}

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

      <OrbitControls
        ref={controlsRef}
        enableRotate={false}
        enableZoom={true}
        enablePan={true}
        zoomSpeed={0.5}
        panSpeed={0.5}
        screenSpacePanning={true}
        mouseButtons={{ MIDDLE: 2 }}
        touches={{ ONE: 32, TWO: 512 }}
      />
    </group>
  );
}