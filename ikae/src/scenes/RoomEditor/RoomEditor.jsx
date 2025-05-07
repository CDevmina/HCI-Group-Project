import { useState, useEffect, useCallback, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber'; 
import { OrbitControls, PerspectiveCamera, useHelper } from '@react-three/drei';
import Room2D from './components/Room2D';
import Room3D from './components/Room3D';
import ControlsPanel from './components/ControlsPanel';
import ViewToggle from './components/ViewToggle';
import './styles.css';
import { MOUSE, TOUCH, Vector3, CameraHelper, Euler } from 'three'; 
import fetchModels from './utils/fetchModels';

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


const RoomEditor = () => {
  const [is3DView, setIs3DView] = useState(true);
  const [roomSize, setRoomSize] = useState({ width: 10, depth: 8, height: 3 });
  const [furniture, setFurniture] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showDimensions, setShowDimensions] = useState(true);
  const [models, setModels] = useState([]);
  const [isGizmoActive, setIsGizmoActive] = useState(false);
  const [gizmoMode, setGizmoMode] = useState('translate');

  const orbitControlsRef3D = useRef();
  const cameraRef3D = useRef();                                                                      
  const [savedCam, setSavedCam] = useState(null); 

  const mainDirectionalLightRef = useRef();

  useEffect(() => {
    fetchModels().then(setModels);
  }, []);

  const getInitialVertexes = (currentRoomSize) => [
    [currentRoomSize.width / 2, 0, currentRoomSize.depth / 2],
    [-currentRoomSize.width / 2, 0, currentRoomSize.depth / 2],
    [-currentRoomSize.width / 2, 0, -currentRoomSize.depth / 2],
    [currentRoomSize.width / 2, 0, -currentRoomSize.depth / 2],
  ];

  const [vertexes, setVertexes] = useState(getInitialVertexes(roomSize));

  useEffect(() => {
    setVertexes(getInitialVertexes(roomSize));
  }, [roomSize]);

  const addFurniture = async (type) => {
    const model = models.find(m => m.name === type);
    const newItem = {
      id: `${type}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      position: { x: 0, y: 0, z: 0 },
      dimensions: model?.dimensions || getDefaultDimensions(type),
      color: '#cccccc', // Default color for new items
      rotation: 0,
      scale: { x: 1, y: 1, z: 1 },
      ...(model ? { glb: model.glb, image: model.image } : {})
    };
    setFurniture([...furniture, newItem]);
    setSelectedItem(newItem.id);
    setIsGizmoActive(true);
  };

  const updateFurniture = useCallback((id, updates) => {
    setFurniture(curr => curr.map(item => item.id === id ? { ...item, ...updates } : item));
  }, []);

  const deleteFurniture = (id) => {
    setFurniture(curr => curr.filter(item => item.id !== id));
    if (selectedItem === id) {
      setSelectedItem(null);
      setIsGizmoActive(false);
    }
  };

  const disableGizmoInteraction = useCallback(() => {
    if (isGizmoActive) setIsGizmoActive(false);
  }, [isGizmoActive]);

  const handleSelectItem = useCallback((itemId) => {
    setSelectedItem(prev => {
      const newSel = prev === itemId ? null : itemId;
      setIsGizmoActive(newSel !== null);
      return newSel;
    });
  }, []);

  const handleDeselect = useCallback(() => {
    if (selectedItem != null) {
      setSelectedItem(null);
      setIsGizmoActive(false);
    }
  }, [selectedItem]);

  const handleViewToggle = (newIs3D) => {
    if (is3DView && !newIs3D && cameraRef3D.current) {
      const cam = cameraRef3D.current;
      setSavedCam({ pos: cam.position.toArray(), rot: cam.rotation.toArray() });
    }
    setIs3DView(newIs3D);
    setIsGizmoActive(selectedItem != null);
  };

  useEffect(() => {
    if (is3DView && savedCam && cameraRef3D.current && orbitControlsRef3D.current) {
      const cam = cameraRef3D.current;
      cam.position.fromArray(savedCam.pos);
      
      // Preserve original rotation logic
      const euler = new Euler(0,0,0, 'YXZ'); // Create an Euler object
      euler.fromArray(savedCam.rot);         // Set its values from the saved rotation array
      cam.rotation.copy(euler);              // Apply it to the camera

      const controls = orbitControlsRef3D.current;
      // If WASD moves target, this might be overwritten or complemented by WASD hook
      // For now, just reset target to origin when switching back to 3D
      // or if it wasn't actively panned by WASD.
      controls.target.set(0, 0, 0); 
      controls.update();
    }
  }, [is3DView, savedCam]);


  return (
    <div className="app-container">
      <ControlsPanel
        roomSize={roomSize} setRoomSize={setRoomSize}
        selectedItem={selectedItem ? furniture.find(i => i.id === selectedItem) : null}
        updateFurniture={updateFurniture} addFurniture={addFurniture}
        deleteFurniture={deleteFurniture}
        showDimensions={showDimensions} setShowDimensions={setShowDimensions}
        onPanelInteraction={disableGizmoInteraction}
        gizmoMode={gizmoMode} setGizmoMode={setGizmoMode}
        isGizmoActive={isGizmoActive} setIsGizmoActive={setIsGizmoActive}
      />

      <ViewToggle is3DView={is3DView} setIs3DView={handleViewToggle} />

      <div className="canvas-container">
        <Canvas
          shadows
          key={is3DView ? '3d-canvas-key' : '2d-canvas-key'}
          // The camera prop on Canvas is still used for initial setup for 2D/3D if PerspectiveCamera isn't default
          // However, for 3D view, PerspectiveCamera with `makeDefault` will take precedence.
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
            shadow-camera-far={40}     
            shadow-bias={-0.003}       
          />
          <directionalLight position={[-10, 10, -10]} intensity={0.3} color={"#ddeeff"} />

          <mesh rotation={[-Math.PI/2,0,0]} position={[0,-0.01,0]} receiveShadow>
            <planeGeometry args={[100,100]} />
            <shadowMaterial transparent opacity={0.25} />
          </mesh>

          {is3DView ? (
            <>
              {/* Use PerspectiveCamera and make it default for the 3D scene */}
              <PerspectiveCamera
                makeDefault 
                ref={cameraRef3D}
                fov={50} near={0.1} far={1000}
                position={savedCam ? savedCam.pos : [0,10,15]} // Using original Y=10 for camera
                rotation={savedCam ? savedCam.rot : [0,0,0]}   // Using original rotation
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
              {/* OrbitControls with original mouse button configuration */}
              <OrbitControls
                ref={orbitControlsRef3D}
                makeDefault // Ensures it targets the PerspectiveCamera
                enableRotate
                enablePan
                minPolarAngle={0}
                maxPolarAngle={Math.PI / 2.1} // Original value
                mouseButtons={{ LEFT: MOUSE.ROTATE, MIDDLE: MOUSE.DOLLY, RIGHT: MOUSE.PAN }} // Preserved
                touches={{ ONE: TOUCH.ROTATE, TWO: TOUCH.DOLLY_PAN }} // Preserved
              />
              {/* Conditionally enable WASD controls only for 3D view */}
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

function getDefaultDimensions(type) {
  switch(type.toLowerCase()) {
    case 'sofa': return { width:2, depth:0.9, height:0.8 };
    case 'chair': return { width:0.6, depth:0.6, height:1 };
    case 'diningtable': return { width:1.5, depth:0.9, height:0.75 };
    case 'sidetable': return { width:0.5, depth:0.5, height:0.6 };
    default: return { width:1, depth:1, height:1 };
  }
}

export default RoomEditor;