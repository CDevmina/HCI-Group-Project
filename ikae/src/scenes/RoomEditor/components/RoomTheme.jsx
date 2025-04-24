export const floorColor = "#ffe4c4";
export const wallColor = "#e0e0e0";
export const borderColor = "black";
export const floorRoughness = 0.35;
export const floorMetalness = 0.1;
export const wallRoughness = 0.5;
export const wallMetalness = 0.15;

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