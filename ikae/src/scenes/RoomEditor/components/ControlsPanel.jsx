// components/ControlsPanel.jsx
import { useState } from 'react';

export default function ControlsPanel({
  roomSize,
  setRoomSize,
  selectedItem,
  updateFurniture,
  addFurniture,
  deleteFurniture
}) {
  const [color, setColor] = useState('#cccccc');

  const handleRoomSizeChange = (e, dimension) => {
    setRoomSize({
      ...roomSize,
      [dimension]: parseFloat(e.target.value) || 1
    });
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
        <label>Width:</label>
        <input 
          type="number" 
          value={roomSize.width} 
          onChange={(e) => handleRoomSizeChange(e, 'width')} 
          step="0.1"
        />
      </div>
      <div className="control-group">
        <label>Depth:</label>
        <input 
          type="number" 
          value={roomSize.depth} 
          onChange={(e) => handleRoomSizeChange(e, 'depth')} 
          step="0.1"
        />
      </div>
      <div className="control-group">
        <label>Height:</label>
        <input 
          type="number" 
          value={roomSize.height} 
          onChange={(e) => handleRoomSizeChange(e, 'height')} 
          step="0.1"
        />
      </div>

      <h2>Furniture</h2>
      <div className="button-group">
        <button onClick={() => addFurniture('chair')}>Add Chair</button>
        <button onClick={() => addFurniture('diningTable')}>Add Dining Table</button>
        <button onClick={() => addFurniture('sideTable')}>Add Side Table</button>
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
              onChange={(e) => handleFurnitureUpdate(e, 'position.x')} 
              step="0.1"
            />
          </div>
          <div className="control-group">
            <label>Z Position:</label>
            <input 
              type="number" 
              value={selectedItem.position.z} 
              onChange={(e) => handleFurnitureUpdate(e, 'position.z')} 
              step="0.1"
            />
          </div>
          <div className="control-group">
            <label>Rotation:</label>
            <input 
              type="number" 
              value={selectedItem.rotation} 
              onChange={(e) => handleFurnitureUpdate(e, 'rotation')} 
              step="0.1"
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