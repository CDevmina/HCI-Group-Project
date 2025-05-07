import { useState, useEffect, useCallback, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, useHelper } from '@react-three/drei'; // Import useHelper
import Room2D from './components/Room2D';
import Room3D from './components/Room3D'; // This uses the 'lights' from RoomTheme
import ControlsPanel from './components/ControlsPanel';
import ViewToggle from './components/ViewToggle';
import './styles.css';
import { MOUSE, TOUCH, Vector3, CameraHelper } from 'three'; // Import CameraHelper
import fetchModels from './utils/fetchModels';

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

  const mainDirectionalLightRef = useRef(); // Ref for the main directional light
  // To debug shadows: Uncomment the line below to see the shadow camera's view
  // useHelper(mainDirectionalLightRef, CameraHelper, 1, 'red'); 

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
      cam.rotation.fromArray(savedCam.rot);
      const controls = orbitControlsRef3D.current;
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
          camera={{ position: [0, 10, 15], fov: 50, near: 0.1, far: 1000 }}
          onPointerMissed={handleDeselect}
        >
          {/* Main Ambient Light - for overall scene lighting */}
          <ambientLight intensity={0.7} /> {/* Increased slightly */}
          
          {/* Main Directional Light - THIS IS THE PRIMARY SHADOW CASTER */}
          <directionalLight
            ref={mainDirectionalLightRef} // Ref for shadow camera helper
            castShadow
            position={[15, 25, 15]} // Increased Y for better shadow angles
            intensity={1.2}          // Main light intensity
            color={"#fff0dd"}        // Warmer light color
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
            // TIGHTEN THESE VALUES based on roomSize and CameraHelper visualization
            shadow-camera-left={-roomSize.width / 2 - 3}   // Example: -10/2 - 3 = -8
            shadow-camera-right={roomSize.width / 2 + 3}  // Example:  10/2 + 3 =  8
            shadow-camera-top={roomSize.depth / 2 + 3}    // Example:   8/2 + 3 =  7
            shadow-camera-bottom={-roomSize.depth / 2 - 3} // Example:  -8/2 - 3 = -7
            shadow-camera-near={1}
            shadow-camera-far={40}     // Reduce far plane significantly
            shadow-bias={-0.003}       // Adjust bias carefully
            // shadow-normalBias={0.02} // Experiment if needed
          />
          {/* A subtle fill light from another direction */}
          <directionalLight position={[-10, 10, -10]} intensity={0.3} color={"#ddeeff"} />


          {/* Ground plane for receiving shadows from RoomEditor's light */}
          <mesh rotation={[-Math.PI/2,0,0]} position={[0,-0.01,0]} receiveShadow>
            <planeGeometry args={[100,100]} />
            <shadowMaterial transparent opacity={0.25} />
          </mesh>

          {is3DView ? (
            <>
              <PerspectiveCamera
                makeDefault
                ref={cameraRef3D}
                fov={50} near={0.1} far={1000}
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
                ref={orbitControlsRef3D}
                makeDefault
                enableRotate
                enablePan
                minPolarAngle={0}
                maxPolarAngle={Math.PI / 2.1}
                mouseButtons={{ LEFT: MOUSE.ROTATE, MIDDLE: MOUSE.DOLLY, RIGHT: MOUSE.PAN }}
                touches={{ ONE: TOUCH.ROTATE, TWO: TOUCH.DOLLY_PAN }}
              />
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