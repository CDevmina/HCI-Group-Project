import { useRef, useEffect, useMemo } from 'react'; // Import useMemo
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
      // GLB models often have their origin at the bottom, non-GLB boxes at the center
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

    // --- Correction: Clone the scene ---
    // Use useMemo to clone the scene only when the gltf object changes
    const clonedScene = useMemo(() => {
        if (gltf.scene) {
           const cloned = gltf.scene.clone(); // Clone the scene object
           // Re-apply material changes to the clone if needed immediately
           cloned.traverse((child) => {
               if (child.isMesh && child.material) {
                   if (child.material.isMeshStandardMaterial || child.material.isMeshPhysicalMaterial) {
                       child.material = child.material.clone(); // Clone material too
                       child.material.color.set(color);
                       child.material.emissive = emissiveColor;
                       child.material.emissiveIntensity = emissiveIntensity;
                       child.material.needsUpdate = true;
                   }
               }
           });
           return cloned;
        }
        return null;
    }, [gltf.scene, color, isSelected, emissiveColor, emissiveIntensity]); // Depend on things affecting appearance

    // Effect to update emissive properties on selection change for the *cloned* material
    useEffect(() => {
        if (clonedScene) {
             clonedScene.traverse((child) => {
               if (child.isMesh && child.material && (child.material.isMeshStandardMaterial || child.material.isMeshPhysicalMaterial)) {
                    child.material.emissive = emissiveColor;
                    child.material.emissiveIntensity = emissiveIntensity;
                    child.material.needsUpdate = true;
               }
             });
        }
    }, [clonedScene, isSelected, emissiveColor, emissiveIntensity]); // Only need selection-related dependencies here
    // --- End of Correction ---

    // Render the cloned scene if it exists
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
        {clonedScene && <primitive object={clonedScene} scale={[1, 1, 1]} />}
      </group>
    );
  }

  // Non-GLB simple box (remains the same)
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