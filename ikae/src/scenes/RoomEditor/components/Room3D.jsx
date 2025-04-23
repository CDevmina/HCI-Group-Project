// components/Room3D.jsx
import { useRef } from 'react';
import * as THREE from 'three';
import FurnitureItem from './FurnitureItem';

export default function Room3D({ roomSize, furniture, selectedItem, setSelectedItem, vertexes }) {
  const groupRef = useRef();
  const height = roomSize.height;

  // Helper: offset a point by a normal and distance
  function offsetPoint([x, y, z], normal, distance) {
    return [x + normal.x * distance, y, z + normal.z * distance];
  }

  // Helper: get normals for each wall edge (2D)
  function getEdgeNormals(vertexes) {
    const normals = [];
    for (let i = 0; i < vertexes.length; i++) {
      const v1 = vertexes[i];
      const v2 = vertexes[(i + 1) % vertexes.length];
      const dx = v2[0] - v1[0];
      const dz = v2[2] - v1[2];
      // Perpendicular (outward) normal
      const len = Math.sqrt(dx * dx + dz * dz);
      normals.push({ x: -dz / len, z: dx / len });
    }
    return normals;
  }

  // Wall thickness (centered)
  const WALL_THICKNESS = 0.1;

  // Generate wall meshes with thickness (like Blender's solidify)
  const WallMeshes = ({ vertexes }) => {
    const normals = getEdgeNormals(vertexes);
    return vertexes.map((v, i) => {
      const v1 = v;
      const v2 = vertexes[(i + 1) % vertexes.length];
      const n = normals[i];
      // Offset both sides
      const v1a = offsetPoint(v1, n, WALL_THICKNESS / 2);
      const v1b = offsetPoint(v1, n, -WALL_THICKNESS / 2);
      const v2a = offsetPoint(v2, n, WALL_THICKNESS / 2);
      const v2b = offsetPoint(v2, n, -WALL_THICKNESS / 2);
      // Center of wall
      const cx = (v1[0] + v2[0]) / 2;
      const cz = (v1[2] + v2[2]) / 2;
      const length = Math.sqrt((v2[0] - v1[0]) ** 2 + (v2[2] - v1[2]) ** 2);
      const angle = Math.atan2(v2[2] - v1[2], v2[0] - v1[0]);
      return (
        <mesh
          key={i}
          position={[(v1a[0] + v2a[0] + v1b[0] + v2b[0]) / 4, roomSize.height / 2, (v1a[2] + v2a[2] + v1b[2] + v2b[2]) / 4]}
          rotation={[0, -angle, 0]}
        >
          <boxGeometry args={[length, roomSize.height, WALL_THICKNESS]} />
          <meshStandardMaterial color="#e0e0e0" />
        </mesh>
      );
    });
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

      {/* Walls with thickness centered on polygon edge */}
      <WallMeshes vertexes={vertexes} />

      {/* Roof mesh on top of the walls */}
      <mesh position={[0, roomSize.height, 0]}>
        <bufferGeometry attach="geometry">
          <float32BufferAttribute attach="attributes-position" args={[new Float32Array(vertexes.map(([x, y, z]) => [x, 0, z]).flat()), 3]} />
          <bufferAttribute attach="index" count={6} array={new Uint16Array([0, 1, 2, 0, 2, 3])} itemSize={1} />
        </bufferGeometry>
        <meshStandardMaterial color="#cccccc"/>
      </mesh>

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