// components/Room2D.jsx
import { useRef, useEffect, useState } from 'react';
import { useThree } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import FurnitureItem from './FurnitureItem';
import * as THREE from 'three';

export default function Room2D({ roomSize, furniture, selectedItem, setSelectedItem, showDimensions, setRoomSize }) {
  const { width, depth, height } = roomSize;
  const groupRef = useRef();
  const controlsRef = useRef();
  const { camera, gl } = useThree();
  const borderThickness = 0.3;
  const [isDragging, setIsDragging] = useState(false);
  const [draggedHandle, setDraggedHandle] = useState(null);
  const dragStartRef = useRef({ x: 0, y: 0, width: 0, depth: 0, height: 0 });

  useEffect(() => {
    camera.position.set(0, 20, 0);
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
    if (controlsRef.current) {
      controlsRef.current.target.set(0, 0, 0);
      controlsRef.current.update();
    }
  }, [camera]);

  const DimensionLine = ({ start, end, value, isVertical }) => {
    const position = [
      (start[0] + end[0]) / 2,
      0.1,
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

  const CornerHandle = ({ position, corner }) => {
    const handlePointerDown = (e) => {
      e.stopPropagation();
      setIsDragging(true);
      setDraggedHandle(corner);
      dragStartRef.current = {
        x: e.point.x,
        y: e.point.z,
        width,
        depth,
        height
      };

      const handleMove = (moveEvent) => {
        const rect = gl.domElement.getBoundingClientRect();
        const x = ((moveEvent.clientX - rect.left) / rect.width) * 2 - 1;
        const y = -((moveEvent.clientY - rect.top) / rect.height) * 2 + 1;

        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera({ x, y }, camera);
        const floorPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
        const intersection = new THREE.Vector3();
        raycaster.ray.intersectPlane(floorPlane, intersection);

        const dx = intersection.x - dragStartRef.current.x;
        const dz = intersection.z - dragStartRef.current.y;

        let newWidth = dragStartRef.current.width;
        let newDepth = dragStartRef.current.depth;

        if (corner.includes("right")) newWidth = Math.max(1, dragStartRef.current.width + dx * 2);
        if (corner.includes("left")) newWidth = Math.max(1, dragStartRef.current.width - dx * 2);
        if (corner.includes("bottom")) newDepth = Math.max(1, dragStartRef.current.depth + dz * 2);
        if (corner.includes("top")) newDepth = Math.max(1, dragStartRef.current.depth - dz * 2);

        setRoomSize({
          width: Number(newWidth.toFixed(2)),
          depth: Number(newDepth.toFixed(2)),
          height
        });
      };

      const handleUp = () => {
        setIsDragging(false);
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
        <meshBasicMaterial color={draggedHandle === corner ? '#4a9eff' : '#aa2222'} opacity={0.8} transparent />
      </mesh>
    );
  };

  const BorderedFloor = () => (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <planeGeometry args={[width + borderThickness * 2, depth + borderThickness * 2]} />
        <meshBasicMaterial color="black" />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[width, depth]} />
        <meshStandardMaterial color="#f5f5f5" />
      </mesh>

      {/* Corner handles */}
      <CornerHandle position={[width / 2 + 0.25, 0.25, depth / 2 + 0.25]} corner="bottom-right" />
      <CornerHandle position={[-width / 2 - 0.25, 0.25, depth / 2 + 0.25]} corner="bottom-left" />
      <CornerHandle position={[-width / 2 - 0.25, 0.25, -depth / 2 - 0.25]} corner="top-left" />
      <CornerHandle position={[width / 2 + 0.25, 0.25, -depth / 2 - 0.25]} corner="top-right" />
    </group>
  );

  return (
    <group ref={groupRef}>
      <BorderedFloor />

      {furniture.map(item => (
        <FurnitureItem 
          key={item.id}
          item={item}
          is2D={true}
          isSelected={selectedItem === item.id}
          onClick={() => setSelectedItem(item.id)}
        />
      ))}

      {showDimensions && (
        <>
          <DimensionLine start={[-width/2, 0, -depth/2 - 0.5]} end={[width/2, 0, -depth/2 - 0.5]} value={width} isVertical={false} />
          <DimensionLine start={[width/2 + 0.5, 0, -depth/2]} end={[width/2 + 0.5, 0, depth/2]} value={depth} isVertical={true} />
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
