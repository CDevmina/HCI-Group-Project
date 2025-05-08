import { useLoader, useThree } from '@react-three/fiber';
import * as THREE from 'three';

// Texture imports (adjust path as needed)
import woodColor from '../textures/WoodFloor051_2K-JPG/WoodFloor051_2K-JPG_Color.jpg';
import woodNormal from '../textures/WoodFloor051_2K-JPG/WoodFloor051_2K-JPG_NormalGL.jpg';
import woodRoughness from '../textures/WoodFloor051_2K-JPG/WoodFloor051_2K-JPG_Roughness.jpg';
import woodAO from '../textures/WoodFloor051_2K-JPG/WoodFloor051_2K-JPG_AmbientOcclusion.jpg';

// Wall texture imports (Wallpaper002A)
import wallColorMap from '../textures/Wallpaper002A_2K-JPG/Wallpaper002A_2K-JPG_Color.jpg';
import wallNormalMap from '../textures/Wallpaper002A_2K-JPG/Wallpaper002A_2K-JPG_NormalGL.jpg';
import wallRoughnessMap from '../textures/Wallpaper002A_2K-JPG/Wallpaper002A_2K-JPG_Roughness.jpg';
// If you want to use AO, add it here if available
// import wallAOMap from '../textures/Wallpaper002A_2K-JPG/Wallpaper002A_2K-JPG_AmbientOcclusion.jpg';

export const floorColor = "#ffe4c4";
export const wallColor = "#e0e0e0";
export const borderColor = "black";
export const floorRoughness = 0.5;
export const floorMetalness = 0.1;
export const wallRoughness = 0.5;
export const wallMetalness = 0.15;

// Hook to get floor material props with textures, tiling, and normal strength
export function useFloorMaterialProps(tiling = 2, normalStrength = 1) {
  const [map, normalMap, roughnessMap, aoMap] = useLoader(THREE.TextureLoader, [
    woodColor,
    woodNormal,
    woodRoughness,
    woodAO,
  ]);

  // Set repeat and wrapping for all maps
  [map, normalMap, roughnessMap, aoMap].forEach(tex => {
    if (tex) {
      tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
      tex.repeat.set(tiling, tiling);
      tex.needsUpdate = true;
    }
  });

  return {
    map,
    normalMap,
    roughnessMap,
    aoMap,
    normalScale: new THREE.Vector2(normalStrength, normalStrength),
    roughness: floorRoughness,
    metalness: floorMetalness,
    side: THREE.DoubleSide,
  };
}

// Hook to get wall material props with textures, tiling, and normal strength
export function useWallMaterialProps(tiling = 2, normalStrength = 1) {
  const [map, normalMap, roughnessMap, aoMap] = useLoader(THREE.TextureLoader, [
    wallColorMap,
    wallNormalMap,
    wallRoughnessMap,
    // Uncomment if AO map is available
    // wallAOMap,
  ]);

  [map, normalMap, roughnessMap, aoMap].forEach(tex => {
    if (tex) {
      tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
      tex.repeat.set(tiling, tiling);
      tex.needsUpdate = true;
    }
  });

  return {
    map,
    normalMap,
    roughnessMap,
    aoMap,
    normalScale: new THREE.Vector2(normalStrength, normalStrength),
    roughness: wallRoughness,
    metalness: wallMetalness,
    side: THREE.DoubleSide,
  };
}

export const lights = (height = 5) => (
  <>
    <ambientLight intensity={1} />
    <directionalLight
      position={[10, 20, 10]}
      intensity={1.2}
      castShadow
      shadow-mapSize-width={1024}
      shadow-mapSize-height={1024}
      color="#fffbe6"
    />
    <directionalLight
      position={[-10, 10, -10]}
      intensity={0.3}
      color="#b3d1ff"
    />
    <pointLight position={[0, height + 2, 0]} intensity={0.3} color="#ffd6e0" />
  </>
);