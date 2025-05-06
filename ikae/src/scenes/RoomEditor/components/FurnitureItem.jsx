import { useRef, useEffect } from 'react';
import { useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as THREE from 'three';

export default function FurnitureItem({ item, uuid, is2D, isSelected, onClick }) { // uuid prop is kept for now but unused in favour of userData
  const groupRef = useRef();
  const { type, position = { x: 0, y: 0, z: 0 }, dimensions, color = '#cccccc', rotation = 0, id } = item; // Ensure defaults

  // --- START: Assign itemId to userData ---
  useEffect(() => {
    if (groupRef.current) {
      groupRef.current.userData.itemId = id; // Assign the item's original ID
      groupRef.current.name = `Furniture-${type}-${id}`; // Optional: for debugging
       // console.log(`Assigned userData.itemId: ${id} to mesh`, groupRef.current);
    }
  }, [id, type]);
  // --- END: Assign itemId to userData ---

  // Use basic emissive color for selection feedback
  const emissiveColor = isSelected ? new THREE.Color('yellow') : new THREE.Color('black');
  const emissiveIntensity = isSelected ? 0.5 : 0;


  // Handle GLB loading
  if (item.glb) {
    const gltf = useLoader(GLTFLoader, item.glb);

    // Apply selection highlight to all meshes in the GLB
    useEffect(() => {
        if (gltf.scene) {
            gltf.scene.traverse((child) => {
                if (child.isMesh && child.material) {
                    // Ensure material is compatible with emissive
                    if (!child.material.isMeshStandardMaterial && !child.material.isMeshPhysicalMaterial) {
                         // Optional: Convert simple materials if needed, or skip emissive
                         // For simplicity, we might skip emissive for non-standard materials
                         // child.material = new THREE.MeshStandardMaterial().copy(child.material);
                    } else {
                        child.material.emissive = emissiveColor;
                        child.material.emissiveIntensity = emissiveIntensity;
                        child.material.needsUpdate = true; // Important!
                    }

                }
            });
        }
    }, [gltf.scene, isSelected, emissiveColor, emissiveIntensity]);


    return (
      <group
        ref={groupRef}
        // Position directly based on item data - Y=0 for GLBs on floor
        position={[position.x, 0, position.z]}
        rotation={[0, rotation, 0]}
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
        castShadow // Enable shadows for GLB models
        receiveShadow
      >
        <primitive object={gltf.scene} scale={[1, 1, 1]} />
      </group>
    );
  }

  // --- Simplified Non-GLB Rendering ---
  // Render a simple box, place its bottom at y=0
  return (
    <group
      ref={groupRef}
      position={[position.x, dimensions.height / 2, position.z]} // Pivot at bottom center
      rotation={[0, rotation, 0]}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      castShadow
      receiveShadow
    >
      <mesh>
        <boxGeometry args={[dimensions.width, dimensions.height, dimensions.depth]} />
        {/* Apply emissive color for selection */}
        <meshStandardMaterial
            color={color}
            emissive={emissiveColor}
            emissiveIntensity={emissiveIntensity}
        />
      </mesh>
    </group>
  );
}