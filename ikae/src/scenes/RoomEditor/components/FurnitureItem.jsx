import { useRef, useEffect } from 'react';
import { useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as THREE from 'three';

export default function FurnitureItem({ item, isSelected, onClick }) {
  const groupRef = useRef();
  const {
    type,
    position = { x: 0, y: 0, z: 0 },
    dimensions, // Used for non-GLB, contains original width, height, depth
    color = '#cccccc',
    rotation = 0, // In radians if directly applied to THREE.Object3D.rotation.y
    id,
    scale = { x: 1, y: 1, z: 1 } // Default scale from item prop
  } = item;

  useEffect(() => {
    if (groupRef.current) {
      groupRef.current.userData.itemId = id;
      groupRef.current.name = `Furniture-${type}-${id}`;
    }
  }, [id, type]);

  // This useEffect will ensure the Three.js object reflects the React state
  useEffect(() => {
    if (groupRef.current) {
      // Apply position
      const yPos = item.glb ? 0 : (dimensions.height / 2) * scale.y;
      groupRef.current.position.set(position.x, yPos, position.z);
      
      // Apply rotation (assuming Y-axis rotation)
      groupRef.current.rotation.y = rotation;
      
      // Apply scale
      groupRef.current.scale.set(scale.x, scale.y, scale.z);
    }
  }, [position, rotation, scale, item.glb, dimensions]); // Rerun if these properties change

  const emissiveColor = isSelected ? new THREE.Color('yellow') : new THREE.Color('black');
  const emissiveIntensity = isSelected ? 0.5 : 0;

  if (item.glb) {
    const gltf = useLoader(GLTFLoader, item.glb);

    useEffect(() => {
      if (gltf.scene) {
        gltf.scene.traverse((child) => {
          if (child.isMesh && child.material) {
            // Ensure material is compatible
            if (child.material.isMeshStandardMaterial || child.material.isMeshPhysicalMaterial) {
              child.material.color.set(color); // Apply the selected color to the mesh
              child.material.emissive = emissiveColor;
              child.material.emissiveIntensity = emissiveIntensity;
              child.material.needsUpdate = true; 
            }
          }
        });
      }
    }, [gltf.scene, isSelected, emissiveColor, emissiveIntensity, color]); // Added color to dependency array

    return (
      <group
        ref={groupRef}
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
        castShadow
        receiveShadow
      >
        <primitive object={gltf.scene} scale={[1, 1, 1]} /> 
      </group>
    );
  }

  // Non-GLB simple box
  return (
    <group
      ref={groupRef}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      castShadow
      receiveShadow
    >
      <mesh>
        <boxGeometry args={[dimensions.width, dimensions.height, dimensions.depth]} />
        <meshStandardMaterial
            color={color} // Color is directly applied here for non-GLB
            emissive={emissiveColor}
            emissiveIntensity={emissiveIntensity}
        />
      </mesh>
    </group>
  );
}