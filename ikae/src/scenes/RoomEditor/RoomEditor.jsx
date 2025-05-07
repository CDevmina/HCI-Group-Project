import { useState, useEffect, useCallback, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';                                 
import Room2D from './components/Room2D';
import Room3D from './components/Room3D';
import ControlsPanel from './components/ControlsPanel';
import ViewToggle from './components/ViewToggle';
import './styles.css';
import { MOUSE, TOUCH, Vector3 } from 'three';                                                         
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

  // refs & state for 3D camera preservation
  const orbitControlsRef3D = useRef();
  const cameraRef3D = useRef();                                                                      
  const [savedCam, setSavedCam] = useState(null); 

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
  }, [roomSize]);// Depend on roomSize

  const addFurniture = async (type) => {
    const model = models.find(m => m.name === type);
    const newItem = {
      id: `${type}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      position: { x: 0, y: 0, z: 0 },
      dimensions: model?.dimensions || getDefaultDimensions(type),
      color: '#cccccc',
      rotation: 0,
      scale: { x: 1, y: 1, z: 1 },// Ensure scale initialized
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

  // view toggle: save 3D cam when leaving, restore when returning
  const handleViewToggle = (newIs3D) => {
    if (is3DView && !newIs3D && cameraRef3D.current) {
      const cam = cameraRef3D.current;
      setSavedCam({ pos: cam.position.toArray(), rot: cam.rotation.toArray() });
    }
    setIs3DView(newIs3D);
    setIsGizmoActive(selectedItem != null && !newIs3D);
  };

  // apply saved camera on returning to 3D
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
          <ambientLight intensity={0.6} />
          <directionalLight
            castShadow
            position={[10, 20, 5]}
            intensity={1.0}
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
            shadow-camera-far={50}
            shadow-camera-left={-15}
            shadow-camera-right={15}
            shadow-camera-top={15}
            shadow-camera-bottom={-15}
          />
          <mesh rotation={[-Math.PI/2,0,0]} position={[0,-0.01,0]} receiveShadow>
            <planeGeometry args={[100,100]} />
            <shadowMaterial transparent opacity={0.3} />
          </mesh>

          {is3DView ? (
            <>
              {/* 3D Perspective Camera */}
              <PerspectiveCamera
                makeDefault
                ref={cameraRef3D}
                fov={50} near={0.1} far={1000}
                position={savedCam ? savedCam.pos : [0,10,15]}
                rotation={savedCam ? savedCam.rot : [0,0,0]}
              />

              <Room3D
                roomSize={roomSize} furniture={furniture}
                selectedItem={selectedItem} setSelectedItem={handleSelectItem}
                updateFurniture={updateFurniture}
                isGizmoActive={isGizmoActive} gizmoMode={gizmoMode}
                vertexes={vertexes}
              />

              {/* OrbitControls for 3D View */}
              <OrbitControls
                ref={orbitControlsRef3D}
                makeDefault
                enableRotate
                enablePan
                minPolarAngle={0}
                maxPolarAngle={Math.PI/2}
                mouseButtons={{ LEFT: MOUSE.ROTATE, MIDDLE: MOUSE.DOLLY, RIGHT: MOUSE.PAN }}
                touches={{ ONE: TOUCH.ROTATE, TWO: TOUCH.DOLLY_PAN }}
              />
            </>
          ) : (
            <Room2D
              roomSize={roomSize} furniture={furniture}
              selectedItem={selectedItem} setSelectedItem={handleSelectItem}
              updateFurniture={updateFurniture}
              showDimensions={showDimensions}
              vertexes={vertexes} setVertexes={setVertexes}
              isGizmoActive={isGizmoActive} gizmoMode={gizmoMode}
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
