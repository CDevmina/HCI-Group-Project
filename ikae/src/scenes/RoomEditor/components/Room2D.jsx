// components/Room2D.jsx
import { useRef, useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import FurnitureItem from './FurnitureItem';

export default function Room2D({ roomSize, furniture, selectedItem, setSelectedItem }) {
  const { width, depth } = roomSize;
  const groupRef = useRef();
  const controlsRef = useRef();
  const { camera, gl } = useThree();
  
  // Set up orthographic camera for 2D view
  useEffect(() => {
    camera.position.set(0, 20, 0);
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
    
    // Reset controls target when room size changes
    if (controlsRef.current) {
      controlsRef.current.target.set(0, 0, 0);
      controlsRef.current.update();
    }
  }, [camera, roomSize]);

  return (
    <group ref={groupRef}>
      {/* Room floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[width, depth]} />
        <meshStandardMaterial color="#f5f5f5" />
      </mesh>

      {/* Room walls */}
      {/* <mesh position={[0, 0, -depth/2]}>
        <planeGeometry args={[width, 2]} />
        <meshStandardMaterial color="#e0e0e0" />
      </mesh>
      <mesh position={[-width/2, 0, 0]} rotation={[0, Math.PI/2, 0]}>
        <planeGeometry args={[depth, 2]} />
        <meshStandardMaterial color="#e0e0e0" />
      </mesh> */}

      {/* Furniture items */}
      {furniture.map(item => (
        <FurnitureItem 
          key={item.id}
          item={item}
          is2D={true}
          isSelected={selectedItem === item.id}
          onClick={() => setSelectedItem(item.id)}
        />
      ))}

      {/* OrbitControls for 2D navigation */}
      <OrbitControls
        ref={controlsRef}
        enableRotate={false} // Disable rotation in 2D view
        enableZoom={true}
        enablePan={true}
        zoomSpeed={0.5}
        panSpeed={0.5}
        minZoom={1}
        maxZoom={20}
        screenSpacePanning={true} // Makes panning feel more natural in 2D
        mouseButtons={{
          LEFT: 1, // Pan
          MIDDLE: 16, // Zoom
          RIGHT: 2 // Alternate pan (optional)
        }}
        touches={{
          ONE: 32, // Touch pan
          TWO: 512 // Touch zoom
        }}
      />
    </group>
  );
}