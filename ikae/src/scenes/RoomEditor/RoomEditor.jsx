import { useState, useEffect, useCallback, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber'; 
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import Room2D from './components/Room2D';
import Room3D from './components/Room3D';
import './styles.css';
import { MOUSE, Vector3, Euler } from 'three'; 

// --- WASD Movement Hook ---
const useWASDControls = (cameraRef, orbitControlsRef, moveSpeed = 5, enabled = true) => {
  const [movement, setMovement] = useState({
    forward: false,
    backward: false,
    left: false,
    right: false,
    up: false, // For Q/E style movement
    down: false,
  });

  useEffect(() => {
    if (!enabled) return; // Only attach listeners if enabled (i.e., in 3D view)

    const handleKeyDown = (event) => {
      // Prevent WASD from triggering if an input field is focused
      if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') {
        return;
      }
      switch (event.key.toLowerCase()) {
        case 'w': setMovement((m) => ({ ...m, forward: true })); break;
        case 's': setMovement((m) => ({ ...m, backward: true })); break;
        case 'a': setMovement((m) => ({ ...m, left: true })); break;
        case 'd': setMovement((m) => ({ ...m, right: true })); break;
        case 'e': setMovement((m) => ({ ...m, up: true })); break; // Fly up
        case 'q': setMovement((m) => ({ ...m, down: true })); break; // Fly down
      }
    };

    const handleKeyUp = (event) => {
      switch (event.key.toLowerCase()) {
        case 'w': setMovement((m) => ({ ...m, forward: false })); break;
        case 's': setMovement((m) => ({ ...m, backward: false })); break;
        case 'a': setMovement((m) => ({ ...m, left: false })); break;
        case 'd': setMovement((m) => ({ ...m, right: false })); break;
        case 'e': setMovement((m) => ({ ...m, up: false })); break;
        case 'q': setMovement((m) => ({ ...m, down: false })); break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [enabled]); // Re-run effect if 'enabled' changes

  useFrame((state, delta) => {
    if (!enabled || !cameraRef.current || !orbitControlsRef.current) return;

    const cam = cameraRef.current;
    const controls = orbitControlsRef.current;
    const speed = moveSpeed * delta;

    const moveDirection = new Vector3();
    const rightDirection = new Vector3();
    
    // Get camera's local forward direction (direction it's looking)
    cam.getWorldDirection(moveDirection);

    // Get camera's local right direction
    // Deriving right vector from camera's matrix is generally robust
    rightDirection.setFromMatrixColumn(cam.matrix, 0); // First column of rotation matrix
    rightDirection.normalize();


    let didMove = false;

    if (movement.forward) {
      cam.position.addScaledVector(moveDirection, speed);
      controls.target.addScaledVector(moveDirection, speed); // Move target with camera
      didMove = true;
    }
    if (movement.backward) {
      cam.position.addScaledVector(moveDirection, -speed);
      controls.target.addScaledVector(moveDirection, -speed);
      didMove = true;
    }
    if (movement.left) {
      cam.position.addScaledVector(rightDirection, -speed);
      controls.target.addScaledVector(rightDirection, -speed);
      didMove = true;
    }
    if (movement.right) {
      cam.position.addScaledVector(rightDirection, speed);
      controls.target.addScaledVector(rightDirection, speed);
      didMove = true;
    }
    // Vertical movement (flying) - directly modifies Y position
    if (movement.up) {
        cam.position.y += speed;
        controls.target.y += speed;
        didMove = true;
    }
    if (movement.down) {
        cam.position.y -= speed;
        controls.target.y -= speed;
        didMove = true;
    }

    if (didMove) {
      controls.update();
    }
  });
};

// Helper component to conditionally apply WASD controls
const WASDNavigationController = ({ cameraRef, orbitControlsRef, enabled }) => {
  useWASDControls(cameraRef, orbitControlsRef, 5, enabled); // Pass enabled prop
  return null;
};
// --- END WASD Movement Hook ---


const RoomEditor = ({ 
  is3DView: externalIs3DView, 
  showDimensions: externalShowDimensions,
  furniture: externalFurniture,
  setFurniture: setExternalFurniture,
  gizmoMode: externalGizmoMode,
  selectedItem,
  setSelectedItem,
  vertexes,
  setVertexes
}) => {
  // If parent (Studio) provides states, use them, else fallback to internal state
  const [internalIs3DView] = useState(true);
  const [internalFurniture, setInternalFurniture] = useState([]);

  const is3DView = typeof externalIs3DView === 'boolean' ? externalIs3DView : internalIs3DView;
  const showDimensions = externalShowDimensions;
  const furniture = externalFurniture || internalFurniture;
  const setFurniture = setExternalFurniture || setInternalFurniture;
  const gizmoMode = externalGizmoMode || 'translate';

  const [roomSize] = useState({ width: 10, depth: 8, height: 3 });
  const [isGizmoActive, setIsGizmoActive] = useState(false);

  const orbitControlsRef3D = useRef();
  const cameraRef3D = useRef();
  const [savedCam, setSavedCam] = useState(null); 
  const mainDirectionalLightRef = useRef();

  const getInitialVertexes = (currentRoomSize) => [
    [currentRoomSize.width / 2, 0, currentRoomSize.depth / 2],
    [-currentRoomSize.width / 2, 0, currentRoomSize.depth / 2],
    [-currentRoomSize.width / 2, 0, -currentRoomSize.depth / 2],
    [currentRoomSize.width / 2, 0, -currentRoomSize.depth / 2],
  ];

  useEffect(() => {
    setVertexes(getInitialVertexes(roomSize));
  }, [roomSize, setVertexes]);

  const updateFurniture = useCallback((id, updates) => {
    setFurniture(curr => curr.map(item => item.id === id ? { ...item, ...updates } : item));
  }, [setFurniture]);

  const handleSelectItem = useCallback((itemId) => {
    setSelectedItem(prev => {
      const newSel = prev === itemId ? null : itemId;
      setIsGizmoActive(newSel !== null);
      return newSel;
    });
  }, [setSelectedItem, setIsGizmoActive]);

  const handleDeselect = useCallback(() => {
    if (selectedItem != null) {
      setSelectedItem(null);
      setIsGizmoActive(false);
    }
  }, [selectedItem, setSelectedItem]);

  useEffect(() => {
    if (is3DView && savedCam && cameraRef3D.current && orbitControlsRef3D.current) {
      const cam = cameraRef3D.current;
      cam.position.fromArray(savedCam.pos);
      const euler = new Euler(0,0,0, 'YXZ');
      euler.fromArray(savedCam.rot);
      cam.rotation.copy(euler);
      const controls = orbitControlsRef3D.current;
      controls.target.set(0, 0, 0);
      controls.update();
    }
  }, [is3DView, savedCam]);

  useEffect(() => {
    if (!is3DView && cameraRef3D.current) {
      const cam = cameraRef3D.current;
      setSavedCam({ pos: cam.position.toArray(), rot: cam.rotation.toArray() });
    }
  }, [is3DView]);

  return (
    <div className="app-container">
      <div className="canvas-container">
        <Canvas
          shadows
          key={is3DView ? '3d-canvas-key' : '2d-canvas-key'}
          camera={is3DView ? { fov: 50, near: 0.1, far: 1000 } : { position: [0, 10, 15], fov: 50, near: 0.1, far: 1000 }}
          onPointerMissed={handleDeselect}
        >
          <ambientLight intensity={0.7} /> 
          <directionalLight
            ref={mainDirectionalLightRef} 
            castShadow
            position={[15, 25, 15]} 
            intensity={1.2}          
            color={"#fff0dd"}        
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
            shadow-camera-left={-roomSize.width / 2 - 3}  
            shadow-camera-right={roomSize.width / 2 + 3}  
            shadow-camera-top={roomSize.depth / 2 + 3}    
            shadow-camera-bottom={-roomSize.depth / 2 - 3} 
            shadow-camera-near={1}                       
            shadow-camera-far={100}                      
          />
          {is3DView ? (
            <>
              <PerspectiveCamera
                ref={cameraRef3D}
                makeDefault
                position={savedCam ? savedCam.pos : [0,10,15]}
                rotation={savedCam ? savedCam.rot : [0,0,0]}
              />
              <Room3D
                roomSize={roomSize} 
                furniture={furniture}
                selectedItem={selectedItem} 
                setSelectedItem={handleSelectItem}
                updateFurniture={updateFurniture}
                isGizmoActive={isGizmoActive} 
                gizmoMode={gizmoMode}
                vertexes={vertexes}
              />
              <OrbitControls 
                enabled={is3DView}
                enableRotate={true}
                enablePan={true}
                minPolarAngle={0}
                maxPolarAngle={Math.PI / 2}
                ref={orbitControlsRef3D}
                mouseButtons={{
                  LEFT: null,
                  MIDDLE: MOUSE.ROTATE,
                  RIGHT: null
                }}
              />
              <WASDNavigationController cameraRef={cameraRef3D} orbitControlsRef={orbitControlsRef3D} enabled={is3DView} />
            </>
          ) : (
            <Room2D
              roomSize={roomSize} 
              furniture={furniture}
              selectedItem={selectedItem} 
              setSelectedItem={handleSelectItem}
              updateFurniture={updateFurniture}
              showDimensions={showDimensions}
              vertexes={vertexes} 
              setVertexes={setVertexes}
              isGizmoActive={isGizmoActive} 
              gizmoMode={gizmoMode}
            />
          )}
        </Canvas>
      </div>
    </div>
  );
}

export default RoomEditor;