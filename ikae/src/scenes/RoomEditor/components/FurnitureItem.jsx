import { useRef, useEffect, useMemo } from 'react';
import { useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as THREE from 'three';

export default function FurnitureItem({ item, isSelected, onClick }) {
  const groupRef = useRef();
  const {
    type,
    position = { x: 0, y: 0, z: 0 },
    dimensions,
    color = '#cccccc',
    rotation = 0,
    id,
    scale = { x: 1, y: 1, z: 1 }
  } = item;

  // Use unconditional hook call with null path when no GLB
  const gltf = useLoader(GLTFLoader, item.glb || null);

  const emissiveColor = useMemo(() => 
    isSelected ? new THREE.Color('yellow') : new THREE.Color('black'),
    [isSelected]
  );
  
  const emissiveIntensity = isSelected ? 0.5 : 0;

  // Memo-ize the cloned scene
  const clonedScene = useMemo(() => {
    if (!gltf?.scene) return null;
    
    const cloned = gltf.scene.clone();
    cloned.traverse((child) => {
      if (child.isMesh && child.material) {
        if (child.material.isMeshStandardMaterial || child.material.isMeshPhysicalMaterial) {
          child.material = child.material.clone();
          child.material.color.set(color);
          child.material.emissive = emissiveColor;
          child.material.emissiveIntensity = emissiveIntensity;
          child.material.needsUpdate = true;
        }
      }
    });
    return cloned;
  }, [gltf?.scene, color, emissiveColor, emissiveIntensity]);

  useEffect(() => {
    if (groupRef.current) {
      groupRef.current.userData.itemId = id;
      groupRef.current.name = `Furniture-${type}-${id}`;
    }
  }, [id, type]);

  useEffect(() => {
    if (groupRef.current) {
      const yPos = item.glb ? 0 : (dimensions.height / 2) * scale.y;
      groupRef.current.position.set(position.x, yPos, position.z);
      groupRef.current.rotation.y = rotation;
      groupRef.current.scale.set(scale.x, scale.y, scale.z);
    }
  }, [position, rotation, scale, item.glb, dimensions]);

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
  }, [clonedScene, emissiveColor, emissiveIntensity]);

  // Common group props
  const groupProps = {
    ref: groupRef,
    onClick: (e) => {
      e.stopPropagation();
      onClick();
    },
    castShadow: true,
    receiveShadow: true
  };

  if (item.glb) {
    return (
      <group {...groupProps}>
        {clonedScene && <primitive object={clonedScene} scale={[1, 1, 1]} />}
      </group>
    );
  }

  return (
    <group {...groupProps}>
      <mesh>
        <boxGeometry args={[dimensions.width, dimensions.height, dimensions.depth]} />
        <meshStandardMaterial
          color={color}
          emissive={emissiveColor}
          emissiveIntensity={emissiveIntensity}
        />
      </mesh>
    </group>
  );
}