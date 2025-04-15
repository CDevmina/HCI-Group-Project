// components/Room3D.jsx
import { useRef } from 'react';
import FurnitureItem from './FurnitureItem';

export default function Room3D({ roomSize, furniture, selectedItem, setSelectedItem }) {
  const { width, depth, height } = roomSize;
  const groupRef = useRef();

  return (
    <group ref={groupRef}>
      {/* Room floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[width, depth]} />
        <meshStandardMaterial color="#f5f5f5" />
      </mesh>

      {/* Room walls */}
      <mesh position={[0, height/2, -depth/2]}>
        <boxGeometry args={[width, height, 0.1]} />
        <meshStandardMaterial color="#e0e0e0" />
      </mesh>
      <mesh position={[-width/2, height/2, 0]} rotation={[0, Math.PI/2, 0]}>
        <boxGeometry args={[depth, height, 0.1]} />
        <meshStandardMaterial color="#e0e0e0" />
      </mesh>
      <mesh position={[width/2, height/2, 0]} rotation={[0, Math.PI/2, 0]}>
        <boxGeometry args={[depth, height, 0.1]} />
        <meshStandardMaterial color="#e0e0e0" />
      </mesh>
      <mesh position={[0, height/2, depth/2]}>
        <boxGeometry args={[width, height, 0.1]} />
        <meshStandardMaterial color="#e0e0e0" />
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