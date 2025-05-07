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
        LEFT: null,
        MIDDLE: THREE.MOUSE.DOLLY,
        RIGHT: THREE.MOUSE.PAN
      };
      orbitControlsRef.current.touches = {
        ONE: THREE.TOUCH.PAN,
        TWO: THREE.TOUCH.DOLLY_PAN
      };
      orbitControlsRef.current.update();
    }
  }, [camera]);

  // --- track which mesh is selected ---
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

  // --- after any transform, push updates back to your store ---
  const handleTransformEnd = () => {
    if (!selectedObject || !updateFurniture || selectedItem === null) return;

    const newPosition = {
      x: selectedObject.position.x,
      y: 0, // Keep y at 0 for 2D plane
      z: selectedObject.position.z
    };
    // For local space, rotation is often read from quaternion for accuracy,
    // but if you're only rotating around Y, selectedObject.rotation.y is fine.
    // If TransformControls in local space modifies the quaternion, you might need:
    // const newRotation = new THREE.Euler().setFromQuaternion(selectedObject.quaternion, 'YXZ').y;
    // For simplicity, sticking to .rotation.y as it often works if direct Y rotation is primary.
    const newRotation = selectedObject.rotation.y; 

    const newUpdates = {
      position: newPosition,
      rotation: newRotation
    };

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
          0.1,
          (start[2] + end[2]) / 2
        ]}
        rotation={[
          isVertical ? Math.PI / 2 : -Math.PI / 2,
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
      e.stopPropagation();
      setIsDraggingVertex(true);
      setDraggedHandle(index);
      dragStartRef.current = {
        vertexes: vertexes.map(v => [...v]),
        index
      };

      const move = (mv) => {
        const rect = gl.domElement.getBoundingClientRect();
        const x = ((mv.clientX - rect.left) / rect.width) * 2 - 1;
        const y = -((mv.clientY - rect.top) / rect.height) * 2 + 1;
        const ray = new THREE.Raycaster().setFromCamera({ x, y }, camera);
        const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
        const inter = new THREE.Vector3();
        ray.ray.intersectPlane(plane, inter);
        const updated = dragStartRef.current.vertexes.map((v, i) =>
          i === dragStartRef.current.index
            ? [inter.x, 0, inter.z]
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
          color={draggedHandle === index ? '#4a9eff' : '#aa2222'}
          opacity={0.8}
          transparent
        />
      </mesh>
    );
  };

  const BorderedFloor = () => (
    <group>
      <lineLoop>
        <bufferGeometry attach="geometry">
          <float32BufferAttribute
            attach="attributes-position"
            args={[new Float32Array(vertexes.flat()), 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial attach="material" color={borderColor} linewidth={2} />
      </lineLoop>
      <mesh>
        <bufferGeometry attach="geometry">
          <float32BufferAttribute
            attach="attributes-position"
            args={[new Float32Array(vertexes.flat()), 3]}
          />
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
      {vertexes.map((v, i) => (
        <CornerHandle key={i} position={v} index={i} />
      ))}
    </group>
  );

  return (
    <group ref={groupRef}>
      {lights(20)}
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
          space="local" // Align gizmo to the object's local rotation
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