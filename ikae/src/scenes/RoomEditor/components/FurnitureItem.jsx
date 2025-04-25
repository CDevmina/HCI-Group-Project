// components/FurnitureItem.jsx
import { useRef } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export default function FurnitureItem({ item, is2D, isSelected, onClick }) {
  const meshRef = useRef();
  const { type, position, dimensions, color, rotation } = item;

  // If item has a GLB model, load and render it
  if (item.glb) {
    const gltf = useLoader(GLTFLoader, item.glb);
    return (
      <group
        position={[item.position.x, item.position.y, item.position.z]}
        rotation={[0, item.rotation, 0]}
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
        scale={[1, 1, 1]} // Adjust scale as needed for GLB
      >
        <primitive object={gltf.scene} />
      </group>
    );
  }

  // Highlight selected item
  const outlineWidth = isSelected ? 0.05 : 0;

  useFrame(() => {
    if (meshRef.current) {
      // Keep items on the floor in 3D view
      meshRef.current.position.y = is2D ? 0 : dimensions.height / 2;
    }
  });

  const getGeometry = () => {
    switch(type) {
      case 'chair':
        return (
          <>
            <boxGeometry args={[dimensions.width, dimensions.height, dimensions.depth]} />
            {isSelected && (
              <mesh>
                <boxGeometry args={[
                  dimensions.width + outlineWidth, 
                  dimensions.height + outlineWidth, 
                  dimensions.depth + outlineWidth
                ]} />
                <meshBasicMaterial color="yellow" transparent opacity={0.5} wireframe />
              </mesh>
            )}
          </>
        );
      case 'diningTable':
      case 'sideTable':
        return (
          <>
            <boxGeometry args={[dimensions.width, dimensions.height, dimensions.depth]} />
            {isSelected && (
              <mesh>
                <boxGeometry args={[
                  dimensions.width + outlineWidth, 
                  dimensions.height + outlineWidth, 
                  dimensions.depth + outlineWidth
                ]} />
                <meshBasicMaterial color="yellow" transparent opacity={0.5} wireframe />
              </mesh>
            )}
          </>
        );
      default:
        return <boxGeometry args={[dimensions.width, dimensions.height, dimensions.depth]} />;
    }
  };

  return (
    <group
      position={[position.x, position.y, position.z]}
      rotation={[0, rotation, 0]}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
    >
      <mesh ref={meshRef}>
        {getGeometry()}
        <meshStandardMaterial color={color} />
      </mesh>
    </group>
  );
}