// components/Room2D.jsx
import { useRef, useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import FurnitureItem from './FurnitureItem';

export default function Room2D({ roomSize, furniture, selectedItem, setSelectedItem, showDimensions }) {
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

  const DimensionLine = ({ start, end, value, isVertical }) => {
    const position = [
      (start[0] + end[0]) / 2,
      0.1, // Slightly above the floor
      (start[2] + end[2]) / 2
    ];

    return (
      <group>
        {/* Dimension line */}
        <line>
          <bufferGeometry attach="geometry">
            <float32BufferAttribute attach="attributes-position" args={[new Float32Array([...start, ...end]), 3]} />
          </bufferGeometry>
          <lineBasicMaterial attach="material" color="black" />
        </line>

        {/* Dimension text */}
        <Text
          position={position}
          rotation={[isVertical ? Math.PI / 2 :-Math.PI/2, isVertical ? Math.PI : 0, isVertical ? Math.PI / 2: 0]} // Adjusted rotation for 2D view
          fontSize={0.3}
          color="black"
          anchorX="center"
          anchorY="bottom"
        >
          {`${value}m`}
        </Text>
      </group>
    );
  };

  return (
    <group ref={groupRef}>
      {/* Room floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[width, depth]} />
        <meshStandardMaterial color="#f5f5f5" />
      </mesh>

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

      {/* Dimension indicators */}
      {showDimensions && (
        <>
          {/* Width dimension */}
          <DimensionLine 
            start={[-width/2, 0, -depth/2 - 0.5]} 
            end={[width/2, 0, -depth/2 - 0.5]} 
            value={width} 
            isVertical={false}
          />

          {/* Depth dimension */}
          <DimensionLine 
            start={[width/2 + 0.5, 0, -depth/2]} 
            end={[width/2 + 0.5, 0, depth/2]} 
            value={depth} 
            isVertical={true}
          />
        </>
      )}

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
          MIDDLE: 2, // alternate pan
        }}
        touches={{
          ONE: 32, // Touch pan
          TWO: 512 // Touch zoom
        }}
      />
    </group>
  );
}