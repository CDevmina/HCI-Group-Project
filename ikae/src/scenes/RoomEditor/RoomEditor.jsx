import { useState, useEffect, useCallback } from 'react';
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

  // Modified selection handler
  const handleSelectItem = useCallback((itemId) => {
    setSelectedItem(prev => {
      const isDeselectingOrSelectingSame = prev === itemId;
      const newSelection = isDeselectingOrSelectingSame ? null : itemId;
      // Only activate gizmo if selecting a new item in 3D view
      setIsGizmoActive(newSelection !== null && is3DView);
      return newSelection;
    });
  }, [is3DView]); // Depend on is3DView

  // --- START: Deselection Handler ---
  const handleDeselect = useCallback(() => {
      if(selectedItem !== null) { // Only deselect if something is selected
          // console.log("Pointer missed, deselecting");
          setSelectedItem(null);
          setIsGizmoActive(false);
      }
  }, [selectedItem]); // Depend on selectedItem
  // --- END: Deselection Handler ---


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
      />

      <ViewToggle is3DView={is3DView} setIs3DView={setIs3DView} />

      <div className="canvas-container">
        <Canvas
            shadows
            camera={{ position: [15, 15, 15], fov: 50 }}
            // --- START: Add onPointerMissed ---
            onPointerMissed={handleDeselect}
            // --- END: Add onPointerMissed ---
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
                <Room3D
                    roomSize={roomSize}
                    furniture={furniture}
                    selectedItem={selectedItem}
                    setSelectedItem={handleSelectItem} // Pass central handler
                    updateFurniture={updateFurniture}
                    isGizmoActive={isGizmoActive}
                    gizmoMode={gizmoMode}
                    vertexes={vertexes}
                />
            ) : (
                <Room2D
                    roomSize={roomSize}
                    furniture={furniture}
                    selectedItem={selectedItem}
                    setSelectedItem={handleSelectItem} // Pass central handler
                    updateFurniture={updateFurniture}
                    showDimensions={showDimensions}
                    setRoomSize={setRoomSize}
                    vertexes={vertexes}
                    setVertexes={setVertexes}
                />
            )}
            <OrbitControls
                makeDefault
                enabled={is3DView}
                enableRotate={true}
                enablePan={true}
                minPolarAngle={0}
                maxPolarAngle={Math.PI / 2}
                mouseButtons={{ LEFT: null, MIDDLE: MOUSE.ROTATE, RIGHT: MOUSE.PAN }}
                touches={{ ONE: MOUSE.PAN, TWO: MOUSE.ROTATE }}
            />
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