// components/Room2D.jsx
import { useRef, useEffect, useState } from 'react';
import { useThree } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import FurnitureItem from './FurnitureItem';
import * as THREE from 'three';
import { floorColor, borderColor, floorRoughness, floorMetalness, lights } from './RoomTheme';

export default function Room2D({ roomSize, furniture, selectedItem, setSelectedItem, showDimensions, setRoomSize, vertexes, setVertexes }) {
  const [isDragging, setIsDragging] = useState(false);
  const [draggedHandle, setDraggedHandle] = useState(null);
  const dragStartRef = useRef({ vertexes: [], index: null });
  const groupRef = useRef();
  const controlsRef = useRef();
  const { camera, gl } = useThree();

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

  const CornerHandle = ({ position, index }) => {
    const handlePointerDown = (e) => {
      e.stopPropagation();
      setIsDragging(true);
      setDraggedHandle(index);
      dragStartRef.current = {
        vertexes: vertexes.map(v => [...v]),
        index,
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

        const newVertexes = dragStartRef.current.vertexes.map((v, i) =>
          i === index ? [intersection.x, 0, intersection.z] : v
        );
        setVertexes(newVertexes);
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
        <meshBasicMaterial color={draggedHandle === index ? '#4a9eff' : '#aa2222'} opacity={0.8} transparent />
      </mesh>
    );
  };

  const BorderedFloor = () => (
    <group>
      {/* Black border outline */}
      <lineLoop>
        <bufferGeometry attach="geometry">
          <float32BufferAttribute attach="attributes-position" args={[new Float32Array(vertexes.flat()), 3]} />
        </bufferGeometry>
        <lineBasicMaterial attach="material" color={borderColor} linewidth={2} />
      </lineLoop>
      {/* Main floor polygon */}
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
      {lights(5)}
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
          <DimensionLine start={vertexes[1]} end={vertexes[0]} value={Math.abs(vertexes[0][0] - vertexes[1][0]).toFixed(2)} isVertical={false} />
          <DimensionLine start={vertexes[0]} end={vertexes[3]} value={Math.abs(vertexes[0][2] - vertexes[3][2]).toFixed(2)} isVertical={true} />
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
