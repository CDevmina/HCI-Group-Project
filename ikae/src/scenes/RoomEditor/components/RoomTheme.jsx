import { Environment } from '@react-three/drei';
import React from 'react'; // Ensure React is imported for forwardRef

// --- Room Style Constants ---
export const floorColor = "#ffe4c4"; // Standard beige floor - VERIFY THIS IS NOT BLACK
export const wallColor = "#e0e0e0";
export const borderColor = "black";
export const floorRoughness = 0.4;
export const floorMetalness = 0.05;
export const wallRoughness = 0.7;
export const wallMetalness = 0.1;

// --- Enhanced Lighting Component ---
export const EnhancedLights = React.forwardRef(({ 
    brightness = 1.0,         // Ensure this is a positive value when used
    color = '#ffffff', 
    roomWidth = 20, 
    roomDepth = 20 
  }, ref) => (
  <>
    {/* Increased ambient light slightly for overall fill */}
    <ambientLight intensity={brightness * 0.4} color={color} />

    <directionalLight
      ref={ref} 
      position={[15, 20, 10]} 
      intensity={brightness * 0.8} // Primary light source, ensure it's bright enough
      color="#fffde7" // Warm white, good for general lighting
      castShadow
      shadow-mapSize-width={2048} 
      shadow-mapSize-height={2048}
      shadow-camera-left={-roomWidth / 2 - 5}
      shadow-camera-right={roomWidth / 2 + 5}
      shadow-camera-top={roomDepth / 2 + 5}
      shadow-camera-bottom={-roomDepth / 2 - 5}
      shadow-camera-near={1}    
      shadow-camera-far={50}   
      shadow-bias={-0.002} 
    />

    {/* Softer fill light */}
    <directionalLight
      position={[-10, 15, -10]}
      intensity={brightness * 0.2} // Reduced fill light intensity slightly
      color="#e0f0ff" 
    />

    {/* Hemisphere light for more natural ambient feel */}
    <hemisphereLight
        skyColor={"#d0e0ff"} 
        groundColor={"#a08060"} 
        intensity={brightness * 0.5} // Slightly increased hemisphere intensity
    />
    
    {/* Environment preset - provides ambient light and reflections */}
    <Environment preset="city" background={false} blur={0.6} /> 
  </>
));

EnhancedLights.displayName = 'EnhancedLights'; 

// --- Original lights function (Kept for reference or removal) ---
export const lights = (height = 5) => (
  <>
    <ambientLight intensity={0.5} />
    <directionalLight
      position={[10, 20, 10]}
      intensity={0.7}
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
    <pointLight position={[0, height + 2, 0]} intensity={0.2} color="#ffd6e0" />
  </>
);