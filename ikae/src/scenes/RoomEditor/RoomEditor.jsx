// App.jsx
import { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import Room2D from './components/Room2D';
import Room3D from './components/Room3D';
import ControlsPanel from './components/ControlsPanel';
import ViewToggle from './components/ViewToggle';
import './styles.css';
import { MOUSE } from 'three';

const RoomEditor = () => {
  const [is3DView, setIs3DView] = useState(false);
  const [roomSize, setRoomSize] = useState({ width: 10, depth: 8, height: 3 });
  const [furniture, setFurniture] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showDimensions, setShowDimensions] = useState(true);

  const addFurniture = (type) => {
    const newItem = {
      id: Date.now(),
      type,
      position: { x: 0, y: 0, z: 0 },
      dimensions: getDefaultDimensions(type),
      color: '#cccccc',
      rotation: 0
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
            />
          )}
          <OrbitControls 
            enabled={is3DView}
            enableRotate={true}
            enablePan={true}
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