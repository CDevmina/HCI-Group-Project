// App.jsx
import { useState, useEffect } from 'react';
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
  const [is3DView, setIs3DView] = useState(false);
  const [roomSize, setRoomSize] = useState({ width: 10, depth: 8, height: 3 });
  const [furniture, setFurniture] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showDimensions, setShowDimensions] = useState(true);
  const [models, setModels] = useState([]);

  useEffect(() => {
    fetchModels().then(setModels);
  }, []);

  const getInitialVertexes = (roomSize) => [
    [roomSize.width / 2, 0, roomSize.depth / 2],      // bottom-right
    [-roomSize.width / 2, 0, roomSize.depth / 2],     // bottom-left
    [-roomSize.width / 2, 0, -roomSize.depth / 2],    // top-left
    [roomSize.width / 2, 0, -roomSize.depth / 2],     // top-right
  ];

  const [vertexes, setVertexes] = useState(getInitialVertexes(roomSize));

  // Keep vertexes in sync if roomSize changes (but only if shape is still a rectangle)
  useEffect(() => {
    setVertexes(getInitialVertexes(roomSize));
  }, [roomSize.width, roomSize.depth]);

  const addFurniture = async (type) => {
    // Try to find a model with this type
    const model = models.find(m => m.name === type);
    const newItem = {
      id: Date.now(),
      type,
      position: { x: 0, y: 0, z: 0 },
      dimensions: getDefaultDimensions(type),
      color: '#cccccc',
      rotation: 0,
      // If model exists, attach its glb path
      ...(model ? { glb: model.glb, image: model.image } : {})
    };
    setFurniture([...furniture, newItem]);
    setSelectedItem(newItem.id);
  };

  const updateFurniture = (id, updates) => {
    setFurniture(furniture.map(item => 
      item.id === id ? { ...item, ...updates } : item
    ));
  };

  const deleteFurniture = (id) => {
    setFurniture(furniture.filter(item => item.id !== id));
    if (selectedItem === id) setSelectedItem(null);
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
        vertexes={vertexes}
        setVertexes={setVertexes}
        furniture={furniture}
        setFurniture={setFurniture}
      />
      
      <ViewToggle is3DView={is3DView} setIs3DView={setIs3DView} />
      
      <div className="canvas-container">
        <Canvas camera={{ position: [15, 15, 15], fov: 50 }}>
          {is3DView ? (
            <Room3D 
              roomSize={roomSize} 
              furniture={furniture} 
              selectedItem={selectedItem}
              setSelectedItem={setSelectedItem}
              vertexes={vertexes}
            />
          ) : (
            <Room2D 
              roomSize={roomSize} 
              furniture={furniture} 
              selectedItem={selectedItem}
              setSelectedItem={setSelectedItem}
              updateFurniture={updateFurniture}
              showDimensions={showDimensions}
              setRoomSize={setRoomSize}
              vertexes={vertexes}
              setVertexes={setVertexes}
            />
          )}
          <OrbitControls 
            enabled={is3DView}
            enableRotate={true}
            enablePan={true}
            minPolarAngle={0} // 0 radians = 0 degrees (horizontal)
            maxPolarAngle={Math.PI / 2} // 90 degrees in radians
            mouseButtons={{
              LEFT: null, // Disable regular left click
              MIDDLE: MOUSE.ROTATE,  // Middle mouse for orbit
              RIGHT: null  // Right click for pan
            }}
          />
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
        </Canvas>
      </div>
    </div>
  );
}

function getDefaultDimensions(type) {
  switch(type) {
    case 'chair': return { width: 0.5, depth: 0.5, height: 1 };
    case 'diningTable': return { width: 1.5, depth: 0.9, height: 0.75 };
    case 'sideTable': return { width: 0.5, depth: 0.5, height: 0.6 };
    default: return { width: 1, depth: 1, height: 1 };
  }
}

export default RoomEditor;