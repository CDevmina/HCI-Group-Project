// components/ControlsPanel.jsx
import { useEffect, useState } from 'react';
import fetchModels from '../utils/fetchModels';

export default function ControlsPanel({
  roomSize,
  setRoomSize,
  selectedItem,
  updateFurniture,
  addFurniture,
  deleteFurniture,
  showDimensions,
  setShowDimensions
}) {
  const [color, setColor] = useState('#cccccc');
  const [models, setModels] = useState([]);

  useEffect(() => {
    fetchModels().then(setModels);
  }, []);

  const handleRoomSizeChange = (e, dimension) => {
    const value = e.target.value;
    // Only update if value is not empty string
    if (value === '') {
      setRoomSize({
        ...roomSize,
        [dimension]: value
      });
    } else {
      setRoomSize({
        ...roomSize,
        [dimension]: parseFloat(value) || 0
      });
    }
  };

  const handleFurnitureUpdate = (e, property) => {
    if (!selectedItem) return;
    const value = e.target.type === 'number' ? parseFloat(e.target.value) : e.target.value;
    updateFurniture(selectedItem.id, { [property]: value });
  };

  return (
    <div className="controls-panel">
      <h2>Room Controls</h2>

      <div className="control-group">
        <label className="flex items-center gap-2">
          <span className="select-none">Show Dimensions</span>
          <input
            type="checkbox"
            checked={showDimensions}
            onChange={(e) => setShowDimensions(e.target.checked)}
            className="form-checkbox h-4 w-4 text-blue-600"
          />
        </label>
      </div>

      <h2>Furniture</h2>
      <div className="button-group">
        {/* Dynamically render furniture from models */}
        {models.map((model) => (
          <div key={model.name} style={{ display: 'inline-block', margin: 8}}>
            <div>{model.name}</div>
            <img src={model.image} alt={model.name} style={{ width: 64, height: 64, objectFit: 'cover', borderRadius: 8 }} />
            
            <button onClick={() => addFurniture(model.name)}>Add</button>
          </div>
        ))}
      </div>

      {selectedItem && (
        <div className="selected-item-controls">
          <h3>Selected Item: {selectedItem.type}</h3>
          <div className="control-group">
            <label>Color:</label>
            <input 
              type="color" 
              value={selectedItem.color} 
              onChange={(e) => handleFurnitureUpdate(e, 'color')} 
            />
          </div>
          <div className="control-group">
            <label>X Position:</label>
            <input
                type="number"
                value={selectedItem.position.x}
                onChange={(e) => updateFurniture(selectedItem.id, {
                    position: { ...selectedItem.position, x: Number(e.target.value) }
                })}
                step={0.1}
            />
          </div>
          <div className="control-group">
            <label>Z Position:</label>
            <input
                type="number"
                value={selectedItem.position.z}
                onChange={(e) => updateFurniture(selectedItem.id, {
                    position: { ...selectedItem.position, z: Number(e.target.value) }
                })}
                step={0.1}
            />
          </div>
          <div className="control-group">
            <label>Rotation:</label>
            <input
                type="range"
                min="0"
                max="360"
                value={selectedItem.rotation * (180/Math.PI)}
                onChange={(e) => updateFurniture(selectedItem.id, {
                rotation: Number(e.target.value) * (Math.PI/180)
                })}
                step={5}
            />
          </div>
          <button 
            className="delete-button"
            onClick={() => deleteFurniture(selectedItem.id)}
          >
            Delete Item
          </button>
        </div>
      )}
    </div>
  );
}