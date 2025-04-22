// components/Room3D.jsx
import { useRef } from 'react';
import * as THREE from 'three';
import FurnitureItem from './FurnitureItem';

export default function Room3D({ roomSize, furniture, selectedItem, setSelectedItem, vertexes }) {
  const groupRef = useRef();
  const height = roomSize.height;

  // Helper: create wall geometry between two vertexes
  const Wall = ({ v1, v2 }) => {
    // v1, v2: [x, y, z] (y is always 0)
    // Four corners: bottom v1, bottom v2, top v2, top v1
    const wallVerts = [
      ...v1,
      ...v2,
      v2[0], height, v2[2],
      v1[0], height, v1[2],
    ];
    // Two triangles: 0-1-2, 0-2-3
    const wallIndices = [0, 1, 2, 0, 2, 3];
    return (
      <mesh>
        <bufferGeometry>
          <float32BufferAttribute attach="attributes-position" args={[new Float32Array(wallVerts), 3]} />
          <bufferAttribute attach="index" count={6} array={new Uint16Array(wallIndices)} itemSize={1} />
        </bufferGeometry>
        <meshStandardMaterial color="#e0e0e0" side={THREE.DoubleSide} />
      </mesh>
    );
  };

  return (
    <group ref={groupRef}>
      {/* Floor polygon (no rotation) */}
      <mesh position={[0, 0, 0]}>
        <bufferGeometry attach="geometry">
          <float32BufferAttribute attach="attributes-position" args={[new Float32Array(vertexes.flat()), 3]} />
          <bufferAttribute attach="index" count={6} array={new Uint16Array([0, 1, 2, 0, 2, 3])} itemSize={1} />
        </bufferGeometry>
        <meshStandardMaterial color="#f5f5f5" side={THREE.DoubleSide} />
      </mesh>

      {/* Extruded walls along each edge */}
      {vertexes.map((v, i) => (
        <Wall key={i} v1={v} v2={vertexes[(i + 1) % vertexes.length]} />
      ))}

      {/* Furniture items */}
      {furniture.map(item => (
        <FurnitureItem 
          key={item.id}
          item={item}
          is2D={false}
          isSelected={selectedItem === item.id}
          onClick={() => setSelectedItem(item.id)}
        />
      ))}
    </group>
  );
}