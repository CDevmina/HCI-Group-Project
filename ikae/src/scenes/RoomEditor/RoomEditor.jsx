// src/scenes/RoomEditor/RoomEditor.jsx
import { useState, useEffect, useCallback, useRef } from 'react'; // Added useRef
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import Room2D from './components/Room2D';
import Room3D from './components/Room3D';
import ControlsPanel from './components/ControlsPanel';
import ViewToggle from './components/ViewToggle';
import './styles.css';
import { MOUSE } from 'three';
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

  // Refs for controls to potentially reset them
  const orbitControlsRef3D = useRef();

  useEffect(() => {
    fetchModels().then(setModels);
  }, []);

  const getInitialVertexes = (roomSize) => [
    [roomSize.width / 2, 0, roomSize.depth / 2],
    [-roomSize.width / 2, 0, roomSize.depth / 2],
    [-roomSize.width / 2, 0, -roomSize.depth / 2],
    [roomSize.width / 2, 0, -roomSize.depth / 2],
  ];

  const [vertexes, setVertexes] = useState(getInitialVertexes(roomSize));

  useEffect(() => {
    setVertexes(getInitialVertexes(roomSize));
  }, [roomSize.width, roomSize.depth]);

  const addFurniture = async (type) => {
    const model = models.find(m => m.name === type);
    const newItem = {
      id: `${type}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      position: { x: 0, y: 0, z: 0 },
      dimensions: model?.dimensions || getDefaultDimensions(type),
      color: '#cccccc',
      rotation: 0,
      ...(model ? { glb: model.glb, image: model.image } : {})
    };
    setFurniture([...furniture, newItem]);
    setSelectedItem(newItem.id);
    setIsGizmoActive(true);
  };

  const updateFurniture = useCallback((id, updates) => {
    setFurniture(currentFurniture =>
      currentFurniture.map(item =>
        item.id === id ? { ...item, ...updates } : item
      )
    );
  }, []);

  const deleteFurniture = (id) => {
    setFurniture(furniture.filter(item => item.id !== id));
    if (selectedItem === id) {
      setSelectedItem(null);
      setIsGizmoActive(false);
    }
  };

  const disableGizmoInteraction = useCallback(() => {
    if (isGizmoActive) {
      setIsGizmoActive(false);
    }
  }, [isGizmoActive]);

  const handleSelectItem = useCallback((itemId) => {
    setSelectedItem(prev => {
      const isDeselectingOrSelectingSame = prev === itemId;
      const newSelection = isDeselectingOrSelectingSame ? null : itemId;
      setIsGizmoActive(newSelection !== null);
      return newSelection;
    });
  }, []);

  const handleDeselect = useCallback(() => {
      if(selectedItem !== null) {
          setSelectedItem(null);
          setIsGizmoActive(false);
      }
  }, [selectedItem]);

  const handleViewToggle = (newIs3DView) => {
    setIs3DView(newIs3DView);
    if (selectedItem) {
      setIsGizmoActive(true);
    } else {
      setIsGizmoActive(false);
    }
    // Attempt to reset the 3D OrbitControls target when switching
    if (newIs3DView && orbitControlsRef3D.current) {
        orbitControlsRef3D.current.target.set(0,0,0); // Or a more appropriate target
        orbitControlsRef3D.current.reset(); // More forceful reset
    }
  };

  return (
    <div className="app-container">
      <ControlsPanel
        roomSize={roomSize}
        setRoomSize={setRoomSize}
        selectedItem={selectedItem ? furniture.find(item => item.id === selectedItem) : null}
        updateFurniture={updateFurniture}
        addFurniture={addFurniture}
        deleteFurniture={deleteFurniture}
        showDimensions={showDimensions}
        setShowDimensions={setShowDimensions}
        onPanelInteraction={disableGizmoInteraction}
        gizmoMode={gizmoMode}
        setGizmoMode={setGizmoMode}
        isGizmoActive={isGizmoActive}
        setIsGizmoActive={setIsGizmoActive}
      />

      <ViewToggle is3DView={is3DView} setIs3DView={handleViewToggle} />

      <div className="canvas-container">
        <Canvas
            shadows
            // Using a key that changes with the view mode can help ensure
            // the Canvas and its children re-mount or reset properly.
            key={is3DView ? "3d-canvas-key" : "2d-canvas-key"}
            camera={{ fov: 50 }} // Initial camera props, will be overridden by Room2D/Room3D
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
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
                <planeGeometry args={[100, 100]} />
                <shadowMaterial transparent opacity={0.3} />
            </mesh>

            {is3DView ? (
                <>
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
                    {/* OrbitControls specifically for 3D view */}
                    <OrbitControls
                        ref={orbitControlsRef3D} // Assign ref
                        makeDefault
                        enableRotate={true}
                        enablePan={true}
                        minPolarAngle={0}
                        maxPolarAngle={Math.PI / 2}
                        // Your original 3D controls mouse/touch bindings
                        mouseButtons={{ LEFT: null, MIDDLE: MOUSE.ROTATE, RIGHT: MOUSE.PAN }}
                        touches={{ ONE: MOUSE.PAN, TWO: MOUSE.ROTATE }}
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
                    // Room2D will have its own OrbitControls instance
                />
            )}
        </Canvas>
      </div>
    </div>
  );
}

function getDefaultDimensions(type) {
  switch(type.toLowerCase()) {
    case 'sofa': return { width: 2, depth: 0.9, height: 0.8 };
    case 'chair': return { width: 0.6, depth: 0.6, height: 1 };
    case 'diningtable': return { width: 1.5, depth: 0.9, height: 0.75 };
    case 'sidetable': return { width: 0.5, depth: 0.5, height: 0.6 };
    default: return { width: 1, depth: 1, height: 1 };
  }
}

export default RoomEditor;